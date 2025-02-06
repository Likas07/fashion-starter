import * as React from "react"
import { listRegions } from "@lib/data/regions"
import { retrieveCart } from "@lib/data/cart"

// Components
import { SearchField } from "@/components/SearchField"
import { CartDrawer } from "@/components/CartDrawer"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import { CartIcon } from "@/components/CartIcon"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { RegionSwitcher } from "@/components/RegionSwitcher"
import { HeaderWrapper } from "@/components/HeaderWrapper"
import { Icon } from "@/components/Icon"

export const Header: React.FC = async () => {
  const regions = await listRegions()
  const cart = await retrieveCart()

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
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex justify-between items-center h-18 md:h-21">
              <h1 className="font-medium text-md">
                <LocalizedLink href="/">SofaSocietyCo.</LocalizedLink>
              </h1>
              <div className="flex items-center gap-8 max-md:hidden">
                <LocalizedLink href="/about">About</LocalizedLink>
                <LocalizedLink href="/inspiration">Inspiration</LocalizedLink>
                <LocalizedLink href="/store">Shop</LocalizedLink>
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
                <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-16"
                  selectButtonClassName="h-auto !gap-0 !p-1 transition-none"
                  selectIconClassName="text-current"
                />
                <SearchField countryOptions={countryOptions} />
                <LocalizedButtonLink
                  href="/auth/login"
                  variant="ghost"
                  className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
                >
                  <Icon name="user" className="w-6 h-6" />
                </LocalizedButtonLink>

                <CartDrawer cart={cart}>
                  <CartIcon className="w-6 h-6" />
                </CartDrawer>
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LocalizedButtonLink
                  href="/auth/login"
                  variant="ghost"
                  className="p-1 group-data-[light=true]:md:text-white"
                >
                  <Icon
                    name="user"
                    className="w-6 h-6"
                    wrapperClassName="w-6 h-6"
                  />
                </LocalizedButtonLink>

                <CartDrawer cart={cart}>
                  <CartIcon className="w-6 h-6" wrapperClassName="w-6 h-6" />
                </CartDrawer>
                <HeaderDrawer countryOptions={countryOptions} />
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}
