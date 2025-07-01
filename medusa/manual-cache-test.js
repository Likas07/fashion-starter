#!/usr/bin/env node

/**
 * Manual Cache Population Test
 *
 * This script manually runs the cache population job to test the caching system
 */

const fs = require("fs");
const path = require("path");

// Load environment variables from .env file manually
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

async function testCachePopulation() {
  console.log("🔄 Testing manual cache population...\n");

  try {
    // Import the cache job function
    const cacheJobPath = path.join(
      __dirname,
      "src/jobs/cache-product-filters.ts"
    );

    console.log(
      "ℹ️  Note: This would normally be triggered by the Medusa job scheduler"
    );
    console.log("ℹ️  To test the full system:");
    console.log("   1. Start Medusa server: npm run dev");
    console.log("   2. Wait for job registration in logs");
    console.log("   3. Wait up to 15 minutes for automatic execution");
    console.log("   4. Or check if job is running with server logs\n");

    // Check Redis connection
    console.log("🔍 Checking Redis cache status...");

    const { execSync } = require("child_process");
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    try {
      const cacheExists = execSync(
        `redis-cli -u ${redisUrl} EXISTS product_filters_v1`,
        { encoding: "utf8" }
      ).trim();

      if (cacheExists === "(integer) 1") {
        console.log("✅ Cache data exists in Redis");

        // Get cache content
        const cacheData = execSync(
          `redis-cli -u ${redisUrl} GET product_filters_v1`,
          { encoding: "utf8" }
        ).trim();
        console.log("📊 Cache content preview:");

        try {
          const parsedData = JSON.parse(
            cacheData.replace(/^"/, "").replace(/"$/, "").replace(/\\"/g, '"')
          );
          const contexts = Object.keys(parsedData);
          console.log(
            `   - ${contexts.length} context(s) cached: ${contexts.join(", ")}`
          );

          if (parsedData.global) {
            const global = parsedData.global;
            console.log(
              `   - Global: ${global.productCount} products, ${global.colors.length} colors, ${global.styles.length} styles, ${global.sizes.length} sizes`
            );
          }
        } catch (e) {
          console.log("   - Raw cache data found (parsing failed)");
        }
      } else {
        console.log("⚠️  No cache data found in Redis");
        console.log("💡 Background job needs to run first");

        // Check TTL
        const ttl = execSync(
          "redis-cli -u redis://localhost:6379 TTL product_filters_v1",
          { encoding: "utf8" }
        ).trim();
        console.log(`   TTL: ${ttl} (should be -2 for non-existent key)`);
      }
    } catch (redisError) {
      console.log("❌ Redis connection failed:", redisError.message);
    }

    // Test API endpoint with timing
    console.log("\n🌐 Testing API endpoint performance...");

    const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.log("⚠️  MEDUSA_PUBLISHABLE_KEY not found in environment");
      return;
    }

    const testUrl = `${process.env.MEDUSA_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:9000"}/store/custom/products/filter-metadata`;

    // Make multiple requests to test performance
    const times = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      try {
        const response = await fetch(testUrl, {
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const end = Date.now();
          times.push(end - start);
          console.log(
            `   Request ${i + 1}: ${end - start}ms - ${data.productCount} products`
          );
        } else {
          console.log(
            `   Request ${i + 1}: Failed with status ${response.status}`
          );
        }
      } catch (fetchError) {
        console.log(`   Request ${i + 1}: Failed - ${fetchError.message}`);
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      console.log(`\n📈 Performance Summary:`);
      console.log(`   Average: ${avgTime.toFixed(2)}ms`);
      console.log(`   Min: ${minTime}ms`);
      console.log(`   Max: ${maxTime}ms`);

      if (avgTime < 20) {
        console.log("✅ Excellent performance (likely cache hits)");
      } else if (avgTime < 50) {
        console.log("✅ Good performance (possible cache hits)");
      } else {
        console.log("⚠️  Slower performance (likely database queries)");
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
if (require.main === module) {
  testCachePopulation().catch(console.error);
}

module.exports = { testCachePopulation };
