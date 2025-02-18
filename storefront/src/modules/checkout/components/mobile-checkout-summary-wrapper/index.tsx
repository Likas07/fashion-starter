import MobileCheckoutSummary from "@modules/checkout/templates/mobile-checkout-summary"
import { HttpTypes } from "@medusajs/types"
import { retrieveCart } from "@lib/data/cart"
import { notFound } from "next/navigation"

const fetchCart = async () => {
  const cart = await retrieveCart()
  if (!cart) {
    return notFound()
  }

  return cart
}

export default async function MobileCheckoutSummaryWrapper() {
  const cart = (await fetchCart()) as HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }

  return <MobileCheckoutSummary cart={cart} />
}
