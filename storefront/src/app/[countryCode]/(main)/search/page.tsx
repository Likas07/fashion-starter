// External packages
import Image from "next/image"

// COmponents
import { Carousel } from "@/components/Carousel"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"

export default function SearchPage() {
  return (
    <div className="md:pt-47 py-26 md:pb-36">
      <Layout>
        <LayoutColumn>
          <h2 className="mb-8 md:mb-16 text-lg md:text-2xl">
            Search results for &apos;scandinavian&apos;
          </h2>
        </LayoutColumn>
      </Layout>
      <Layout className="gap-y-10 md:gap-y-16 mb-26 md:mb-36">
        <LayoutColumn className="md:!col-span-4 !col-span-6">
          <LocalizedLink href="">
            <Thumbnail
              thumbnail="/images/content/shop1.png"
              size="square"
              className="mb-4 md:mb-6"
            />
            <div className="flex justify-between max-md:flex-col">
              <div className="max-md:text-xs">
                <p className="mb-1">Nordic Haven</p>
                <p className="text-grayscale-500 text-xs max-md:hidden">
                  Scandinavian Simplicity
                </p>
              </div>
              <div>
                <p className="font-semibold max-md:text-xs">1000€</p>
              </div>
            </div>
          </LocalizedLink>
        </LayoutColumn>
        <LayoutColumn className="md:!col-span-4 !col-span-6">
          <LocalizedLink href="">
            <Thumbnail
              thumbnail="/images/content/shop1.png"
              size="square"
              className="mb-4 md:mb-6"
            />
            <div className="flex justify-between max-md:flex-col">
              <div className="max-md:text-xs">
                <p className="mb-1">Nordic Haven</p>
                <p className="text-grayscale-500 text-xs max-md:hidden">
                  Scandinavian Simplicity
                </p>
              </div>
              <div>
                <p className="font-semibold max-md:text-xs">1000€</p>
              </div>
            </div>
          </LocalizedLink>
        </LayoutColumn>
        <LayoutColumn className="md:!col-span-4 !col-span-6">
          <LocalizedLink href="">
            <Thumbnail
              thumbnail="/images/content/shop1.png"
              size="square"
              className="mb-4 md:mb-6"
            />
            <div className="flex justify-between max-md:flex-col">
              <div className="max-md:text-xs">
                <p className="mb-1">Nordic Haven</p>
                <p className="text-grayscale-500 text-xs max-md:hidden">
                  Scandinavian Simplicity
                </p>
              </div>
              <div>
                <p className="font-semibold max-md:text-xs">1000€</p>
              </div>
            </div>
          </LocalizedLink>
        </LayoutColumn>
        <LayoutColumn className="md:!col-span-4 !col-span-6">
          <LocalizedLink href="">
            <Thumbnail
              thumbnail="/images/content/shop1.png"
              size="square"
              className="mb-4 md:mb-6"
            />
            <div className="flex justify-between max-md:flex-col">
              <div className="max-md:text-xs">
                <p className="mb-1">Nordic Haven</p>
                <p className="text-grayscale-500 text-xs max-md:hidden">
                  Scandinavian Simplicity
                </p>
              </div>
              <div>
                <p className="font-semibold max-md:text-xs">1000€</p>
              </div>
            </div>
          </LocalizedLink>
        </LayoutColumn>
      </Layout>
      <Carousel
        heading={
          <h3 className="text-md md:text-2xl">
            Check out our collections for more products
          </h3>
        }
        button={
          <>
            <LocalizedButtonLink
              href="/store"
              size="md"
              className="h-full flex-1 max-md:hidden md:h-auto"
            >
              View All
            </LocalizedButtonLink>
            <LocalizedButtonLink href="/store" size="sm" className="md:hidden">
              View All
            </LocalizedButtonLink>
          </>
        }
      >
        <div className="w-[70%] sm:w-[60%] lg:w-full max-w-124 flex-shrink-0">
          <LocalizedLink href="">
            <div className="relative mb-4 md:mb-10 w-full aspect-[3/4]">
              <Image
                src="/images/content/scandinavian-simplicity.png"
                alt="Scandinavian simplicity"
                fill
              />
            </div>
            <h3 className="md:text-lg mb-2 md:mb-4">Scandinavian Simplicity</h3>
            <p className="text-xs text-grayscale-500 md:text-md">
              Minimalistic designs, neutral colors, and high-quality textures
            </p>
          </LocalizedLink>
        </div>
        <div className="w-[70%] sm:w-[60%] lg:w-full max-w-124 flex-shrink-0">
          <LocalizedLink href="">
            <div className="relative mb-4 md:mb-10 w-full aspect-[3/4]">
              <Image
                src="/images/content/scandinavian-simplicity.png"
                alt="Scandinavian simplicity"
                fill
              />
            </div>
            <h3 className="md:text-lg mb-2 md:mb-4">Scandinavian Simplicity</h3>
            <p className="text-xs text-grayscale-500 md:text-md">
              Minimalistic designs, neutral colors, and high-quality textures
            </p>
          </LocalizedLink>
        </div>
        <div className="w-[70%] sm:w-[60%] lg:w-full max-w-124 flex-shrink-0">
          <LocalizedLink href="">
            <div className="relative mb-4 md:mb-10 w-full aspect-[3/4]">
              <Image
                src="/images/content/scandinavian-simplicity.png"
                alt="Scandinavian simplicity"
                fill
              />
            </div>
            <h3 className="md:text-lg mb-2 md:mb-4">Scandinavian Simplicity</h3>
            <p className="text-xs text-grayscale-500 md:text-md">
              Minimalistic designs, neutral colors, and high-quality textures
            </p>
          </LocalizedLink>
        </div>
        <div className="w-[70%] sm:w-[60%] lg:w-full max-w-124 flex-shrink-0">
          <LocalizedLink href="">
            <div className="relative mb-4 md:mb-10 w-full aspect-[3/4]">
              <Image
                src="/images/content/scandinavian-simplicity.png"
                alt="Scandinavian simplicity"
                fill
              />
            </div>
            <h3 className="md:text-lg mb-2 md:mb-4">Scandinavian Simplicity</h3>
            <p className="text-xs text-grayscale-500 md:text-md">
              Minimalistic designs, neutral colors, and high-quality textures
            </p>
          </LocalizedLink>
        </div>
      </Carousel>
    </div>
  )
}
