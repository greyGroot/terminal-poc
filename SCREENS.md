# Mastercard Terminal Interactive Experience - Screen States

### 🧭 Quick Navigation
[🖥️ TV Screen Variations (`/tv`)](#️-tv-screen-variations-tv) | [📱 iPad Controller Variations (`/ipad`)](#-ipad-controller-variations-ipad)

---

## 🖥️ TV Screen Variations (`/tv`)
The main visual showcase display, managing attract loops, user reveals, and stats.

| Screen State | Visual Description | Behavior / Controls | Triggers / Transition Events |
|---|---|---|---|
| **Maintenance Screen** | Holding screen overlay containing Mastercard and event branding logos. Interaction disabled. | Non-interactive. Keeps code assets stable in the background. | Emitted via Admin overlay ON (`maintenance_overlay_active { active: true }`), day start init, or restarts. |
| **Broke Connection Screen** | Identical to **Maintenance Screen** (holding screen overlay containing Mastercard and event branding logos). | Non-interactive. Blocks background view elements. | Instantly triggered upon WebSocket connection loss. Clears on reconnect. |
| **On Hold / Game Paused State** | Attract Screen displaying the text: "Повернемося незабаром" (I'll be back soon) on top of the glowing vinyl grid. | Non-interactive. Start actions blocked. | Triggered after active game completes and fires `tv -> server: prize_displayed`, or instantly if paused from idle. |
| **Idle State (Variant 1: Default Attract Mode)** | Glowing 3D record player grid with dynamic particles, floating waveforms, and hover-highlight nodes. | Interactive attract loop running continuously at 60fps. | Default active state. Triggered via Admin Day Start or when client queue reset finishes. |
| **Idle State (Variant 2: Promo Attract Mode)** | Alternative visual grid showing Mastercard product benefits and campaign slogans. | Runs attract animations. | Triggers randomly or after set inactivity duration while in Attract Mode. |
| **Name Entered State** | Personalized welcome banner reading: "Вітаємо, [Name]!" (Welcome, [Name]!) with floating cards. | Welcoming animation sequence. | Received immediately after user submits registration name (`name_submitted`). |
| **Roulette State (Spin Animation)** | Neon record grid highlight starts a rapid circular rotation, decelerating over 10 seconds. | Plays record-deceleration audio. Controls locked. | Triggered by user starting game (`game_spin_trigger`). |
| **TV Reveal State (3D Detaching Reveal)** | Selected vinyl record detaches, flies to the center, and rotates 360 degrees in 3D to reveal prize or prediction. | Displays win or prediction. Fires `tv -> server: prize_displayed` on end. | Fired automatically when roulette animation decelerates to its final node. |
| **Variant 4 (End of Day / Hall of Fame)** | Completed mosaic showing today's statistics, games played, prizes won, and a scrolling feed of winner photos. | Non-interactive stats display. | Triggered when day timer hits 0 or Admin forces end of day (`status: "ended"`). |

---

## 📱 iPad Controller Variations (`/ipad`)
The interactive kiosk interface placed in front of the queue, allowing registrations and inputs.

| Screen State | Visual Description | Behavior / Controls | Triggers / Transition Events |
|---|---|---|---|
| **Maintenance Screen** | Kiosk holding screen overlay showing Mastercard and client event branding. | Interaction disabled. "ПОЧАТИ" button hidden. | Triggered when active day is configured as offline, overlay is ON, or DB is restarted. |
| **Broke Connection Screen** | Identical to **Maintenance Screen** (kiosk holding screen overlay showing Mastercard and client event branding). | Disables all inputs, forms, and keyboard interaction. | Instantly triggered upon socket disconnect. Handshake restores state on reconnect. |
| **On Hold / Game Paused State** | Welcome layout showing: "Гра призупинена. Повернемося незабаром" (I'll be back soon). | All interactive start options hidden or disabled. | Resolves when active game finishes and queue is reset, or instantly when paused from idle. |
| **Idle State (Welcome Screen)** | Attract layout showing Mastercard branding, visual instructions, and a glowing interactive **"ПОЧАТИ" (START)** button. | Tapping "ПОЧАТИ" starts the participant flow. | Default state. Transitions here on load, restart, or queue reset. |
| **Name Entry State** | Input form screen containing participant name text field, native keyboard bounds, and **"ПРОДОВЖИТИ"** button. | Clicking field opens soft keyboard. Checks name for length and forbidden profanity. | Transitions here when user taps "ПОЧАТИ" on Welcome Screen (`user_began_registration`). |
| **Ready State** | Interactive control board displaying a giant vinyl record button labeled **"СТАРТ"** and prize inventory details. | Tapping record button initiates spin. | Transitions here immediately after valid name submission (`name_submitted`). |
| **Roulette State (Spin Locked Screen)** | Spin animation overlay showing locked controls and spin progress indicator. | Controls disabled. | Transitions here instantly when user taps "СТАРТ" record button (`game_spin_trigger`). |
| **Post-Game Reset Screen** | Displays result confirmation (win details or prediction comfort text) and a **"Start Over" / "Finish"** button. | Tapping "Start Over" resets the loop. 30s inactivity timeout fallback. | Transitions here automatically when TV reveal finishes. |
