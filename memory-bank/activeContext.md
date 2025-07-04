# Active Context Documentation
**Project:** Disaster Response Coordination Platform  
**Last Updated:** Current Session  
**Project Phase:** Development Phase

## Current Sprint Focus

### Primary Objective
Complete the backend implementation and begin frontend integration for the disaster response platform.

### Sprint Goals
1.  **Fix Web Scraping Service** - Resolve issues with the `updates` endpoint.
2.  **Implement Frontend** - Build a minimal React client for API testing.
3.  **End-to-End Testing** - Ensure all backend and frontend components work together.
4.  **Deployment** - Deploy the application to Vercel and Render.

## Recent Decisions & Changes

### API Status
-   **Verification Endpoint:** The `/api/verification` endpoint is complete and functional.
-   **Updates Endpoint:** The `/api/updates` endpoint is currently non-functional due to issues with the web scraping logic. This is a priority to fix.

### Technical Stack Confirmed
- **Frontend:** React (minimal implementation for API testing)
- **Social Media Integration:** Mock Twitter API (avoiding real API complexity)
- **Deployment:** Vercel (frontend) + Render (backend) as specified
- **Geographic Scope:** No specific region - using global sample data

### Key Architecture Decisions
- **Mapping Service:** OpenStreetMap/Nominatim (Finalized)
- **Web Scraping Strategy:** Real web scraping of FEMA/Red Cross websites (Finalized)
- **Project Structure:** Monorepo with `/backend` and `/frontend` folders (Finalized)

### Assignment Context Clarified
- **Purpose:** Job application technical assessment
- **Evaluation Criteria:** 50% functionality, 30% backend complexity, 15% integrations, 5% AI tool usage
- **Timeline:** 8-10 hours intensive sprint
- **AI Tools:** Cursor/Windsurf for rapid development with documented usage

## Detailed 8-Phase Implementation Plan

**Phase 1: Project Initialization & Database Setup (1.5 hours)**
*   **Goal:** Establish the foundational structure and database.
*   **Tasks:**
    *   Initialize the monorepo with `/backend` and `/frontend` directories.
    *   Set up the Supabase project.
    *   Execute the SQL scripts to create the database schema and all required indexes (GIST, GIN).
    *   Configure all environment variables (`.env`) for backend services.

**Phase 2: Core Backend & API Foundation (1.5 hours)**
*   **Goal:** Build the main server and the primary data endpoint.
*   **Tasks:**
    *   Set up the Express.js server.
    *   Integrate essential middleware (CORS, Helmet, JSON parser, rate-limiter).
    *   Implement the mock authentication system with hard-coded users and roles.
    *   Implement the complete CRUD (Create, Read, Update, Delete) API endpoints for `disasters`.

**Phase 3: Geocoding & AI Integration (1.5 hours)**
*   **Goal:** Implement the location processing pipeline.
*   **Tasks:**
    *   Integrate the Google Gemini API for location name extraction from text.
    *   Integrate the OpenStreetMap Nominatim service for converting location names to coordinates.
    *   Build the two-stage geocoding pipeline that orchestrates both services.
    *   Implement the Supabase-based caching layer for both Gemini and Nominatim responses.

**Phase 4: Real-time Communication Setup (1 hour)**
*   **Goal:** Enable live data broadcasting.
*   **Tasks:**
    *   Integrate and configure the Socket.IO server with Express.
    *   Implement the event broadcasting system for `disaster_updated` events.
    *   Set up a room-based architecture to broadcast updates only to relevant clients (e.g., by `disasterId`).

**Phase 5: Advanced Data Services (1.5 hours)**
*   **Goal:** Build out the remaining data models and complex queries.
*   **Tasks:**
    *   Implement CRUD APIs for `reports` and `resources`.
    *   Implement the geospatial proximity query endpoint using PostGIS (`ST_DWithin`) to find nearby resources.
    *   Implement the mock social media data generation service.

**Phase 6: Web Scraping & Verification (1.5 hours)**
*   **Goal:** Integrate external data sources and advanced AI features.
*   **Tasks:**
    *   Implement the **real web scraping service** using Cheerio to fetch data from FEMA and Red Cross websites.
    *   Integrate the caching layer for scraped content.
    *   Implement the image verification endpoint using the Gemini Vision API.

**Phase 7: Frontend Integration & Testing (1 hour)**
*   **Goal:** Create a simple client to test and demonstrate backend functionality.
*   **Tasks:**
    *   Build a minimal React interface with forms for creating disasters and submitting reports.
    *   Connect the frontend to the backend REST APIs using Axios.
    *   Integrate the Socket.IO client to display real-time updates.

**Phase 8: Deployment & Finalization (0.5 hours)**
*   **Goal:** Deploy the application and complete the assignment.
*   **Tasks:**
    *   Deploy the backend to Render.
    *   Deploy the frontend to Vercel.
    *   Perform final end-to-end testing and prepare submission documentation.

### Technical Implementation Decisions
1. **Geospatial Query Optimization:**
   - Index strategy for sub-second performance
   - Radius limits for proximity searches (10km default)
   - Caching strategy for expensive geospatial operations

2. **Real-time Event Strategy:**
   - Room-based WebSocket broadcasting per disaster
   - Global event broadcasting for all updates
   - **Recommendation:** Hybrid approach with disaster-specific rooms

3. **Error Handling & Fallbacks:**
   - Graceful degradation for external API failures
   - Cache-first strategy with stale data tolerance
   - Mock response fallbacks for rate limiting

## Current Challenges

### Web Scraper Failure
- **Challenge:** The web scraping service for the `/api/updates` endpoint is not working. The selectors for the FEMA and/or Red Cross websites are likely outdated.
- **Mitigation:** The service needs to be debugged by examining the current HTML of the target websites and updating the selectors.

### Time Constraint Management
- **Challenge:** 8-10 hour limit for comprehensive feature set
- **Mitigation:** MVP-first approach, aggressive AI tool usage
- **Risk:** Feature scope creep affecting core functionality

### External API Integration Complexity
- **Challenge:** Multiple external services (Gemini, mapping, social media)
- **Mitigation:** Robust caching and fallback strategies
- **Risk:** API rate limits during development/testing

### Geospatial Performance Requirements
- **Challenge:** Sub-second response times for proximity queries
- **Mitigation:** Strategic indexing and query optimization
- **Risk:** Database performance bottlenecks with large datasets

### Assignment Evaluation Criteria
- **Challenge:** Balancing functionality vs backend complexity scoring
- **Mitigation:** Focus on core features first, then optimization
- **Risk:** Over-engineering vs under-delivering on basic functionality

## Next Session Priorities

1.  **Fix Updates Endpoint:** Debug and resolve the issues with the web scraping service.
2.  **Frontend Development:** Begin implementation of the minimal React client.
3.  **Deployment:** Prepare for deployment to Vercel and Render.

## Success Metrics for Current Phase

- [ ] Complete Memory Bank documentation generated
- [ ] All technical architecture decisions finalized
- [ ] Development environment configured and tested
- [ ] Clear implementation roadmap with time estimates
- [ ] Risk mitigation strategies defined for each major component

**Status:** Development in progress. Backend is partially complete.
