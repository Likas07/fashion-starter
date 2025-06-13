import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { StoreClientWrapper } from "@modules/store/templates/store-client"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import { getCollectionsList } from "@lib/data/collections"
import { getCategoriesList } from "@lib/data/categories"
import { getProductTypesList } from "@lib/data/product-types"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { getRegion } from "@lib/data/regions"

const StoreTemplate = async ({
  sortBy,
  collection,
  category,
  type,
  page,
  countryCode,
  pageDisplayTitle,
}: {
  sortBy?: SortOptions
  collection?: string[]
  category?: string[]
  type?: string[]
  page?: string
  countryCode: string
  pageDisplayTitle?: string
}) => {
  const pageNumber = page ? parseInt(page, 10) : 1

  const [collections, categories, types, region] = await Promise.all([
    getCollectionsList(0, 100, ["id", "title", "handle"]),
    getCategoriesList(0, 100, ["id", "name", "handle"]),
    getProductTypesList(0, 100, ["id", "value"]),
    getRegion(countryCode),
  ])

  return (
    <StoreClientWrapper
      title={pageDisplayTitle}
      sortBy={sortBy}
      typeId={
        !type
          ? undefined
          : types.productTypes
              .filter((t) => type.includes(t.value))
              .map((t) => t.id)
      }
      collectionId={
        !collection
          ? undefined
          : collections.collections
              .filter((c) => collection.includes(c.handle))
              .map((c) => c.id)
      }
      categoryId={
        !category
          ? undefined
          : categories.product_categories
              .filter((c) => category.includes(c.handle))
              .map((c) => c.id)
      }
      regionId={region?.id}
    >
      <Suspense fallback={<SkeletonProductGrid />}>
        {region && (
          <PaginatedProducts
            sortBy={sortBy}
            page={pageNumber}
            countryCode={countryCode}
            collectionId={
              !collection
                ? undefined
                : collections.collections
                    .filter((c) => collection.includes(c.handle))
                    .map((c) => c.id)
            }
            categoryId={
              !category
                ? undefined
                : categories.product_categories
                    .filter((c) => category.includes(c.handle))
                    .map((c) => c.id)
            }
            typeId={
              !type
                ? undefined
                : types.productTypes
                    .filter((t) => type.includes(t.value))
                    .map((t) => t.id)
            }
          />
        )}
      </Suspense>
    </StoreClientWrapper>
  )
}

export default StoreTemplate
