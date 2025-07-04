"use client"
import { StoreProduct } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NoResults } from "@modules/store/components/no-results.tsx"
import { withReactQueryProvider } from "@lib/util/react-query"
import * as React from "react"
import { StoreProductsParams, useStoreProducts } from "hooks/store"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const PRODUCT_LIMIT = 12

type ColorInfo = {
  id: string
  name: string
  hex_code: string
}

type PaginatedProductsProps = {
  sortBy?: SortOptions
  page: number
  countryCode: string
  collectionId?: string[]
  categoryId?: string[]
  typeId?: string[]
  productsIds?: string[]
  colors?: ColorInfo[] // Accept the global colors list
  color?: string[]
  material?: string[]
  minPrice?: number
  maxPrice?: number
}

function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  colors, // Receive the colors list
  color,
  material,
  minPrice,
  maxPrice,
}: PaginatedProductsProps) {
  const queryParams: StoreProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  // Build queryParams object with all filters...
  if (collectionId) queryParams["collection_id"] = collectionId
  if (categoryId) queryParams["category_id"] = categoryId
  if (typeId) queryParams["type_id"] = typeId
  if (productsIds) queryParams["id"] = productsIds
  if (sortBy === "created_at") queryParams["order"] = "created_at"
  if (color && color.length > 0)
    queryParams.options = { ...queryParams.options, color: color.join(",") }
  if (material && material.length > 0)
    queryParams.options = {
      ...queryParams.options,
      material: material.join(","),
    }
  if (minPrice !== undefined)
    queryParams["variants.prices.amount[gte]"] = minPrice * 100
  if (maxPrice !== undefined)
    queryParams["variants.prices.amount[lte]"] = maxPrice * 100

  const productsQuery = useStoreProducts({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!loadMoreRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && productsQuery.hasNextPage) {
          productsQuery.fetchNextPage()
        }
      },
      { rootMargin: "100px" }
    )
    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [productsQuery, loadMoreRef])

  if (productsQuery.isPending) {
    return <SkeletonProductGrid />
  }

  const products = productsQuery.data?.pages.flatMap(
    (page) => page?.response?.products || []
  )

  return (
    <>
      <Layout className="gap-y-10 md:gap-y-16 mb-16">
        {products && products.length > 0 ? (
          products.map((p: StoreProduct) => (
            <LayoutColumn key={p.id} className="md:!col-span-4 !col-span-6">
              {/* Pass the colors list down to each ProductPreview */}
              <ProductPreview product={p} colors={colors} />
            </LayoutColumn>
          ))
        ) : (
          <NoResults />
        )}
        {productsQuery.hasNextPage && <div ref={loadMoreRef} />}
      </Layout>
    </>
  )
}

export default withReactQueryProvider(PaginatedProducts)
