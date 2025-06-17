# Cache Fix Instructions

## Issue Identified

The Medusa cache service was not properly configured to use Redis. The cache module was missing from the configuration, causing the system to fall back to database queries instead of using Redis caching.

## Fix Applied

Added Redis cache module configuration to `medusa-config.js`:

```javascript
{
  resolve: "@medusajs/medusa/cache-redis",
  options: {
    redisUrl: process.env.REDIS_URL,
  },
},
```

## Required Actions

### 1. Restart Medusa Server

The Medusa server needs to be restarted to apply the new cache configuration:

```bash
# Stop the current server (Ctrl+C in the terminal running Medusa)
# Then restart:
npm run dev
```

### 2. Verify Cache Configuration

After restart, check the logs for cache module initialization. You should see something like:

```
[INFO] Cache module initialized with Redis
```

### 3. Test Cache Functionality

Run the test script to verify caching is working:

```bash
node test-cache-service.js
```

Expected results after fix:

- ✅ Direct Redis connection: OK
- ✅ Direct Redis write/read: OK
- ✅ API call successful
- ✅ Cache was populated by fallback mechanism ← This should now work

### 4. Run Full Test Suite

After verifying the cache is working:

```bash
node test-filter-cache.js
```

Expected improvements:

- Success rate should remain 92.9% or higher
- Cache hit warnings should be resolved
- Second requests should be significantly faster (< 5ms)

### 5. Verify Background Job

Check if the background job is now registering and running:

```bash
# Check Medusa logs for:
[INFO] Registered job: cache-product-filters with schedule: */15 * * * *

# After 15 minutes, check for job execution:
Starting product filter caching job...
Product filter caching job completed
```

### 6. Verify Redis Cache Population

Check if the cache key exists in Redis:

```bash
redis-cli -u redis://localhost:6379 EXISTS product_filters_v1
# Should return: (integer) 1

redis-cli -u redis://localhost:6379 GET product_filters_v1
# Should return: JSON data with filter information
```

## What This Fixes

1. **Cache Service Integration**: Medusa now properly uses Redis for caching
2. **Background Job Caching**: The scheduled job will now populate Redis cache
3. **API Fallback Caching**: API requests will now cache results in Redis
4. **Performance Improvements**: Cache hits will be significantly faster (1-5ms)
5. **Test Warnings**: The "may not be cache hit" warning will be resolved

## Troubleshooting

If issues persist after restart:

1. **Check Redis Connection**: Ensure Redis is running on the configured URL
2. **Check Dependencies**: Verify `@medusajs/medusa/cache-redis` is available
3. **Check Logs**: Look for cache-related errors in Medusa startup logs
4. **Verify Environment**: Ensure `REDIS_URL` is correctly set

## Performance Expectations

After the fix:

- **First API call**: 50-100ms (database query + cache population)
- **Subsequent calls**: 1-10ms (cache hits)
- **Background job**: Runs every 15 minutes, pre-populates cache
- **Cache TTL**: 1 hour (3600 seconds)

The system is now properly configured for production-grade caching performance.
