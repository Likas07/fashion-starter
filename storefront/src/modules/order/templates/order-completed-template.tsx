// External packages
import Image from "next/image"

import { HttpTypes } from "@medusajs/types"

import PaymentDetails from "@modules/order/components/payment-details"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import { Icon } from "@/components/Icon"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <Layout className="py-26 md:pt-39 md:pb-36">
      <LayoutColumn
        start={{ base: 1, lg: 3, xl: 4 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <h1 className="text-md md:text-2xl mb-8 md:mb-16">
          Thank you for your order!
        </h1>
        <p className="mb-4">
          We are pleased to confirm that your order has been successfully placed
          and will be processed shortly.
        </p>
        <p className="mb-8">
          We have sent you the receipt and order details via{" "}
          <strong>e-mail</strong>.<br />
          Your order number is <strong>#{order.display_id}</strong>.
        </p>
        <div className="flex gap-x-6 gap-y-4 max-sm:flex-col mb-16">
          <LocalizedButtonLink href="/">
            Check order details
          </LocalizedButtonLink>
          <LocalizedButtonLink href="/" variant="outline">
            Back to home
          </LocalizedButtonLink>
        </div>
        <div className="flex max-sm:flex-col gap-x-4 gap-y-4 md:flex-col lg:flex-row mb-5">
          <div className="flex-1 overflow-hidden rounded-xs border border-grayscale-200 p-4">
            <div className="flex gap-4 items-center mb-8">
              <Icon name="map-pin" />
              <p className="text-grayscale-400">Delivery address</p>
            </div>
            <div>
              <p>Jovana Jerimic</p>
              <p>Duvanjska 3, 10000 Zagreb, Croatia</p>
              <p>+385 226 2266</p>
            </div>
          </div>
          <div className="flex-1 overflow-hidden rounded-xs border border-grayscale-200 p-4">
            <div className="flex gap-4 items-center mb-8">
              <Icon name="receipt" />
              <p className="text-grayscale-400">Billing address</p>
            </div>
            <div>
              <p>Jovana Jerimic</p>
              <p>Duvanjska 3, 10000 Zagreb, Croatia</p>
              <p>+385 226 2266</p>
            </div>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 mb-5">
          <div className="flex gap-x-6 sm:gap-x-8 gap-y-6 mb-6 pb-6 border-b border-grayscale-100 last:border-0 last:mb-0 last:pb-0">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-full max-w-27 sm:max-w-37 aspect-[3/4]"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 sm:text-md">Paloma Haven</p>
              <div className="text-xs flex flex-col flex-1">
                <div>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Material:</span>
                    Linen
                  </p>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Color:</span>Gray
                  </p>
                </div>
                <div className="sm:mt-auto flex max-sm:flex-col gap-x-10 gap-y-6 max-sm:h-full sm:items-center justify-between relative">
                  <div className="sm:self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-base sm:text-md">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-6 sm:gap-x-8 gap-y-6 mb-6 pb-6 border-b border-grayscale-100 last:border-0 last:mb-0 last:pb-0">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-full max-w-27 sm:max-w-37 aspect-[3/4]"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 sm:text-md">Paloma Haven</p>
              <div className="text-xs flex flex-col flex-1">
                <div>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Material:</span>
                    Linen
                  </p>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Color:</span>Gray
                  </p>
                </div>
                <div className="sm:mt-auto flex max-sm:flex-col gap-x-10 gap-y-6 max-sm:h-full sm:items-center justify-between relative">
                  <div className="sm:self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-base sm:text-md">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-6 sm:gap-x-8 gap-y-6 mb-6 pb-6 border-b border-grayscale-100 last:border-0 last:mb-0 last:pb-0">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-full max-w-27 sm:max-w-37 aspect-[3/4]"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 sm:text-md">Paloma Haven</p>
              <div className="text-xs flex flex-col flex-1">
                <div>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Material:</span>
                    Linen
                  </p>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Color:</span>Gray
                  </p>
                </div>
                <div className="sm:mt-auto flex max-sm:flex-col gap-x-10 gap-y-6 max-sm:h-full sm:items-center justify-between relative">
                  <div className="sm:self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-base sm:text-md">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-6 sm:gap-x-8 gap-y-6 mb-6 pb-6 border-b border-grayscale-100 last:border-0 last:mb-0 last:pb-0">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-full max-w-27 sm:max-w-37 aspect-[3/4]"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 sm:text-md">Paloma Haven</p>
              <div className="text-xs flex flex-col flex-1">
                <div>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Material:</span>
                    Linen
                  </p>
                  <p className="mb-1">
                    <span className="text-grayscale-400 mr-2">Color:</span>Gray
                  </p>
                </div>
                <div className="sm:mt-auto flex max-sm:flex-col gap-x-10 gap-y-6 max-sm:h-full sm:items-center justify-between relative">
                  <div className="sm:self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-base sm:text-md">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex max-sm:flex-col gap-y-8 gap-x-10 md:flex-wrap justify-between">
          <div className="flex items-center self-baseline gap-4">
            <Icon name="credit-card" />
            <div>
              <p className="text-grayscale-500">Payment</p>
            </div>
          </div>
          <div className="sm:max-w-65 w-full flex-1">
            <div className="flex justify-between gap-4 mb-2">
              <div className="text-grayscale-500">
                <p>Subtotal</p>
              </div>
              <div className="self-end">
                <p>€120</p>
              </div>
            </div>
            <div className="flex justify-between gap-4 mb-2">
              <div className="text-grayscale-500">
                <p>Shipping</p>
              </div>
              <div className="self-end">
                <p>€15</p>
              </div>
            </div>
            <div className="flex justify-between gap-4 mb-6">
              <div className="text-grayscale-500">
                <p>Taxes</p>
              </div>
              <div className="self-end">
                <p>€0.00</p>
              </div>
            </div>
            <div className="flex justify-between gap-4 text-md mb-1">
              <div>
                <p>Total</p>
              </div>
              <div className="self-end">
                <p>€135</p>
              </div>
            </div>
            <p className="text-xs text-grayscale-500">Including 11.25 tax </p>
          </div>
        </div>
      </LayoutColumn>
    </Layout>
  )
}
