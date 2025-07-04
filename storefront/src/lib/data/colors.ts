import { sdk } from "@lib/config"

export const getColorsList = async function () {
  // Using a generic error handler to catch any issues
  try {
    const { colors } = await sdk.client.fetch<{
      colors: { id: string; name: string; hex_code: string }[]
    }>(`/store/custom/colors`)

    return colors
  } catch (error) {
    console.error("Failed to fetch colors:", error)
    return [] // Return an empty array on error
  }
}
