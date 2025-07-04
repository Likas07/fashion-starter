import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import { getCollectionsList } from "@lib/data/collections"
import { getCategoriesList } from "@lib/data/categories"
import { getProductTypesList } from "@lib/data/product-types"
import { getRegion } from "@lib/data/regions"
import { getColorsList } from "@lib/data/colors"
import { getMaterialsList } from "@lib/data/materials"
import { getPriceRange } from "@lib/data/prices"

type StoreTemplateProps = {
  sortBy?: SortOptions
  collection?: string[]
  category?: string[]
  type?: string[]
  color?: string[]
  material?: string[]
  minPrice?: number
  maxPrice?: number
  page?: string
  countryCode: string
  pageDisplayTitle?: string
}

const StoreTemplate = async ({
  sortBy,
  collection,
  category,
  type,
  color,
  material,
  minPrice,
  maxPrice,
  page,
  countryCode,
  pageDisplayTitle,
}: StoreTemplateProps) => {
  const pageNumber = page ? parseInt(page, 10) : 1

  const [
    collections,
    categories,
    types,
    region,
    colors,
    materials,
    priceRange,
  ] = await Promise.all([
    getCollectionsList(0, 100, ["id", "title", "handle"]),
    getCategoriesList(0, 100, ["id", "name", "handle"]),
    getProductTypesList(0, 100, ["id", "value"]),
    getRegion(countryCode),
    getColorsList(),
    getMaterialsList(),
    getPriceRange(),
  ])

  return (
    <div className="md:pt-47 py-26 md:pb-36">
      <RefinementList
        collections={Object.fromEntries(
          collections.collections.map(
            (c: { handle: string; title: string }) => [c.handle, c.title]
          )
        )}
        collection={collection}
        categories={Object.fromEntries(
          categories.product_categories.map(
            (c: { handle: string; name: string }) => [c.handle, c.name]
          )
        )}
        category={category}
        types={Object.fromEntries(
          types.productTypes.map((t: { value: string }) => [t.value, t.value])
        )}
        type={type}
        colors={colors}
        color={color}
        materials={materials}
        material={material}
        priceRange={priceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortBy={sortBy}
        title={pageDisplayTitle}
      />
      <Suspense fallback={<SkeletonProductGrid />}>
        {region && (
          <PaginatedProducts
            sortBy={sortBy}
            page={pageNumber}
            countryCode={countryCode}
            colors={colors} // Pass the global colors list down
            collectionId={
              !collection
                ? undefined
                : collections.collections
                    .filter((c: { handle: string }) =>
                      collection.includes(c.handle)
                    )
                    .map((c: { id: string }) => c.id)
            }
            categoryId={
              !category
                ? undefined
                : categories.product_categories
                    .filter((c: { handle: string }) =>
                      category.includes(c.handle)
                    )
                    .map((c: { id: string }) => c.id)
            }
            typeId={
              !type
                ? undefined
                : types.productTypes
                    .filter((t: { value: string }) => type.includes(t.value))
                    .map((t: { id: string }) => t.id)
            }
            color={color}
            material={material}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        )}
      </Suspense>
    </div>
  )
}

export default StoreTemplate
