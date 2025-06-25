"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { AdvancedFilters } from "@modules/store/components/advanced-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { useFilterMetadata } from "@lib/hooks/use-filter-metadata"
import { withReactQueryProvider } from "@lib/util/react-query"

type FilterState = {
  size: string[]
  style: string
  color: string[]
  bestSelling: string
  priceRange: number[]
}

const StoreClientWrapperComponent = ({
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

  const [isUpdatingFromURL, setIsUpdatingFromURL] = useState(false)

  // Use the custom hook for filter metadata
  const {
    data: filterOptions,
    isLoading,
    error,
  } = useFilterMetadata({
    type_id: typeId,
    collection_id: collectionId,
    category_id: categoryId,
    region_id: regionId,
  })

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
    const timeoutId = setTimeout(() => setIsUpdatingFromURL(false), 100)

    // Cleanup function to clear timeout
    return () => clearTimeout(timeoutId)
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
      productCount={filterOptions?.productCount || productCount}
      totalCount={filterOptions?.productCount || totalCount}
      appliedFilters={appliedFilters}
      onFiltersChange={handleFiltersChange}
      onSortChange={handleSortChange}
      filterOptions={filterOptions}
      isLoading={isLoading}
      error={error?.message || null}
    >
      {children}
    </AdvancedFilters>
  )
}

export const StoreClientWrapper = withReactQueryProvider(
  StoreClientWrapperComponent
)
