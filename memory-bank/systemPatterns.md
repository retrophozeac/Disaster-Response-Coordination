# System Patterns Documentation
## Disaster Response Coordination Platform

### Project Overview
This document outlines the architectural patterns and technical decisions for a backend-heavy MERN stack disaster response coordination platform. The system aggregates real-time data from multiple sources to aid disaster management through AI-powered location extraction, geospatial queries, and real-time communication.

## Core Architectural Patterns

### 1. Microservices-Oriented Monolith Pattern
**Decision**: Implement a modular monolith with clear service boundaries that can be extracted later.

```
src/
├── services/
│   ├── disaster/          # Disaster CRUD operations
│   ├── geocoding/         # Location extraction & geocoding
│   ├── social-media/      # Mock Twitter API integration
│   ├── verification/      # Image verification via Gemini
│   ├── resources/         # Geospatial resource queries
│   └── updates/           # Official updates scraping
├── middleware/
├── utils/
└── websockets/
```

**Rationale**: Given the 8-10 hour constraint, a monolith allows rapid development while maintaining clear separation of concerns for future extraction.

### 2. Event-Driven Real-Time Architecture
**Pattern**: WebSocket-based event broadcasting with Socket.IO

```javascript
// Event emission strategy
const events = {
  DISASTER_UPDATED: 'disaster_updated',
  SOCIAL_MEDIA_UPDATED: 'social_media_updated',
  RESOURCES_UPDATED: 'resources_updated'
};

// Centralized event emitter
class EventBroadcaster {
  static emit(event, data, disasterId = null) {
    if (disasterId) {
      io.to(`disaster_${disasterId}`).emit(event, data);
    } else {
      io.emit(event, data);
    }
  }
}
```

**Implementation**: Room-based broadcasting for disaster-specific updates with global fallback.

### 3. Cache-First External API Pattern
**Decision**: Supabase-based caching with TTL for all external API calls

```javascript
// Cache strategy implementation
class CacheService {
  static async getOrFetch(key, fetchFunction, ttl = 3600) {
    const cached = await supabase
      .from('cache')
      .select('value, expires_at')
      .eq('key', key)
      .single();
    
    if (cached.data && new Date(cached.data.expires_at) > new Date()) {
      return cached.data.value;
    }
    
    const freshData = await fetchFunction();
    await this.set(key, freshData, ttl);
    return freshData;
  }
}
```

**Services Cached**:
- Gemini API responses (location extraction, image verification)
- Geocoding API responses
- Mock social media data
- Official updates from web scraping

### 4. Geospatial Query Optimization Pattern
**Decision**: PostGIS with strategic indexing for sub-second proximity queries

```sql
-- Geospatial indexes for performance
CREATE INDEX disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX resources_location_idx ON resources USING GIST (location);

-- Optimized proximity query pattern
SELECT r.*, 
       ST_Distance(r.location, ST_SetSRID(ST_Point($1, $2), 4326)) as distance
FROM resources r 
WHERE ST_DWithin(r.location, ST_SetSRID(ST_Point($1, $2), 4326), 10000)
ORDER BY distance
LIMIT 50;
```

**Performance Target**: Sub-second response for geospatial queries within 10km radius.

## Service Integration Patterns

### 1. AI Service Orchestration Pattern
**Implementation**: Gemini API integration with structured prompting

```javascript
class GeminiService {
  static async extractLocation(description) {
    const prompt = `Extract the specific location name from this disaster description. 
    Return only the location name (city, state/country format) or "NONE" if no location found:
    
    "${description}"`;
    
    return await CacheService.getOrFetch(
      `location_${hash(description)}`,
      () => this.callGemini(prompt)
    );
  }
  
  static async verifyImage(imageUrl) {
    const prompt = `Analyze this image for disaster authenticity. 
    Check for signs of manipulation, context consistency, and disaster indicators.
    Return JSON: {"authentic": boolean, "confidence": number, "reasoning": string}`;
    
    return await CacheService.getOrFetch(
      `verify_${hash(imageUrl)}`,
      () => this.callGeminiVision(prompt, imageUrl)
    );
  }
}
```

### 2. Geocoding Pipeline Pattern
**Decision**: Two-stage location processing (AI extraction → coordinate conversion)

```javascript
class GeocodingPipeline {
  static async processLocation(input) {
    // Stage 1: Extract location name using Gemini
    const locationName = await GeminiService.extractLocation(input);
    
    if (locationName === 'NONE') {
      throw new Error('No location found in input');
    }
    
    // Stage 2: Convert to coordinates using Nominatim
    const coordinates = await CacheService.getOrFetch(
      `geocode_${locationName}`,
      () => NominatimService.geocode(locationName)
    );
    
    return {
      locationName,
      coordinates,
      geography: `POINT(${coordinates.lon} ${coordinates.lat})`
    };
  }
}
```

**API Design Integration**: This pipeline is automatically used in endpoints like `createResource`, where the user provides a `location_name` and the server handles the geocoding, making the API more user-friendly.

### 3. Mock Social Media Pattern
**Implementation**: Realistic disaster-related social media simulation

```javascript
class MockSocialMediaService {
  static generateRealisticPosts(disasterType, location) {
    const templates = {
      flood: [
        "#floodrelief Need food and water in {location}",
        "Roads flooded near {location}, avoid area #emergency",
        "Shelter available at {location} community center #disaster"
      ],
      earthquake: [
        "Building damage reported in {location} #earthquake",
        "Emergency services needed at {location} #help",
        "Safe shelter available near {location} #earthquakerelief"
      ]
    };
    
    return templates[disasterType]?.map(template => ({
      id: generateId(),
      content: template.replace('{location}', location),
      user: this.getRandomUser(),
      timestamp: new Date(),
      engagement: this.generateEngagement()
    })) || [];
  }
}
```

## Data Management Patterns

### 1. Audit Trail Pattern
**Implementation**: JSONB-based audit logging for all disaster modifications

```javascript
class AuditService {
  static createAuditEntry(action, userId, oldData = null, newData = null) {
    return {
      action,
      user_id: userId,
      timestamp: new Date().toISOString(),
      old_data: oldData,
      new_data: newData,
      ip_address: this.getCurrentIP(),
      user_agent: this.getCurrentUserAgent()
    };
  }
  
  static async appendAudit(table, id, auditEntry) {
    await supabase
      .from(table)
      .update({
        audit_trail: sql`audit_trail || ${JSON.stringify(auditEntry)}::jsonb`
      })
      .eq('id', id);
  }
}
```
