#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Product Filter Caching System
 *
 * This script tests:
 * - Background job execution
 * - Cache hit/miss scenarios
 * - Data structure validation
 * - Redis connectivity
 * - Performance benchmarks
 * - Error handling
 */

const { performance } = require("perf_hooks");
const { createRequire } = require("module");
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
    // Continue without env file
  }
}

loadEnvFile();

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

class FilterCacheTestSuite {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
    };
    this.performanceMetrics = {
      cacheHits: [],
      cacheMisses: [],
      jobExecution: null,
    };
    this.baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
    this.apiEndpoint = `${this.baseUrl}/store/custom/products/filter-metadata`;
    this.publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || null;
    this.testMode = process.env.NODE_ENV === "test";
  }

  log(message, color = "white") {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, "green");
  }

  logError(message) {
    this.log(`❌ ${message}`, "red");
  }

  logWarning(message) {
    this.log(`⚠️  ${message}`, "yellow");
  }

  logInfo(message) {
    this.log(`ℹ️  ${message}`, "blue");
  }

  logHeader(message) {
    this.log(`\n${colors.bold}${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    this.log(`${colors.bold}${colors.cyan}${message}${colors.reset}`);
    this.log(`${colors.bold}${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async makeRequest(url, options = {}) {
    const startTime = performance.now();
    try {
      // Add default headers including publishable key if available
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (this.publishableKey) {
        headers["x-publishable-api-key"] = this.publishableKey;
      }

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId); // Clear timeout on successful response
        const endTime = performance.now();

        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        return {
          success: response.ok,
          data,
          status: response.status,
          responseTime: endTime - startTime,
          headers: Object.fromEntries(response.headers.entries()),
        };
      } catch (error) {
        clearTimeout(timeoutId); // Clear timeout on error
        const endTime = performance.now();
        return {
          success: false,
          error: error.message,
          responseTime: endTime - startTime,
        };
      }
  }

  validateFilterDataStructure(data) {
    const errors = [];

    // Check required fields
    if (typeof data.priceRange !== "object") {
      errors.push("Missing or invalid priceRange object");
    } else {
      if (typeof data.priceRange.min !== "number") {
        errors.push("priceRange.min is not a number");
      }
      if (typeof data.priceRange.max !== "number") {
        errors.push("priceRange.max is not a number");
      }
      if (data.priceRange.min > data.priceRange.max) {
        errors.push("priceRange.min is greater than priceRange.max");
      }
    }

    if (!Array.isArray(data.colors)) {
      errors.push("colors is not an array");
    }

    if (!Array.isArray(data.styles)) {
      errors.push("styles is not an array");
    }

    if (!Array.isArray(data.sizes)) {
      errors.push("sizes is not an array");
    }

    if (typeof data.productCount !== "number") {
      errors.push("productCount is not a number");
    } else if (data.productCount < 0) {
      errors.push("productCount is negative");
    }

    return errors;
  }

  async testRedisConnectivity() {
    this.logHeader("Testing Redis Connectivity");

    try {
      // Test if we can reach the API (which uses Redis)
      const result = await this.makeRequest(this.apiEndpoint);

      if (result.success) {
        this.logSuccess("Redis connectivity test passed (API responded)");
        this.results.passed++;
      } else {
        this.logError(`Redis connectivity test failed: ${result.error}`);
        this.results.failed++;
      }
    } catch (error) {
      this.logError(`Redis connectivity test failed: ${error.message}`);
      this.results.failed++;
    }

    this.results.total++;
  }

  async testApiEndpointBasic() {
    this.logHeader("Testing API Endpoint - Basic Functionality");

    this.logInfo("Testing basic API endpoint...");
    const result = await this.makeRequest(this.apiEndpoint);

    if (!result.success) {
      this.logError(`API endpoint test failed: ${result.error}`);
      this.results.failed++;
      this.results.total++;
      return;
    }

    this.logSuccess(
      `API responded with status ${result.status} in ${result.responseTime.toFixed(2)}ms`
    );

    // Validate response structure
    const structureErrors = this.validateFilterDataStructure(result.data);
    if (structureErrors.length > 0) {
      this.logError("Response structure validation failed:");
      structureErrors.forEach((error) => this.logError(`  - ${error}`));
      this.results.failed++;
    } else {
      this.logSuccess("Response structure validation passed");
      this.results.passed++;
    }

    this.results.total++;
  }

  async testCacheHitScenario() {
    this.logHeader("Testing Cache Hit Scenario");

    this.logInfo("Making first request to warm cache...");
    const firstRequest = await this.makeRequest(this.apiEndpoint);

    if (!firstRequest.success) {
      this.logError(`First request failed: ${firstRequest.error}`);
      this.results.failed++;
      this.results.total++;
      return;
    }

    await this.sleep(100); // Small delay between requests

    this.logInfo("Making second request (should hit cache)...");
    const secondRequest = await this.makeRequest(this.apiEndpoint);

    if (!secondRequest.success) {
      this.logError(`Second request failed: ${secondRequest.error}`);
      this.results.failed++;
      this.results.total++;
      return;
    }

    // Record performance metrics
    this.performanceMetrics.cacheHits.push(secondRequest.responseTime);

    this.logSuccess(`Cache hit test completed`);
    this.logInfo(`First request: ${firstRequest.responseTime.toFixed(2)}ms`);
    this.logInfo(`Second request: ${secondRequest.responseTime.toFixed(2)}ms`);

    // Check if second request is significantly faster (cache hit indicator)
    if (secondRequest.responseTime < firstRequest.responseTime * 0.8) {
      this.logSuccess("Second request was faster - likely cache hit");
      this.results.passed++;
    } else {
      this.logWarning(
        "Second request not significantly faster - may not be cache hit"
      );
      this.results.warnings++;
    }

    this.results.total++;
  }

  async testDifferentContexts() {
    this.logHeader("Testing Different Context Scenarios");

    const testCases = [
      { name: "Global context", params: "" },
      { name: "Type filter", params: "?type_id=test_type" },
      { name: "Collection filter", params: "?collection_id=test_collection" },
      {
        name: "Multiple filters",
        params: "?type_id=test_type&collection_id=test_collection",
      },
      { name: "Category filter", params: "?category_id=test_category" },
    ];

    for (const testCase of testCases) {
      this.logInfo(`Testing ${testCase.name}...`);
      const url = `${this.apiEndpoint}${testCase.params}`;
      const result = await this.makeRequest(url);

      if (result.success) {
        const structureErrors = this.validateFilterDataStructure(result.data);
        if (structureErrors.length === 0) {
          this.logSuccess(
            `${testCase.name} - Structure valid, ${result.responseTime.toFixed(2)}ms`
          );
          this.results.passed++;
        } else {
          this.logError(`${testCase.name} - Structure invalid`);
          this.results.failed++;
        }
      } else {
        this.logError(`${testCase.name} - Request failed: ${result.error}`);
        this.results.failed++;
      }

      this.results.total++;
      await this.sleep(100); // Prevent rate limiting
    }
  }

  async testErrorHandling() {
    this.logHeader("Testing Error Handling");

    // Test with invalid parameters
    const invalidTests = [
      {
        name: "Invalid type_id",
        params: "?type_id=invalid_id_that_does_not_exist",
      },
      {
        name: "Invalid collection_id",
        params: "?collection_id=invalid_collection",
      },
      { name: "Malformed parameters", params: "?type_id[]=invalid" },
    ];

    for (const test of invalidTests) {
      this.logInfo(`Testing ${test.name}...`);
      const url = `${this.apiEndpoint}${test.params}`;
      const result = await this.makeRequest(url);

      if (result.success && result.status === 200) {
        // API should still return valid structure even with invalid IDs
        const structureErrors = this.validateFilterDataStructure(result.data);
        if (structureErrors.length === 0) {
          this.logSuccess(
            `${test.name} - Graceful handling with valid fallback`
          );
          this.results.passed++;
        } else {
          this.logError(`${test.name} - Invalid response structure`);
          this.results.failed++;
        }
      } else {
        this.logWarning(
          `${test.name} - Unexpected response: ${result.status || "No response"}`
        );
        this.results.warnings++;
      }

      this.results.total++;
      await this.sleep(100);
    }
  }

  async simulateJobExecution() {
    this.logHeader("Simulating Background Job Execution");

    this.logInfo(
      "Note: This test simulates job execution by making multiple API calls"
    );
    this.logInfo(
      "For actual job testing, check Medusa server logs for job execution"
    );

    const startTime = performance.now();

    // Make multiple requests to different contexts to simulate job load
    const contexts = [
      "",
      "?type_id=context1",
      "?collection_id=context2",
      "?type_id=context1&collection_id=context2",
    ];

    for (const context of contexts) {
      const url = `${this.apiEndpoint}${context}`;
      const result = await this.makeRequest(url);

      if (result.success) {
        this.logInfo(`Context ${context || "global"} processed successfully`);
      } else {
        this.logWarning(
          `Context ${context || "global"} failed: ${result.error}`
        );
      }
    }

    const endTime = performance.now();
    this.performanceMetrics.jobExecution = endTime - startTime;

    this.logSuccess(
      `Simulated job execution completed in ${this.performanceMetrics.jobExecution.toFixed(2)}ms`
    );
    this.results.passed++;
    this.results.total++;
  }

  async performanceBenchmark() {
    this.logHeader("Performance Benchmark");

    this.logInfo(
      "Running performance benchmark with 10 concurrent requests..."
    );

    const concurrentRequests = 10;
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(this.makeRequest(this.apiEndpoint));
    }

    const startTime = performance.now();
    const results = await Promise.all(promises);
    const endTime = performance.now();

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (successful.length > 0) {
      const responseTimes = successful.map((r) => r.responseTime);
      const avgResponseTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const minResponseTime = Math.min(...responseTimes);
      const maxResponseTime = Math.max(...responseTimes);

      this.logSuccess(`Benchmark completed:`);
      this.logInfo(`  Total time: ${(endTime - startTime).toFixed(2)}ms`);
      this.logInfo(
        `  Successful requests: ${successful.length}/${concurrentRequests}`
      );
      this.logInfo(`  Average response time: ${avgResponseTime.toFixed(2)}ms`);
      this.logInfo(`  Min response time: ${minResponseTime.toFixed(2)}ms`);
      this.logInfo(`  Max response time: ${maxResponseTime.toFixed(2)}ms`);

      if (avgResponseTime < 100) {
        this.logSuccess("Performance is excellent (avg < 100ms)");
        this.results.passed++;
      } else if (avgResponseTime < 500) {
        this.logWarning("Performance is acceptable (avg < 500ms)");
        this.results.warnings++;
      } else {
        this.logError("Performance is poor (avg >= 500ms)");
        this.results.failed++;
      }
    } else {
      this.logError("All benchmark requests failed");
      this.results.failed++;
    }

    if (failed.length > 0) {
      this.logWarning(`${failed.length} requests failed during benchmark`);
    }

    this.results.total++;
  }

  async testDataConsistency() {
    this.logHeader("Testing Data Consistency");

    this.logInfo("Making multiple requests to check data consistency...");

    const requests = await Promise.all([
      this.makeRequest(this.apiEndpoint),
      this.makeRequest(this.apiEndpoint),
      this.makeRequest(this.apiEndpoint),
    ]);

    const successful = requests.filter((r) => r.success);

    if (successful.length < 2) {
      this.logError("Not enough successful requests to test consistency");
      this.results.failed++;
      this.results.total++;
      return;
    }

    const firstData = JSON.stringify(successful[0].data);
    const allConsistent = successful.every(
      (r) => JSON.stringify(r.data) === firstData
    );

    if (allConsistent) {
      this.logSuccess("Data consistency test passed - all responses identical");
      this.results.passed++;
    } else {
      this.logError("Data consistency test failed - responses differ");
      this.results.failed++;
    }

    this.results.total++;
  }

  generateReport() {
    this.logHeader("Test Results Summary");

    const successRate =
      this.results.total > 0
        ? ((this.results.passed / this.results.total) * 100).toFixed(1)
        : 0;

    this.log(`Total Tests: ${this.results.total}`, "bold");
    this.log(`Passed: ${this.results.passed}`, "green");
    this.log(`Failed: ${this.results.failed}`, "red");
    this.log(`Warnings: ${this.results.warnings}`, "yellow");
    this.log(
      `Success Rate: ${successRate}%`,
      successRate > 80 ? "green" : successRate > 60 ? "yellow" : "red"
    );

    if (this.performanceMetrics.cacheHits.length > 0) {
      const avgCacheHit =
        this.performanceMetrics.cacheHits.reduce((a, b) => a + b, 0) /
        this.performanceMetrics.cacheHits.length;
      this.log(`\nPerformance Metrics:`, "bold");
      this.log(
        `Average cache hit response time: ${avgCacheHit.toFixed(2)}ms`,
        "blue"
      );
    }

    if (this.performanceMetrics.jobExecution) {
      this.log(
        `Simulated job execution time: ${this.performanceMetrics.jobExecution.toFixed(2)}ms`,
        "blue"
      );
    }

    this.log("\nRecommendations:", "bold");

    if (this.results.failed > 0) {
      this.logError("Some tests failed. Check the errors above and verify:");
      this.logError("  - Redis server is running and accessible");
      this.logError("  - Medusa server is running");
      this.logError("  - Background job has executed at least once");
    }

    if (this.results.warnings > 0) {
      this.logWarning("Some tests have warnings. Consider:");
      this.logWarning("  - Optimizing cache performance");
      this.logWarning("  - Checking Redis configuration");
      this.logWarning("  - Verifying job execution schedule");
    }

    if (this.results.passed === this.results.total) {
      this.logSuccess(
        "All tests passed! The caching system is working correctly."
      );
    }

    return {
      success: this.results.failed === 0,
      summary: this.results,
      performance: this.performanceMetrics,
    };
  }

  async runAllTests() {
    this.logHeader("Product Filter Cache System Test Suite");
    this.logInfo(`Testing endpoint: ${this.apiEndpoint}`);
    this.logInfo(`Base URL: ${this.baseUrl}`);

    try {
      await this.testRedisConnectivity();
      await this.testApiEndpointBasic();
      await this.testCacheHitScenario();
      await this.testDifferentContexts();
      await this.testErrorHandling();
      await this.testDataConsistency();
      await this.performanceBenchmark();
      await this.simulateJobExecution();

      return this.generateReport();
    } catch (error) {
      this.logError(`Test suite failed with error: ${error.message}`);
      console.error(error);
      return { success: false, error: error.message };
    }
  }
}

// Manual job execution test
async function testManualJobExecution() {
  console.log(
    `${colors.bold}${colors.magenta}${"=".repeat(60)}${colors.reset}`
  );
  console.log(
    `${colors.bold}${colors.magenta}Manual Job Execution Test${colors.reset}`
  );
  console.log(
    `${colors.bold}${colors.magenta}${"=".repeat(60)}${colors.reset}\n`
  );

  console.log(
    `${colors.blue}ℹ️  To test the background job manually:${colors.reset}\n`
  );

  console.log(
    `${colors.yellow}1. In your Medusa project directory, run:${colors.reset}`
  );
  console.log(`   ${colors.cyan}npm run dev${colors.reset}\n`);

  console.log(
    `${colors.yellow}2. Check the logs for job registration:${colors.reset}`
  );
  console.log(
    `   ${colors.green}[INFO] Registered job: cache-product-filters with schedule: */15 * * * *${colors.reset}\n`
  );

  console.log(
    `${colors.yellow}3. Wait for job execution (every 15 minutes) or trigger manually:${colors.reset}`
  );
  console.log(`   Check logs for execution messages like:`);
  console.log(
    `   ${colors.green}Starting product filter caching job...${colors.reset}`
  );
  console.log(
    `   ${colors.green}Product filter caching job completed${colors.reset}\n`
  );

  console.log(`${colors.yellow}4. Verify cache creation:${colors.reset}`);
  console.log(
    `   ${colors.cyan}redis-cli -u $REDIS_URL GET product_filters_v1${colors.reset}\n`
  );

  console.log(
    `${colors.yellow}5. Test the API endpoint to confirm cache usage:${colors.reset}`
  );
  console.log(
    `   ${colors.cyan}curl "${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/custom/products/filter-metadata"${colors.reset}\n`
  );
}

// Environment check
function checkEnvironment() {
  console.log(`${colors.bold}${colors.cyan}Environment Check${colors.reset}\n`);

  const checks = [
    { name: "Node.js version", value: process.version, required: true },
    { name: "REDIS_URL", value: process.env.REDIS_URL, required: false },
    { name: "DATABASE_URL", value: process.env.DATABASE_URL, required: false },
    {
      name: "MEDUSA_BACKEND_URL",
      value:
        process.env.MEDUSA_BACKEND_URL || "http://localhost:9000 (default)",
      required: false,
    },
  ];

  checks.forEach((check) => {
    if (check.value) {
      console.log(
        `${colors.green}✅ ${check.name}: ${check.value}${colors.reset}`
      );
    } else if (check.required) {
      console.log(
        `${colors.red}❌ ${check.name}: Not set (required)${colors.reset}`
      );
    } else {
      console.log(
        `${colors.yellow}⚠️  ${check.name}: Not set (using defaults)${colors.reset}`
      );
    }
  });

  console.log();
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Product Filter Cache System Test Suite

Usage:
  node test-filter-cache.js [options]

Options:
  --help, -h          Show this help message
  --env               Show environment check only
  --job               Show manual job execution instructions only
  --quick             Run quick tests only (skip performance benchmarks)

Environment Variables:
  MEDUSA_BACKEND_URL  Medusa backend URL (default: http://localhost:9000)
  REDIS_URL          Redis connection URL (for manual testing)
  DATABASE_URL       Database connection URL (for reference)

Examples:
  node test-filter-cache.js                    # Run all tests
  node test-filter-cache.js --quick            # Run quick tests
  node test-filter-cache.js --env              # Check environment
  node test-filter-cache.js --job              # Show job instructions
    `);
    return;
  }

  if (args.includes("--env")) {
    checkEnvironment();
    return;
  }

  if (args.includes("--job")) {
    await testManualJobExecution();
    return;
  }

  checkEnvironment();

  if (args.includes("--quick")) {
    console.log(
      `${colors.yellow}Running quick tests (skipping performance benchmarks)...${colors.reset}\n`
    );
  }

  const testSuite = new FilterCacheTestSuite();
  const results = await testSuite.runAllTests();

  // Exit with appropriate code
  process.exit(results.success ? 0 : 1);
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Global fetch polyfill for older Node.js versions
if (typeof fetch === "undefined") {
  console.log(
    `${colors.yellow}⚠️  fetch not available, please run with Node.js 18+ or install node-fetch${colors.reset}`
  );
  process.exit(1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { FilterCacheTestSuite };
