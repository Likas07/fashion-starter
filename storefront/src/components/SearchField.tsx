"use client"

// External packages
import * as React from "react"
import { ComboBox, ListBox, ListBoxItem, Popover } from "react-aria-components"
import { twJoin } from "tailwind-merge"

// Components
import Thumbnail from "@modules/products/components/thumbnail"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Button } from "@/components/Button"
import { Input } from "@/components/Forms"
import { Icon } from "@/components/Icon"

export const SearchField: React.FC<{}> = ({}) => {
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
      <ComboBox className="overflow-hidden">
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
          className="max-w-98 w-full bg-white p-6 rounded-xs border border-grayscale-200 overflow-y-scroll"
          maxHeight={243}
        >
          <ListBox className="outline-none">
            <ListBoxItem
              className="border-b border-grayscale-100 py-6 first:pt-0 last:pb-0 last:border-b-0"
              textValue="a"
            >
              <div className="flex gap-6">
                <LocalizedLink href="">
                  <Thumbnail
                    thumbnail="/images/content/shop1.png"
                    size="3/4"
                    className="w-20"
                  />
                </LocalizedLink>
                <div>
                  <p className="text-base font-normal">
                    <LocalizedLink href="">Paloma Haven</LocalizedLink>
                  </p>
                  <p className="text-grayscale-500 text-xs">
                    Linen / Light Gray
                  </p>
                </div>
                <p className="text-base font-semibold ml-auto">€1500</p>
              </div>
            </ListBoxItem>
            <ListBoxItem
              className="border-b border-grayscale-100 py-6 first:pt-0 last:pb-0 last:border-b-0"
              textValue="b"
            >
              <div className="flex gap-6">
                <LocalizedLink href="">
                  <Thumbnail
                    thumbnail="/images/content/shop1.png"
                    size="3/4"
                    className="w-20"
                  />
                </LocalizedLink>
                <div>
                  <p className="text-base font-normal">
                    <LocalizedLink href="">Paloma Haven</LocalizedLink>
                  </p>
                  <p className="text-grayscale-500 text-xs">
                    Linen / Light Gray
                  </p>
                </div>
                <p className="text-base font-semibold ml-auto">€1500</p>
              </div>
            </ListBoxItem>
            <ListBoxItem
              className="border-b border-grayscale-100 py-6 first:pt-0 last:pb-0 last:border-b-0"
              textValue="c"
            >
              <div className="flex gap-6">
                <LocalizedLink href="">
                  <Thumbnail
                    thumbnail="/images/content/shop1.png"
                    size="3/4"
                    className="w-20"
                  />
                </LocalizedLink>
                <div>
                  <p className="text-base font-normal">
                    <LocalizedLink href="">Paloma Haven</LocalizedLink>
                  </p>
                  <p className="text-grayscale-500 text-xs">
                    Linen / Light Gray
                  </p>
                </div>
                <p className="text-base font-semibold ml-auto">€1500</p>
              </div>
            </ListBoxItem>
          </ListBox>
        </Popover>
      </ComboBox>
    </div>
  )
}
