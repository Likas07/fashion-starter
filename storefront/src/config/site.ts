export const siteConfig = {
  featuredProducts: {
    count: 4, // Number of products to display if no specific handles are provided
    handles: [] as string[], // Array of product handles to feature.
    // Example: handles: ["sofa-1", "chair-2"]
  },
  secondaryFeaturedProducts: {
    count: 3, // Number of products to display if no specific handles are provided
    handles: [] as string[], // Array of product handles to feature.
  },
  verticalBannerImage: "/images/content/Carousel_3.jpg", // Default banner image
  heroCarouselImages: [
    { src: "/images/content/Carousel_1.jpg", alt: "Hero image 1" },
    { src: "/images/content/Carousel_2.jpg", alt: "Hero image 2" },
    { src: "/images/content/Carousel_3.jpg", alt: "Hero image 3" },
  ],
  // Add other site-wide configurations here as needed
}

export type SiteConfig = typeof siteConfig
