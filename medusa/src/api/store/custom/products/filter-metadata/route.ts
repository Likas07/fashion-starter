import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";

interface FilterOptions {
  priceRange: { min: number; max: number };
  colors: Array<{ name: string; hex_code: string }>;
  styles: string[];
  productCount: number;
}

interface QueryParams {
  type_id?: string | string[];
  collection_id?: string | string[];
  category_id?: string | string[];
  region_id?: string;
}

// Color mapping for Portuguese and English color names
const COLOR_HEX_MAP: Record<string, string> = {
  // Portuguese colors
  preto: "#000000",
  branco: "#FFFFFF",
  vermelho: "#FF0000",
  azul: "#0000FF",
  verde: "#008000",
  amarelo: "#FFFF00",
  rosa: "#FFC0CB",
  roxo: "#800080",
  laranja: "#FFA500",
  cinza: "#808080",
  cinzento: "#808080",
  marrom: "#A52A2A",
  bege: "#F5F5DC",
  dourado: "#FFD700",
  prateado: "#C0C0C0",
  navy: "#000080",
  turquesa: "#40E0D0",
  "coral-pt": "#FF7F50",
  salmão: "#FA8072",
  limão: "#32CD32",
  lilás: "#DDA0DD",
  "magenta-pt": "#FF00FF",
  ciano: "#00FFFF",
  "olive-pt": "#808000",
  marinho: "#000080",
  // English colors (fallbacks)
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  pink: "#FFC0CB",
  purple: "#800080",
  orange: "#FFA500",
  gray: "#808080",
  grey: "#808080",
  brown: "#A52A2A",
  beige: "#F5F5DC",
  gold: "#FFD700",
  silver: "#C0C0C0",
  turquoise: "#40E0D0",
  coral: "#FF7F50",
  salmon: "#FA8072",
  lime: "#32CD32",
  lilac: "#DDA0DD",
  magenta: "#FF00FF",
  cyan: "#00FFFF",
  olive: "#808000",
  // Color variations
  "dark gray": "#808080",
  "light gray": "#D3D3D3",
  violet: "#EE82EE",
};

function mapColorToHex(colorName: string): string {
  const normalizedName = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[normalizedName] || "#808080"; // Default to gray if color not found
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

    // Get the product module service
    const productModuleService: IProductModuleService = req.scope.resolve(
      Modules.PRODUCT
    );

    console.log("Product module service resolved:", !!productModuleService);

    // Build filters for the product query
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

    console.log("Applied filters:", filters);

    // Query products using the product module service
    const products = await productModuleService.listProducts(filters, {
      relations: ["options", "options.values", "variants"],
    });

    console.log("Products found:", products?.length || 0);

    if (products?.length > 0) {
      console.log("Sample product:", {
        id: products[0].id,
        title: products[0].title,
        options: products[0].options?.map((opt: any) => ({
          title: opt.title,
          values: opt.values?.map((val: any) => val.value),
        })),
      });
    }

    // Initialize collections for processing
    const uniqueColors = new Set<string>();
    const uniqueStyles = new Set<string>();
    const prices: number[] = [];

    // Process products to extract filter data
    products?.forEach((product: any) => {
      console.log(
        "Processing product:",
        product.title,
        "with options:",
        product.options?.length || 0
      );

      // Process product options
      if (product.options) {
        product.options.forEach((option: any) => {
          console.log(
            "Processing option:",
            option.title,
            "with values:",
            option.values?.length || 0
          );

          if (option.title && option.values) {
            if (isColorOption(option.title)) {
              console.log("Found color option:", option.title);
              // Extract color values
              option.values.forEach((value: any) => {
                if (value.value) {
                  console.log("Adding color:", value.value);
                  uniqueColors.add(value.value);
                }
              });
            } else if (isStyleOption(option.title)) {
              console.log("Found style option:", option.title);
              // Extract style values
              option.values.forEach((value: any) => {
                if (value.value) {
                  console.log("Adding style:", value.value);
                  uniqueStyles.add(value.value);
                }
              });
            }
          }
        });
      }

      // Process product variants for price calculation (basic price extraction)
      if (product.variants) {
        product.variants.forEach((variant: any) => {
          // For now, we'll use a simple approach since calculated_price might not be available
          // In a real scenario, you would need to calculate prices based on region/currency
          if (variant.price) {
            const price = variant.price;
            if (typeof price === "number" && price > 0) {
              prices.push(price);
            }
          }
        });
      }
    });

    console.log("Extracted colors:", Array.from(uniqueColors));
    console.log("Extracted styles:", Array.from(uniqueStyles));
    console.log("Extracted prices:", prices);

    // Calculate price range
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

    // Convert colors to the expected format with hex codes
    const colors = Array.from(uniqueColors).map((colorName) => ({
      name: colorName,
      hex_code: mapColorToHex(colorName),
    }));

    // Convert styles to array
    const styles = Array.from(uniqueStyles);

    // Prepare response
    const response_data: FilterOptions = {
      priceRange: {
        min: Math.floor(minPrice / 100), // Convert from cents to currency units if needed
        max: Math.ceil(maxPrice / 100),
      },
      colors,
      styles,
      productCount: products?.length || 0,
    };

    console.log("Final response:", response_data);
    res.json(response_data);
  } catch (error) {
    console.error("Error fetching filter metadata:", error);

    // Return fallback response in case of error
    const fallbackResponse: FilterOptions = {
      priceRange: { min: 0, max: 1000 },
      colors: [],
      styles: [],
      productCount: 0,
    };

    res.status(200).json(fallbackResponse);
  }
};
