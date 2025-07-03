"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { AdvancedFilters } from "@modules/store/components/advanced-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const StoreClientWrapper = ({
  title,
  sortBy,
  productCount = 0,
  totalCount = 0,
  children,
}: {
  title?: string
  sortBy?: SortOptions
  productCount?: number
  totalCount?: number
  children?: React.ReactNode
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = useCallback(
    (sort: string) => {
      const query = new URLSearchParams(searchParams)
      query.set("sortBy", sort)
      router.push(`${pathname}?${query.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return (
    <AdvancedFilters
      title={title}
      sortBy={sortBy}
      productCount={productCount}
      totalCount={totalCount}
      onSortChange={handleSortChange}
    >
      {children}
    </AdvancedFilters>
  )
}
