import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";
import Redis from "ioredis";

// Singleton Redis client
let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl =
      process.env.CACHE_REDIS_URL ||
      process.env.REDIS_URL ||
      "redis://localhost:6379";

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: false,
    });

    // Handle connection events
    redisClient.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected");
    });
  }

  return redisClient;
}

interface FilterOptions {
  priceRange: { min: number; max: number };
  colors: string[];
  styles: string[];
  sizes: string[];
  productCount: number;
}

interface ProductFilterData {
  [contextKey: string]: FilterOptions;
}

interface QueryParams {
  type_id?: string | string[];
  collection_id?: string | string[];
  category_id?: string | string[];
  region_id?: string;
}

function normalizeArray(value: any): string[] {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string");
  return [];
}

function isColorOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase();
  return normalizedTitle.includes("cor") || normalizedTitle.includes("color");
}

function isStyleOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase();
  return (
    normalizedTitle.includes("estilo") ||
    normalizedTitle.includes("style") ||
    normalizedTitle.includes("material")
  );
}

function isSizeOption(title: string): boolean {
  const normalizedTitle = title.toLowerCase();
  return (
    normalizedTitle.includes("size") ||
    normalizedTitle.includes("tamanho") ||
    normalizedTitle.includes("talla")
  );
}

function generateContextKey(filters: any): string {
  const parts = [];

  if (filters.type_id && filters.type_id.length > 0) {
    const sortedUniqueTypeIds = [...new Set(filters.type_id)].sort();
    parts.push(`type:${sortedUniqueTypeIds.join(",")}`);
  }

  if (filters.collection_id && filters.collection_id.length > 0) {
    const sortedUniqueCollectionIds = [
      ...new Set(filters.collection_id),
    ].sort();
    parts.push(`collection:${sortedUniqueCollectionIds.join(",")}`);
  }

  if (filters.category_id && filters.category_id.length > 0) {
    const sortedUniqueCategoryIds = [...new Set(filters.category_id)].sort();
    parts.push(`category:${sortedUniqueCategoryIds.join(",")}`);
  }

  return parts.length > 0 ? parts.join("|") : "global";
}

async function getFallbackFilterData(
  productModuleService: IProductModuleService,
  filters: any
): Promise<FilterOptions> {
  console.log("Using fallback database query with filters:", filters);

  // Query products using the product module service
  const products = await productModuleService.listProducts(filters, {
    relations: ["options", "options.values", "variants"],
  });

  console.log("Fallback query - Products found:", products?.length || 0);

  // Initialize collections for processing
  const uniqueColors = new Set<string>();
  const uniqueStyles = new Set<string>();
  const uniqueSizes = new Set<string>();
  const prices: number[] = [];

  // Process products to extract filter data
  products?.forEach((product: any) => {
    // Process product options
    if (product.options) {
      product.options.forEach((option: any) => {
        if (option.title && option.values) {
          if (isColorOption(option.title)) {
            // Extract color values (simplified - no hex codes)
            option.values.forEach((value: any) => {
              if (value.value) {
                uniqueColors.add(value.value);
              }
            });
          } else if (isStyleOption(option.title)) {
            // Extract style values
            option.values.forEach((value: any) => {
              if (value.value) {
                uniqueStyles.add(value.value);
              }
            });
          } else if (isSizeOption(option.title)) {
            // Extract size values
            option.values.forEach((value: any) => {
              if (value.value) {
                uniqueSizes.add(value.value);
              }
            });
          }
        }
      });
    }

    // Process product variants for price calculation (no stock requirement)
    if (product.variants) {
      product.variants.forEach((variant: any) => {
        const price = variant.calculated_price || variant.price;
        if (typeof price === "number" && price > 0) {
          prices.push(price);
        }
      });
    }
  });

  // Calculate price range
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  // Return simplified filter data
  return {
    priceRange: {
      min: Math.floor(minPrice), // Prices are already in currency units, not cents
      max: Math.ceil(maxPrice),
    },
    colors: Array.from(uniqueColors),
    styles: Array.from(uniqueStyles),
    sizes: Array.from(uniqueSizes),
    productCount: products?.length || 0,
  };
}

export const GET = async (
  req: MedusaRequest<QueryParams>,
  res: MedusaResponse
) => {
  try {
    const { type_id, collection_id, category_id, region_id } = req.query;

    // Normalize query parameters to arrays
    const typeIds = normalizeArray(type_id);
    const collectionIds = normalizeArray(collection_id);
    const categoryIds = normalizeArray(category_id);

    console.log("Filter metadata query params:", {
      typeIds,
      collectionIds,
      categoryIds,
      region_id,
    });

    // Get required services
    const productModuleService: IProductModuleService = req.scope.resolve(
      Modules.PRODUCT
    );

    // Get singleton Redis client
    const redis = getRedisClient();

    console.log("Services resolved:", {
      productService: !!productModuleService,
      redisConnection: !!redis,
    });

    // Build filters for context key generation and fallback query
    const filters: any = {
      status: "published",
    };

    if (typeIds.length > 0) {
      filters.type_id = typeIds;
    }

    if (collectionIds.length > 0) {
      filters.collection_id = collectionIds;
    }

    if (categoryIds.length > 0) {
      filters.category_id = categoryIds;
    }

    // Generate context key for the current request
    const contextKey = generateContextKey({
      type_id: typeIds,
      collection_id: collectionIds,
      category_id: categoryIds,
    });

    console.log("Generated context key:", contextKey);

    // Try to retrieve cached data first using direct Redis
    try {
      const cachedData = await redis.get("product_filters_v1");

      if (cachedData && typeof cachedData === "string") {
        console.log("✅ Cache hit! Retrieved cached filter data from Redis");
        const filterData: ProductFilterData = JSON.parse(cachedData);

        // Check if we have data for the specific context
        if (filterData[contextKey]) {
          console.log(`✅ Found cached data for context: ${contextKey}`);
          res.json(filterData[contextKey]);
          return;
        } else if (contextKey !== "global" && filterData["global"]) {
          console.log("✅ Using global cached data as fallback");
          res.json(filterData["global"]);
          return;
        }

        console.log(
          "⚠️ Context not found in cache, falling back to database query"
        );
      } else {
        console.log("⚠️ Cache miss - no cached data found in Redis");
      }
    } catch (cacheError) {
      console.error("❌ Error retrieving from Redis cache:", cacheError);
      console.log("Falling back to database query");
    }

    // Fallback to database query
    const fallbackData = await getFallbackFilterData(
      productModuleService,
      filters
    );

    // Try to cache the fallback result for future requests using direct Redis
    try {
      const existingCacheData = await redis.get("product_filters_v1");
      let cacheData: ProductFilterData = {};

      if (existingCacheData && typeof existingCacheData === "string") {
        cacheData = JSON.parse(existingCacheData);
      }

      // Update cache with the new data
      cacheData[contextKey] = fallbackData;

      await redis.setex(
        "product_filters_v1",
        3600, // TTL: 1 hour
        JSON.stringify(cacheData)
      );

      console.log(`✅ Cached fallback data for context: ${contextKey}`);
    } catch (cacheSetError) {
      console.error("❌ Error setting Redis cache:", cacheSetError);
    }

    console.log("Final response (from fallback):", fallbackData);
    res.json(fallbackData);
  } catch (error) {
    console.error("Error fetching filter metadata:", error);

    // Return fallback response in case of error
    const fallbackResponse: FilterOptions = {
      priceRange: { min: 0, max: 1000 },
      colors: [],
      styles: [],
      sizes: [],
      productCount: 0,
    };

    res.status(200).json(fallbackResponse);
  }
};
