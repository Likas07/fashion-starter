# Product Filter Caching Implementation

## Overview

This implementation provides a Redis-based caching solution for product filter metadata to improve API response times and reduce database load.

## Components

### 1. Background Job (`src/jobs/cache-product-filters.ts`)

- **Schedule**: Runs every 15 minutes (`*/15 * * * *`)
- **Purpose**: Precomputes and caches filter metadata for all product contexts
- **Key Changes**:
  - ✅ Removed `inventory_quantity > 0` requirement
  - ✅ Queries all products with `status: "published"`
  - ✅ Simplified color handling (string array only, no hex codes)
  - ✅ Added size extraction alongside colors and styles
  - ✅ Maintains context-based grouping (type, collection, category)

### 2. API Endpoint (`src/api/store/custom/products/filter-metadata/route.ts`)

- **Path**: `/store/custom/products/filter-metadata`
- **Caching Strategy**:
  1. **Cache Hit**: Return cached data directly (fast response)
  2. **Cache Miss**: Fall back to database query and cache result
- **Key Changes**:
  - ✅ Added Redis cache integration via Medusa's cache service
  - ✅ Context-aware cache lookup
  - ✅ Simplified color handling (no hex code mapping)
  - ✅ Removed stock requirements from fallback queries
  - ✅ Added comprehensive error handling

## Data Structure

### Updated Filter Response

```typescript
interface FilterOptions {
  priceRange: { min: number; max: number };
  colors: string[]; // Simplified: just color names
  styles: string[]; // Style/material names
  sizes: string[]; // Added: size options
  productCount: number;
}
```

### Cache Structure

```typescript
interface ProductFilterData {
  [contextKey: string]: FilterOptions;
}
```

## Context-Based Caching

The system generates context keys based on request parameters:

- `type:1` - Single product type
- `type:1,2|collection:3` - Multiple filters
- `global` - No specific filters

## Performance Benefits

1. **Faster API Responses**: Cache hits return immediately
2. **Reduced Database Load**: Precomputed data reduces query frequency
3. **Context Awareness**: Specific filters have dedicated cache entries
4. **Resilient Fallback**: Database queries as safety mechanism

## Implementation Details

### Background Job Features

- Removes all stock-based filtering
- Processes all published products regardless of inventory
- Groups products by context (type, collection, category combinations)
- Stores aggregated filter data in Redis with key `product_filters_v1`
- Runs automatically every 15 minutes

### API Endpoint Features

- First attempts Redis cache retrieval
- Falls back to database query if cache miss
- Caches fallback results for future requests
- Maintains backward compatibility with existing API structure
- Includes comprehensive logging for debugging

### Error Handling

- Cache service failures don't break the API
- Database query failures return safe fallback response
- All errors are logged with context

## Usage

The system works transparently with existing frontend code. No changes required to API consumers - responses maintain the same structure with simplified data.

## Cache TTL

- **Job Cache**: 1 hour (3600 seconds)
- **Fallback Cache**: 1 hour (3600 seconds)
- **Refresh Frequency**: Every 15 minutes via background job

## Benefits Summary

- 🚀 **Performance**: Significantly faster filter metadata responses
- 📉 **Database Load**: Reduced query frequency and complexity
- 🎯 **Scalability**: Context-based caching scales with product catalog
- 🛡️ **Reliability**: Robust fallback mechanisms ensure uptime
- 🔧 **Maintainability**: Simplified color handling reduces complexity
