"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { Icon } from "@/components/Icon"
import { useAddLineItem } from "hooks/cart"
import { useCountryCode } from "hooks/country-code"
import { getVariantItemsInStock } from "@lib/util/inventory"
import { withReactQueryProvider } from "@lib/util/react-query"

import { ThumbnailProps } from "@modules/products/components/thumbnail"

type ProductOverlayProps = {
  product: HttpTypes.StoreProduct
  isVisible: boolean
  // Thumbnail dimension matching
  thumbnailSize?: ThumbnailProps["size"]
  isFeatured?: boolean
  // Manual width control options
  customWidth?: string
  customHeight?: string
  customAspectRatio?: string
  debugMode?: boolean
  // Shared state for options selection
  selectedOptions?: Record<string, string>
  onOptionSelect?: (options: Record<string, string>) => void
}

// Helper function to convert size options to Portuguese
const getSizeDisplayName = (size: string): string => {
  const sizeMap: Record<string, string> = {
    XS: "PP",
    S: "P",
    Small: "P",
    M: "M",
    Medium: "M",
    L: "G",
    Large: "G",
    XL: "GG",
    XXL: "XGG",
  }
  return sizeMap[size] || size
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

// Helper function to get variant options as keymap
const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) {
      acc[varopt.option_id] = varopt.value
    }
    return acc
  }, {})
}

// Helper function to calculate thumbnail dimensions (matches Thumbnail component logic)
const getThumbnailDimensions = (
  size: ThumbnailProps["size"] = "small",
  isFeatured = false
) => {
  // Width calculations
  let width = "100%"
  if (size === "small") width = "180px"
  else if (size === "medium") width = "290px"
  else if (size === "large") width = "440px"
  else if (size === "full") width = "100%"

  // Aspect ratio calculations
  let aspectRatio = "9/16" // default
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

  // Use external options if provided, otherwise use local state
  const selectedOptions = externalSelectedOptions || localSelectedOptions
  // const setSelectedOptions = onOptionSelect || setLocalSelectedOptions

  // Extract available options from product
  const availableOptions = useMemo(() => {
    if (!product.options) {
      return {
        sizeOption: null,
        colorOption: null,
        sizes: [],
        colors: [],
      }
    }

    const sizeOption = product.options.find((opt) => {
      const title = opt.title?.toLowerCase()
      return title === "size" || title === "tamanho"
    })
    const colorOption = product.options.find((opt) => {
      const title = opt.title?.toLowerCase()
      return title === "color" || title === "cor"
    })

    const sizes = sizeOption?.values?.map((v) => v.value).filter(Boolean) || []
    const colors =
      colorOption?.values?.map((v) => v.value).filter(Boolean) || []

    return {
      sizeOption,
      colorOption,
      sizes: sizes.map((size) => ({
        value: size,
        display: getSizeDisplayName(size),
      })),
      colors: colors.map((color) => ({
        name: color,
        hex_code: getColorHexCode(color),
      })),
    }
  }, [product.options])

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!product.variants) {
      return null
    }

    // If no options are selected yet, return the first variant as default
    if (Object.keys(selectedOptions).length === 0) {
      return product.variants[0] || null
    }

    // Find variant that matches selected options
    const matchingVariant = product.variants.find((variant) => {
      const variantOptions = optionsAsKeymap(variant.options) || {}

      // Check if all selected options match this variant
      for (const [optionId, selectedValue] of Object.entries(selectedOptions)) {
        if (variantOptions[optionId] !== selectedValue) {
          return false
        }
      }
      return true
    })

    return matchingVariant || product.variants[0] || null
  }, [product.variants, selectedOptions])

  const itemsInStock = selectedVariant
    ? getVariantItemsInStock(selectedVariant)
    : 0

  const handleOptionSelect = (optionId: string, value: string) => {
    if (onOptionSelect) {
      // When using external state, we need to merge with existing options
      onOptionSelect({
        ...selectedOptions,
        [optionId]: value,
      })
    } else {
      // When using local state, we can use the setter function
      setLocalSelectedOptions((prev) => ({
        ...prev,
        [optionId]: value,
      }))
    }
  }

  // Check if all required options are selected
  const isReadyToAddToCart = useMemo(() => {
    const hasRequiredSize =
      !availableOptions.sizes.length ||
      (availableOptions.sizeOption &&
        selectedOptions[availableOptions.sizeOption.id])

    const hasRequiredColor =
      !availableOptions.colors.length ||
      (availableOptions.colorOption &&
        selectedOptions[availableOptions.colorOption.id])

    const isValid =
      hasRequiredSize && hasRequiredColor && selectedVariant && itemsInStock > 0

    return isValid
  }, [availableOptions, selectedOptions, selectedVariant, itemsInStock])

  const handleAddToCart = async () => {
    if (!isReadyToAddToCart) return

    try {
      await mutateAsync({
        variantId: selectedVariant!.id,
        quantity: 1,
        countryCode,
      })

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  // Calculate overlay styles based on thumbnail dimensions and manual controls
  const overlayStyles = useMemo(() => {
    const styles: React.CSSProperties = {}

    // Get thumbnail dimensions if not manually overridden
    if (!customWidth || !customAspectRatio) {
      const thumbnailDimensions = getThumbnailDimensions(
        thumbnailSize,
        isFeatured
      )

      // Use 100% width to fill the container, but keep aspect ratio
      if (!customWidth) {
        styles.width = "100%"
      }
      if (!customAspectRatio) {
        styles.aspectRatio = thumbnailDimensions.aspectRatio
      }
    }

    // Apply manual overrides
    if (customWidth) styles.width = customWidth
    if (customHeight) styles.height = customHeight
    if (customAspectRatio) styles.aspectRatio = customAspectRatio

    return styles
  }, [thumbnailSize, isFeatured, customWidth, customHeight, customAspectRatio])

  // Build overlay className
  const overlayClassName = useMemo(() => {
    const baseClasses =
      "text-white flex items-end transition-all duration-300 ease-out group-hover:scale-105"
    const visibilityClasses = isVisible
      ? "translate-y-0 opacity-100 pointer-events-auto"
      : "translate-y-full opacity-0 pointer-events-none"

    // Use absolute positioning with calculated dimensions
    const positionClasses = "absolute top-0 left-0"

    const debugClasses = debugMode ? "ring-2 ring-red-500 ring-opacity-50" : ""

    return `${baseClasses} ${visibilityClasses} ${positionClasses} ${debugClasses}`
  }, [isVisible, debugMode])

  return (
    <div className={overlayClassName} style={overlayStyles}>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="w-full flex flex-col relative z-10 h-full">
        {/* Size Selection */}
        {availableOptions.sizes && availableOptions.sizes.length > 0 && (
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

        {/* Add to Cart Button - Full Width, No Padding */}
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
              <Icon name="loader" className="w-4 h-4 animate-spin" />
              Adicionando...
            </>
          ) : showSuccess ? (
            <>
              <Icon name="check" className="w-4 h-4" />
              Adicionado!
            </>
          ) : (
            <>
              <Icon name="case" className="w-4 h-4" />
              Adicionar à Sacola
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default withReactQueryProvider(ProductOverlay)
