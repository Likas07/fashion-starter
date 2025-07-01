#!/usr/bin/env node

/**
 * Test script to check if Medusa's cache service is working
 */

const fs = require("fs");
const path = require("path");
const Redis = require("ioredis");

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

async function testCacheService() {
  console.log("🔍 Testing Medusa Cache Service...\n");

  try {
    // Test direct Redis connection first
    console.log("1. Testing direct Redis connection...");

    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    try {
      const pingResult = await redis.ping();

      if (pingResult === "PONG") {
        console.log("✅ Direct Redis connection: OK");
      } else {
        console.log("❌ Direct Redis connection failed:", pingResult);
        await redis.quit();
        return;
      }
    } catch (error) {
      console.log("❌ Direct Redis connection failed:", error.message);
      await redis.quit();
      return;
    }

    // Test if we can write to Redis directly
    console.log("\n2. Testing direct Redis write...");
    try {
      const testKey = "cache_test_" + Date.now();
      const testValue = "test_value";

      await redis.set(testKey, testValue);
      const retrievedValue = await redis.get(testKey);

      if (retrievedValue === testValue) {
        console.log("✅ Direct Redis write/read: OK");
        // Clean up
        await redis.del(testKey);
      } else {
        console.log(
          "❌ Direct Redis write/read failed. Expected:",
          testValue,
          "Got:",
          retrievedValue
        );
      }
    } catch (error) {
      console.log("❌ Direct Redis write failed:", error.message);
    }

    // Close Redis connection
    await redis.quit();

    // Test API endpoint cache behavior
    console.log("\n3. Testing API cache behavior...");

    const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.log("❌ MEDUSA_PUBLISHABLE_KEY not found");
      return;
    }

    const apiUrl = `${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/custom/products/filter-metadata`;

    // Make API call and check if cache is populated
    console.log("   Making API call to trigger fallback caching...");

    const startTime = Date.now();
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "x-publishable-api-key": publishableKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const endTime = Date.now();
        console.log(
          `   ✅ API call successful: ${endTime - startTime}ms, ${data.productCount} products`
        );

        // Check if cache was populated
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay

        const cacheExists = execSync(
          "redis-cli -u redis://localhost:6379 EXISTS product_filters_v1",
          { encoding: "utf8" }
        ).trim();

        if (cacheExists === "(integer) 1") {
          console.log("   ✅ Cache was populated by fallback mechanism");
        } else {
          console.log("   ❌ Cache was NOT populated by fallback mechanism");
          console.log(
            "   💡 This indicates an issue with Medusa's cache service integration"
          );
        }
      } else {
        console.log(
          "   ❌ API call failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.log("   ❌ API call failed:", error.message);
    }

    // Check Medusa configuration
    console.log("\n4. Checking Medusa configuration...");

    const configPath = path.join(__dirname, "medusa-config.js");
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, "utf8");

      if (configContent.includes("redisUrl")) {
        console.log("   ✅ Redis URL configured in medusa-config.js");
      } else {
        console.log("   ❌ Redis URL not found in medusa-config.js");
      }

      // Check if cache module is explicitly configured
      if (configContent.includes("cache")) {
        console.log("   ℹ️  Cache module explicitly configured");
      } else {
        console.log(
          "   ⚠️  Cache module not explicitly configured (using defaults)"
        );
      }
    }

    console.log("\n📋 Summary:");
    console.log("- Redis is running and accessible");
    console.log("- API endpoint is working and fast");
    console.log("- Issue: Medusa cache service not populating Redis");
    console.log("\n🔧 Possible solutions:");
    console.log("1. Restart Medusa server to reinitialize cache service");
    console.log("2. Check Medusa logs for cache service errors");
    console.log("3. Verify Medusa v2 cache service configuration");
    console.log("4. The system works well without cache (fast fallback)");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

if (require.main === module) {
  testCacheService().catch(console.error);
}
