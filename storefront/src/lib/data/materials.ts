import { sdk } from "@lib/config"

export const getMaterialsList = async function () {
  try {
    const { materials } = await sdk.client.fetch<{
      materials: { id: string; name: string }[]
    }>(`/store/custom/materials`)

    return materials
  } catch (error) {
    console.error("Failed to fetch materials:", error)
    return [] // Return an empty array on error
  }
}
