"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { ThumbnailProps } from "@modules/products/components/thumbnail"
import ProductOverlay from "./ProductOverlay"

// Define the shape of the color data we expect as a prop
type ColorInfo = {
  id: string
  name: string
  hex_code: string
}

export default function ProductPreview({
  product,
  thumbnailSize = "medium",
  colors: globalColors = [], // Receive the global colors list as a prop
}: {
  product: HttpTypes.StoreProduct
  thumbnailSize?: ThumbnailProps["size"]
  colors?: ColorInfo[]
}) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})

  // Create a Map for fast lookups (e.g., "Azul" -> { id, name, hex_code })
  // This runs only when the global colors list changes.
  const colorMap = useMemo(() => {
    return new Map(globalColors.map((color) => [color.name, color]))
  }, [globalColors])

  // Prepare the list of colors available for this specific product
  const availableColors = useMemo(() => {
    if (!product.options) return { colorOption: null, colors: [] }

    const colorOption = product.options.find((opt) => {
      // Add a check to ensure 'opt' is not null or undefined
      if (!opt) {
        return false // If 'opt' is null/undefined, it cannot be the color option
      }
      // Now it's safe to access 'opt.title' with optional chaining
      return (
        opt.title?.toLowerCase() === "color" ||
        opt.title?.toLowerCase() === "cor"
      )
    })

    const productColors =
      colorOption?.values?.map((v) => v.value).filter(Boolean) || []

    return {
      colorOption,
      colors: productColors.map((colorName) => ({
        name: colorName,
        // Look up the hex code from the map. Fallback to gray if not found.
        hex_code: colorMap.get(colorName)?.hex_code || "#CCCCCC",
      })),
    }
  }, [product.options, colorMap])

  const handleColorSelect = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const { cheapestPrice } = getProductPrice({ product })
  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  const handleTouchStart = () => setIsTouchDevice(true)
  const handleMouseEnter = () => !isTouchDevice && setIsOverlayVisible(true)
  const handleMouseLeave = () => !isTouchDevice && setIsOverlayVisible(false)
  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      e.preventDefault()
      setIsOverlayVisible(!isOverlayVisible)
    }
  }

  return (
    <div>
      <LocalizedLink href={`/products/${product.handle}`}>
        <div className="mb-4 md:mb-6">
          <div
            className="relative overflow-hidden group w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
          >
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size={thumbnailSize}
              className="transition-transform duration-300 group-hover:scale-105 w-full"
            />
            {isOverlayVisible && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity duration-300">
                <ProductOverlay
                  product={product}
                  isVisible={isOverlayVisible}
                  selectedOptions={selectedOptions}
                  onOptionSelect={setSelectedOptions}
                />
              </div>
            )}
          </div>
        </div>
      </LocalizedLink>

      {availableColors.colors.length > 0 && (
        <div className="flex gap-1 justify-start mb-2">
          {availableColors.colors.slice(0, 4).map((color) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (availableColors.colorOption) {
                  handleColorSelect(availableColors.colorOption.id, color.name)
                }
              }}
              className={`w-4 h-4 text-xs font-medium rounded-full border transition-colors ${
                selectedOptions[availableColors.colorOption?.id || ""] ===
                color.name
                  ? "border-black scale-110"
                  : "border-gray-300 hover:border-gray-500"
              }`}
              style={{ backgroundColor: color.hex_code }}
              title={color.name} // Use the Portuguese name directly for the tooltip
            />
          ))}
          {availableColors.colors.length > 4 && (
            <div className="w-4 h-4 text-xs font-medium rounded-full border bg-gray-200 border-gray-300 flex items-center justify-center">
              <span className="text-[8px] text-gray-600">
                +{availableColors.colors.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between max-md:flex-col w-full">
        <div className="max-md:text-xs min-w-0 flex-1">
          <p className="mb-1 truncate">{product.title}</p>
          {product.collection && (
            <p className="text-grayscale-500 text-xs max-md:hidden truncate">
              {product.collection.title}
            </p>
          )}
        </div>
        {cheapestPrice &&
          (hasReducedPrice ? (
            <div className="flex-shrink-0">
              <p className="font-semibold max-md:text-xs text-red-primary">
                {cheapestPrice.calculated_price}
              </p>
              <p className="max-md:text-xs text-grayscale-500 line-through">
                {cheapestPrice.original_price}
              </p>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <p className="font-semibold max-md:text-xs">
                {cheapestPrice.calculated_price}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}
