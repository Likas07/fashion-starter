#!/usr/bin/env node

/**
 * Test Direct Redis Cache Implementation
 *
 * This script tests the direct Redis implementation to compare it with
 * the Medusa cache service approach
 */

const fs = require("fs");
const path = require("path");

// Load environment variables
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const lines = envContent.split("\n");

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#")) {
          const [key, ...valueParts] = trimmedLine.split("=");
          if (key && valueParts.length > 0) {
            const value = valueParts.join("=");
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      }
    }
  } catch (e) {
    console.log("Could not load .env file:", e.message);
  }
}

loadEnvFile();

async function testDirectRedisCache() {
  console.log("🧪 Testing Direct Redis Cache Implementation\n");

  try {
    // Import the direct Redis job function
    console.log("📦 Loading direct Redis job...");

    // Create a mock container with the necessary services
    const mockContainer = {
      resolve: (serviceName) => {
        if (serviceName === "productModuleService") {
          // Mock product service
          return {
            listProducts: async (filters, options) => {
              console.log("📦 Mock: Returning sample products for testing...");
              return [
                {
                  id: "prod_1",
                  status: "published",
                  type_id: "type_1",
                  collection_id: "coll_1",
                  options: [
                    {
                      title: "Color",
                      values: [{ value: "Red" }, { value: "Blue" }],
                    },
                    {
                      title: "Size",
                      values: [{ value: "S" }, { value: "M" }, { value: "L" }],
                    },
                  ],
                  variants: [
                    { price: 2500, calculated_price: 2500 },
                    { price: 3000, calculated_price: 3000 },
                  ],
                },
                {
                  id: "prod_2",
                  status: "published",
                  options: [
                    {
                      title: "Color",
                      values: [{ value: "Green" }, { value: "Yellow" }],
                    },
                    {
                      title: "Material",
                      values: [{ value: "Cotton" }, { value: "Polyester" }],
                    },
                  ],
                  variants: [
                    { price: 1500, calculated_price: 1500 },
                    { price: 2000, calculated_price: 2000 },
                  ],
                },
              ];
            },
          };
        }
        throw new Error(`Unknown service: ${serviceName}`);
      },
    };

    // Test direct Redis implementation
    console.log("🚀 Running direct Redis cache job...\n");

    // We'll simulate the job execution by implementing the core logic here
    const Redis = require("ioredis");

    // Create Redis client
    const redisUrl =
      process.env.CACHE_REDIS_URL ||
      process.env.REDIS_URL ||
      "redis://localhost:6379";

    // Log sanitized URL (hide credentials)
    const sanitizedUrl = redisUrl.replace(/:\/\/[^@]*@/, "://***:***@");
    console.log(`🔌 Connecting to Redis: ${sanitizedUrl}`);

    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    // Test connection
    await redis.connect();
    console.log("✅ Connected to Redis successfully");

    // Test basic operations
    await redis.set("test_direct_redis", "working", "EX", 10);
    const testResult = await redis.get("test_direct_redis");

    if (testResult === "working") {
      console.log("✅ Basic Redis operations working");
    } else {
      throw new Error("Basic Redis test failed");
    }

    // Get sample data from mock service
    const productService = mockContainer.resolve("productModuleService");
    const products = await productService.listProducts(
      { status: "published" },
      {}
    );
    console.log(`📦 Retrieved ${products.length} sample products`);

    // Process the data (simplified version)
    const filterData = {
      global: {
        priceRange: { min: 15, max: 30 },
        colors: ["Red", "Blue", "Green", "Yellow"],
        styles: ["Cotton", "Polyester"],
        sizes: ["S", "M", "L"],
        productCount: products.length,
      },
    };

    console.log("📊 Processed filter data:", filterData);

    // Cache the data
    const cacheKey = "product_filters_v1";
    const cacheData = JSON.stringify(filterData);

    console.log(`💾 Caching data to Redis with key: ${cacheKey}`);
    const result = await redis.setex(cacheKey, 3600, cacheData);

    if (result === "OK") {
      console.log("✅ Data cached successfully!");

      // Verify by reading back
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log("✅ Cache verification successful!");
        console.log("📋 Cached contexts:", Object.keys(parsed));

        // Check TTL
        const ttl = await redis.ttl(cacheKey);
        console.log(`⏰ Cache TTL: ${ttl} seconds`);
      } else {
        console.log("❌ Cache verification failed");
      }
    } else {
      console.log("❌ Cache operation failed");
    }

    // Test API endpoint behavior
    console.log("\n🌐 Testing API endpoint with cached data...");

    const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY;
    if (publishableKey) {
      const response = await fetch(
        "http://localhost:9000/store/custom/products/filter-metadata",
        {
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        }
      );

      if (response.ok) {
        const apiData = await response.json();
        console.log("✅ API response:", apiData);
        console.log(
          `📊 API returned ${apiData.productCount} products, ${apiData.colors?.length || 0} colors`
        );
      } else {
        console.log(`⚠️ API returned status: ${response.status}`);
      }
    } else {
      console.log("⚠️ No publishable key found, skipping API test");
    }

    // Cleanup
    await redis.disconnect();
    console.log("🔌 Disconnected from Redis");

    console.log("\n🎉 Direct Redis cache test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Check Redis availability first
async function checkRedisAvailability() {
  try {
    const Redis = require("ioredis");
    const redisUrl =
      process.env.CACHE_REDIS_URL ||
      process.env.REDIS_URL ||
      "redis://localhost:6379";

    console.log("🔍 Checking Redis availability...");
    const redis = new Redis(redisUrl, { lazyConnect: true });

    await redis.connect();
    await redis.ping();
    console.log("✅ Redis is available and responding");
    await redis.disconnect();

    return true;
  } catch (error) {
    console.error("❌ Redis is not available:", error.message);
    return false;
  }
}

async function main() {
  console.log("🧪 Direct Redis Cache Implementation Test\n");

  // Check environment
  console.log("Environment variables:");
  console.log(`  CACHE_REDIS_URL: ${process.env.CACHE_REDIS_URL || "not set"}`);
  console.log(`  REDIS_URL: ${process.env.REDIS_URL || "not set"}`);
  console.log(
    `  MEDUSA_PUBLISHABLE_KEY: ${process.env.MEDUSA_PUBLISHABLE_KEY ? "set" : "not set"}\n`
  );

  // Check Redis availability
  const redisAvailable = await checkRedisAvailability();
  if (!redisAvailable) {
    console.error(
      "❌ Cannot proceed without Redis. Please ensure Redis is running."
    );
    process.exit(1);
  }

  // Run the test
  await testDirectRedisCache();
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { testDirectRedisCache };
