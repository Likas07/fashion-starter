import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

import { collectionMetadataCustomFieldsSchema } from "@lib/util/collections"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Layout, LayoutColumn } from "@/components/Layout"
import BuyTogether from "@modules/products/components/buy-together"
import DiscountProgressBar from "@modules/products/components/discount-progress-bar"
import ProductInfoAccordions from "@modules/products/components/product-info-accordions"
import ReviewsPlaceholder from "@modules/products/components/reviews-placeholder"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  materials,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const images = product.images || []
  const hasImages = Boolean(
    product.images &&
      product.images.filter((image) => Boolean(image.url)).length > 0
  )

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    product.collection?.metadata ?? {}
  )

  return (
    <div
      className="pt-18 md:pt-26 lg:pt-37 pb-26 md:pb-36"
      data-testid="product-container"
    >
      <ImageGallery className="md:hidden" images={images} />

      {/* Main Product Section */}
      <Layout>
        <LayoutColumn className="mb-26 md:mb-52">
          <div className="flex max-lg:flex-col gap-8 xl:gap-27">
            {hasImages && (
              <div className="lg:w-1/2 flex flex-1 flex-col gap-8">
                <ImageGallery className="max-md:hidden" images={images} />
              </div>
            )}
            <div className="sticky flex-1 top-0">
              <ProductInfo product={product} />
              <ProductActions
                product={product}
                materials={materials}
                region={region}
              />
            </div>
            {!hasImages && <div className="flex-1" />}
          </div>
        </LayoutColumn>
      </Layout>

      {/* Discount Progress Bar */}
      <Layout>
        <LayoutColumn>
          <DiscountProgressBar
            currentValue={75}
            targetValue={149}
            rewardType="frete"
            className="mb-8"
          />
        </LayoutColumn>
      </Layout>

      {/* Product Information Accordions */}
      <Layout>
        <LayoutColumn>
          <ProductInfoAccordions
            product={product}
            materials={materials}
            className="mb-12"
          />
        </LayoutColumn>
      </Layout>

      {/* Buy Together Section */}
      <Layout>
        <LayoutColumn>
          <BuyTogether
            currentProduct={product}
            suggestedProducts={[
              {
                id: "suggestion-1",
                title: "Saída de Praia Complementar",
                thumbnail: product.thumbnail || "/placeholder-product.jpg",
                price: {
                  calculated_price: 8900,
                  currency_code: "BRL",
                },
              },
              {
                id: "suggestion-2",
                title: "Protetor Solar FPS 60",
                thumbnail: product.thumbnail || "/placeholder-product.jpg",
                price: {
                  calculated_price: 4500,
                  currency_code: "BRL",
                },
              },
            ]}
            className="mb-12"
          />
        </LayoutColumn>
      </Layout>

      {/* Reviews Placeholder */}
      <Layout>
        <LayoutColumn>
          <ReviewsPlaceholder className="mb-12" />
        </LayoutColumn>
      </Layout>

      {/* Collection Details Sections */}
      {collectionDetails.success &&
        ((typeof collectionDetails.data.product_page_heading === "string" &&
          collectionDetails.data.product_page_heading.length > 0) ||
          typeof collectionDetails.data.product_page_image?.url ===
            "string") && (
          <Layout>
            <LayoutColumn>
              {typeof collectionDetails.data.product_page_heading ===
                "string" &&
                collectionDetails.data.product_page_heading.length > 0 && (
                  <h2 className="text-md md:text-2xl mb-8">
                    {collectionDetails.data.product_page_heading}
                  </h2>
                )}
              {typeof collectionDetails.data.product_page_image?.url ===
                "string" && (
                <div className="relative mb-8 md:mb-20 aspect-[3/2]">
                  <Image
                    src={collectionDetails.data.product_page_image.url}
                    alt="Collection product page image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </LayoutColumn>
          </Layout>
        )}
      {collectionDetails.success &&
        collectionDetails.data.product_page_wide_image &&
        typeof collectionDetails.data.product_page_wide_image.url ===
          "string" && (
          <div className="relative mb-8 md:mb-20 aspect-[3/2] md:aspect-[7/3]">
            <Image
              src={collectionDetails.data.product_page_wide_image.url}
              alt="Collection product page wide image"
              fill
              className="object-cover"
            />
          </div>
        )}
      {collectionDetails.success &&
        (typeof collectionDetails.data.product_page_cta_image?.url ===
          "string" ||
          (typeof collectionDetails.data.product_page_cta_heading ===
            "string" &&
            collectionDetails.data.product_page_cta_heading.length > 0) ||
          (typeof collectionDetails.data.product_page_cta_link === "string" &&
            collectionDetails.data.product_page_cta_link.length > 0)) && (
          <Layout>
            {typeof collectionDetails.data.product_page_cta_image?.url ===
              "string" && (
              <LayoutColumn start={1} end={{ base: 10, md: 6 }}>
                <div className="relative aspect-[3/4]">
                  <Image
                    src={collectionDetails.data.product_page_cta_image.url}
                    fill
                    alt="Collection product page CTA image"
                  />
                </div>
              </LayoutColumn>
            )}
            {((typeof collectionDetails.data.product_page_cta_heading ===
              "string" &&
              collectionDetails.data.product_page_cta_heading.length > 0) ||
              (typeof collectionDetails.data.product_page_cta_link ===
                "string" &&
                collectionDetails.data.product_page_cta_link.length > 0)) && (
              <LayoutColumn start={{ base: 1, md: 7 }} end={13}>
                {typeof collectionDetails.data.product_page_cta_heading ===
                  "string" &&
                  collectionDetails.data.product_page_cta_heading.length >
                    0 && (
                    <h3 className="text-md md:text-2xl my-8 md:mt-20">
                      {collectionDetails.data.product_page_cta_heading}
                    </h3>
                  )}
                {typeof collectionDetails.data.product_page_cta_link ===
                  "string" &&
                  collectionDetails.data.product_page_cta_link.length > 0 &&
                  typeof product.collection?.handle === "string" && (
                    <p className="text-base md:text-md">
                      <LocalizedLink
                        href={`/collections/${product.collection.handle}`}
                        variant="underline"
                      >
                        {collectionDetails.data.product_page_cta_link}
                      </LocalizedLink>
                    </p>
                  )}
              </LayoutColumn>
            )}
          </Layout>
        )}

      {/* Related Products */}
      <Suspense fallback={<SkeletonRelatedProducts />}>
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>
    </div>
  )
}

export default ProductTemplate
