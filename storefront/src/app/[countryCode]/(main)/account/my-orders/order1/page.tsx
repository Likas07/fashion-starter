// External components
import Image from "next/image"

// Components
import { ButtonLink } from "@/components/Button"
import { UiTag } from "@/components/ui/Tag"
import { UiTagList, UiTagListDivider } from "@/components/ui/TagList"
import { Icon } from "@/components/Icon"
import { LocalizedLink } from "@/components/LocalizedLink"

export default function AccountOrderPage() {
  return (
    <>
      <h1 className="text-lg mb-16">Order: 00000000001</h1>
      <div className="flex flex-col gap-6">
        <div className="rounded-xs border border-grayscale-200 p-4">
          <p className="mb-6">
            <span className="text-grayscale-500">Estimate delivery:</span> 1 — 3
            Dec, 2024
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-8 justify-between items-end w-full">
            <UiTagList>
              <UiTag isActive iconName="package" className="self-start mt-auto">
                Packing
              </UiTag>
              <UiTagListDivider />
              <UiTag iconName="truck" className="self-start mt-auto">
                Delivering
              </UiTag>
              <UiTagListDivider />
              <UiTag iconName="check" className="self-start mt-auto">
                Delivered
              </UiTag>
            </UiTagList>
            <ButtonLink
              href="/account/my-orders/order1"
              variant="outline"
              size="sm"
              className="self-end"
            >
              Check status
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 flex flex-wrap justify-between p-4">
          <div className="flex gap-4 items-center">
            <Icon name="calendar" />
            <p className="text-grayscale-400">Order date</p>
          </div>
          <div>
            <p>1 Dec, 2024</p>
          </div>
        </div>
        <div className="flex max-sm:flex-col gap-x-4 gap-y-6 md:flex-col lg:flex-row">
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
        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex gap-x-8 gap-y-6 max-sm:flex-col mb-6 pb-6 border-b border-grayscale-100">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-37 aspect-[3/4] max-sm:w-full"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 text-md">Paloma Haven</p>
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
                <div className="mt-auto flex gap-x-10 gap-y-6 items-center justify-between relative">
                  <div className="self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-md max-sm:absolute max-sm:right-0">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-8 gap-y-6 max-sm:flex-col mb-6 pb-6 border-b border-grayscale-100">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-37 aspect-[3/4] max-sm:w-full"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 text-md">Paloma Haven</p>
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
                <div className="mt-auto flex gap-x-10 gap-y-6 items-center justify-between relative">
                  <div className="self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-md max-sm:absolute max-sm:right-0">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-8 gap-y-6 max-sm:flex-col mb-6 pb-6 border-b border-grayscale-100">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-37 aspect-[3/4] max-sm:w-full"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 text-md">Paloma Haven</p>
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
                <div className="mt-auto flex gap-x-10 gap-y-6 items-center justify-between relative">
                  <div className="self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-md max-sm:absolute max-sm:right-0">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-8 gap-y-6 max-sm:flex-col">
            <LocalizedLink href="">
              <Image
                src="/images/content/product1.png"
                width={1200}
                height={1600}
                alt="Sofa"
                className="w-37 aspect-[3/4] max-sm:w-full"
              />
            </LocalizedLink>
            <div className="flex flex-col flex-1">
              <p className="mb-2 text-md">Paloma Haven</p>
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
                <div className="mt-auto flex gap-x-10 gap-y-6 items-center justify-between relative">
                  <div className="self-end sm:mb-1">
                    <p>
                      <span className="text-grayscale-400 mr-2">Quantity:</span>
                      1
                    </p>
                  </div>
                  <div className="text-md max-sm:absolute max-sm:right-0">
                    <p>€30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4 flex max-sm:flex-col gap-y-4 gap-x-10 md:flex-wrap justify-between">
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
            <div className="flex justify-between gap-4 mb-6">
              <div className="text-grayscale-500">
                <p>Shipping</p>
              </div>
              <div className="self-end">
                <p>€15</p>
              </div>
            </div>
            <div className="flex justify-between gap-4 text-md">
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
      </div>
    </>
  )
}
