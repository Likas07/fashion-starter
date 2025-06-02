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
import { Carousel } from "@/components/Carousel"
import OfferBenefits from "@/components/OfferBenefits"
import { VideoProductGallery } from "@/components/VideoProductGallery" // Import the new component

export const metadata: Metadata = {
  title: "Orla Da Praia",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

// ProductTypesSection removed

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

  // Fetch products for the home display collections carousel
  let homeDisplayCollectionsProductsToFetch
  const {
    handles: homeDisplayCollectionsHandles,
    count: homeDisplayCollectionsCount,
  } = siteConfig.homeDisplayCollections || { handles: [], count: 2 } // Provide default if undefined

  if (
    homeDisplayCollectionsHandles &&
    homeDisplayCollectionsHandles.length > 0
  ) {
    const { response } = await getProductsList({
      countryCode,
      queryParams: {
        handle: homeDisplayCollectionsHandles,
        fields: "handle,thumbnail,title,collection_id",
      },
    })
    homeDisplayCollectionsProductsToFetch = response.products
  } else {
    const { response } = await getProductsList({
      countryCode,
      queryParams: {
        limit: homeDisplayCollectionsCount,
        fields: "handle,thumbnail,title,collection_id",
      },
    })
    homeDisplayCollectionsProductsToFetch = response.products
  }
  const homeDisplayCollectionsProducts = homeDisplayCollectionsProductsToFetch

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
        {/* New Collections Section */}
        <Layout>
          <LayoutColumn className="col-span-full text-center mb-8 pt-12">
            <h2 className="text-2xl font-semibold">FEATURED COLLECTIONS</h2>
          </LayoutColumn>
        </Layout>
        <Layout className="mb-26 md:mb-36 items-stretch">
          {/* Left Column: Vertical Banner for Collections Section */}
          <LayoutColumn
            start={1}
            end={{ base: 13, md: 7 }} // Banner takes 6/12 columns on medium+
            className="relative min-h-[300px] md:min-h-0 md:aspect-[9/10] order-1 md:order-none" // Adjusted aspect ratio
          >
            <Image
              src={siteConfig.verticalBannerImage} // Consider if this should be a different banner
              alt="Collections Banner"
              fill
              className="object-cover rounded-lg"
            />
          </LayoutColumn>
          {/* Right Column: Collections Carousel (Re-implemented) */}
          <LayoutColumn
            start={{ base: 1, md: 7 }} // Carousel takes 6/12 columns on medium+
            end={13}
            className="flex flex-col order-2 md:order-none mt-6 md:mt-0"
          >
            {homeDisplayCollectionsProducts &&
            homeDisplayCollectionsProducts.length > 0 ? (
              <Carousel
                autoplay={false}
                loop={false}
                arrows={false} // No arrows for this carousel
                useInternalLayout={false} // Manage layout explicitly
                className="w-full h-full flex-grow"
              >
                {homeDisplayCollectionsProducts.map(
                  (product: HttpTypes.StoreProduct) => (
                    <div
                      key={product.id}
                      className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 p-4" // Increased padding
                    >
                      <ProductPreview
                        product={product}
                        thumbnailSize="medium"
                      />
                    </div>
                  )
                )}
              </Carousel>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
                <p className="text-gray-500 text-center">
                  No products for this collection yet. Configure them in
                  siteConfig (homeDisplayCollections).
                </p>
              </div>
            )}
          </LayoutColumn>
        </Layout>
        {/* <ProductTypesSection /> Removed */}
        <VideoProductGallery title="Assista & Compre" />{" "}
        {/* Add the new component here */}
        <Layout>
          {/* Optional: Main title for the section, if you want it above the two columns */}
          <LayoutColumn className="col-span-full mb-8 md:mb-12">
            <h3 className="text-xl md:text-3xl text-center font-semibold">
              Sobre a Orla
            </h3>
          </LayoutColumn>

          {/* Left Column: Image */}
          <LayoutColumn className="col-span-full md:col-span-5 order-1 md:order-1 flex items-center justify-center">
            <Image
              src="/images/content/gray-sofa-against-concrete-wall.png" // Or a new image if you prefer
              width={800} // Adjust as needed
              height={600} // Adjust as needed
              alt="About Sofa Society Image"
              className="rounded-lg object-cover w-full h-auto md:max-h-[500px]" // Adjust styling
            />
          </LayoutColumn>

          {/* Right Column: Text Content */}
          <LayoutColumn className="col-span-full md:col-span-7 order-2 md:order-2 flex flex-col justify-center mt-6 md:mt-0 md:pl-8 lg:pl-12">
            <h2 className="text-lg md:text-2xl font-semibold mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <div className="text-sm md:text-md">
              <p className="mb-4 md:mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="mb-4 md:mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <LocalizedLink href="/about" variant="underline">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
