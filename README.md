# Disaster Response Coordination Platform

This is a comprehensive disaster response coordination platform that aggregates real-time data to aid disaster management operations. The platform combines AI-powered location extraction, geospatial database queries, real-time social media monitoring, and official updates aggregation to provide a centralized hub for disaster response coordination.

## Key Features

*   **Disaster Data Management:** Complete CRUD operations for disaster records with ownership tracking and audit trails.
*   **AI-Powered Location Processing:** Google Gemini API integration for extracting location names from disaster descriptions and converting them to coordinates.
*   **Real-Time Social Media Monitoring:** Mock Twitter API implementation for processing social media reports and alerts.
*   **Geospatial Resource Mapping:** Supabase PostGIS queries for location-based resource discovery and proximity searches.
*   **Official Updates Aggregation:** Web scraping of government and relief organization websites (FEMA, Red Cross).
*   **Image Verification:** AI-powered analysis of disaster images for authenticity verification.
*   **Real-Time Updates:** WebSocket implementation for live data broadcasting.

## Tech Stack

### Backend

*   **Runtime:** Node.js with Express.js
*   **Database:** Supabase (PostgreSQL with PostGIS extensions)
*   **Real-Time:** Socket.IO for WebSocket communication
*   **Authentication:** Mock authentication with hard-coded users and roles
*   **AI Processing:** Google Gemini API
*   **Geocoding:** OpenStreetMap Nominatim
*   **Web Scraping:** Cheerio.js
*   **Caching:** Supabase-based caching with 1-hour TTL

### Frontend

*   **Framework:** React with Vite
*   **State Management:** Redux Toolkit
*   **Styling:** Material-UI
*   **API Client:** Axios

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm
*   A Supabase account
*   A Google AI Studio API key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory and add the following:
    ```
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

5.  **Set up the database:**
    Execute the SQL queries in `backend/src/database.sql` in your Supabase project to create the necessary tables and indexes.

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## API Endpoints

A full description of the API can be found in the `memory-bank/api-documentation.md` file.

## Deployment

The frontend is deployed on Vercel and the backend is deployed on Render.
