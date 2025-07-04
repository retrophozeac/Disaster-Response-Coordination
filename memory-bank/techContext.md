# Technical Context Documentation

## Project Overview
**Project Name:** Disaster Response Coordination Platform  
**Project Type:** Backend-heavy MERN Stack Web Application  
**Context:** Job Application Technical Assignment  
**Timeline:** 8-10 hours intensive development sprint  

## Core Technology Stack

### Backend Infrastructure
- **Runtime:** Node.js (Latest LTS)
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL with PostGIS extensions)
- **Real-time Communication:** Socket.IO for WebSocket implementation
- **Authentication:** Mock authentication with hard-coded users

### Frontend Stack
- **Framework:** React (minimal implementation for API testing)
- **Build Tool:** Vite or Create React App
- **WebSocket Client:** Socket.IO client library
- **HTTP Client:** Axios for API requests

### Database & Geospatial
- **Primary Database:** Supabase PostgreSQL
- **Geospatial Extensions:** PostGIS for location-based queries
- **ORM/Client:** Supabase JavaScript SDK
- **Caching Strategy:** Supabase table-based caching with TTL

## External Service Integrations

### AI & Machine Learning
- **Google Gemini API:** Location extraction and image verification
  - Endpoint: Google AI Studio API
  - Use cases: Natural language location parsing, image authenticity analysis
  - Caching: 1-hour TTL in Supabase cache table

### Mapping & Geocoding
- **Primary Choice:** OpenStreetMap Nominatim (free tier)
- **Alternative:** Google Maps Geocoding API
- **Functionality:** Convert location names to lat/lng coordinates
- **Rate Limiting:** Implemented with Supabase caching

### Social Media Integration
- **Implementation:** Mock Twitter API
- **Data Format:** JSON responses with disaster-related posts
- **Real-time Updates:** WebSocket broadcasting for new social media data
- **Fallback Strategy:** Static mock responses for rate limit scenarios

### Web Scraping
- **Library:** Cheerio.js for DOM parsing
- **Targets:** Government websites (FEMA, Red Cross)
- **Caching:** 1-hour TTL for scraped official updates
- **Error Handling:** Graceful fallback to cached or mock data

## Development Environment

### AI-Assisted Development
- **Primary Tool:** Cursor IDE or Windsurf
- **Usage Strategy:** Aggressive AI assistance for rapid development
- **Documentation Requirement:** Track AI tool usage for submission notes

### Package Dependencies

#### Backend Dependencies
```json
{
  "express": "^4.18.0",
  "socket.io": "^4.7.0",
  "@supabase/supabase-js": "^2.38.0",
  "cheerio": "^1.0.0-rc.12",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "dotenv": "^16.3.0",
  "express-rate-limit": "^6.10.0"
}
```

#### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "socket.io-client": "^4.7.0",
  "axios": "^1.5.0"
}
```

#### Development Dependencies
```json
{
  "nodemon": "^3.0.0",
  "concurrently": "^8.2.0",
  "@types/node": "^20.0.0"
}
```

## Database Schema & Geospatial Requirements

### Core Tables
```sql
-- Disasters with geospatial support
disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location_name TEXT,
  location GEOGRAPHY(POINT, 4326),
  description TEXT,
  tags TEXT[],
  owner_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  audit_trail JSONB DEFAULT '[]'::jsonb
)

-- Reports and user submissions
reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
  user_id TEXT,
  content TEXT,
  image_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Geospatial resources
resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_name TEXT,
  location GEOGRAPHY(POINT, 4326),
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Caching table for external APIs
cache (
  key TEXT PRIMARY KEY,
  value JSONB,
  expires_at TIMESTAMPTZ NOT NULL
)
```

### Required Indexes
```sql
-- Geospatial indexes for performance
CREATE INDEX disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX resources_location_idx ON resources USING GIST (location);

-- Query optimization indexes
CREATE INDEX disasters_tags_idx ON disasters USING GIN (tags);
CREATE INDEX disasters_owner_idx ON disasters (owner_id);
CREATE INDEX cache_expires_idx ON cache (expires_at);
```

## API Architecture

### REST Endpoints
- `POST /disasters` - Create disaster record
- `GET /disasters?tag=flood` - Query disasters with filtering
- `PUT /disasters/:id` - Update disaster record
- `DELETE /disasters/:id` - Remove disaster record
- `GET /disasters/:id/social-media` - Mock social media data
- `GET /disasters/:id/resources?lat=...&lon=...` - Geospatial resource lookup
- `GET /disasters/:id/official-updates` - Scraped government updates
- `POST /disasters/:id/verify-image` - AI image verification
- `POST /geocode` - Location extraction and geocoding

### WebSocket Events
- `disaster_updated` - Broadcast on CRUD operations
- `social_media_updated` - New social media reports
- `resources_updated` - Geospatial data changes

## Performance & Optimization

### Caching Strategy
- **TTL:** 1 hour for all external API responses
- **Storage:** Supabase JSONB cache table
- **Cache Keys:** Structured format for easy invalidation
- **Hit Rate Target:** >70% for external API calls

### Geospatial Query Optimization
- **Proximity Queries:** ST_DWithin for radius-based searches
- **Index Usage:** GIST indexes on all geography columns
- **Query Performance Target:** <1 second response time

### Rate Limiting
- **External APIs:** Respect service limits with caching
- **Internal APIs:** Express rate limiting middleware
- **Error Handling:** Graceful degradation to cached/mock data

## Deployment Configuration

### Frontend Deployment (Vercel)
- **Platform:** Vercel for React application
- **Build Command:** `npm run build`
- **Environment Variables:** API endpoint configuration

### Backend Deployment (Render)
- **Platform:** Render for Node.js backend
- **Environment Variables:** Supabase credentials, API keys
- **Health Checks:** Express health endpoint

### Environment Variables
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Optional: Mapping Service API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_key
MAPBOX_API_KEY=your_mapbox_key

# Application Configuration
NODE_ENV=production
PORT=3001
```

## Security Considerations

### Authentication
- **Implementation:** Mock authentication for assignment
- **Users:** Hard-coded users (netrunnerX, reliefAdmin)
- **Roles:** Admin and contributor role-based access

### API Security
- **CORS:** Configured for frontend domain
- **Helmet:** Security headers middleware
- **Rate Limiting:** Prevent API abuse
- **Input Validation:** Sanitize all user inputs

## Monitoring & Logging

### Structured Logging
- **Format:** JSON structured logs
- **Examples:** "Report processed: Flood Alert", "Resource mapped: Shelter at Manhattan, NYC"
- **Levels:** Info, warn, error for different operations

### Performance Monitoring
- **Metrics:** API response times, cache hit rates
- **
