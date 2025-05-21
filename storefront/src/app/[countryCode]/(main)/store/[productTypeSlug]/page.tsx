import { Metadata } from "next"
import { notFound } from "next/navigation"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getProductTypesList } from "@lib/data/product-types"
import { listRegions } from "@lib/data/regions"
import { slugify } from "@lib/util/slugify" // Assuming you created this utility

type Params = {
  searchParams: {
    sortBy?: SortOptions
    collection?: string | string[]
    category?: string | string[]
    page?: string
  }
  params: {
    countryCode: string
    productTypeSlug: string
  }
}

// Function to generate static paths for each product type
export async function generateStaticParams() {
  const regions = await listRegions()
  if (!regions) {
    return []
  }

  const { productTypes } = await getProductTypesList(0, 100, ["value"])
  if (!productTypes || productTypes.length === 0) {
    return []
  }

  const paths: { countryCode: string; productTypeSlug: string }[] = []

  for (const region of regions) {
    if (region.countries) {
      for (const country of region.countries) {
        if (country.iso_2) {
          // Ensure country.iso_2 is defined
          for (const pt of productTypes) {
            paths.push({
              countryCode: country.iso_2,
              productTypeSlug: slugify(pt.value),
            })
          }
        }
      }
    }
  }
  return paths
}

// Function to generate metadata for each product type page
export async function generateMetadata(
  props: { params: Promise<Params["params"]> } | { params: Params["params"] }
): Promise<Metadata> {
  // Await params if it's a promise, otherwise use it directly
  const params =
    "then" in props.params && typeof props.params.then === "function"
      ? await props.params
      : props.params

  const { productTypes } = await getProductTypesList(0, 100, ["value"])
  const productType = productTypes.find(
    (pt) => slugify(pt.value) === params.productTypeSlug
  )

  if (!productType) {
    return {
      title: "Tipo de Produto Não Encontrado",
      description:
        "O tipo de produto que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${productType.value} | Fashion Starter`, // Replace 'Fashion Starter' with your actual store name if different
    description: `Explore nossos ${productType.value.toLowerCase()}.`,
  }
}

export default async function ProductTypeStorePage(props: {
  params: Promise<Params["params"]>
  searchParams: Promise<Params["searchParams"]>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { countryCode, productTypeSlug } = params
  const { sortBy, page, collection, category } = searchParams

  const { productTypes } = await getProductTypesList(0, 100, ["id", "value"])
  const matchedProductType = productTypes.find(
    (pt) => slugify(pt.value) === productTypeSlug
  )

  if (!matchedProductType) {
    notFound() // Triggers the 404 page
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      collection={
        !collection
          ? undefined
          : Array.isArray(collection)
            ? collection
            : [collection]
      }
      category={
        !category ? undefined : Array.isArray(category) ? category : [category]
      }
      type={[matchedProductType.value]} // Pass the original value for filtering
      pageDisplayTitle={matchedProductType.value} // Pass the original value for the title
    />
  )
}
