import {
  IProductModuleService,
  MedusaContainer,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import Redis from "ioredis";

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

function generateContextKey(product: any): string {
  const parts = [];

  if (product.type_id) {
    parts.push(`type:${product.type_id}`);
  }

  if (product.collection_id) {
    parts.push(`collection:${product.collection_id}`);
  }

  if (product.category_id) {
    parts.push(`category:${product.category_id}`);
  }

  return parts.length > 0 ? parts.join("|") : "global";
}

export default async function cacheProductFiltersDirectRedis(
  container: MedusaContainer
) {
  console.log("🚀 Starting DIRECT REDIS product filter caching job...");

  // Create direct Redis client using ioredis
  const redisUrl =
    process.env.CACHE_REDIS_URL ||
    process.env.REDIS_URL ||
    "redis://localhost:6379";
  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  try {
    // Test Redis connection
    console.log("🔌 Connecting to Redis...");
    await redis.connect();

    // Test basic Redis operations
    await redis.set("cache_test_connection", "ok", "EX", 10);
    const testResult = await redis.get("cache_test_connection");

    if (testResult === "ok") {
      console.log("✅ Direct Redis connection and operations verified!");
    } else {
      throw new Error("Redis test operation failed");
    }

    // Resolve product service (keep using Medusa's service)
    const productService: IProductModuleService = container.resolve(
      Modules.PRODUCT
    );

    console.log("✅ Product service resolved successfully");

    // Query all published products with pagination to handle large datasets
    console.log("📦 Fetching published products with pagination...");

    const batchSize = 100; // Process 100 products at a time
    let skip = 0;
    let allProducts: any[] = [];
    let totalFetched = 0;

    while (true) {
      const productsBatch = await productService.listProducts(
        {
          status: "published",
        },
        {
          relations: ["options", "options.values", "variants"],
          skip: skip,
          take: batchSize,
        }
      );

      if (productsBatch.length === 0) {
        // No more products to fetch
        break;
      }

      allProducts.push(...productsBatch);
      totalFetched += productsBatch.length;
      skip += batchSize;

      console.log(
        `📦 Fetched batch: ${productsBatch.length} products (total: ${totalFetched})`
      );

      // Optional: Add a small delay to prevent overwhelming the database
      if (productsBatch.length === batchSize) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    console.log(`📦 Found ${allProducts.length} total published products`);

    // Group products by context (type, collection, category combinations)
    const contextGroups: { [key: string]: any[] } = {};

    allProducts.forEach((product: any) => {
      const contextKey = generateContextKey(product);
      if (!contextGroups[contextKey]) {
        contextGroups[contextKey] = [];
      }
      contextGroups[contextKey].push(product);
    });

    console.log(
      `🔗 Grouped products into ${Object.keys(contextGroups).length} contexts`
    );

    // Process each context group
    const filterData: ProductFilterData = {};

    for (const [contextKey, contextProducts] of Object.entries(contextGroups)) {
      console.log(
        `⚙️ Processing context: ${contextKey} with ${contextProducts.length} products`
      );

      // Initialize collections for this context
      const uniqueColors = new Set<string>();
      const uniqueStyles = new Set<string>();
      const uniqueSizes = new Set<string>();
      const prices: number[] = [];

      // Process products in this context
      contextProducts.forEach((product: any) => {
        // Process product options
        if (product.options) {
          product.options.forEach((option: any) => {
            if (option.title && option.values) {
              if (isColorOption(option.title)) {
                // Extract color values
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
            // Use calculated_price if available, otherwise fall back to price
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

      // Convert collections to arrays
      const colors = Array.from(uniqueColors);
      const styles = Array.from(uniqueStyles);
      const sizes = Array.from(uniqueSizes);

      // Store filter data for this context
      filterData[contextKey] = {
        priceRange: {
          min: Math.floor(minPrice), // Prices are already in currency units, not cents
          max: Math.ceil(maxPrice),
        },
        colors,
        styles,
        sizes,
        productCount: contextProducts.length,
      };

      console.log(`✅ Context ${contextKey} processed:`, {
        colors: colors.length,
        styles: styles.length,
        sizes: sizes.length,
        priceRange: filterData[contextKey].priceRange,
        productCount: contextProducts.length,
      });
    }

    // Cache the aggregated filter data using DIRECT REDIS
    const cacheKey = "product_filters_v1";
    const cacheData = JSON.stringify(filterData);

    console.log(`💾 Caching filter data with DIRECT REDIS (ioredis)...`);
    console.log(`📊 Data size: ${(cacheData.length / 1024).toFixed(2)} KB`);
    console.log(`🔑 Cache key: ${cacheKey}`);

    // Set with TTL using ioredis
    const cacheResult = await redis.setex(cacheKey, 3600, cacheData); // TTL: 1 hour

    if (cacheResult === "OK") {
      console.log(`✅ DIRECT REDIS cache operation successful!`);
      console.log(
        `📈 Total contexts cached: ${Object.keys(filterData).length}`
      );

      // Verify the cache by reading it back
      console.log(`🔍 Verifying cache by reading back...`);
      const verifyResult = await redis.get(cacheKey);
      if (verifyResult) {
        console.log(`✅ Cache verification successful! Data found in Redis.`);
        try {
          const parsedData = JSON.parse(verifyResult);
          const contextCount = Object.keys(parsedData).length;
          console.log(`📊 Verified contexts in cache: ${contextCount}`);

          // Show sample of cached data
          const sampleContext = Object.keys(parsedData)[0];
          if (sampleContext) {
            const sampleData = parsedData[sampleContext];
            console.log(`📋 Sample context "${sampleContext}":`, {
              products: sampleData.productCount,
              colors: sampleData.colors.length,
              styles: sampleData.styles.length,
              sizes: sampleData.sizes.length,
              priceRange: sampleData.priceRange,
            });
          }
        } catch (parseError) {
          console.error(
            `⚠️ Cache verification: data exists but parsing failed:`,
            parseError
          );
        }
      } else {
        console.error(`❌ Cache verification failed: data not found in Redis`);
      }

      // Check TTL
      const ttl = await redis.ttl(cacheKey);
      console.log(`⏰ Cache TTL: ${ttl} seconds`);
    } else {
      console.error(
        `❌ DIRECT REDIS cache operation failed! Result: ${cacheResult}`
      );
    }

    // Log summary for each context
    console.log(`\n📋 FINAL SUMMARY:`);
    Object.entries(filterData).forEach(([contextKey, data]) => {
      console.log(
        `   ${contextKey}: ${data.productCount} products, ${data.colors.length} colors, ${data.styles.length} styles, ${data.sizes.length} sizes`
      );
    });

    // Compare with Medusa cache service approach
    console.log(`\n🔄 COMPARISON TEST: Trying Medusa cache service...`);
    try {
      const cacheService = container.resolve(Modules.CACHE);
      console.log("✅ Medusa cache service resolved");

      const medusaCacheResult = await cacheService.set(
        "medusa_cache_test",
        JSON.stringify({ test: "data", timestamp: Date.now() }),
        3600
      );
      console.log(`📤 Medusa cache SET result:`, medusaCacheResult);

      const medusaCacheGet = await cacheService.get("medusa_cache_test");
      console.log(
        `📥 Medusa cache GET result:`,
        medusaCacheGet ? "SUCCESS" : "FAILED"
      );

      // Check if Medusa cache populated Redis
      const medusaRedisCheck = await redis.get("medusa_cache_test");
      console.log(
        `🔍 Medusa cache in Redis:`,
        medusaRedisCheck ? "FOUND" : "NOT FOUND"
      );
    } catch (medusaError) {
      console.error(`❌ Medusa cache service error:`, medusaError);
    }
  } catch (error) {
    console.error(
      "❌ Error in DIRECT REDIS product filter caching job:",
      error
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "Unknown error"
    );
  } finally {
    // Always disconnect from Redis
    console.log("🔌 Disconnecting from Redis...");
    await redis.disconnect();
    console.log("✅ Redis disconnected");
  }

  console.log("🏁 DIRECT REDIS product filter caching job completed");
}

export const config = {
  name: "cache-product-filters-direct-redis",
  schedule: "*/15 * * * *", // Every 15 minutes
};
