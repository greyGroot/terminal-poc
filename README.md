# Mastercard Terminal Interactive Experience

This is an interactive dual-screen web application built for an event or terminal experience. It features an iPad control interface where users can enter their name and trigger a roulette game, and a large TV display that shows the spinning animation, dynamic visuals, and the final prize or prediction result.

The application supports both a legacy 2D CSS-animated TV display and a high-performance **3D WebGL (Three.js)** TV display.

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, React Router, React Three Fiber (R3F), `@react-three/drei`, Three.js
- **Backend:** Node.js, Express, Socket.io
- **Styling:** Custom CSS with advanced keyframe animations (2D) and WebGL materials (3D)
- **Database:** Local JSON file (`database.json`) for lightweight inventory tracking

---

## 📂 Project Structure

- `src/views/Tv3dView.jsx` - **[NEW]** The 3D WebGL TV display showing a grid of thick, grooved vinyl records rotating on the Y-axis, a fullscreen parallax background, and a fly-to-center winner reveal animation.
- `src/views/TvView.jsx` - The legacy 2D CSS-animated TV display.
- `src/views/IpadView.jsx` - The interactive tablet interface for the user (name input, spin trigger).
- `src/views/AdminView.jsx` - A control panel to configure prizes, quantities, and cooldown timers.
- `server.js` - The Node.js server that handles Socket.io events and REST API calls.
- `database.json` - Stores prize inventory and cooldown timestamps.

---

## 🚀 How to Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Starting the Development Server
Run the following command to start both the Vite frontend server and the Express backend server concurrently:
```bash
npm run dev
```
By default, the Express backend runs on port `3000` (handling Socket.io and database API) and the Vite dev server runs on port `5173`.

---

## 🎮 How to Use (URL Endpoints)

Once the server is running, you can access the different interfaces using the following URLs:

1. **📺 TV Screen 3D (WebGL Display - Recommended):**
   [http://localhost:5173/tv-3d](http://localhost:5173/tv-3d)
   *Put this on the main large display. Rendered in WebGL with high-fidelity gold/copper glares, realistic physical grooves, and Mastercard-colored parallax background flows.*

2. **📺 TV Screen 2D (Legacy CSS Display):**
   [http://localhost:5173/tv](http://localhost:5173/tv)
   *The legacy 2D display screen, kept fully functional as a fallback.*

3. **📱 iPad Screen (User Control):**
   [http://localhost:5173/ipad](http://localhost:5173/ipad)
   *Open this on the tablet device given to the user. Here they enter their name and swipe/click the record to start the game.*

4. **⚙️ Admin Panel:**
   [http://localhost:5173/admin](http://localhost:5173/admin)
   *Use this to manage the prize pool. You can set the quantity of available prizes (iPhone, PlayStation, etc.) and configure the cooldown timer between guaranteed wins.*

---

## 💡 How to Develop (3D View Architecture)

The 3D TV Screen `Tv3dView.jsx` is built with a custom React Three Fiber setup. Key components and design considerations:

### 1. Dynamic Canvas Textures
To maintain perfect brand styling without loading large assets:
- **`drawGoldRecord`**: Draws a high-contrast conic gradient on a 2D canvas using rich copper-bronze (`#8c4300`), saturated gold (`#ffa800`), and bright champagne highlights (`#fff0a6`).
- **`drawDarkRecord`**: Draws a dark vinyl record texture with subtle white highlight tracks.
- **`drawBumpMap`**: Generates a concentric height bump map texture with song tracks and gap bands, used as a `bumpMap` on the standard materials to create realistic physical ridges.
- Canvases are converted to `THREE.CanvasTexture` on mount and cached using `useMemo`.

### 2. Dynamic Layout & Scaling
To ensure the grid of records fits perfectly between the header and footer on any screen size and aspect ratio:
- `topRef` and `bottomRef` track the bounding boxes of the header/title area and footer.
- A resize listener computes the clear vertical space in pixels (`available_px`) and converts it to Three.js coordinates using the formula:
  $$\text{height}_{\text{units}} = \text{pixels} \times \frac{\text{viewportHeight}_{\text{units}}}{\text{windowHeight}_{\text{pixels}}}$$
- The records grid is scaled to fill `95%` of the available height and centered exactly at `yCenter`.
- During state transitions, the Screen Title's height is preserved (hidden using CSS `visibility` and `opacity`) to prevent the grid layout from jumping.

### 3. Winner Record Compensation
Because the winner record in the `result` state is inside the scaled grid group, its local scale and displacement are normalized:
- **Scale:** `targetScale = 1.8 / gridScale` (guarantees a large, prominent absolute scale of `1.8` on all devices).
- **Y Position:** `targetY = (-0.15 - yCenter) / gridScale` (places the center of the record at exactly `-0.15` absolute coordinates, leaving equal visual margins to the title above and the footer below).
- **Z Position:** `targetZ = 0.9 / gridScale` (brings the record closer to the camera to clear the background grid).

---

## 📦 Building for Production

To build the application for production deployment:
```bash
npm run build
```
Then start the production server:
```bash
npm start
```
*(The production server will serve the built static Vite files directly from the Express backend on port 3000).*
