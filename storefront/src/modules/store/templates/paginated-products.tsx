"use client"
import { HttpTypes, StoreProduct, StoreRegion } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NoResults } from "@modules/store/components/no-results.tsx"
import { withReactQueryProvider } from "@lib/util/react-query"
import * as React from "react"
import { useStoreProducts } from "hooks/store"
import { debounce } from "lodash"

const PRODUCT_LIMIT = 12
function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  countryCode,
  region,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string | string[]
  categoryId?: string | string[]
  typeId?: string | string[]
  productsIds?: string[]
  countryCode: string
  region: StoreRegion
}) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId)
      ? categoryId
      : [categoryId]
  }

  if (typeId) {
    queryParams["type_id"] = Array.isArray(typeId) ? typeId : [typeId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const productsQuery = useStoreProducts({
    page,
    queryParams,
    sortBy,
    countryCode,
  })
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = debounce(() => {
      if (productsQuery.isFetchingNextPage || !productsQuery.hasNextPage) {
        return
      }

      if (scrollRef.current) {
        const rect = scrollRef?.current?.getBoundingClientRect()
        const isBottomVisible =
          rect.top + rect.height <= window.innerHeight && rect.bottom >= 0

        if (isBottomVisible) {
          productsQuery.fetchNextPage()
        }
      }
    }, 200)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [productsQuery])

  return (
    <>
      <Layout className="gap-y-10 md:gap-y-16 mb-16" ref={scrollRef}>
        {productsQuery?.data?.pages[0]?.response?.products?.length ? (
          productsQuery?.data?.pages.flatMap((page) => {
            return page?.response?.products.map((p: StoreProduct) => (
              <LayoutColumn key={p.id} className="md:!col-span-4 !col-span-6">
                <ProductPreview product={p} region={region} />
              </LayoutColumn>
            ))
          })
        ) : (
          <NoResults />
        )}
      </Layout>
    </>
  )
}

export default withReactQueryProvider(PaginatedProducts)
