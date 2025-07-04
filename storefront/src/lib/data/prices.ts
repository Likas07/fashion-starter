import { sdk } from "@lib/config"

export const getPriceRange = async function () {
  try {
    const priceRange = await sdk.client.fetch<{
      min_price: number
      max_price: number
    }>(`/store/custom/price-range`)

    return priceRange
  } catch (error) {
    console.error("Failed to fetch price range:", error)
    // Return a default range on error
    return { min_price: 0, max_price: 0 }
  }
}
