"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { applyPromotions } from "@lib/data/cart"
import { Input } from "@/components/Forms"
import { Button } from "@/components/Button"
import { twMerge } from "tailwind-merge"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  className?: string
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart, className }) => {
  const { promotions = [] } = cart
  const [promotionCode, setPromotionCode] = React.useState<string>("")

  const addPromotionCode = async () => {
    if (!promotionCode) {
      return
    }
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(promotionCode)

    await applyPromotions(codes)

    setPromotionCode("")
  }

  return (
    <div className={twMerge("flex gap-2 mt-10", className)}>
      <Input
        name="code"
        autoFocus={false}
        value={promotionCode}
        onChange={(e) => setPromotionCode(e.target.value)}
        uiSize="md"
        placeholder="Discount code"
        wrapperClassName="flex flex-1"
      />
      <Button onPress={addPromotionCode}>Apply</Button>
    </div>
  )
}

export default DiscountCode
