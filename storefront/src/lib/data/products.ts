import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"
import { StoreProductsParams } from "hooks/store" // Import the new type

// getProductsById, getProductByHandle, getProductFashionDataByHandle functions remain the same...

export const getProductsById = async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      query: {
        id: ids,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      next: { tags: ["products"] },
      cache: "force-cache",
    })
    .then(({ products }) => products)
}

export const getProductByHandle = async function (
  handle: string,
  regionId: string
) {
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      query: {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      next: { tags: ["products"] },
    })
    .then(({ products }) => products[0])
}

export const getProductFashionDataByHandle = async function (handle: string) {
  return sdk.client.fetch<{
    materials: {
      id: string
      name: string
      colors: {
        id: string
        name: string
        hex_code: string
      }[]
    }[]
  }>(`/store/custom/fashion/${handle}`)
}

export const getProductsList = async function ({
  pageParam = 0,
  queryParams = {},
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.StoreProductListParams
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { limit, ...rest } = queryParams

  const limitNum = limit || 12
  const offset = pageParam * limitNum

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        query: {
          limit: limitNum,
          offset,
          region_id: region.id,
          fields:
            "*variants.calculated_price,*options,*options.values,*variants.options",
          ...rest,
        },
        next: { tags: ["products"] },
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limitNum ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export const getProductsListWithSort = async function ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: StoreProductsParams // Use the extended type here
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: StoreProductsParams
}> {
  const limit = queryParams?.limit || 12

  const productsResult = await getProductsList({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  if (!productsResult) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
      queryParams,
    }
  }

  const {
    response: { products, count },
  } = productsResult

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? page + 1 : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage: nextPage,
    queryParams,
  }
}
