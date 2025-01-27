import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { retrieveCart } from "@lib/data/cart"
import { getCustomer } from "@lib/data/customer"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
}

const fetchCart = async () => {
  const cart = await retrieveCart()
  if (!cart) {
    return notFound()
  }

  return cart
}

export default async function Checkout({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  const cart = (await fetchCart()) as HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  const customer = await getCustomer()

  return (
    <Wrapper cart={cart}>
      <CheckoutForm cart={cart} customer={customer} countryCode={countryCode} />
    </Wrapper>
  )
}
