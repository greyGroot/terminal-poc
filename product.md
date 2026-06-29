# Mastercard Terminal Interactive Experience - Product Flow

## 🔄 Step-by-Step Flow

| Step | Admin (`/admin`) | TV Screen (`/tv`) | iPad Screen (`/ipad`) | Hostess |
|---|---|---|---|---|
| **1. System Offline** | Admin configures prizes, content, and settings. Clicks **START** to activate the game. | Displays the **Idle Screen** (Mastercard logo and branding). Cannot interact. | Displays the **Idle Screen**. Cannot interact. | |
| **2. Game Active** | Game is running. Admin monitors statistics and winners in real-time. | Displays the dynamic glowing vinyl grid. | Displays the **Welcome Screen** prompting the user to begin. | |
| **3. Name Entry** | *(No action)* | Transitions to **Name Entered State** and displays a huge personalized welcome message. | Prompts the user to input their name via the on-screen keyboard and tap "Continue". | |
| **4. Game Trigger** | *(No action)* | Displays "START" in giant text, then begins the high-speed roulette animation. | User taps the giant "PLAY" button to spin the roulette. | |
| **5. Roulette Spin** | *(No action)* | Records highlight rapidly in a spinning sequence for 10 seconds. | Shows an animated vinyl record player with a tonearm playing the record. | |
| **6. Winner Selection** | *(No action)* | Roulette stops. The winning record pulses intensely with a golden glow. | Vinyl player animation continues or slows down. | |
| **7. Result Reveal** | Game logs the result (Win or Prediction) to the **Statistics** and **Winners** tables. | The winning record detaches, flies to the center, and reveals the prize or prediction message. | The vinyl record dims and a "Restart" button appears. | |
| **8. Next User** | *(No action)* | Transitions back to the dynamic idle grid. | Taps "Restart" to reset the iPad for the next participant. | |

---

## 📺 Page Descriptions

### ⚙️ Admin Panel (`/admin`)
The Admin Panel is a comprehensive dashboard for managing the event, monitoring statistics, and configuring content.

**0. Authentication & Security**
- **Admin Password:** The entire Admin Panel is strictly protected by a password. The admin must authenticate to view the dashboard or make any changes.

**1. Top Bar Controls (Game State)**
- **Active Day Selector:** A dropdown to select which day is currently being played (e.g., Day 1, Day 2, Day 3).
- **Play Time Config:** Inputs to set the exact starting and end time for the active play day.
- **START:** Activates the game. Only when started do the iPad and TV transition from the static logo screens to the interactive grids.
- **STOP:** Immediately halts the game. TV and iPad return to the static **Idle Screen** with the Mastercard logo. Prize inventory can only be edited in this state.
- **RESTART:** Resets the game to its initial state for a new day or test run. Returns Prize Inventory to initial quantities and clears the Winners list for the day. *Log statistics are preserved.*
- **MAINTENANCE OVERLAY (Заглушка):** A critical toggle that forces the TV and iPad to display an independent holding screen. Used to safely deploy live code updates to the main app without the audience seeing browser refreshes or errors.
- **FULL SCREEN MODE:** A toggle button that remotely forces the connected TV and iPad screens to enter full-screen view, hiding browser UI and address bars for a completely immersive experience.

**2. Dashboard (Real-time Metrics)**
Features tabbed navigation (`Day 1`, `Day 2`, `Day 3`, `Total`) to view metrics for specific days or cumulative totals across all days. A quick-glance section displaying live statistics for the selected tab:
- **Time Remaining:** A live countdown showing how many hours, minutes, and seconds are left until the end of the current game day.
- **Games Played:** Total number of spins/games initiated.
- **Winners:** Total number of physical prizes given out.
- **Predictions:** Total number of "no prize" prediction messages shown.
- **Current Win Probability:** The real-time calculated chance of winning a prize on the next spin.

**3. Randomizer Settings**
- **Win Probability (%):** The baseline chance of winning a physical prize if inventory allows.
- **Cooldown Interval:** Minimum time (in minutes) that must pass before another physical prize can be won.

**4. Prize Inventory Table**
*Note: This section is locked and cannot be edited while the game is STARTED.*
- **Day Tabs:** Features tabbed navigation (`Day 1`, `Day 2`, `Day 3`, `Total`) allowing admins to configure separate prize pools and stock quantities for each specific day, as well as view the combined total inventory.
- Columns: `ID`, `Name`, `Image` (upload field), `Initial Quantity`, `Won Quantity`, `Left`, `Win Probability Weight`.
- Functionality: Ability to add new prize entities, remove existing ones, and upload visual assets for the TV reveal. **CRITICAL:** Changes to the prize inventory (adding, editing, or removing prizes) can ONLY be made when the game is STOPPED.

**5. Winners Section**
A table that automatically logs participants who won a physical prize.
- Columns: `Time`, `Name`, `Phone` (editable optional field), `Image File` (upload field for winner's photo).
- Functionality: Admins or hostesses can upload photos and add phone numbers at any time, even while the game is running. **Additionally, Admins have the ability to manually add new winners or remove existing ones from this list.**

**6. Content Management (i18n)**
A visual editor for the application's localization and text content.
- Language selector to switch between editing English (ENG) and Ukrainian (UKR) strings.
- **Predictions Editor:** Crucial section to manage the array of comforting/motivational messages users receive when they don't win a physical prize.

**7. Statistics & Event Log**
A real-time, persistent log of all game events to track terminal usage.
- Columns: `Time`, `Name`, `Event Description`.
- Logs include: 
  - "[Time] [Name] started the game."
  - "[Time] [Name] game result: Won iPhone 16 Pro."
  - "[Time] [Name] game result: Prediction received."

**8. Error Log**
A dedicated system log for capturing and monitoring technical issues.
- **Functionality:** Tracks and records any system errors, such as lost WebSocket connections, database write failures, or iPad/TV disconnections.
- **Purpose:** Crucial for developers and admins to debug issues during the live event without digging through the standard game event log.

**9. Hostess Password Management**
A dedicated settings area within the admin dashboard.
- **Functionality:** Allows the admin to define, view, or update the password required to access the `/hostess` page. This ensures the hostess access can be rotated or secured independently of the main admin password.

### 🚧 Maintenance Overlay ("Заглушка")
A completely separate, lightweight, and independent web application or page layer.
- **Purpose:** Activated from the Admin Panel when developers need to push live code updates, clear cache, or restart the main application server during the event.
- **Visuals:** Visually identical to the standard "Idle Screen" (Mastercard branding) so attendees do not notice any disruption.
- **Behavior:** Because it sits entirely outside the main app bundle, it stays stable while the main app underneath reloads. When the admin turns the overlay off, it disappears, revealing the freshly updated main app.

### 👩‍💼 Hostess Page (`/hostess`)
A streamlined, restricted interface designed specifically for event hostesses on the floor.
- **Authentication:** Protected by a dedicated hostess password (configured by the Admin in the Admin Panel).
- **Winner Management:** Allows the hostess to monitor the real-time Winners list, input optional phone numbers, and upload photos of the winners with their prizes. She cannot edit inventory or view overarching statistics.
- **Game Controls (Pause):** The hostess has the ability to **PAUSE** the game from her interface. When triggered, the TV and iPad instantly revert to the static **Idle Screen**. This allows her to safely manage the crowd or process a winner without the next person starting a game.

### 🖥️ TV Screen (`/tv`)
The TV Screen is the main visual centerpiece of the experience, designed to attract attention and engage the audience.

**1. Core Visual States**
- **Idle State:** The Idle Screen supports 4 distinct layout variants/modes.
  - **Variant 1 (3-Panel Vertical Layout):**
    - **Center Panel:** Displays a dynamic grid of gently rotating glowing copper-gold vinyl records. It features a header with the Mastercard logo and "30 Years Anniversary", a central catchphrase ("Catch your moment"), and a footer with the Mastercard logo and the text "Each concert is a priceless moment."
    - **Left Panel (Winners Board):** Displays a live feed of winners. Shows the winner's photo, their name, and the name of the prize won. If a winner declined a photo, a stylized shadow/silhouette (man, woman, boy, or girl) is displayed instead. **Scrolling:** Displays as a vertically scrolling marquee of all winners. **Visibility Rule:** If there are no winners yet, this panel is completely hidden.
    - **Right Panel (Prize Inventory):** Displays an alluring list of the available top prizes (e.g., iPhone 16 Pro, PS5, Dyson) with their respective images. **Depletion Rule:** When a specific physical prize is fully depleted (stock reaches 0), its image simply disappears from the screen.
  - **Variant 2 (Top/Bottom Horizontal Layout):**
    - **Center Panel:** The main dynamic vinyl grid remains the focal point in the middle of the screen.
    - **Top Panel (Winners Board):** The winners feed is placed at the top of the screen above the grid. **Scrolling:** Functions as a horizontally scrolling marquee. **Visibility Rule:** Just like Variant 1, if there are no winners yet, this panel is completely hidden.
    - **Bottom Panel (Prize Inventory):** The available prizes are displayed in a horizontal row below the grid. **Depletion Rule:** Prizes disappear when stock reaches 0.
  - **Variant 3 (Tutorial / Promo Mode):**
    - **Layout:** Inherits the panel positioning of either Variant 1 or Variant 2.
    - **Behavior:** The main difference is the central grid's behavior. After 30 seconds of inactivity, the vinyl grid transitions into an engaging, animated tutorial explaining how to participate.
    - **Tutorial Flow:** "1. Pay a bill of at least 100 UAH with Mastercard. -> 2. Play the game. -> 3. Win one of the following prizes!"
  - **Variant 4 (End of Day / "Hall of Fame" Mode):**
    - **Trigger:** Displayed when the active day's time limit expires, or if ALL physical prizes have been completely won.
    - **Layout:** The standard game grid fades out and is replaced by a massive, celebratory "Hall of Fame" mosaic or scrolling grid showcasing all the players who won that day.
    - **Dynamic Messaging:** 
      - *"To celebrate Mastercard's 30th anniversary, these lucky people caught their priceless moment and won!"*
      - **If there is a next day:** *"The game will continue tomorrow! We are waiting for you."*
      - **If it's the final day (or stock is empty):** *"Thank you for celebrating with us. Every concert is a priceless moment."*
  - **Standard Attract Mode:** For Variants 1 & 2, every 30 seconds of inactivity triggers a shimmering wave of light passing across the central vinyl records to catch the audience's eye.
- **Name Entered State:** Once a user enters their name on the iPad, the TV reacts by displaying a massive, personalized welcome message (e.g., "Welcome, [Name]! Are you ready to catch your priceless moment?") over a dark overlay.
- **Roulette State:** When the user spins, the TV shows a fast-paced 10-second roulette animation where grid items light up in a sequence, accelerating and then gracefully decelerating.
- **Winner Pulse:** The final selected record pulses intensely with a golden glow for 2 seconds to build anticipation.
- **Result State:** A seamless 3D animation where the winning record detaches from the grid, flies to the center, scales up, and rotates in 3D space to reveal the outcome hidden underneath it (either the physical prize graphic or a prediction message). Confetti falls in the background. **Timeout:** The result stays on screen until the Hostess taps "Restart" on the iPad, OR it automatically returns to the Idle Screen after 3 minutes of inactivity.
- **Disconnected / Error State:** If the TV loses its WebSocket connection or encounters a critical error, it automatically falls back to displaying the **Maintenance Overlay** (mimicking the Idle Screen) so attendees do not see broken UI or browser errors.

**2. Hardware & Resolution Specs**
*(Specifications for physical screen orientation, resolution, and aspect ratio will be defined here)*

**3. Sound & Audio Design (Nice-to-Have)**
If venue acoustics allow, the TV experience should be enhanced with audio cues:
- **Idle:** Low ambient background music.
- **Name Entered:** An emphatic *whoosh* or engaging chime.
- **Roulette State:** Fast-paced ticking that matches the spinning lights.
- **Result State:** Triumphant fanfare for physical prizes, or a gentle, whimsical sound for predictions.

### 📱 iPad Screen (`/ipad`)
The iPad Screen serves as the interactive remote control for the participant.
- **Welcome Screen:** Displays Mastercard branding, brief instructions, and a "Start" button. Includes a hidden language selector at the top right for initial setup.
- **Name Input:** A clean, distraction-free interface prompting the user to type their name using the on-screen keyboard.
- **Ready Screen:** A final confirmation screen with a giant "PLAY" button that triggers the socket event to spin the TV roulette.
- **Spin Animation:** While the TV roulette is running, the iPad displays a 3D-styled animated vinyl record player with a tonearm placed on the spinning record.
- **Result Screen:** Once the game finishes and the TV shows the result, the iPad vinyl record dims and a "Restart" button appears, allowing the user (or Hostess) to reset the experience for the next person in line.
