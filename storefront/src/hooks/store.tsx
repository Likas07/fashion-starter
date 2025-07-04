"use client"
import { getProductsListWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { useInfiniteQuery } from "@tanstack/react-query"

// Create a more specific type that extends the base params
export type StoreProductsParams = HttpTypes.StoreProductListParams & {
  "variants.prices.amount[gte]"?: number
  "variants.prices.amount[lte]"?: number
  options?: Record<string, string>
}

export const useStoreProducts = ({
  page,
  queryParams,
  sortBy,
  countryCode,
}: {
  page: number
  queryParams: StoreProductsParams
  sortBy: SortOptions | undefined
  countryCode: string
}) => {
  return useInfiniteQuery({
    initialPageParam: page,
    queryKey: ["products", queryParams, sortBy, countryCode],
    queryFn: async ({ pageParam }) => {
      return getProductsListWithSort({
        page: pageParam,
        queryParams,
        sortBy,
        countryCode,
      })
    },
    getNextPageParam: (lastPage: {
      response: { products: HttpTypes.StoreProduct[]; count: number }
      nextPage: number | null
      queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
    }) => {
      if (!lastPage?.nextPage) {
        return undefined
      }
      return lastPage.nextPage
    },
  })
}
