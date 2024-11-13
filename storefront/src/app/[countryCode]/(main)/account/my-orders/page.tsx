// External components
import Image from "next/image"

// Components
import { ButtonLink } from "@/components/Button"
import { UiTag } from "@/components/ui/Tag"
import { LocalizedLink } from "@/components/LocalizedLink"

export default function AccountMyOrdersPage() {
  return (
    <>
      <h1 className="text-lg mb-13">My orders</h1>
      {true ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-xs border border-grayscale-200 flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-8 p-4">
            <div className="flex max-sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-y-6 gap-x-10 justify-between lg:flex-wrap">
              <div className="flex-shrink-0">
                <p className="text-md mb-2">
                  <span className="font-semibold">Order: </span>00000000004
                </p>
                <p className="text-grayscale-500">
                  Order date: 29 December 2024
                </p>
              </div>
              <div className="flex gap-4 max-lg:overflow-x-auto">
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
              </div>
            </div>
            <div className="flex max-sm:flex-col md:flex-col lg:flex-row justify-between gap-6">
              <UiTag isActive iconName="package" className="self-start mt-auto">
                Packing
              </UiTag>
              <ButtonLink
                href="/account/my-orders/order1"
                variant="outline"
                size="sm"
                className="sm:self-end md:self-start lg:self-end"
              >
                Check status
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-xs border border-grayscale-200 flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-8 p-4">
            <div className="flex max-sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-y-6 gap-x-10 justify-between lg:flex-wrap">
              <div className="flex-shrink-0">
                <p className="text-md mb-2">
                  <span className="font-semibold">Order: </span>00000000022
                </p>
                <p className="text-grayscale-500">
                  Order date: 29 December 2024
                </p>
              </div>
              <div className="flex gap-4 max-lg:overflow-x-auto">
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
              </div>
            </div>
            <div className="flex max-sm:flex-col md:flex-col lg:flex-row justify-between gap-6">
              <UiTag isActive iconName="package" className="self-start mt-auto">
                Packing
              </UiTag>
              <ButtonLink
                href="/account/my-orders/order1"
                variant="outline"
                size="sm"
                className="sm:self-end md:self-start lg:self-end"
              >
                Check status
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-xs border border-grayscale-200 flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-8 p-4">
            <div className="flex max-sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-y-6 gap-x-10 justify-between lg:flex-wrap">
              <div className="flex-shrink-0">
                <p className="text-md mb-2">
                  <span className="font-semibold">Order: </span>00000000013
                </p>
                <p className="text-grayscale-500">
                  Order date: 29 December 2024
                </p>
              </div>
              <div className="flex gap-4 max-lg:overflow-x-auto">
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
              </div>
            </div>
            <div className="flex max-sm:flex-col md:flex-col lg:flex-row justify-between gap-6">
              <UiTag isActive iconName="package" className="self-start mt-auto">
                Packing
              </UiTag>
              <ButtonLink
                href="/account/my-orders/order1"
                variant="outline"
                size="sm"
                className="sm:self-end md:self-start lg:self-end"
              >
                Check status
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-xs border border-grayscale-200 flex flex-col gap-6 sm:gap-8 md:gap-6 lg:gap-8 p-4">
            <div className="flex max-sm:flex-col-reverse md:flex-col-reverse lg:flex-row gap-y-6 gap-x-10 justify-between lg:flex-wrap">
              <div className="flex-shrink-0">
                <p className="text-md mb-2">
                  <span className="font-semibold">Order: </span>00000000001
                </p>
                <p className="text-grayscale-500">
                  Order date: 29 December 2024
                </p>
              </div>
              <div className="flex gap-4 max-lg:overflow-x-auto">
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0 lg:hidden"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0 lg:hidden"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0 lg:hidden"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="shrink-0 lg:hidden"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19 rounded-2xs aspect-[3/4]"
                  />
                </LocalizedLink>
                <LocalizedLink
                  href="/account/my-orders/order1"
                  className="rounded-2xs aspect-[3/4] overflow-hidden relative shrink-0 max-lg:hidden"
                >
                  <Image
                    src="/images/content/product1.png"
                    width={1200}
                    height={1600}
                    alt="Sofa"
                    className="w-19"
                  />
                  <div className="h-full w-full bg-black-30% flex items-center justify-center absolute left-0 top-0 z-10 text-md font-semibold text-white">
                    <p>+4</p>
                  </div>
                </LocalizedLink>
              </div>
            </div>
            <div className="flex max-sm:flex-col md:flex-col lg:flex-row justify-between gap-6">
              <UiTag isActive iconName="package" className="self-start mt-auto">
                Packing
              </UiTag>
              <ButtonLink
                href="/account/my-orders/order1"
                variant="outline"
                size="sm"
                className="sm:self-end md:self-start lg:self-end"
              >
                Check status
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-md mt-16">You haven&apos;t ordered anything yet</p>
      )}
    </>
  )
}
