import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { retrieveCart } from "@lib/data/cart"
import { getCustomer } from "@lib/data/customer"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import MobileCheckoutSummary from "@modules/checkout/templates/mobile-checkout-summary"
import { getCheckoutStep } from "@modules/cart/utils/getCheckoutStep"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"

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
    <>
      <Layout className="lg:hidden">
        <LayoutColumn>
          <div className="flex justify-between items-center h-18">
            <LocalizedLink href="/" className="text-md font-medium">
              SofaSocietyCo.
            </LocalizedLink>
            <div>
              <p className="font-semibold">Checkout</p>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
      <div className="w-full bg-grayscale-50 lg:hidden">
        <Layout>
          <LayoutColumn>
            <MobileCheckoutSummary cart={cart} />
          </LayoutColumn>
        </Layout>
      </div>
      <Layout>
        <LayoutColumn className="flex max-lg:flex-col-reverse lg:justify-between relative">
          <div className="flex-1 pt-8 lg:max-w-125 xl:max-w-150 pb-9 lg:pb-40">
            <LocalizedLink
              href="/"
              className="text-md font-medium mb-16 inline-block max-lg:hidden"
            >
              SofaSocietyCo.
            </LocalizedLink>
            <Wrapper cart={cart}>
              <CheckoutForm
                cart={cart}
                customer={customer}
                countryCode={countryCode}
              />
            </Wrapper>
          </div>
          <div className="sticky top-0 lg:max-w-100 xl:max-w-123 flex-1 py-32 max-lg:hidden z-10 self-start">
            <CheckoutSummary cart={cart} />
          </div>
          <div className="absolute right-0 top-0 lg:max-w-[calc((50vw-50%)+448px)] xl:max-w-[calc((50vw-50%)+540px)] -mr-[calc(50vw-50%)] bg-grayscale-50 h-full w-full max-lg:hidden" />
        </LayoutColumn>
      </Layout>
    </>
  )
}
