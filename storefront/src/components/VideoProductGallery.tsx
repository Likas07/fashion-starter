"use client"

import Image from "next/image"
import { siteConfig, VideoProductItem } from "@/config/site"
// import { AspectRatio } from "../lib/components/ui/aspect-ratio" // No longer using AspectRatio
import { LocalizedLink } from "@/components/LocalizedLink"
import { Layout, LayoutColumn } from "@/components/Layout" // For consistent layout

interface VideoProductGalleryProps {
  title?: string
}

export const VideoProductGallery = ({ title }: VideoProductGalleryProps) => {
  if (
    !siteConfig.videoProductGalleryItems ||
    siteConfig.videoProductGalleryItems.length === 0
  ) {
    return null
  }

  return (
    <Layout className="py-12 md:py-24">
      {(title !== "" || title === undefined) && (
        <LayoutColumn className="col-span-full text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {title || "Assita & Compre"}
          </h2>
        </LayoutColumn>
      )}
      <LayoutColumn className="col-span-full">
        {" "}
        {/* Wrap the grid in a full-width LayoutColumn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {siteConfig.videoProductGalleryItems.map(
            (item: VideoProductItem, index: number) => (
              <div key={index} className="flex flex-col space-y-4 items-center">
                {/* Video Container with fixed dimensions */}
                <div className="w-[232px] h-[360px] bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src={item.videoUrl}
                    title={`Video for ${item.product.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full" // Fills the fixed-size container
                    style={{ border: 0 }}
                  />
                </div>
                {/* Product Card with fixed dimensions and new internal layout */}
                <div className="border border-border rounded-lg w-[216px] h-[77px] p-2 overflow-hidden">
                  <LocalizedLink
                    href={item.product.productLink || "#"}
                    className="group w-full h-full flex flex-row items-center space-x-2"
                  >
                    {/* Image Container (Left) */}
                    <div className="relative w-[55px] h-[55px] rounded-sm flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {/* Text Container (Right) */}
                    <div className="flex flex-col flex-grow h-full overflow-hidden">
                      <h3 className="text-xs font-medium group-hover:text-primary transition-colors truncate w-full text-right">
                        {item.product.name}
                      </h3>
                      <p className="text-2xs text-foreground mt-auto w-full text-right">
                        {item.product.price}
                      </p>
                    </div>
                  </LocalizedLink>
                </div>
              </div>
            )
          )}
        </div>
      </LayoutColumn>
    </Layout>
  )
}
