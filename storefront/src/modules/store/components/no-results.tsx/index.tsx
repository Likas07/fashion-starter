"use client"

import { Button } from "@/components/Button"
import { LayoutColumn } from "@/components/Layout"
import { usePathname, useRouter } from "next/navigation"

export const NoResults = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <LayoutColumn className="pt-28">
      <p className="text-md text-center mb-2">No results match!</p>
      <Button
        onPress={() => router.push(pathname, { scroll: false })}
        variant="link"
        className="flex mx-auto"
      >
        Clear filters
      </Button>
    </LayoutColumn>
  )
}
