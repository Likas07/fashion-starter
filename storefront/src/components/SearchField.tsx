"use client"

// External packages
import * as React from "react"
import {
  ComboBox,
  ListBox,
  ListBoxItem,
  Popover,
  Section,
} from "react-aria-components"
import { twJoin } from "tailwind-merge"

// Components
import Thumbnail from "@modules/products/components/thumbnail"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Button } from "@/components/Button"
import { Input } from "@/components/Forms"
import { Icon } from "@/components/Icon"

export const SearchField = () => {
  const [isInputShown, setIsInputShown] = React.useState(true)

  return (
    <div className="flex">
      <Button
        onPress={() => setIsInputShown(!isInputShown)}
        variant="ghost"
        className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
      >
        <Icon name="search" className="w-5 h-5" />
      </Button>
      <ComboBox className="overflow-hidden" aria-label="Search">
        <div
          className={twJoin(
            "overflow-hidden transition-width duration-500",
            isInputShown ? "w-30" : "w-0"
          )}
        >
          <Input
            variant="outline"
            className="px-1 h-auto max-w-30 border-black rounded-none border-t-0 border-x-0 group-data-[light=true]:md:border-white group-data-[sticky=true]:md:border-black ml-1"
          />
        </div>
        <Popover
          crossOffset={-228}
          maxHeight={243}
          offset={16}
          className="max-w-95 lg:max-w-98 w-full bg-white rounded-xs border border-grayscale-200 overflow-y-scroll"
        >
          <ListBox className="outline-none">
            <ListBoxItem
              className="relative after:absolute after:content-[''] after:h-px after:bg-grayscale-100 after:-bottom-px after:left-6 after:right-6 last:after:hidden mb-px"
              textValue="Paloma Haven"
            >
              <LocalizedLink
                href="/"
                className="flex gap-6 p-6 transition-colors hover:bg-grayscale-50"
              >
                <Thumbnail
                  thumbnail="/images/content/shop1.png"
                  size="3/4"
                  className="w-20"
                />
                <div>
                  <p className="text-base font-normal">Paloma Haven</p>
                  <p className="text-grayscale-500 text-xs">
                    Linen / Light Gray
                  </p>
                </div>
                <p className="text-base font-semibold ml-auto">€1500</p>
              </LocalizedLink>
            </ListBoxItem>
            <ListBoxItem
              className="relative after:absolute after:content-[''] after:h-px after:bg-grayscale-100 after:-bottom-px after:left-6 after:right-6 last:after:hidden mb-px"
              textValue="Velora Luxe"
            >
              <LocalizedLink
                href="/"
                className="flex gap-6 p-6 transition-colors hover:bg-grayscale-50"
              >
                <Thumbnail
                  thumbnail="/images/content/shop1.png"
                  size="3/4"
                  className="w-20"
                />
                <div>
                  <p className="text-base font-normal">Velora Luxe</p>
                  <p className="text-grayscale-500 text-xs">Velvet / Yellow</p>
                </div>
                <p className="text-base font-semibold ml-auto">€1500</p>
              </LocalizedLink>
            </ListBoxItem>
          </ListBox>
        </Popover>
      </ComboBox>
    </div>
  )
}
