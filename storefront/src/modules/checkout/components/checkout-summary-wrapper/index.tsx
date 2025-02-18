import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
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

export default async function CheckoutSummaryWrapper() {
  const cart = (await fetchCart()) as HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }

  return <CheckoutSummary cart={cart} />
}
