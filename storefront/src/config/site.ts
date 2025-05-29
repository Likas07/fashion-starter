export const siteConfig = {
  featuredProducts: {
    count: 4, // Number of products to display if no specific handles are provided
    handles: [] as string[], // Array of product handles to feature.
    // Example: handles: ["sofa-1", "chair-2"]
  },
  // Add other site-wide configurations here as needed
}

export type SiteConfig = typeof siteConfig
