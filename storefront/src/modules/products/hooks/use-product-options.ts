import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { getVariantItemsInStock } from "@lib/util/inventory"

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

// The new custom hook
export const useProductOptions = ({
  product,
  selectedOptions,
}: {
  product: HttpTypes.StoreProduct
  selectedOptions: Record<string, string>
}) => {
  // Logic to parse and prepare available options (sizes, colors, etc.)
  const availableOptions = useMemo(() => {
    if (!product.options) {
      return { sizeOption: null, colorOption: null, sizes: [], colors: [] }
    }
    const sizeOption = product.options.find(
      (opt) =>
        opt.title?.toLowerCase() === "size" ||
        opt.title?.toLowerCase() === "tamanho"
    )
    const colorOption = product.options.find(
      (opt) =>
        opt.title?.toLowerCase() === "color" ||
        opt.title?.toLowerCase() === "cor"
    )
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
      colors: colors, // Assuming colors don't need a display name transformation
    }
  }, [product.options])

  // Logic to find the currently selected variant based on options
  const selectedVariant = useMemo(() => {
    if (!product.variants) return null
    if (Object.keys(selectedOptions).length === 0)
      return product.variants[0] || null

    const matchingVariant = product.variants.find((variant) => {
      const variantOptions = optionsAsKeymap(variant.options) || {}
      return Object.entries(selectedOptions).every(
        ([optionId, selectedValue]) =>
          variantOptions[optionId] === selectedValue
      )
    })
    return matchingVariant || product.variants[0] || null
  }, [product.variants, selectedOptions])

  // Logic to check stock for the selected variant
  const itemsInStock = selectedVariant
    ? getVariantItemsInStock(selectedVariant)
    : 0

  // Logic to determine if the product is ready to be added to the cart
  const isReadyToAddToCart = useMemo(() => {
    const hasRequiredSize =
      !availableOptions.sizes.length ||
      (availableOptions.sizeOption &&
        selectedOptions[availableOptions.sizeOption.id])
    const hasRequiredColor =
      !availableOptions.colors.length ||
      (availableOptions.colorOption &&
        selectedOptions[availableOptions.colorOption.id])
    return (
      hasRequiredSize && hasRequiredColor && selectedVariant && itemsInStock > 0
    )
  }, [availableOptions, selectedOptions, selectedVariant, itemsInStock])

  return {
    availableOptions,
    selectedVariant,
    itemsInStock,
    isReadyToAddToCart,
  }
}
