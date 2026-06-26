# Mastercard Terminal Interactive Experience

This is an interactive dual-screen web application built for an event or terminal experience. It features an iPad control interface where users can enter their name and trigger a roulette game, and a large TV display that shows the spinning animation, dynamic 3D-like visuals, and the final prize or prediction result.

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express, Socket.io
- **Styling:** Custom CSS with advanced keyframe animations (spinning vinyls, glow effects)
- **Database:** Local JSON file (`database.json`) for lightweight inventory tracking

## 📂 Project Structure

- `src/views/TvView.jsx` - The main display screen showing the 25-record grid and win animations.
- `src/views/IpadView.jsx` - The interactive tablet interface for the user (name input, spin trigger).
- `src/views/AdminView.jsx` - A control panel to configure prizes, quantities, and cooldown timers.
- `server.js` - The Node.js server that handles Socket.io events and REST API calls for the admin panel.
- `database.json` - Stores prize inventory and cooldown timestamps.

## 🚀 How to Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

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

## 🎮 How to Use (URL Endpoints)

Once the server is running, you can access the different interfaces using the following URLs:

1. **📺 TV Screen (Main Display):**
   [http://localhost:5173/tv](http://localhost:5173/tv)
   *Put this on the main large display. It stays idle until a user interacts with the iPad.*

2. **📱 iPad Screen (User Control):**
   [http://localhost:5173/ipad](http://localhost:5173/ipad)
   *Open this on the tablet device given to the user. Here they enter their name and swipe/click the record to start the game.*

3. **⚙️ Admin Panel:**
   [http://localhost:5173/admin](http://localhost:5173/admin)
   *Use this to manage the prize pool. You can set the quantity of available prizes (iPhone, PlayStation, etc.) and configure the cooldown timer between guaranteed wins.*

## 💡 How to Develop

- **Editing UI:** All frontend React components are located in the `src/views` directory.
- **Styling:** Main CSS styles and complex animations (like `.record-bg-gold` and `.record-bg-dark-ipad`) are located in `src/index.css`.
- **Backend Logic:** Game probability and socket broadcasting are handled in `server.js`. 
  - *Note:* The system is currently configured to guarantee a win (`WIN_PROBABILITY = 1.0`) as long as the cooldown has expired and there is inventory available in `database.json`.
- **Localization:** Text and translations for English and Ukrainian are managed in `src/i18n.jsx`.

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
