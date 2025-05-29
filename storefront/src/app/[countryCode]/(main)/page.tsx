import { Metadata } from "next"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types" // Added
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn, ColumnsNumbers } from "@/components/Layout"
import ProductPreview from "@modules/products/components/product-preview"
import { siteConfig } from "@/config/site" // Added
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"
import { Carousel } from "@/components/Carousel"
import OfferBenefits from "@/components/OfferBenefits"

export const metadata: Metadata = {
  title: "Orla Da Praia",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

const ProductTypesSection: React.FC = async () => {
  const productTypes = await getProductTypesList(0, 20, [
    "id",
    "value",
    "metadata",
  ])

  if (!productTypes) {
    return null
  }

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="text-md md:text-2xl mb-8 md:mb-15">Our products</h3>
      </LayoutColumn>
      {productTypes.productTypes.map((productType, index) => (
        <LayoutColumn
          key={productType.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
        >
          <LocalizedLink href={`/store?type=${productType.value}`}>
            {typeof productType.metadata?.image === "object" &&
              productType.metadata.image &&
              "url" in productType.metadata.image &&
              typeof productType.metadata.image.url === "string" && (
                <Image
                  src={productType.metadata.image.url}
                  width={1200}
                  height={900}
                  alt={productType.value}
                  className="mb-2 md:mb-8"
                />
              )}
            <p className="text-xs md:text-md">{productType.value}</p>
          </LocalizedLink>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Fetch products for the first featured carousel
  let productsToFetch
  const { handles: featuredHandles, count: featuredCount } =
    siteConfig.featuredProducts

  if (featuredHandles && featuredHandles.length > 0) {
    const { response } = await getProductsList({
      countryCode,
      queryParams: {
        handle: featuredHandles,
        fields: "handle,thumbnail,title,collection_id",
      },
    })
    productsToFetch = response.products
  } else {
    const { response } = await getProductsList({
      countryCode,
      queryParams: {
        limit: featuredCount,
        fields: "handle,thumbnail,title,collection_id",
      },
    })
    productsToFetch = response.products
  }
  const products = productsToFetch

  // Fetch products for the secondary featured carousel
  let secondaryProductsToFetch
  const { handles: secondaryHandles, count: secondaryCount } =
    siteConfig.secondaryFeaturedProducts

  if (secondaryHandles && secondaryHandles.length > 0) {
    const { response } = await getProductsList({
      countryCode,
      queryParams: {
        handle: secondaryHandles,
        fields: "handle,thumbnail,title,collection_id",
      },
    })
    secondaryProductsToFetch = response.products
  } else {
    const { response } = await getProductsList({
      countryCode,
      queryParams: {
        limit: secondaryCount,
        fields: "handle,thumbnail,title,collection_id",
      },
    })
    secondaryProductsToFetch = response.products
  }
  const secondaryProducts = secondaryProductsToFetch

  return (
    <>
      <div className="max-md:pt-18">
        <Carousel
          autoplay={true}
          autoplayDelay={5000}
          loop={true}
          arrows={true}
          useInternalLayout={false} // Tell carousel to be full-width
          arrowPosition="inside" // Add this prop
          className="md:h-screen w-full" // Ensure carousel itself takes full width
        >
          {siteConfig.heroCarouselImages.map((image, index) => (
            <div key={index} className="relative flex-[0_0_100%] md:h-screen">
              <Image
                src={image.src}
                fill
                alt={image.alt}
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <OfferBenefits />
      {products && products.length > 0 && (
        <div className="py-12 bg-gray-100">
          <Layout>
            <LayoutColumn className="col-span-full text-center mb-8">
              <h2 className="text-2xl font-semibold">VOCÊ VAI AMAR CONHECER</h2>
            </LayoutColumn>
          </Layout>
          <Carousel
            autoplay={false} // You might want to enable this
            loop={true}
            arrows={true}
            useInternalLayout={true} // Use internal layout for product carousel
            className="w-full"
          >
            {products.map((product: HttpTypes.StoreProduct) => (
              <div
                key={product.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <ProductPreview product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        <Layout className="mb-26 md:mb-36 items-stretch">
          {/* Left Column: Vertical Banner */}
          <LayoutColumn
            start={1}
            end={{ base: 13, md: 5 }} // Banner takes 4/12 columns on medium+
            className="relative min-h-[300px] md:min-h-0 md:aspect-[3/5] order-1 md:order-none" // Aspect ratio for banner
          >
            <Image
              src={siteConfig.verticalBannerImage}
              alt="Promotional Banner"
              fill
              className="object-cover rounded-lg"
            />
          </LayoutColumn>
          {/* Right Column: New Carousel */}
          <LayoutColumn
            start={{ base: 1, md: 5 }} // Carousel takes 8/12 columns on medium+
            end={13}
            className="flex flex-col order-2 md:order-none mt-6 md:mt-0"
          >
            {secondaryProducts && secondaryProducts.length > 0 ? (
              <Carousel
                autoplay={false}
                loop={true}
                arrows={true}
                useInternalLayout={false} // Manage layout explicitly
                arrowPosition="inside" // Add this prop
                className="w-full h-full flex-grow"
              >
                {secondaryProducts.map((product: HttpTypes.StoreProduct) => (
                  <div
                    key={product.id}
                    className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 p-2" // Shows 1, 2, 2, or 3 items based on screen
                  >
                    <ProductPreview product={product} thumbnailSize="medium" />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
                <p className="text-gray-500 text-center">
                  No featured products for this section yet. Configure them in
                  siteConfig.
                </p>
              </div>
            )}
          </LayoutColumn>
        </Layout>
        <ProductTypesSection />
        <CollectionsSection className="mb-22 md:mb-36" />
        <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-md md:text-2xl mb-8 md:mb-16">
              About Sofa Society
            </h3>
            <Image
              src="/images/content/gray-sofa-against-concrete-wall.png"
              width={2496}
              height={1400}
              alt="Gray sofa against concrete wall"
              className="mb-8 md:mb-16 max-md:aspect-[3/2] max-md:object-cover"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="text-md md:text-2xl">
              At Sofa Society, we believe that a sofa is the heart of every
              home.
            </h2>
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div className="md:text-md">
              <p className="mb-5 md:mb-9">
                We are dedicated to delivering high-quality, thoughtfully
                designed sofas that merge comfort and style effortlessly.
              </p>
              <p className="mb-5 md:mb-3">
                Our mission is to transform your living space into a sanctuary
                of relaxation and beauty, with products built to last.
              </p>
              <LocalizedLink href="/about" variant="underline">
                Read more about Sofa Society
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
