"use client"

import { useEffect, useState } from "react"
import * as ReactAria from "react-aria-components"
import { convertToLocale } from "@lib/util/money"
import {
  UiSelectButton,
  UiSelectDialog,
  UiSelectIcon,
} from "@/components/ui/Select"
import { UiDialogTrigger } from "@/components/Dialog"
import {
  UiSliderThumb,
  UiSliderTrack,
  UiSliderOutputValue,
} from "@/components/ui/Slider"

type PriceSliderFilterProps = {
  priceRange: { min_price: number; max_price: number }
  minPrice?: number
  maxPrice?: number
  setMultipleQueryParams: (params: Record<string, string | string[]>) => void
}

export const PriceSliderFilter: React.FC<PriceSliderFilterProps> = ({
  priceRange,
  minPrice,
  maxPrice,
  setMultipleQueryParams,
}) => {
  const [value, setValue] = useState([
    minPrice || priceRange.min_price,
    maxPrice || priceRange.max_price,
  ])

  useEffect(() => {
    setValue([
      minPrice || priceRange.min_price,
      maxPrice || priceRange.max_price,
    ])
  }, [minPrice, maxPrice, priceRange])

  const handleValueChange = (newValues: number[]) => {
    setValue(newValues)
  }

  const handleValueCommit = (newValues: number[]) => {
    setMultipleQueryParams({
      minPrice: newValues[0].toString(),
      maxPrice: newValues[1].toString(),
    })
  }

  const currencyCode = "USD" // Placeholder currency for display formatting

  return (
    <UiDialogTrigger>
      {/* CORRECTED JSX STRUCTURE HERE */}
      <UiSelectButton className="w-35">
        <span>Price</span>
        <UiSelectIcon />
      </UiSelectButton>

      <UiSelectDialog className="w-80 p-6">
        <ReactAria.Slider
          minValue={priceRange.min_price}
          maxValue={priceRange.max_price}
          step={10}
          value={value}
          onChange={handleValueChange}
          onChangeEnd={handleValueCommit}
          className="flex flex-col"
        >
          <div className="flex justify-between items-center mb-2">
            <ReactAria.Label>Price Range</ReactAria.Label>
            <UiSliderOutputValue>
              <ReactAria.SliderOutput>
                {({ state }) =>
                  `${convertToLocale({
                    amount: state.getThumbValue(0) * 100,
                    currency_code: currencyCode,
                  })} - ${convertToLocale({
                    amount: state.getThumbValue(1) * 100,
                    currency_code: currencyCode,
                  })}`
                }
              </ReactAria.SliderOutput>
            </UiSliderOutputValue>
          </div>
          <UiSliderTrack>
            <UiSliderThumb index={0} />
            <UiSliderThumb index={1} />
          </UiSliderTrack>
        </ReactAria.Slider>
      </UiSelectDialog>
    </UiDialogTrigger>
  )
}
