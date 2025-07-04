# API Documentation

This document provides detailed information about the API endpoints for the Disaster Response Coordination Platform.

## Base URL

All API endpoints are relative to the following base URL: `/api`


## 1. Disaster Service

**Service Prefix:** `/disasters`

This service manages the core disaster records.

### 1.1 Create a new Disaster

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new disaster record.
*   **Authorization:** `admin`, `contributor`
*   **Request Body:**
    ```json
    {
      "title": "Hurricane Zen",
      "description": "A powerful hurricane is approaching the coast of Miami, FL.",
      "tags": ["hurricane", "coastal"]
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "title": "Hurricane Zen",
      "description": "A powerful hurricane is approaching the coast.",
      "location_name": "Miami, FL",
      "location": "POINT(-80.1918 25.7617)",
      "tags": ["hurricane", "coastal"],
      "owner_id": "user-123",
      "created_at": "2025-07-04T12:00:00.000Z",
      "audit_trail": []
    }
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Error creating disaster",
      "error": "Details about the error."
    }
    ```

### 1.2 Get all Disasters

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a list of all disasters. Can be filtered by tags.
*   **Authorization:** `admin`, `contributor`
*   **Query Parameters:**
    *   `tag` (optional): A comma-separated list of tags to filter by.
*   **Success Response (200):**
    ```json
    [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "title": "Hurricane Zen",
        "description": "A powerful hurricane is approaching the coast.",
        "location_name": "Miami, FL",
        "location": "POINT(-80.1918 25.7617)",
        "tags": ["hurricane", "coastal"],
        "owner_id": "user-123",
        "created_at": "2025-07-04T12:00:00.000Z",
        "audit_trail": []
      }
    ]
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Error fetching disasters",
      "error": "Details about the error."
    }
    ```

### 1.3 Get Disaster by ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single disaster record by its ID.
*   **Authorization:** `admin`, `contributor`
*   **Success Response (200):**
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "title": "Hurricane Zen",
      "description": "A powerful hurricane is approaching the coast.",
      "location_name": "Miami, FL",
      "location": "POINT(-80.1918 25.7617)",
      "tags": ["hurricane", "coastal"],
      "owner_id": "user-123",
      "created_at": "2025-07-04T12:00:00.000Z",
      "audit_trail": []
    }
    ```
*   **Error Response (404):**
    ```json
    {
      "message": "Disaster not found"
    }
    ```

### 1.4 Update a Disaster

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Updates an existing disaster record. The location is automatically re-geocoded from the description.
*   **Authorization:** `admin`, `contributor` (must be owner)
*   **Request Body:**
    ```json
    {
      "title": "Hurricane Zen (Upgraded to Category 5)",
      "description": "Hurricane Zen has been upgraded to a Category 5 storm and is making landfall in Miami, FL.",
      "tags": ["hurricane", "coastal", "major"]
    }
    ```
*   **Success Response (200):**
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "title": "Hurricane Zen (Upgraded to Category 5)",
      "description": "A powerful hurricane is approaching the coast.",
      "location_name": "Miami, FL",
      "location": "POINT(-80.1918 25.7617)",
      "tags": ["hurricane", "coastal", "major"],
      "owner_id": "user-123",
      "created_at": "2025-07-04T12:00:00.000Z",
      "audit_trail": [...]
    }
    ```
*   **Error Response (403):**
    ```json
    {
      "message": "Forbidden: You do not own this resource"
    }
    ```

### 1.5 Delete a Disaster

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a disaster record.
*   **Authorization:** `admin`
*   **Success Response (204):** No content.
*   **Error Response (403):**
    ```json
    {
      "message": "Forbidden: You do not own this resource"
    }
    ```

---

## 2. Geocoding Service

**Service Prefix:** `/geocode`

This service provides utilities for converting location descriptions into geographic coordinates.

### 2.1 Geocode a Description

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Takes a natural language description and returns the extracted location name and its coordinates.
*   **Authorization:** `admin`, `contributor`
*   **Request Body:**
    ```json
    {
      "description": "There is a massive fire near the Golden Gate Bridge in San Francisco."
    }
    ```
*   **Success Response (200):**
    ```json
    {
      "locationName": "San Francisco",
      "coordinates": {
        "lat": "37.7749",
        "lon": "-122.4194"
      },
      "geography": "POINT(-122.4194 37.7749)"
    }
    ```
*   **Error Response (400):**
    ```json
    {
      "message": "Description is required"
    }
    ```
*   **Error Response (404):**
    ```json
    {
      "message": "Could not determine location from description"
    }
    ```

---

## 3. Reports Service

**Service Prefix:** `/disasters/:disasterId/reports`

This service manages user-submitted reports for a specific disaster.

### 3.1 Create a new Report

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new report for a specific disaster.
*   **Authorization:** `admin`, `contributor`
*   **Request Body:**
    ```json
    {
      "content": "The bridge on the main highway has collapsed.",
      "image_url": "http://example.com/bridge_collapse.jpg"
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "id": "r1b2c3d4-e5f6-7890-1234-567890abcdef",
      "disaster_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "user_id": "user-123",
      "content": "The bridge on the main highway has collapsed.",
      "image_url": "http://example.com/bridge_collapse.jpg",
      "verification_status": true,
      "created_at": "2025-07-04T13:00:00.000Z"
    }
    ```
*   **Note:** If an `image_url` is provided, the `verification_status` will be automatically set to `true` or `false` based on the AI verification result. Otherwise, it will default to `pending`.
*   **Error Response (500):**
    ```json
    {
      "message": "Error creating report",
      "error": "Details about the error."
    }
    ```

### 3.2 Get all Reports for a Disaster

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a list of all reports for a specific disaster.
*   **Authorization:** `admin`, `contributor`
*   **Success Response (200):**
    ```json
    [
      {
        "id": "r1b2c3d4-e5f6-7890-1234-567890abcdef",
        "disaster_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "user_id": "user-123",
        "content": "The bridge on the main highway has collapsed.",
        "image_url": "http://example.com/bridge_collapse.jpg",
        "verification_status": "pending",
        "created_at": "2025-07-04T13:00:00.000Z"
      }
    ]
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Error fetching reports",
      "error": "Details about the error."
    }
    ```

### 3.3 Verify a Report

*   **Method:** `POST`
*   **Path:** `/:reportId/status`
*   **Description:** Verifies a report.
*   **Authorization:** `admin`
*   **Success Response (200):**
    ```json
    {
      "id": "r1b2c3d4-e5f6-7890-1234-567890abcdef",
      "disaster_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "user_id": "user-123",
      "content": "The bridge on the main highway has collapsed.",
      "image_url": "http://example.com/bridge_collapse.jpg",
      "verification_status": "verified",
      "created_at": "2025-07-04T13:00:00.000Z"
    }
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Error verifying report",
      "error": "Details about the error."
    }
    ```

---

## 4. Resources Service

This service manages resources associated with disasters and provides geospatial search capabilities.

### 4.1 Create a new Resource for a Disaster

*   **Service Prefix:** `/disasters/:disasterId/resources`
*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new resource and associates it with a specific disaster. The `location_name` is automatically geocoded.
*   **Authorization:** `admin`, `contributor`
*   **Request Body:**
    ```json
    {
      "name": "Red Cross Shelter",
      "location_name": "123 Main St, San Francisco, CA",
      "type": "shelter"
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "id": "res1b2c3d4-e5f6-7890-1234-567890abcdef",
      "disaster_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "name": "Red Cross Shelter",
      "location_name": "123 Main St, San Francisco, CA",
      "location": "POINT(-122.4194 37.7749)",
      "type": "shelter",
      "created_at": "2025-07-04T14:00:00.000Z"
    }
    ```
*   **Error Response (400):**
    ```json
    {
      "message": "location_name is required"
    }
    ```

### 4.2 Get all Resources for a Disaster

*   **Service Prefix:** `/disasters/:disasterId/resources`
*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a list of all resources for a specific disaster.
*   **Authorization:** `admin`, `contributor`
*   **Success Response (200):**
    ```json
    [
      {
        "id": "res1b2c3d4-e5f6-7890-1234-567890abcdef",
        "disaster_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Red Cross Shelter",
        "location_name": "123 Main St, San Francisco, CA",
        "location": "POINT(-122.4194 37.7749)",
        "type": "shelter",
        "created_at": "2025-07-04T14:00:00.000Z"
      }
    ]
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Error fetching resources",
      "error": "Details about the error."
    }
    ```

### 4.3 Find Nearby Resources

*   **Service Prefix:** `/resources/nearby`
*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Finds all resources within a 20km radius of a given location name. The location name is geocoded to get coordinates.
*   **Authorization:** `admin`, `contributor`
*   **Request Body:**
    *   **Note:** This endpoint unconventionally expects a request body for a GET request.
    ```json
    {
      "location_name": "Downtown San Francisco"
    }
    ```
*   **Success Response (200):**
    ```json
    [
      {
        "id": "res1b2c3d4-e5f6-7890-1234-567890abcdef",
        "disaster_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Red Cross Shelter",
        "location_name": "123 Main St, San Francisco, CA",
        "location": "POINT(-122.4194 37.7749)",
        "type": "shelter",
        "created_at": "2025-07-04T14:00:00.000Z",
        "distance": 520.5
      }
    ]
    ```
*   **Error Response (400):**
    ```json
    {
      "message": "location_name is required"
    }
    ```

---

## 5. Social Media Service

**Service Prefix:** `/disasters/:disasterId/social-media`

This service provides a mock social media feed related to a specific disaster.

### 5.1 Get Social Media Feed for a Disaster

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a mock social media feed for a specific disaster.
*   **Authorization:** `admin`, `contributor`
*   **Success Response (200):**
    ```json
    [
      {
        "id": "sm1b2c3d4-e5f6-7890-1234-567890abcdef",
        "content": "Massive flooding reported in downtown Miami #hurricane #flooding",
        "user": "concerned_citizen",
        "timestamp": "2025-07-04T15:00:00.000Z",
        "engagement": {
          "likes": 150,
          "retweets": 75
        }
      }
    ]
    ```
*   **Error Response (404):**
    ```json
    {
      "message": "Disaster not found"
    }
    ```

---

## 6. Updates Service

**Service Prefix:** `/updates`

This service provides official updates by scraping government and relief organization websites.

### 6.1 Get Official Updates

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves the latest official updates from sources like FEMA and the Red Cross.
*   **Authorization:** `admin`, `contributor`
*   **Success Response (200):**
    ```json
    [
      {
        "source": "FEMA",
        "title": "President Declares Major Disaster for State of Florida",
        "url": "http://fema.gov/disaster/4732",
        "summary": "Federal aid has been made available to the state of Florida to supplement state and local recovery efforts...",
        "timestamp": "2025-07-04T10:00:00.000Z"
      },
      {
        "source": "Red Cross",
        "title": "Red Cross Opens Shelters Across Florida",
        "url": "http://redcross.org/news/article/red-cross-opens-shelters-across-florida",
        "summary": "The American Red Cross has opened 20 shelters in Florida to provide safe refuge for those affected by Hurricane Zen.",
        "timestamp": "2025-07-04T11:00:00.000Z"
      }
    ]
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Details about the error."
    }
    ```

---

## 7. Verification Service

**Service Prefix:** `/verify-image`

This service provides AI-powered image verification.

### 7.1 Verify an Image

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Uses AI to verify the authenticity of a disaster image.
*   **Authorization:** `admin`, `contributor`
*   **Request Body:**
    ```json
    {
      "imageUrl": "http://example.com/disaster-image.jpg"
    }
    ```
*   **Success Response (200):**
    ```json
    {
      "authentic": true,
      "confidence": 0.95,
      "reasoning": "The image appears to be a genuine photograph of a hurricane's aftermath. No signs of digital manipulation were detected."
    }
    ```
*   **Error Response (400):**
    ```json
    {
      "message": "imageUrl is required"
    }
    ```
*   **Error Response (500):**
    ```json
    {
      "message": "Details about the error."
    }
