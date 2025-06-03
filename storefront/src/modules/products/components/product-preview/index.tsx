"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { ThumbnailProps } from "@modules/products/components/thumbnail" // Import ThumbnailProps type
import ProductOverlay from "./ProductOverlay"

export default function ProductPreview({
  product,
  thumbnailSize, // Add new prop
  materials,
  // Overlay control props
  overlayCustomWidth,
  overlayCustomHeight,
  overlayCustomAspectRatio,
  overlayPositioningMode,
  overlayDebugMode,
}: {
  product: HttpTypes.StoreProduct
  thumbnailSize?: ThumbnailProps["size"] // Make it optional
  materials?: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  // Overlay control props
  overlayCustomWidth?: string
  overlayCustomHeight?: string
  overlayCustomAspectRatio?: string
  overlayPositioningMode?: "absolute" | "relative"
  overlayDebugMode?: boolean
}) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

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
    <div>
      <LocalizedLink href={`/products/${product.handle}`}>
        <div className="mb-4 md:mb-6">
          <div
            className="relative overflow-hidden group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
          >
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size={thumbnailSize || "medium"} // Use prop or default to "medium"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <ProductOverlay
              product={product}
              isVisible={isOverlayVisible}
              materials={materials}
              thumbnailSize={thumbnailSize || "medium"}
              isFeatured={false} // Add this if you need featured support
              customWidth={overlayCustomWidth}
              customHeight={overlayCustomHeight}
              customAspectRatio={overlayCustomAspectRatio}
              positioningMode={overlayPositioningMode}
              debugMode={overlayDebugMode}
            />
          </div>
        </div>
        <div className="flex justify-between max-md:flex-col">
          <div className="max-md:text-xs">
            <p className="mb-1">{product.title}</p>
            {product.collection && (
              <p className="text-grayscale-500 text-xs max-md:hidden">
                {product.collection.title}
              </p>
            )}
          </div>
          {cheapestPrice ? (
            hasReducedPrice ? (
              <div>
                <p className="font-semibold max-md:text-xs text-red-primary">
                  {cheapestPrice.calculated_price}
                </p>
                <p className="max-md:text-xs text-grayscale-500 line-through">
                  {cheapestPrice.original_price}
                </p>
              </div>
            ) : (
              <div>
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
