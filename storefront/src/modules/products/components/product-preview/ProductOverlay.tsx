"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { Icon } from "@/components/Icon"
import { useAddLineItem } from "hooks/cart"
import { useCountryCode } from "hooks/country-code"
import { withReactQueryProvider } from "@lib/util/react-query"
import { ThumbnailProps } from "@modules/products/components/thumbnail"
import { useProductOptions } from "../../hooks/use-product-options" // Import the new hook

type ProductOverlayProps = {
  product: HttpTypes.StoreProduct
  isVisible: boolean
  thumbnailSize?: ThumbnailProps["size"]
  isFeatured?: boolean
  customWidth?: string
  customHeight?: string
  customAspectRatio?: string
  debugMode?: boolean
  selectedOptions?: Record<string, string>
  onOptionSelect?: (options: Record<string, string>) => void
}

// Helper function remains here as it's specific to this component's styling
const getThumbnailDimensions = (
  size: ThumbnailProps["size"] = "small",
  isFeatured = false
) => {
  let width = "100%"
  if (size === "small") width = "180px"
  else if (size === "medium") width = "290px"
  else if (size === "large") width = "440px"
  else if (size === "full") width = "100%"
  let aspectRatio = "9/16"
  if (isFeatured) aspectRatio = "11/14"
  else if (size === "square") aspectRatio = "1/1"
  else if (size === "3/4") aspectRatio = "3/4"
  return { width, aspectRatio }
}

function ProductOverlay({
  product,
  isVisible,
  thumbnailSize,
  isFeatured,
  customWidth,
  customHeight,
  customAspectRatio,
  debugMode = false,
  selectedOptions: externalSelectedOptions,
  onOptionSelect,
}: ProductOverlayProps) {
  const [localSelectedOptions, setLocalSelectedOptions] = useState<
    Record<string, string>
  >({})
  const [showSuccess, setShowSuccess] = useState(false)
  const countryCode = useCountryCode()
  const { mutateAsync, isPending } = useAddLineItem()

  const selectedOptions = externalSelectedOptions || localSelectedOptions

  // Use our new hook to handle all the complex logic
  const { availableOptions, selectedVariant, isReadyToAddToCart } =
    useProductOptions({ product, selectedOptions })

  const handleOptionSelect = (optionId: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionId]: value }
    if (onOptionSelect) {
      onOptionSelect(newOptions)
    } else {
      setLocalSelectedOptions(newOptions)
    }
  }

  const handleAddToCart = async () => {
    if (!isReadyToAddToCart || !selectedVariant) return
    try {
      await mutateAsync({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  const overlayStyles = useMemo(() => {
    const styles: React.CSSProperties = {}
    if (!customWidth || !customAspectRatio) {
      const thumbnailDimensions = getThumbnailDimensions(
        thumbnailSize,
        isFeatured
      )
      if (!customWidth) styles.width = "100%"
      if (!customAspectRatio)
        styles.aspectRatio = thumbnailDimensions.aspectRatio
    }
    if (customWidth) styles.width = customWidth
    if (customHeight) styles.height = customHeight
    if (customAspectRatio) styles.aspectRatio = customAspectRatio
    return styles
  }, [thumbnailSize, isFeatured, customWidth, customHeight, customAspectRatio])

  const overlayClassName = useMemo(() => {
    const base =
      "text-white flex items-end transition-all duration-300 ease-out group-hover:scale-105"
    const visibility = isVisible
      ? "translate-y-0 opacity-100 pointer-events-auto"
      : "translate-y-full opacity-0 pointer-events-none"
    const position = "absolute top-0 left-0"
    const debug = debugMode ? "ring-2 ring-red-500 ring-opacity-50" : ""
    return `${base} ${visibility} ${position} ${debug}`
  }, [isVisible, debugMode])

  return (
    <div className={overlayClassName} style={overlayStyles}>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="w-full flex flex-col relative z-10 h-full">
        {availableOptions.sizes.length > 0 && (
          <div className="flex gap-1 justify-center p-2 flex-1 items-end">
            {availableOptions.sizes.map((size) => (
              <button
                key={size.value}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (availableOptions.sizeOption) {
                    handleOptionSelect(
                      availableOptions.sizeOption.id,
                      size.value
                    )
                  }
                }}
                className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                  selectedOptions[availableOptions.sizeOption?.id || ""] ===
                  size.value
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/50 hover:border-white"
                }`}
              >
                {size.display}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAddToCart()
          }}
          disabled={!isReadyToAddToCart || isPending}
          className="w-full pt-1 pb-4 bg-white text-black hover:bg-white/90 disabled:bg-white/50 disabled:text-black/50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Icon name="loader" className="w-4 h-4 animate-spin" />{" "}
              Adicionando...
            </>
          ) : showSuccess ? (
            <>
              <Icon name="check" className="w-4 h-4" /> Adicionado!
            </>
          ) : (
            <>
              <Icon name="case" className="w-4 h-4" /> Adicionar à Sacola
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default withReactQueryProvider(ProductOverlay)
