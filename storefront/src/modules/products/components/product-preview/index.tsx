"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { ThumbnailProps } from "@modules/products/components/thumbnail" // Import ThumbnailProps type
import ProductOverlay from "./ProductOverlay"

// Utility function to get width class for thumbnail size
const getThumbnailWidthClass = (
  size: ThumbnailProps["size"] = "small"
): string => {
  switch (size) {
    case "small":
      return "w-[180px]"
    case "medium":
      return "w-[290px]"
    case "large":
      return "w-[440px]"
    case "full":
      return "w-full"
    case "square":
      return "w-[290px]" // Default to medium width for square
    case "3/4":
      return "w-[290px]" // Default to medium width for 3/4
    default:
      return "w-[180px]"
  }
}

// Helper function to get color hex code from color name
const getColorHexCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    Blue: "#0066CC",
    Navy: "#000080",
    "Royal Blue": "#4169E1",
    "Light Blue": "#87CEEB",
    Red: "#CC0000",
    Crimson: "#DC143C",
    "Dark Red": "#8B0000",
    Pink: "#FFC0CB",
    Beige: "#F5F5DC",
    Cream: "#FFFDD0",
    Ivory: "#FFFFF0",
    White: "#FFFFFF",
    Black: "#000000",
    Gray: "#808080",
    Grey: "#808080",
    "Dark Gray": "#A9A9A9",
    "Light Gray": "#D3D3D3",
    Brown: "#A52A2A",
    Tan: "#D2B48C",
    Green: "#008000",
    "Forest Green": "#228B22",
    Olive: "#808000",
    Yellow: "#FFFF00",
    Gold: "#FFD700",
    Orange: "#FFA500",
    Purple: "#800080",
    Violet: "#EE82EE",
    Lavender: "#E6E6FA",
  }
  return colorMap[colorName] || "#CCCCCC" // Default to light gray if color not found
}

export default function ProductPreview({
  product,
  thumbnailSize, // Add new prop
  // Overlay control props
  overlayCustomWidth,
  overlayCustomHeight,
  overlayCustomAspectRatio,
  overlayDebugMode,
}: {
  product: HttpTypes.StoreProduct
  thumbnailSize?: ThumbnailProps["size"] // Make it optional
  // Overlay control props
  overlayCustomWidth?: string
  overlayCustomHeight?: string
  overlayCustomAspectRatio?: string
  overlayDebugMode?: boolean
}) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})

  // Extract available color options from product
  const availableColors = useMemo(() => {
    if (!product.options) {
      return {
        colorOption: null,
        colors: [],
      }
    }

    const colorOption = product.options.find((opt) => {
      const title = opt.title?.toLowerCase()
      return title === "color" || title === "cor"
    })

    const colors =
      colorOption?.values?.map((v) => v.value).filter(Boolean) || []

    return {
      colorOption,
      colors: colors.map((color) => ({
        name: color,
        hex_code: getColorHexCode(color),
      })),
    }
  }, [product.options])

  const handleColorSelect = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const { cheapestPrice } = getProductPrice({
    product: product,
  })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  // Check if device supports touch
  const handleTouchStart = () => {
    setIsTouchDevice(true)
  }

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsOverlayVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsOverlayVisible(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      e.preventDefault()
      setIsOverlayVisible(!isOverlayVisible)
    }
  }

  return (
    <div className={getThumbnailWidthClass(thumbnailSize || "medium")}>
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
              size={thumbnailSize || "medium"} // Use prop or default to "medium"
              className="transition-transform duration-300 group-hover:scale-105 w-full"
            />
            <ProductOverlay
              product={product}
              isVisible={isOverlayVisible}
              thumbnailSize={thumbnailSize || "medium"}
              isFeatured={false} // Add this if you need featured support
              customWidth={overlayCustomWidth}
              customHeight={overlayCustomHeight}
              customAspectRatio={overlayCustomAspectRatio}
              debugMode={overlayDebugMode}
              selectedOptions={selectedOptions}
              onOptionSelect={setSelectedOptions}
            />
          </div>
        </div>

        {/* Color Selection */}
        {availableColors.colors && availableColors.colors.length > 0 && (
          <div className="flex gap-1 justify-start mb-2">
            {availableColors.colors.slice(0, 4).map((color) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (availableColors.colorOption) {
                    handleColorSelect(
                      availableColors.colorOption.id,
                      color.name
                    )
                  }
                }}
                className={`w-4 h-4 text-xs font-medium rounded-full border transition-colors ${
                  selectedOptions[availableColors.colorOption?.id || ""] ===
                  color.name
                    ? "border-black scale-110"
                    : "border-gray-300 hover:border-gray-500"
                }`}
                style={{ backgroundColor: color.hex_code }}
                title={color.name}
              />
            ))}
            {availableColors.colors && availableColors.colors.length > 4 && (
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
          {cheapestPrice ? (
            hasReducedPrice ? (
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
            )
          ) : null}
        </div>
      </LocalizedLink>
    </div>
  )
}
