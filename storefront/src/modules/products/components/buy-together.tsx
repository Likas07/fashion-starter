"use client"

import React, { useState } from "react"
import { Button } from "@/components/Button"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type BuyTogetherProduct = {
  id: string
  title: string
  thumbnail?: string
  price: {
    calculated_price: number
    currency_code: string
  }
}

type BuyTogetherProps = {
  currentProduct: HttpTypes.StoreProduct
  suggestedProducts: BuyTogetherProduct[]
  className?: string
}

const BuyTogether: React.FC<BuyTogetherProps> = ({
  currentProduct,
  suggestedProducts,
  className = "",
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    currentProduct.id!, // Current product is always selected
  ])

  const toggleProduct = (productId: string) => {
    if (productId === currentProduct.id) return // Can't deselect current product

    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const getTotalPrice = () => {
    const currentPrice =
      currentProduct.variants?.[0]?.calculated_price?.calculated_amount || 0
    const selectedSuggestedProducts = suggestedProducts.filter((product) =>
      selectedProducts.includes(product.id)
    )
    const suggestedTotal = selectedSuggestedProducts.reduce(
      (total, product) => total + product.price.calculated_price,
      0
    )
    return (currentPrice + suggestedTotal) / 100 // Convert from cents
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div className={`border border-grayscale-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-6">Compre Junto</h3>

      <div className="space-y-4">
        {/* Current Product */}
        <div className="flex items-start gap-4 p-4 bg-grayscale-50 rounded-lg">
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={true}
              disabled={true}
              className="w-5 h-5 text-black border-2 border-grayscale-300 rounded focus:ring-black focus:ring-2"
            />
          </div>
          <div className="flex gap-4 flex-1">
            {currentProduct.thumbnail && (
              <div className="flex-shrink-0">
                <Image
                  src={currentProduct.thumbnail}
                  alt={currentProduct.title || ""}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-sm">{currentProduct.title}</h4>
              <p className="text-sm text-grayscale-600 mt-1">
                {formatPrice(
                  (currentProduct.variants?.[0]?.calculated_price
                    ?.calculated_amount || 0) / 100
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        {suggestedProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-start gap-4 p-4 border border-grayscale-200 rounded-lg hover:border-grayscale-300 transition-colors"
          >
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="w-5 h-5 text-black border-2 border-grayscale-300 rounded focus:ring-black focus:ring-2"
              />
            </div>
            <div className="flex gap-4 flex-1">
              {product.thumbnail && (
                <div className="flex-shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{product.title}</h4>
                <p className="text-sm text-grayscale-600 mt-1">
                  {formatPrice(product.price.calculated_price / 100)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Add to Cart */}
      <div className="mt-6 pt-4 border-t border-grayscale-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-lg font-bold">
            {formatPrice(getTotalPrice())}
          </span>
        </div>

        <Button
          onPress={() => {
            // Placeholder for add all to cart functionality
            console.log("Adding to cart:", selectedProducts)
          }}
          className="w-full"
          isDisabled={selectedProducts.length <= 1}
        >
          Adicionar{" "}
          {selectedProducts.length > 1
            ? `${selectedProducts.length} itens`
            : "item"}{" "}
          ao carrinho
        </Button>

        {selectedProducts.length > 1 && (
          <p className="text-sm text-grayscale-600 mt-2 text-center">
            Economize comprando junto!
          </p>
        )}
      </div>
    </div>
  )
}

export default BuyTogether
