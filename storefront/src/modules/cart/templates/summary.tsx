"use client"

import { HttpTypes } from "@medusajs/types"

import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import CartTotals from "@modules/cart/components/cart-totals"
import DiscountCode from "@modules/cart/components/discount-code"
import { Icon } from "@/components/Icon"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart.email) {
    return "email"
  }

  if (!cart?.shipping_address?.address_1) {
    return "delivery"
  }

  if (cart?.shipping_methods?.length === 0) {
    return "shipping"
  }

  return "payment"
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <>
      <CartTotals cart={cart} />
      <DiscountCode cart={cart} />
      <LocalizedButtonLink
        href={"/checkout?step=" + step}
        isFullWidth
        className="mt-6"
      >
        Proceed to checkout
      </LocalizedButtonLink>
      <div className="bg-grayscale-50 rounded-xs p-4 flex items-center text-grayscale-500 gap-4">
        <Icon name="info" />
        <p>
          Already have an account? No worries, just{" "}
          <LocalizedLink href="/" variant="underline" className="text-black">
            log in.
          </LocalizedLink>
        </p>
      </div>
    </>
  )
}

export default Summary
