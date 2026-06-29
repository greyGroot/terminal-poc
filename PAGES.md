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
- **FORCE END OF DAY (Variant 4):** A toggle button that manually forces both the TV and iPad into the **End of Day / "Hall of Fame" Mode** (Variant 4). This allows the admin to show the wrap-up screen and winners summary early (e.g., if the booth closes before the official timer runs out). **Safety Rule:** If a game is actively in progress when this is toggled, the transition is queued and will execute only after the current player's result is revealed and resolved.
- **STRICT LINE RULE (Optional):** An optional configuration toggle that governs game launch protocol on the iPad. By default, this rule is OFF (disabled).
  - **When ON:** Activates controlled queuing. After a game resolves, the iPad locks. The next player cannot begin registration until the hostess explicitly triggers a release from the Hostess Page.
  - **When OFF (Default):** Activates open queue mode. The next player can tap "Start Over" or register independently as long as the game status is active (not stopped or paused).

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
A streamlined, restricted dashboard designed specifically for event hostesses to manage the queue, verify winners, and control the floor experience. Optimized for mobile viewports so hostesses can use their personal smartphones on the floor.

**1. Authentication & PWA (Progressive Web App) Setup**
- **First-Time Password Prompt:** Access to `/hostess` requires a dedicated hostess password (configured in the Admin Panel). On first launch, the hostess must authenticate to access the interface.
- **PWA Installation:** The page supports PWA criteria, prompting the hostess to "Add to Home Screen" upon initial browser access.
- **Session Persistence:** Once authenticated, the credential/session is securely cached locally. Reopening the app or launching it from the home screen bypasses the password screen.
- **Session Expiration:** Connection loss or WebSocket resets will NOT force the hostess to re-enter her password. However, she must re-enter the password when a new play day starts (e.g., when the active day configuration changes).

**2. Connection Status Monitor**
- **Health Check:** On initial boot and during active usage, the app performs a real-time connection check with the backend server via WebSockets.
- **Diagnostic UI:** A persistent connection badge (Green for Online, Red for Disconnected) is shown. If disconnected, a full-screen warning modal overlays the UI, blocking hostess actions until communication is restored to prevent data loss.

**3. Real-Time Prize Inventory Tracker**
- **Live Stock Monitor:** Displays a simple list of all physical prizes configured for the active day alongside their remaining stock quantities.
- **Indicators:** Displays plain numbers representing the remaining quantity of each prize. No visual color coding (orange/red highlights) is used.

**4. Winner Management & Camera Sync**
- **Winners Feed:** Displays a live feed of all participants who have won physical prizes during the active day.
- **Phone Number Input:** Features an editable field next to each winner to log contact details.
- **Photo Capture & Instant TV Push:** Includes an image upload button. The hostess uses her own smartphone's camera to take a photo of the winner with their prize or upload a file. Saving the image uploads it to the server and instantly pushes it to the TV Screen's active winners marquee.
- **Image Preview & Crop (Optional):** An optional image cropping/preview modal can be enabled. If active, it allows the hostess to preview and adjust the photo before confirming the upload to the TV.

**5. Game Controls & Queue Management**
- **Game Pause:** A primary toggle button to **PAUSE** or **RESUME** the experience. 
  - **Pause Behavior:** Pausing instantly transitions the TV and iPad to their respective Idle States (with the iPad start action disabled). 
  - **Active Game Safety:** If a game is in progress when pause is triggered, the action is queued and takes effect immediately after the current player completes their game and the result is revealed.
- **Maintenance Overlay Toggle:** A secondary toggle allowing the hostess to activate the Maintenance Overlay ("Заглушка") in case of local technical issues or booth resets.
- **Strict Line Rule Interface (Conditional):**
  - *Context:* This control visibility depends on the **Strict Line Rule** setting configured in the Admin Panel.
  - *Rule ON:* After a player completes their turn, the iPad locks in its Idle State. A prominent button labeled **"Дозволити гру" (Allow Next Player)** appears on the Hostess Page. Tapping this button triggers a socket event that unlocks the iPad and transitions it to the **Name Entry State**.
  - *Rule OFF:* The "Allow Next Player" button is hidden. The iPad transitions automatically to the **Name Entry State** when the player taps "Start Over" (or after the timeout resets it).

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
The iPad Screen serves as the interactive remote control and participant registrar for the terminal experience.

**1. Persistent Branding & Layout Rules**
- **Anniversary Footer:** Every screen state on the iPad must display the Mastercard 30th Anniversary logo and localized tagline (`"30 років з Україною"` / `"30 Years in Ukraine"`) at the bottom of the layout.
- **Footer Exception (Roulette State):** The anniversary footer is temporarily hidden during the active **Roulette State (Spin Animation)** to optimize visual focus and reduce layout clutter.
- **Hidden Full Screen Toggle:** A barely visible full-screen toggle button is placed in the top right corner of the **Idle State (Welcome Screen)**. To prevent accidental exit by attendees during the event, it is hidden and can only be activated by a long-press (3 seconds) action.

**2. Detailed Screen States & User Flow**
- **Idle State (Welcome Screen / Attract Mode):**
  - *Main Message:* "Здійснили оплату Mastercard? Активуйте свій момент" *(Did you pay with Mastercard? Activate your moment)*.
  - *Call to Action:* A large, prominent button labeled "ПОЧАТИ" *(START)*.
  - *Footer:* Mastercard 30th Anniversary branding visible.
  - *Context:* This state is also displayed on the iPad when the TV is in **Variant 4 (End of Day / Hall of Fame Mode)** or in the **Maintenance State**.
- **Name Entry State (Name Input Screen):**
  - *Main Message:* "Введіть ваше ім'я" *(Enter your name)*.
  - *Form Element:* A single text input field with placeholder text. Tapping or clicking this input field must automatically focus it and display the iPad's native soft keyboard.
  - *Action Button:* Labeled "ПРОДОВЖИТИ" *(CONTINUE)*.
  - *Layout Rule:* The "ПРОДОВЖИТИ" action button must remain fully visible and interactive on the screen when the soft keyboard is open, and must not be obscured or pushed off-screen by the keyboard layout.
  - *Input Validation & Limits:*
    - **Character Limit:** Minimum of 2 characters, maximum of 20 characters.
    - **Allowed Characters:** Strictly Cyrillic and Latin alphabets, spaces, hyphens, and apostrophes. Numbers, emojis, and special symbols are blocked.
    - **Forbidden Words & Profanity Filter:** The system must check the name input against a robust, localized profanity dictionary. Names containing vulgar words, swear words, or insults (e.g., standard profanities in English and Ukrainian) must be blocked.
    - **Geopolitical & Offensive Terms Filter:** Explicitly bans derogatory, hostile, or offensive terms related to the Russian invasion, symbols of aggression, or invader-related slurs.
    - **Active State:** The "ПРОДОВЖИТИ" button remains disabled (greyed out) until the name passes all validation rules.
- **Ready State (Game Trigger Screen):**
  - *Main Message:* "НАТИСНІТЬ СТАРТ, ЩОБ ПОЧАТИ ГРУ" *(TAP START TO BEGIN THE GAME)*.
  - *Action Button:* A massive, high-contrast button labeled "СТАРТ" *(START)*.
  - *Behavior:* Tapping "СТАРТ" sends a socket event triggering the TV roulette spin and immediately transitions the iPad to the **Roulette State (Spin Animation)**.
- **Roulette State (Spin Animation):**
  - *Visuals:* An animated 3D-style vinyl record player with a tonearm placed on a spinning record, representing the game in progress.
  - *Branding:* Footer is hidden. No buttons are displayed.
  - *Behavior:* Interactive controls are locked. This state is maintained for exactly 10 seconds to match the TV screen's spin and reveal sequence.
- **Post-Game Reset Screen:**
  - *Concept:* To avoid visual mismatch and animation lag relative to the TV reveal, the iPad skips showing dedicated Winner or Prediction/Comfort screens.
  - *Visuals:* The vinyl record animation stops, and a clean **"Start Over" / "Finish"** screen is presented.
  - *Action Button:* A prominent button labeled "Завершити" *(Finish)* or "Start Over".
  - *Behavior (Direct registration loop):* When the user taps this button, the iPad immediately opens the **Name Entry State (Name Input Screen)** for the next participant, bypassing the Welcome/Attract screen to keep the queue moving.
- **On Hold / Game Paused State:**
  - *Trigger:* Initiated when the hostess pauses the game via the Hostess Page.
  - *Visuals:* A neutral, non-interactive holding screen displaying: "Гра тимчасово призупинена. Будь ласка, зачекайте..." *(Game temporarily paused. Please wait...)*.
  - *Behavior:* Automatically suspends current registration or input flows. The interface returns to the previous state once the hostess resumes.
- **Maintenance State (Disconnected / Error State Fallback):**
  - *Trigger:* Activated when the admin toggles the **Maintenance Overlay** or if the iPad encounters a WebSocket connection failure.
  - *Visuals:* Displays the standard Mastercard logo and anniversary branding overlay with a subtle message: "Система оновлюється..." *(System is updating...)*. All interactive buttons and forms are hidden.

**3. Inactivity & Safety Rules**
- **Registration Timeout:** If an attendee walks away mid-registration (during the **Name Entry State** or **Ready State**) for more than 45 seconds, a modal warning with a 10-second countdown ("Ви ще тут?" / "Are you still here?") appears. If unanswered, the iPad automatically wipes the entered name and resets to the **Idle State (Welcome Screen)**.
- **Post-Game / Name Entry Reset Timeout:** If the player walks away after the game finishes without tapping "Start Over", or if the next player leaves the iPad open on the Name Entry screen without any activity, the iPad automatically resets to the **Idle State (Welcome Screen)** after **30 seconds** of inactivity.
- **Active Game Lockout:** Once the spin command is sent, the iPad cannot be reset by any attendee action until the game resolution is logged and the TV screen's animation finishes.

**4. Sound & Audio Design (Nice-to-Have)**
- **UI Interaction:** A clean, tactile click/tap sound on buttons and keyboard presses.
- **Input Error:** A low-pitched double beep if validation blocks disallowed characters or forbidden substrings.
- **Roulette Trigger:** A classic vinyl "scratch" sound when tapping the "СТАРТ" button.
- **Spinning Ambient:** A soft, rhythmic whirring or vinyl crackle during the **Roulette State (Spin Animation)**.
- **Winner Fanfare:** A bright, uplifting copper-gold chime sequence played once the TV completes the prize reveal.
- **Prediction Chime:** A mystical, calming sound effect played once the TV reveals the prediction.
