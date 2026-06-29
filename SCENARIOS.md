# Mastercard Terminal Interactive Experience - Scenarios

### 🧭 Quick Navigation
[Scenario 1: Day Start](#scenario-1-day-start-game-initialization) | [Scenario 2: Win Path](#scenario-2-winner-path-prize-won) | [Scenario 3: Prediction Path](#scenario-3-prediction-path-comfort-message) | [Scenario 4: Day End](#scenario-4-day-end-wrap-up) | [Scenario 5: Connection Loss](#scenario-5-unexpected-connection-loss) | [Scenario 6: Maintenance Trigger](#scenario-6-maintenance-overlay-trigger) | [Scenario 7: All Prizes Depleted](#scenario-7-all-prizes-depleted-prediction-fallback-mode) | [Scenario 8: Game Pause](#scenario-8-game-paused-by-hostess)

---

## 🏁 Scenario 1: Day Start (Game Initialization)
This scenario details the setup lifecycle: moving the system from offline configuration, through pre-event testing, resetting to clean initial database states, and launching live production.

- **Step 1: Initial State (System Offline)**
  - **Admin Panel (`/admin`):** Admin selects active day, configures db parameters (prizes list, stock sizes, win probability %, cooldown times). Status: "Offline".
  - **WebSocket Event:** *None (HTTP API)*
  - **iPad Controller (`/ipad`):** Displays **Maintenance Screen** (logo overlay; non-interactive; "ПОЧАТИ" button hidden).
  - **TV Screen (`/tv`):** Displays **Maintenance Screen** (logo holding screen; non-interactive).
  - **Hostess Page (`/hostess`):** Hostess logs in. Can view the UI dashboard layout, stock levels, and empty/previous event logs, but **all controls, inputs, and uploads are disabled (read-only)**.
- **Step 2: Admin Starts Day**
  - **Admin Panel (`/admin`):** Admin clicks **START**. Metrics countdown timers begin. Status log: "Day started".
  - **WebSocket Event:** `server -> all: game_status_changed { status: "started" }`
  - **iPad Controller (`/ipad`):** Transitions to active **Idle State (Welcome Screen)**. Start button enabled.
  - **TV Screen (`/tv`):** Transitions to active **Idle State (Variant 1/2)**. Glowing vinyl grid runs.
  - **Hostess Page (`/hostess`):** Mobile UI unlocks. Hostess sees valid active stock counts and queue/pause controls.
- **Step 3: Pre-Game Validation / Testing**
  - **Admin Panel (`/admin`):** Dashboard records test metrics. Verifies randomizer and event logs are firing.
  - **WebSocket Event:** *Triggers standard game events (see Scenario 2 / Scenario 3 flows)*
  - **iPad Controller (`/ipad`):** Admin/hostess play a few test games to confirm iPad UI and native keyboard function.
  - **TV Screen (`/tv`):** Plays test roulette spins and reveals test outcomes on screen.
  - **Hostess Page (`/hostess`):** Hostess verifies phone logging and photo uploads using her smartphone.
- **Step 4: Day Reset (Admin clicks Restart)**
  - **Admin Panel (`/admin`):** Admin clicks **RESTART**. **DB resets:** won test prizes are returned to stock, and day's winners list is cleared. **Logs integrity:** Event Log and Technical Stats are NOT changed (preserved).
  - **WebSocket Event:** `server -> all: game_status_changed { status: "restarted" }`
  - **iPad Controller (`/ipad`):** Transitions back to **Maintenance Screen** (non-interactive).
  - **TV Screen (`/tv`):** Transitions back to **Maintenance Screen** (non-interactive).
  - **Hostess Page (`/hostess`):** Mobile controls lock again. Stock numbers reset back to initial values.
- **Step 5: Admin Starts Game (Production Live)**
  - **Admin Panel (`/admin`):** Admin clicks **START**. System enters live production. Status log: "Production game started".
  - **WebSocket Event:** `server -> all: game_status_changed { status: "started" }`
  - **iPad Controller (`/ipad`):** Transitions to active **Idle State (Welcome Screen)**. Ready for real attendees.
  - **TV Screen (`/tv`):** Transitions to active **Idle State (Variant 1/2)**. Glowing vinyl grid runs.
  - **Hostess Page (`/hostess`):** Mobile UI unlocks; ready for live floor operations.

---

## 🏆 Scenario 2: Winner Path (Prize Won)
This scenario details the end-to-end participant flow when winning a physical prize, tracing registration inputs, roulette triggers, and hostess smartphone upload integration.

- **Step 1: Initial State**
  - **iPad Controller (`/ipad`):** Displays **Idle State (Welcome Screen)**. Ready to start.
  - **WebSocket Event:** *None (System Idle)*
  - **TV Screen (`/tv`):** Displays active **Idle State (Variant 1/2)** vinyl grid.
  - **Admin Panel (`/admin`):** Dashboard active. Status: "Idle/Active".
  - **Hostess Page (`/hostess`):** Mobile page shows online connection, initial stock counts, and log history.
- **Step 2: Begin Registration**
  - **iPad Controller (`/ipad`):** User clicks **"ПОЧАТИ" (START)** button. Transitions to **Name Entry State**.
  - **WebSocket Event:** `ipad -> server: user_began_registration`
  - **TV Screen (`/tv`):** Remains in active **Idle State (Variant 1/2)**.
  - **Admin Panel (`/admin`):** Logs: `"[Time] Participant started registration on iPad."`
  - **Hostess Page (`/hostess`):** No changes.
- **Step 3: Name Submission**
  - **iPad Controller (`/ipad`):** User types name (validated, profanity blocked) and taps **"ПРОДОВЖИТИ"**. Transitions to **Ready State**.
  - **WebSocket Event:** `ipad -> server: name_submitted { name: "..." }`
  - **TV Screen (`/tv`):** Transitions to **Name Entered State** displaying personalized welcome message.
  - **Admin Panel (`/admin`):** Logs participant registration: `"[Time] Registered participant [Name]"`.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 4: Spin Trigger**
  - **iPad Controller (`/ipad`):** User taps giant **"СТАРТ"** button. Transitions to **Roulette State (Spin Locked Screen)**. Footer hidden.
  - **WebSocket Event:** `ipad -> server: game_spin_trigger`
  - **TV Screen (`/tv`):** Transitions to **Roulette State (Spin Animation)**. Starts 10-second vinyl record highlight spin.
  - **Admin Panel (`/admin`):** Increments "Games Played" metrics. Logs spin trigger.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 5: Spin & Result**
  - **iPad Controller (`/ipad`):** Plays mechanical sound. Record player animation runs. Interactive controls locked in **Roulette State (Spin Locked Screen)**.
  - **WebSocket Event:** `server -> all: game_result { outcome: "win", prize: "..." }`
  - **TV Screen (`/tv`):** Roulette sequence decelerates and stops on selected winning record (Winner Pulse).
  - **Admin Panel (`/admin`):** Randomizer selects winning physical prize based on stock & cooldown. Logs win. Decreases the amount of prize in DB.
  - **Hostess Page (`/hostess`):** Remaining stock counts update.
- **Step 6: TV Reveal & Reset Screen**
  - **TV Screen (`/tv`):** Transitions to **TV Reveal State (3D Detaching Reveal)**. Selected record detaches, flies to center, and rotates in 3D to reveal physical prize.
  - **WebSocket Event:** `tv -> server: prize_displayed`
  - **iPad Controller (`/ipad`):** Animation ends. Transitions to **Post-Game Reset Screen** displaying "Start Over" button.
  - **Admin Panel (`/admin`):** Updates winners list. Increments Winner Count metrics.
  - **Hostess Page (`/hostess`):** Winner entry appears in winners list; phone input and photo upload fields unlock.
- **Step 7: Hostess Photo Upload (Winner Photo Captured)**
  - **Hostess Page (`/hostess`):** Hostess inputs the phone number and takes the winner's photo using her smartphone camera (with optional crop preview) and submits.
  - **WebSocket Event:** `hostess -> server: winner_photo_upload { phone: "...", image: "..." }`
  - **iPad Controller (`/ipad`):** Remains on **Post-Game Reset Screen** with interactive "Start Over" button.
  - **TV Screen (`/tv`):** Left/Top Panel (Winners Board) marquee updates live showing the winner's photo and name.
  - **Admin Panel (`/admin`):** Links the phone number and the uploaded photo URL to the winner entry in the database.
- **Step 8: No Photo / Declined Photo (Alternative Outcome)**
  - **Hostess Page (`/hostess`):** Hostess inputs the winner's phone number but submits without uploading a photo (e.g., if the participant declined a photo).
  - **WebSocket Event:** `hostess -> server: winner_details_update { phone: "..." }` (no image payload is sent).
  - **iPad Controller (`/ipad`):** Remains on **Post-Game Reset Screen** with interactive "Start Over" button.
  - **TV Screen (`/tv`):** Left/Top Panel (Winners Board) marquee displays the winner's name alongside a standard default silhouette image of a person (since no custom photo is present in the database).
  - **Admin Panel (`/admin`):** Links the phone number to the winner database entry. The image field is left empty (`null`).
- **Step 9: Start Over**
  - **iPad Controller (`/ipad`):** Hostess/user taps **"Start Over" / "Finish"**. iPad immediately transitions to **Name Entry State** for next user.
  - **WebSocket Event:** `ipad -> server: queue_start_over`
  - **TV Screen (`/tv`):** Transitions back to active **Idle State (Variant 1/2)** vinyl grid.
  - **Admin Panel (`/admin`):** Logs queue reset.
  - **Hostess Page (`/hostess`):** Input fields clear.

---

## 🔮 Scenario 3: Prediction Path (Comfort Message)
This scenario details the participant flow when no physical prize is won, resulting in an inspirational/comforting prediction message displayed on the TV screen and a simplified reset trigger.

- **Step 1: Initial State**
  - **iPad Controller (`/ipad`):** Displays **Idle State (Welcome Screen)**. Ready to start.
  - **WebSocket Event:** *None (System Idle)*
  - **TV Screen (`/tv`):** Displays active **Idle State (Variant 1/2)** vinyl grid.
  - **Admin Panel (`/admin`):** Dashboard active. Status: "Idle/Active".
  - **Hostess Page (`/hostess`):** Mobile page shows online connection, stock counts, and log history.
- **Step 2: Begin Registration**
  - **iPad Controller (`/ipad`):** User clicks **"ПОЧАТИ" (START)**. Transitions to **Name Entry State**.
  - **WebSocket Event:** `ipad -> server: user_began_registration`
  - **TV Screen (`/tv`):** Remains in active **Idle State (Variant 1/2)**.
  - **Admin Panel (`/admin`):** Logs: `"[Time] Participant started registration on iPad."`
  - **Hostess Page (`/hostess`):** No changes.
- **Step 3: Name Submission**
  - **iPad Controller (`/ipad`):** User types name (validated, profanity blocked) and taps **"ПРОДОВЖИТИ"**. Transitions to **Ready State**.
  - **WebSocket Event:** `ipad -> server: name_submitted { name: "..." }`
  - **TV Screen (`/tv`):** Transitions to **Name Entered State** displaying welcome message.
  - **Admin Panel (`/admin`):** Logs: `"[Time] Registered participant [Name]"`.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 4: Spin Trigger**
  - **iPad Controller (`/ipad`):** User taps giant **"СТАРТ"** button. Transitions to **Roulette State (Spin Locked Screen)**. Footer hidden.
  - **WebSocket Event:** `ipad -> server: game_spin_trigger`
  - **TV Screen (`/tv`):** Transitions to **Roulette State (Spin Animation)**. Starts 10-second vinyl record highlight spin.
  - **Admin Panel (`/admin`):** Increments "Games Played" metrics. Logs spin trigger.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 5: Spin & Result**
  - **iPad Controller (`/ipad`):** Plays mechanical sound. Record player animation runs. Interactive controls locked in **Roulette State (Spin Locked Screen)**.
  - **WebSocket Event:** `server -> all: game_result { outcome: "prediction", text: "..." }`
  - **TV Screen (`/tv`):** Roulette sequence decelerates and stops on selected record.
  - **Admin Panel (`/admin`):** Randomizer decides prediction message. Logs outcome.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 6: TV Reveal & Reset Screen**
  - **TV Screen (`/tv`):** Transitions to **TV Reveal State (3D Detaching Reveal)**. Selected record detaches, flies to center, and rotates to reveal the motivational prediction.
  - **WebSocket Event:** `tv -> server: prize_displayed`
  - **iPad Controller (`/ipad`):** Animation ends. Transitions to **Post-Game Reset Screen** displaying "Start Over" button.
  - **Admin Panel (`/admin`):** Updates prediction statistics. Logs event description.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 7: Inactivity Timeout (Default Reset)**
  - **iPad Controller (`/ipad`):** Player walks away without tapping "Start Over". Timer counts down. iPad resets automatically to **Idle State (Welcome Screen)**.
  - **WebSocket Event:** *None (30s Local Timer)*
  - **TV Screen (`/tv`):** TV displays prediction for 3 minutes, then automatically resets to active **Idle State (Variant 1/2)**.
  - **Admin Panel (`/admin`):** Logs: `"iPad reset to Welcome Screen due to inactivity."`
  - **Hostess Page (`/hostess`):** No changes.
- **Step 8: Start Over (Alternative Reset)**
  - **iPad Controller (`/ipad`):** Hostess/user taps **"Start Over" / "Finish"** button. iPad immediately transitions to **Name Entry State** for next user.
  - **WebSocket Event:** `ipad -> server: queue_start_over`
  - **TV Screen (`/tv`):** Transitions back to active **Idle State (Variant 1/2)** vinyl grid.
  - **Admin Panel (`/admin`):** Logs queue reset.
  - **Hostess Page (`/hostess`):** Input fields clear.

---

## 🌇 Scenario 4: Day End / Wrap-Up
This scenario details what happens when the play time runs out or the admin forces the Day End (Variant 4) to display the Hall of Fame.

- **Step 1: Time Limit Expires / Forced End**
  - **Admin Panel (`/admin`):** Day timer hits 0 or Admin toggles **FORCE END OF DAY**. Day logs closed.
  - **WebSocket Event:** `server -> all: game_status_changed { status: "ended" }`
  - **iPad Controller (`/ipad`):** Transitions to **Idle State (Welcome Screen)**. "ПОЧАТИ" button disabled.
  - **TV Screen (`/tv`):** Transitions to **Variant 4 (End of Day / Hall of Fame)** mosaic.
  - **Hostess Page (`/hostess`):** Stock displays locked. "Allow Next Player" control hidden.
- **Step 2: New Day Setup**
  - **Admin Panel (`/admin`):** Admin selects next day from dropdown. Resets prize stocks and winner feed.
  - **WebSocket Event:** `admin -> server: set_active_day { day: 2 }`
  - **iPad Controller (`/ipad`):** Remains in **Idle State (Welcome Screen)**.
  - **TV Screen (`/tv`):** Remains in **Variant 4 (End of Day / Hall of Fame)** displaying the completed day's Hall of Fame.
  - **Hostess Page (`/hostess`):** Hostess session cache invalidated. Prompts for password to access Day 2.

---

## 🔌 Scenario 5: Unexpected Connection Loss
Details how the system fails safely without exposing browser crashes or operating system alerts when network connectivity fails.

- **Step 1: iPad Offline**
  - **WebSocket Event:** *WebSocket Disconnect*
  - **iPad Controller (`/ipad`):** Instantly falls back to **Broke Connection Screen** (visually identical to Maintenance Screen; logo, interaction disabled).
  - **TV Screen (`/tv`):** TV remains active in its previous state (unless it also disconnected).
  - **Hostess Page (`/hostess`):** Hostess connection badge turns Red; warning modal blocks input.
  - **Admin Panel (`/admin`):** Logs error: "iPad connection lost".
- **Step 2: TV Offline**
  - **WebSocket Event:** *WebSocket Disconnect*
  - **iPad Controller (`/ipad`):** Remains active (unless it also disconnected).
  - **TV Screen (`/tv`):** Instantly falls back to **Broke Connection Screen** (visually identical to Maintenance Screen; logo holding screen; non-interactive).
  - **Hostess Page (`/hostess`):** Hostess page displays TV connection warning.
  - **Admin Panel (`/admin`):** Logs error: "TV Screen connection lost".
- **Step 3: Connection Restored**
  - **WebSocket Event:** *WebSocket Reconnect*
  - **iPad Controller (`/ipad`):** Re-auth handshake completes. Restores previous active state.
  - **TV Screen (`/tv`):** Handshake completes. Restores active **Idle State (Variant 1/2)** vinyl grid.
  - **Hostess Page (`/hostess`):** Warning modal disappears. Connection badge turns Green.
  - **Admin Panel (`/admin`):** Logs event: "Screens reconnected successfully".

---

## 🛠️ Scenario 6: Maintenance Overlay Trigger
Details the deployment override scenario when the admin triggers the overlay holding screen to perform safe app updates.

- **Step 1: Toggle Overlay ON**
  - **Admin Panel (`/admin`):** Admin toggles **MAINTENANCE OVERLAY** to ON in the Admin Panel dashboard.
  - **WebSocket Event:** `server -> all: maintenance_overlay_active { active: true }`
  - **iPad Controller (`/ipad`):** Instantly transitions to **Maintenance Screen**. All start controls hidden.
  - **TV Screen (`/tv`):** Instantly transitions to **Maintenance Screen**.
  - **Hostess Page (`/hostess`):** Hostess page displays: "System under maintenance".
- **Step 2: Code Refresh**
  - **Admin Panel (`/admin`):** Developers push update and reload server.
  - **WebSocket Event:** *None*
  - **iPad Controller (`/ipad`):** Reloads code safely in background while holding screen stays stable.
  - **TV Screen (`/tv`):** Reloads code safely in background while holding screen stays stable.
  - **Hostess Page (`/hostess`):** PWA reconnects to WebSocket in background.
- **Step 3: Toggle Overlay OFF**
  - **Admin Panel (`/admin`):** Admin toggles **MAINTENANCE OVERLAY** to OFF in the Admin Panel.
  - **WebSocket Event:** `server -> all: maintenance_overlay_active { active: false }`
  - **iPad Controller (`/ipad`):** Returns to active **Idle State (Welcome Screen)**.
  - **TV Screen (`/tv`):** Returns to active **Idle State (Variant 1/2)** vinyl grid.
  - **Hostess Page (`/hostess`):** Hostess page dashboard unlocked.

---

## 🎁 Scenario 7: All Prizes Depleted (Prediction Fallback Mode)
Details the experience flow when all physical prize stocks for the active day hit 0. The system automatically shifts into a fail-safe "Prediction-Only" mode.

- **Step 1: Inventory Depletion Trigger**
  - **Admin Panel (`/admin`):** The last physical prize is claimed. All prize stock levels hit 0. The dashboard warning banner updates: `"Prediction Fallback Mode Active (Stocks Empty)"`.
  - **WebSocket Event:** `server -> all: stock_depleted_notification`
  - **iPad Controller (`/ipad`):** Remains active and on active **Idle State (Welcome Screen)**.
  - **TV Screen (`/tv`):** Remains active showing winners marquee and vinyl grid in **Idle State (Variant 1/2)**.
  - **Hostess Page (`/hostess`):** Mobile inventory indicators update to show `0` for all physical prizes. Warning header displays: `"Prediction mode active"`.
- **Step 2: Participant Registration**
  - **iPad Controller (`/ipad`):** A new participant clicks **"ПОЧАТИ" (START)**, inputs name, and taps **"ПРОДОВЖИТИ"**. (Transitions to **Name Entry State**).
  - **WebSocket Event:** `ipad -> server: user_began_registration` followed by `name_submitted { name: "..." }`
  - **TV Screen (`/tv`):** Transitions to **Name Entered State** welcome message.
  - **Admin Panel (`/admin`):** Logs participant registration: `"[Time] Registered participant [Name] (Forced prediction fallback)"`.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 3: Spin Trigger**
  - **iPad Controller (`/ipad`):** Participant taps giant **"СТАРТ"** button. Transitions to **Roulette State (Spin Locked Screen)**.
  - **WebSocket Event:** `ipad -> server: game_spin_trigger`
  - **TV Screen (`/tv`):** Transitions to **Roulette State (Spin Animation)**. Starts record highlight spin.
  - **Admin Panel (`/admin`):** Increments games played. Server automatically selects a prediction outcome since physical prize stocks are depleted.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 4: Result & TV Reveal**
  - **iPad Controller (`/ipad`):** Plays deceleration sounds. Animation ends. Transitions to **Post-Game Reset Screen** showing "Start Over" button.
  - **WebSocket Event:** `server -> all: game_result { outcome: "prediction", text: "..." }` followed by `tv -> server: prize_displayed`
  - **TV Screen (`/tv`):** Transitions to **TV Reveal State (3D Detaching Reveal)**. Selected record detaches, flies to center, and rotates to reveal the motivational prediction.
  - **Admin Panel (`/admin`):** Increments prediction statistics count in logs.
  - **Hostess Page (`/hostess`):** No changes.
- **Step 5: Reset Loop**
  - **iPad Controller (`/ipad`):** Participant taps **"Start Over" / "Finish"** (or local 30s timeout triggers). iPad immediately transitions to **Name Entry State** for the next user.
  - **WebSocket Event:** `ipad -> server: queue_start_over` (or local 30s timeout event)
  - **TV Screen (`/tv`):** Transitions back to active **Idle State (Variant 1/2)** vinyl grid.
  - **Admin Panel (`/admin`):** Logs queue reset.
  - **Hostess Page (`/hostess`):** Input fields clear.

---

## ⏸️ Scenario 8: Game Paused (by Hostess)
Covers the hostess pausing the queue to process a winner, manage crowd congestion, or address floor issues.

- **Step 1: Pause Trigger (In Game)**
  - **Hostess Page (`/hostess`):** Hostess toggles **PAUSE** on smartphone dashboard during an active roulette spin or registration.
  - **WebSocket Event:** `hostess -> server: game_pause_request`
  - **iPad Controller (`/ipad`):** Game session continues normally without interruption in **Roulette State (Spin Locked Screen)**. Participant can still spin the roulette.
  - **TV Screen (`/tv`):** Roulette spin and reveal animations complete normally on TV screen.
  - **Admin Panel (`/admin`):** Shows pause status queued: "Pause queued (Active game in progress)".
- **Step 2: TV Reveal & Queue Pause Hook**
  - **TV Screen (`/tv`):** Transitions to **TV Reveal State (3D Detaching Reveal)**. Selected record detaches, flies to center, and rotates to reveal the prize or prediction.
  - **WebSocket Event:** `tv -> server: prize_displayed` (fired from TV once the reveal animation is finished).
  - **iPad Controller (`/ipad`):** Remains on the **Post-Game Reset Screen** displaying the "Start Over" button.
  - **Admin Panel (`/admin`):** Receives reveal completion signal, blocks the launch of new registrations, and prepares pause transition.
  - **Hostess Page (`/hostess`):** Mobile status dashboard shows: "Pause pending game completion". Phone and photo fields remain active.
- **Step 3: Pause Resolution (Start Over or Timeout)**
  - **Trigger:** Player or hostess taps **"Start Over"** on the iPad, OR the 30-second inactivity timer expires.
  - **WebSocket Event:** `ipad -> server: queue_start_over` (or local 30s timeout event) followed by `server -> all: game_status_changed { status: "paused" }`
  - **iPad Controller (`/ipad`):** Tapping "Start Over" or waiting for timeout does NOT transition to the Name Entry input. Instead, the iPad transitions directly to the **On Hold / Game Paused State** displaying the message "Гра призупинена. Повернемося незабаром" (I'll be back soon) with start buttons disabled.
  - **TV Screen (`/tv`):** Transitions back to **On Hold / Game Paused State** displaying the message "Повернемося незабаром" (I'll be back soon) on top of the glowing vinyl grid.
  - **Hostess Page (`/hostess`):** Dashboard status indicator turns yellow: "PAUSED". Input fields clear.
  - **Admin Panel (`/admin`):** Dashboard status indicator turns yellow: "PAUSED".
- **Step 4: Pause Trigger (From Idle State)**
  - **Hostess Page (`/hostess`):** Hostess toggles **PAUSE** on smartphone dashboard while the system is in active **Idle State**.
  - **WebSocket Event:** `hostess -> server: game_pause_request` followed by `server -> all: game_status_changed { status: "paused" }`
  - **iPad Controller (`/ipad`):** Transitions instantly to **On Hold / Game Paused State** ("I'll be back soon" message; start button disabled).
  - **TV Screen (`/tv`):** Transitions instantly to **On Hold / Game Paused State** ("Повернемося незабаром").
  - **Admin Panel (`/admin`):** Dashboard status indicator turns yellow: "PAUSED".
- **Step 5: Game Resumed**
  - **Hostess Page (`/hostess`):** Hostess toggles **RESUME** on smartphone dashboard. Dashboard status turns green: "ACTIVE".
  - **WebSocket Event:** `hostess -> server: game_resume_request` followed by `server -> all: game_status_changed { status: "started" }`
  - **iPad Controller (`/ipad`):** Transitions back to active **Idle State (Welcome Screen)**, start button enabled.
  - **TV Screen (`/tv`):** Transitions back to active **Idle State (Variant 1/2)**. Glowing vinyl grid runs.
  - **Admin Panel (`/admin`):** Dashboard status turns green: "ACTIVE".
