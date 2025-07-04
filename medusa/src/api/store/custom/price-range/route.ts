import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import MedusaSdkClient from "@medusajs/js-sdk";
import { HttpTypes } from "@medusajs/types"; // Add this import for types

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const sdk: MedusaSdkClient = req.scope.resolve("medusaSdk");

  // Add the generic type <{ products: HttpTypes.StoreProduct[] }> to the fetch call
  // This tells TypeScript the shape of the expected response.
  const { products } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[];
  }>(`/store/products?limit=9999&fields=*variants.calculated_price`);

  let min_price = Number.MAX_SAFE_INTEGER;
  let max_price = 0;

  for (const product of products) {
    if (!product.variants || !Array.isArray(product.variants)) {
      continue;
    }
    for (const variant of product.variants) {
      if (variant.calculated_price?.calculated_amount) {
        const current_price = variant.calculated_price.calculated_amount;
        if (current_price < min_price) {
          min_price = current_price;
        }
        if (current_price > max_price) {
          max_price = current_price;
        }
      }
    }
  }

  if (min_price === Number.MAX_SAFE_INTEGER) {
    min_price = 0;
  }

  res.status(200).json({
    min_price: min_price / 100,
    max_price: max_price / 100,
  });
};
