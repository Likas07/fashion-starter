import * as React from "react"
import { listRegions } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { slugify } from "@lib/util/slugify"
import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { RegionSwitcher } from "@/components/RegionSwitcher"
import { HeaderWrapper } from "@/components/HeaderWrapper"
import { StickyBanner } from "@/components/ui/sticky-banner"
import { DefaultLogoSVG, StickyLogoSVG } from "@/components/HeaderSVGs"

import dynamic from "next/dynamic"

const LoginLink = dynamic(
  () => import("@modules/header/components/LoginLink"),
  { loading: () => <></> }
)

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

export const Header: React.FC = async () => {
  const regions = await listRegions()
  const { productTypes } = await getProductTypesList(0, 100, ["value"])

  const countryOptions = regions
    .map((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .flat()
    .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))

  return (
    <>
      <StickyBanner className="bg-white text-black" hideOnScroll={true}>
        <p>Your awesome banner content goes here!</p>
      </StickyBanner>
      <HeaderWrapper>
        <Layout className="w-full !mx-0 !max-w-none !px-8">
          <LayoutColumn className="!col-start-1 !col-end-[-1]">
            <div className="relative flex justify-between items-center h-18 md:h-21">
              <h1 className="font-medium text-md text-header-text">
                <LocalizedLink href="/">
                  <DefaultLogoSVG />
                  <StickyLogoSVG />
                </LocalizedLink>
              </h1>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 max-md:hidden">
                {productTypes &&
                  productTypes.map((pt) => (
                    <LocalizedLink
                      key={pt.id}
                      href={`/store/${slugify(pt.value)}`}
                      className="text-black md:text-header-text group-data-[sticky=true]:md:text-black"
                    >
                      {pt.value}
                    </LocalizedLink>
                  ))}
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
                <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-16"
                  selectButtonClassName="h-auto !gap-0 !p-1 transition-none text-black md:text-header-text group-data-[sticky=true]:md:text-black"
                  selectIconClassName="text-black md:text-header-text group-data-[sticky=true]:md:text-black"
                />
                <React.Suspense>
                  <SearchField countryOptions={countryOptions} />
                </React.Suspense>
                <LoginLink className="p-1 text-black md:text-header-text group-data-[sticky=true]:md:text-black font-semibold text-lg" />
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LoginLink className="p-1 text-black md:text-header-text group-data-[sticky=true]:md:text-black font-semibold text-lg" />
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer countryOptions={countryOptions} />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}
