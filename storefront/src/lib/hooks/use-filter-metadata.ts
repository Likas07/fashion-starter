"use client"

import { useQuery } from "@tanstack/react-query"
import { sdk } from "@lib/config"

export interface FilterMetadata {
  priceRange: { min: number; max: number }
  colors: string[]
  styles: string[]
  sizes: string[]
  productCount: number
}

interface FilterMetadataParams {
  type_id?: string | string[]
  collection_id?: string | string[]
  category_id?: string | string[]
  region_id?: string
}

const fetchFilterMetadata = async (
  params: FilterMetadataParams
): Promise<FilterMetadata> => {
  const query = new URLSearchParams()

  // Add filters to query
  if (params.type_id) {
    const typeIds = Array.isArray(params.type_id)
      ? params.type_id
      : [params.type_id]
    typeIds.forEach((id) => query.append("type_id", id))
  }
  if (params.collection_id) {
    const collectionIds = Array.isArray(params.collection_id)
      ? params.collection_id
      : [params.collection_id]
    collectionIds.forEach((id) => query.append("collection_id", id))
  }
  if (params.category_id) {
    const categoryIds = Array.isArray(params.category_id)
      ? params.category_id
      : [params.category_id]
    categoryIds.forEach((id) => query.append("category_id", id))
  }
  if (params.region_id) {
    query.append("region_id", params.region_id)
  }

  const queryString = query.toString()
  const url = `/store/custom/products/filter-metadata${queryString ? `?${queryString}` : ""}`

  try {
    const response = await sdk.client.fetch<FilterMetadata>(url, {
      method: "GET",
      next: { tags: ["filter-metadata"] },
      cache: "force-cache",
    })

    return response
  } catch (error) {
    console.error("Error fetching filter metadata:", error)
    throw error
  }
}

export const useFilterMetadata = (params: FilterMetadataParams) => {
  // Create a stable key for the query
  const queryKey = [
    "filter-metadata",
    params.type_id &&
      (Array.isArray(params.type_id)
        ? params.type_id.join(",")
        : params.type_id),
    params.collection_id &&
      (Array.isArray(params.collection_id)
        ? params.collection_id.join(",")
        : params.collection_id),
    params.category_id &&
      (Array.isArray(params.category_id)
        ? params.category_id.join(",")
        : params.category_id),
    params.region_id,
  ].filter(Boolean)

  return useQuery({
    queryKey,
    queryFn: () => fetchFilterMetadata(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
