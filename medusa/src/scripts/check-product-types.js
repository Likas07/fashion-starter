export default async function checkProductTypes({ container }) {
  const query = container.resolve("query");

  console.log("=== CHECKING PRODUCT TYPES ===");

  // Get all product types
  const { data: productTypes } = await query.graph({
    entity: "product_types",
    fields: ["id", "value"],
  });

  console.log("Product Types found:", productTypes?.length || 0);
  productTypes?.forEach((pt) => {
    console.log(`- ID: ${pt.id}, Value: ${pt.value}`);
  });

  console.log("\n=== CHECKING PRODUCTS AND THEIR TYPE IDS ===");

  // Get all products with their type_id
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "type_id"],
  });

  console.log("Products found:", products?.length || 0);
  products?.forEach((product) => {
    console.log(`- ${product.title}: type_id = ${product.type_id || "NULL"}`);
  });

  console.log("\n=== CHECKING PRODUCTS WITH SPECIFIC TYPE ===");

  // Try filtering by a specific type_id
  if (productTypes?.length > 0) {
    const firstTypeId = productTypes[0].id;
    console.log(`Filtering by type_id: ${firstTypeId}`);

    const { data: filteredProducts } = await query.graph({
      entity: "product",
      filters: { type_id: firstTypeId },
      fields: ["id", "title", "type_id"],
    });

    console.log("Filtered products:", filteredProducts?.length || 0);
    filteredProducts?.forEach((product) => {
      console.log(`- ${product.title}: type_id = ${product.type_id}`);
    });
  }
}
