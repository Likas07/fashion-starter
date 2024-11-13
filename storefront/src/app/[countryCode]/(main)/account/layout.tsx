"use client"

// External components
import * as React from "react"
import { useParams, usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"

// Componenets
import { Button } from "@/components/Button"
import { LocalizedLink } from "@/components/LocalizedLink"

export default function AccountLayout(props: { children: React.ReactNode }) {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  return (
    <div className="flex max-md:flex-col">
      <div className="sticky left-0 shrink-0 z-30 top-0 md:max-w-75 lg:max-w-93 py-8 max-md:mt-18 max-md:top-18 md:pt-45 md:pb-9 max-md:border-b max-md:border-grayscale-200 max-md:overflow-x-auto bg-white md:bg-grayscale-50 w-full h-21 md:h-screen">
        <div className="md:max-w-54 mx-auto flex max-md:items-center md:flex-col md:justify-between h-full max-md:px-4 max-md:container max-md:mx-auto">
          <div className="max-md:flex max-md:gap-22">
            <h1 className="text-lg mb-16 max-md:hidden">My account</h1>
            <LocalizedLink
              href="/account/personal-and-security"
              className={twJoin(
                "inline-flex items-start py-3 max-md:whitespace-nowrap",
                currentPath === "/account/personal-and-security" &&
                  "font-semibold"
              )}
            >
              Personal &amp; security
            </LocalizedLink>
            <LocalizedLink
              href="/account/my-orders"
              className={twJoin(
                "inline-flex items-start py-3 max-md:whitespace-nowrap",
                currentPath === "/account/my-orders" && "font-semibold"
              )}
            >
              My orders
            </LocalizedLink>
          </div>
          <Button
            variant="ghost"
            className="justify-start px-0 py-3 max-md:hidden"
          >
            Log out
          </Button>
        </div>
      </div>
      <div className="max-md:px-4 overflow-hidden max-md:container max-md:mx-auto md:px-10 pt-8 md:pt-45 pb-26 md:pb-36 w-full lg:max-w-200 xl:mx-auto 2xl:ml-30">
        {props.children}
      </div>
    </div>
  )
}
