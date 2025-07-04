import { sdk } from "@lib/config"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async function (id: string) {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next: { tags: ["collections"] },
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection)
}

export const getCollectionsList = async function (
  offset: number = 0,
  limit: number = 100,
  fields?: (keyof HttpTypes.StoreCollection)[]
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  const { collections, count } = await sdk.client.fetch<{
    collections: HttpTypes.StoreCollection[]
    count: number
  }>("/store/collections", {
    query: { limit, offset, fields: fields ? fields.join(",") : undefined },
    next: { tags: ["collections"] },
    cache: "force-cache",
  })
  return { collections, count }
}

export const getCollectionByHandle = async function (
  handle: string,
  fields?: (keyof HttpTypes.StoreCollection)[]
): Promise<HttpTypes.StoreCollection> {
  const { collections } =
    await sdk.client.fetch<HttpTypes.StoreCollectionListResponse>(
      `/store/collections`,
      {
        query: {
          handle,
          fields: fields ? fields.join(",") : undefined,
          limit: 1,
        },
        next: { tags: ["collections"] },
        cache: "force-cache",
      }
    )
  return collections[0]
}

export const getCollectionsWithProducts = async (
  countryCode: string
): Promise<HttpTypes.StoreCollection[] | null> => {
  const { collections } = await getCollectionsList(0, 3)

  if (!collections) {
    return null
  }

  const collectionIds = collections
    .map((collection) => collection.id)
    .filter(Boolean) as string[]

  const productsResult = await getProductsList({
    queryParams: {
      collection_id: collectionIds,
    } as HttpTypes.StoreProductListParams, // Cast to the expected type
    countryCode,
  })

  if (!productsResult) {
    return collections as unknown as HttpTypes.StoreCollection[]
  }

  const { response } = productsResult

  response.products.forEach((product) => {
    const collection = collections.find(
      (collection) => collection.id === product.collection_id
    )

    if (collection) {
      if (!collection.products) {
        collection.products = []
      }
      collection.products.push(product)
    }
  })

  return collections as unknown as HttpTypes.StoreCollection[]
}
