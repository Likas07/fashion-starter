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
  homeDisplayCollections: {
    count: 4, // Number of products to display if no specific handles are provided
    handles: [] as string[], // Array of product handles to feature.
  },
  verticalBannerImage: "/images/content/Carousel_3.jpg", // Default banner image
  heroCarouselImages: [
    { src: "/images/content/Carousel_1.jpg", alt: "Hero image 1" },
    { src: "/images/content/Carousel_2.jpg", alt: "Hero image 2" },
    { src: "/images/content/Carousel_3.jpg", alt: "Hero image 3" },
  ],
  videoProductGalleryItems: [
    {
      videoUrl: "https://www.youtube.com/embed/n61ULEU7CO0",
      product: {
        imageUrl: "https://placehold.co/300x200.png?text=Product+Image+1",
        name: "Placeholder Product 1",
        price: "R$ 99,99",
        productLink: "#",
      },
    },
    {
      videoUrl: "https://www.youtube.com/embed/n61ULEU7CO0",
      product: {
        imageUrl: "https://placehold.co/300x200.png?text=Product+Image+2",
        name: "Placeholder Product 2",
        price: "R$ 129,99",
        productLink: "#",
      },
    },
  ] as VideoProductItemConfig[],
  // Add other site-wide configurations here as needed
}

export type SiteConfig = typeof siteConfig

export interface VideoProductItemConfig {
  videoUrl: string
  product: {
    imageUrl: string
    name: string
    price: string
    productLink?: string
  }
}

export type VideoProductItem = VideoProductItemConfig
