# Frontend Development Action Plan

This document outlines the phased development plan for the Disaster Response Coordination Platform's frontend.

### **Phase 1: Core Setup and Disaster List**

**Goal:** Establish the project foundation and display the main list of disasters.

*   **Actions:**
    1.  **Initialize Project:** Set up a new **Vite + React** project.
    2.  **Install Dependencies:** Add essential libraries:
        *   `react-router-dom` for navigation.
        *   `axios` for API requests.
        *   `@reduxjs/toolkit` and `react-redux` for state management.
        *   `@mui/material` (Material-UI) for UI components.
    3.  **API Layer:** Create functions to communicate with the backend, starting with fetching all disasters (`GET /api/disasters`).
    4.  **Home Page:** Build the main page to display a list of all disasters fetched from the API. Each item will be a clickable link.
    5.  **Create Disaster Button:** Add a "Create New Disaster" button that navigates to a placeholder page.

*   **Testing for Phase 1:**
    *   Verify the application runs without errors.
    *   Confirm the home page successfully fetches and displays the list of disasters.
    *   Ensure the "Create New Disaster" button works for navigation.

---

### **Phase 2: Disaster Details Page**

**Goal:** Build the page that shows all information for a single disaster.

*   **Actions:**
    1.  **Dynamic Routing:** Set up a route for `/disaster/:id` to handle individual disaster pages.
    2.  **Data Fetching:** On the details page, fetch the specific disaster's data, all associated reports, and all associated resources.
    3.  **Display Reports:** Render the list of reports for the disaster, showing the content, timestamp, and any images provided.
    4.  **Display Resources:** Render the list of resources, showing their name and location.

*   **Testing for Phase 2:**
    *   Verify that clicking a disaster on the home page takes you to the correct details page (e.g., `/disaster/a1b2c3d4`).
    *   Confirm that all data (disaster details, reports, and resources) is fetched and displayed correctly.

---

### **Phase 3: Content Creation Forms**

**Goal:** Enable users to add new disasters, reports, and resources.

*   **Actions:**
    1.  **Create Disaster Form:** Build the "Create New Disaster" page with a form (`POST /api/disasters`). On success, redirect the user to the home page.
    2.  **Create Report Form:** On the `DisasterDetailPage`, add a form to submit a new report (`POST /api/disasters/:disasterId/reports`).
    3.  **Create Resource Form:** On the `DisasterDetailPage`, add a form to submit a new resource (`POST /api/disasters/:disasterId/resources`).
    4.  **UI Updates:** Ensure the UI updates automatically (without a page refresh) when new content is added.

*   **Testing for Phase 3:**
    *   Test all three forms to ensure they successfully create new entries in the database.
    *   Verify that the new data appears immediately in the UI.

---

### **Phase 4: Filtering and UI Polish**

**Goal:** Implement the tag filter and refine the user experience.

*   **Actions:**
    1.  **Tag Filter:** On the home page, add a filter component (e.g., a dropdown or clickable tags) to filter disasters by tags (`GET /api/disasters?tag=...`).
    2.  **Loading & Error States:** Implement loading indicators to show when data is being fetched and display user-friendly error messages if an API call fails.
    3.  **Styling:** Use Material-UI to ensure a clean, consistent, and professional look across the application.

*   **Testing for Phase 4:**
    *   Verify the tag filter works correctly.
    *   Confirm that loading indicators and error messages appear when appropriate.
    *   Review the overall application for visual consistency and ease of use.
