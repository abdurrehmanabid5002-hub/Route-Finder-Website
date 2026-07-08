# Smart Route Finder Pakistan v2.0 🇵🇰 📍

An interactive, premium web-based navigation system that calculates the mathematically shortest driving route between **81+ Pakistani cities** using a custom client-side Dijkstra's algorithm, maps real road geometries using the OSRM API, and features a secure, full-featured modern authentication and settings preferences dashboard.

---

## 📖 GitHub About Section (Repository Description)
> Find the shortest driving route between 81+ Pakistani cities using Dijkstra's algorithm, with real road geometry from OSRM and interactive Leaflet maps. Features Light/Dark mode, path tables, secure Google/Email authentication gateway, and custom user settings preferences.

### Recommended Repository Topics (Tags)
`dijkstra-algorithm` · `route-finder` · `leaflet-maps` · `osrm-api` · `google-oauth` · `authentication` · `user-settings` · `graph-theory` · `pakistan-navigation` · `interactive-map` · `javascript-es6` · `html5-css3`

---

## 🌟 Key Features

- **🔐 Mandatory Secure Auth Gateway**: Restricts app access to verified users using an elegant, glassmorphic auth panel supporting email validation, confirmation matching, and strength indicators.
- **🚀 Google OAuth 2.0 Integration**: Native Google Sign-In button branding with real SDK triggers, complemented by a fallback mock Google Account selector list.
- **⚙️ Account Settings Dashboard**: Customize your application experience with setting preferences stored locally:
  - **Default Starting City**: Sets your home base to pre-load as the default routing origin on map initialization.
  - **Theme Select**: Force the site theme (*Always Light*, *Always Dark*, or *Follow System Preferences*).
  - **Notification Toasts**: Toggle interactive alert popups.
- **👤 GitHub-Style Profile Dropdown**: Clean initials-based circular user avatars and interactive dropdown menu offering rapid profile access, theme toggle, and secure sign-out.
- **📍 Dijkstra's Weighted Graph**: Custom client-side pathfinding implementation. Cities are represented as graph nodes, and road connections are edges weighted by approximate driving distance.
- **🗺️ Leaflet.js Interactive Map**: Beautiful map rendering with custom hover tooltips, smooth zooming, and highlighted routes.
- **🛣️ OSRM Real Road Geometry**: Fetches exact road geometry (curves, turns, highways) from the Open Source Routing Machine (OSRM) API instead of drawing unrealistic straight lines.
- **🌓 Premium UI & Dark Mode**: Modern, glassmorphism-inspired aesthetic with responsive layouts and a seamless Light/Dark mode toggle synced at the parser-level to prevent page white-flashing.
- **🔔 Toast Notifications**: Customized sleek alerts replacing browser defaults for a premium experience.
- **🌆 81+ Pakistani Cities**: Expanded coverage across Punjab, Sindh, KPK, Balochistan, AJK, GB, and ICT.

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5 (semantic structure), Vanilla CSS3 (responsive grid/flexbox), JavaScript ES6+ (Dijkstra algorithm & client-side interactions)
- **Map & GIS**: [Leaflet.js](https://leafletjs.com/) (interactive maps), OpenStreetMap tiles
- **Routing API**: [OSRM API](http://project-osrm.org/) (real road geometry and trip duration data)
- **Graph Generator**: Python (computes great-circle distances via the Haversine formula and auto-generates the `cities.js` network)
- **Styling & Assets**: Google Fonts (Poppins), Font Awesome 6 Icons
- **Security & Hosting**: Vercel Deployment with strict COEP (`require-corp`) headers. Utilizes a self-contained inline SVG initials avatar rendering pipeline and CORS map-tile handlers to ensure compatibility under secure network protocols.

---

## 📐 System Architecture & Pipeline

```mermaid
graph TD
    A[User Opens Website] --> B{Authenticated?}
    B -- No --> C[Redirect to auth.html Gate]
    B -- Yes --> D[Load index.html & Apply Theme/Settings Preferences]
    D --> E[User Selects Start & Destination]
    E --> F[Dijkstra Pathfinding Algorithm]
    F --> G[Compute Shortest Node Path in cities.js]
    G --> H[Send Waypoints to OSRM API]
    H --> I[OSRM Returns Road Geometry & Real Duration]
    I --> J[Leaflet.js Draws Route & User Dashboard Updates]
```

1. **Cities as Nodes**: City positions are stored with their real coordinates (latitude and longitude) in [cities.js](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/cities.js).
2. **Roads as Weighted Edges**: Bidirectional roads connect neighboring cities. The Python script [generate_cities.py](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/generate_cities.py) identifies the nearest neighbors for each city using the **Haversine formula**.
3. **Route Optimization**: The client-side Dijkstra's algorithm runs on the weighted graph to output the optimal sequence of intermediate cities.
4. **Road Geometry Fetching**: The computed sequence of coordinates is queried against the OSRM routing service to retrieve high-fidelity road polyline coordinates.
5. **Dashboard Rendering**: The page visualizes the route on the Leaflet map, populates the dashboard stats card (total distance, duration, and steps), and renders the detailed routing steps table.

---

## 📂 Project Structure

- 🔐 **[auth.html](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/auth.html)**: The modern gateway page containing the login forms, Google sign-in integrations, loading states, and mock accounts panel.
- ⚙️ **[auth-shared.js](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/auth-shared.js)**: Handles the global authentication gate redirect checks, user sessions, initials SVG generation, theme sync, dynamic profile/settings modal injection, and settings preferences hooks.
- 🗺️ **[index.html](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/index.html)**: The main application entry point (interactive map, routing search sidebar, stats cards, and table views).
- ❓ **[how.html](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/how.html)**: Interactive guide detailing the architecture, Dijkstra logic, OSRM drawing pipeline, and user flow.
- ℹ️ **[about.html](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/about.html)**: Project information page listing the mission, development journey, and the core development team.
- 🗄️ **[cities.js](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/cities.js)**: Holds the JSON data for coordinates, weighted graph connections, and provincial data for all 81+ cities.
- ⚙️ **[generate_cities.py](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/generate_cities.py)**: Python script used to process city coordinates, calculate neighboring distances, and output the graph module.
- 🌐 **[vercel.json](file:///c:/Users/abdur/Downloads/Route%20Finder%20Website%202.0/vercel.json)**: Hosting configuration for seamless deployment (clean URLs and COEP security headers).

---

## 🚀 Running the Project Locally

No complex database or server setups are required! The project runs entirely on the browser.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/route-finder-pakistan.git
   cd route-finder-pakistan
   ```
2. **Open the App**:
   Simply double-click **`auth.html`** or **`index.html`** to open it directly in any modern browser, or run a local development server:
   ```bash
   # If using python
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000/index.html` in your browser. The app will check for local credentials and direct you to the login gateway page.

3. **(Optional) Re-generating Graph Data**:
   If you add new cities or want to recalculate connections:
   ```bash
   python generate_cities.py
   ```

---

## 👥 Meet the Team

- **Abdur Rehman Abid** – Lead Developer & UI/UX Design
- **Amna Waheed** – API Integration & Core Logic
- **Noor Fatima** – Graph Data & Routing Algorithms
