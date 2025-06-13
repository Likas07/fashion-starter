"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useMemo } from "react"
import {
  AdvancedFilters,
  FilterOptions,
} from "@modules/store/components/advanced-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sdk } from "@lib/config"

type FilterState = {
  size: string[]
  style: string
  color: string[]
  bestSelling: string
  priceRange: number[]
}

export const StoreClientWrapper = ({
  title,
  sortBy,
  productCount = 0,
  totalCount = 0,
  children,
  typeId,
  collectionId,
  categoryId,
  regionId,
}: {
  title?: string
  sortBy?: SortOptions
  productCount?: number
  totalCount?: number
  children?: React.ReactNode
  typeId?: string | string[]
  collectionId?: string | string[]
  categoryId?: string | string[]
  regionId?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    size: [],
    style: "",
    color: [],
    bestSelling: "",
    priceRange: [0, 1000],
  })

  const [filterOptions, setFilterOptions] = useState<FilterOptions | undefined>(
    undefined
  )

  const [dynamicProductCount, setDynamicProductCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingFromURL, setIsUpdatingFromURL] = useState(false)

  // Memoize the dependencies to prevent infinite loop
  const stableTypeId = useMemo(
    () => (Array.isArray(typeId) ? typeId.join(",") : typeId),
    [typeId]
  )
  const stableCollectionId = useMemo(
    () => (Array.isArray(collectionId) ? collectionId.join(",") : collectionId),
    [collectionId]
  )
  const stableCategoryId = useMemo(
    () => (Array.isArray(categoryId) ? categoryId.join(",") : categoryId),
    [categoryId]
  )

  // Fetch filter metadata when component mounts or filter params change
  useEffect(() => {
    const getFilterMetadata = async ({
      type_id,
      collection_id,
      category_id,
      region_id,
    }: {
      type_id?: string | string[]
      collection_id?: string | string[]
      category_id?: string | string[]
      region_id?: string
    }): Promise<FilterOptions> => {
      const query = new URLSearchParams()

      // Add filters to query
      if (type_id) {
        const typeIds = Array.isArray(type_id) ? type_id : [type_id]
        typeIds.forEach((id) => query.append("type_id", id))
      }
      if (collection_id) {
        const collectionIds = Array.isArray(collection_id)
          ? collection_id
          : [collection_id]
        collectionIds.forEach((id) => query.append("collection_id", id))
      }
      if (category_id) {
        const categoryIds = Array.isArray(category_id)
          ? category_id
          : [category_id]
        categoryIds.forEach((id) => query.append("category_id", id))
      }
      if (region_id) {
        query.append("region_id", region_id)
      }

      const queryString = query.toString()
      const url = `/store/custom/products/filter-metadata${queryString ? `?${queryString}` : ""}`

      try {
        const response = await sdk.client.fetch<FilterOptions>(url, {
          method: "GET",
          next: { tags: ["filter-metadata"] },
          cache: "force-cache",
        })

        return response
      } catch (error) {
        console.error("Error fetching filter metadata:", error)
        // Return fallback data
        return {
          priceRange: { min: 0, max: 1000 },
          colors: [],
          styles: [],
          productCount: 0,
        }
      }
    }

    const fetchFilterMetadata = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const metadata = await getFilterMetadata({
          type_id: typeId,
          collection_id: collectionId,
          category_id: categoryId,
          region_id: regionId,
        })

        setFilterOptions(metadata)
        setDynamicProductCount(metadata.productCount)
      } catch (error) {
        console.error("Error fetching filter metadata:", error)
        setError("Failed to load filter options")
        // Keep undefined to use fallback values
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilterMetadata()
  }, [stableTypeId, stableCollectionId, stableCategoryId, regionId])

  // Parse URL parameters on mount
  useEffect(() => {
    setIsUpdatingFromURL(true)

    const size = searchParams.getAll("size")
    const style = searchParams.get("style") || ""
    const color = searchParams.getAll("color")
    const bestSelling = searchParams.get("bestSelling") || ""
    const minPrice = parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = parseInt(searchParams.get("maxPrice") || "1000")

    const newFilters = {
      size,
      style,
      color,
      bestSelling,
      priceRange: [minPrice, maxPrice],
    }

    setFilters(newFilters)

    // Reset the flag after a short delay
    setTimeout(() => setIsUpdatingFromURL(false), 100)
  }, [searchParams])

  const updateURLParams = useCallback(
    (newFilters: FilterState) => {
      const query = new URLSearchParams()

      // Add new filter params (don't use existing searchParams to avoid circular dependency)
      newFilters.size.forEach((s) => query.append("size", s))
      if (newFilters.style) query.set("style", newFilters.style)
      newFilters.color.forEach((c) => query.append("color", c))
      if (newFilters.bestSelling)
        query.set("bestSelling", newFilters.bestSelling)
      if (newFilters.priceRange[0] > 0)
        query.set("minPrice", newFilters.priceRange[0].toString())
      if (newFilters.priceRange[1] < 1000)
        query.set("maxPrice", newFilters.priceRange[1].toString())

      // Preserve non-filter search params
      const currentParams = new URLSearchParams(searchParams)
      currentParams.forEach((value, key) => {
        if (
          ![
            "size",
            "style",
            "color",
            "bestSelling",
            "minPrice",
            "maxPrice",
          ].includes(key)
        ) {
          query.set(key, value)
        }
      })

      router.push(`${pathname}?${query.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      if (isUpdatingFromURL) {
        return
      }
      setFilters(newFilters)
      updateURLParams(newFilters)
    },
    [updateURLParams, isUpdatingFromURL]
  )

  const handleSortChange = useCallback(
    (sort: string) => {
      const query = new URLSearchParams(searchParams)
      query.set("sortBy", sort)
      router.push(`${pathname}?${query.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // Generate applied filters for display
  const appliedFilters = [
    ...filters.size.map((size) => ({
      type: "size",
      value: size,
      label: `Tamanho: ${size}`,
    })),
    ...(filters.style
      ? [
          {
            type: "style",
            value: filters.style,
            label: `Estilo: ${filters.style}`,
          },
        ]
      : []),
    ...filters.color.map((color) => ({
      type: "color",
      value: color,
      label: `Cor: ${color}`,
    })),
    ...(filters.bestSelling
      ? [
          {
            type: "bestSelling",
            value: filters.bestSelling,
            label: `Mais Vendidos: ${filters.bestSelling}`,
          },
        ]
      : []),
    ...(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000
      ? [
          {
            type: "price",
            value: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
            label: `Preço: R$ ${filters.priceRange[0]} - R$ ${filters.priceRange[1]}`,
          },
        ]
      : []),
  ]

  return (
    <AdvancedFilters
      title={title}
      sortBy={sortBy}
      productCount={dynamicProductCount}
      totalCount={filterOptions?.productCount || totalCount}
      appliedFilters={appliedFilters}
      onFiltersChange={handleFiltersChange}
      onSortChange={handleSortChange}
      filterOptions={filterOptions}
    >
      {children}
    </AdvancedFilters>
  )
}
