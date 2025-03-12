import { HttpTypes } from "@medusajs/types"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import Addresses from "@modules/checkout/components/addresses"
import Email from "@modules/checkout/components/email"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  countryCode,
}: {
  cart: HttpTypes.StoreCart | null
  countryCode: string
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <>
      <Email cart={cart} countryCode={countryCode} />
      <Addresses cart={cart} />
      <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      <Review cart={cart} />
    </>
  )
}
