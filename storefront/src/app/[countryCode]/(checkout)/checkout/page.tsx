import React from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { retrieveCart } from "@lib/data/cart"
import { getCustomer } from "@lib/data/customer"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import { getCheckoutStep } from "@modules/cart/utils/getCheckoutStep"

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
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const { countryCode } = await params
  const { step } = await searchParams

  const cart = await fetchCart()
  const customer = await getCustomer()
  const checkoutStep = getCheckoutStep(cart)

  if (!step) {
    redirect(`/${countryCode}/checkout?step=${checkoutStep}`)
  }

  return (
    <Wrapper cart={cart}>
      <CheckoutForm cart={cart} customer={customer} countryCode={countryCode} />
    </Wrapper>
  )
}
