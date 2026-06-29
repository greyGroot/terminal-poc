# Mastercard Terminal Interactive Experience - WebSocket Events

### 🧭 Quick Navigation
[🖥️ Server to Client Broadcasts](#-server-to-client-broadcast-events) | [📱 iPad to Server Events](#-ipad-to-server-events) | [🖥️ TV Screen to Server Events](#-tv-screen-to-server-events) | [⚙️ Admin Panel to Server Events](#-admin-panel-to-server-events) | [👩‍💼 Hostess to Server Events](#-hostess-to-server-events)

---

## 🖥️ Server to Client Broadcast Events

| Event Name | Direction | Payload | Trigger Timing / Description |
|---|---|---|---|
| `game_result` | Server &rarr; All Clients | `{ outcome: "win" \| "prediction", prize?: string, text?: string }` | Broadcast immediately after `game_spin_trigger` is processed. The server calculates the outcome (win vs prediction fallback) and broadcasts the outcome payload to synchronize TV spins and update hostess inventory levels. |
| `game_status_changed` | Server &rarr; All Clients | `{ status: "started" \| "restarted" \| "paused" \| "ended" }` | Broadcast when the global system state changes due to admin configuration (START/RESTART), day timer completion, or hostess pause resolution. |
| `maintenance_overlay_active` | Server &rarr; All Clients | `{ active: boolean }` | Broadcast to all clients when the Admin triggers the Maintenance Overlay override to show/hide holding screens. |
| `stock_depleted_notification` | Server &rarr; All Clients | *None* | Broadcast to all clients when all physical day prizes are empty, triggering the automatic prediction-only mode override on dashboard UIs. |

---

## 📱 iPad to Server Events

| Event Name | Direction | Payload | Trigger Timing / Description |
|---|---|---|---|
| `user_began_registration` | iPad &rarr; Server | *None* | Fired when the participant taps the **"ПОЧАТИ" (START)** button on the iPad Welcome Screen. |
| `name_submitted` | iPad &rarr; Server | `{ name: string }` | Fired when the participant types their name, passes local validation/profanity check, and taps the **"ПРОДОВЖИТИ"** button. |
| `game_spin_trigger` | iPad &rarr; Server | *None* | Fired when the participant taps the giant interactive vinyl record **"СТАРТ"** button on the iPad Ready Screen. |
| `queue_start_over` | iPad &rarr; Server | *None* | Fired when the participant or hostess taps the **"Start Over" / "Finish"** button on the iPad Post-Game Reset Screen, or when the 30-second local inactivity timer expires. |

---

## 🖥️ TV Screen to Server Events

| Event Name | Direction | Payload | Trigger Timing / Description |
|---|---|---|---|
| `prize_displayed` | TV Screen &rarr; Server | *None* | Fired by the TV client application immediately after the 3D reveal animation finishes, indicating the prize or prediction details are fully displayed on screen. |

---

## ⚙️ Admin Panel to Server Events

| Event Name | Direction | Payload | Trigger Timing / Description |
|---|---|---|---|
| `set_active_day` | Admin &rarr; Server | `{ day: number }` | Fired when the admin selects a day from the active day config dropdown. |
| `maintenance_overlay_active` | Admin &rarr; Server | `{ active: boolean }` | Fired when the admin toggles the Maintenance Overlay ON/OFF switch in the dashboard. |

---

## 👩‍💼 Hostess to Server Events

| Event Name | Direction | Payload | Trigger Timing / Description |
|---|---|---|---|
| `winner_photo_upload` | Hostess &rarr; Server | `{ phone: string, image: string }` | Fired when the hostess captures the winner's photo using her smartphone camera, enters their phone number, and confirms the upload. `image` contains base64 image data or file reference. |
| `winner_details_update` | Hostess &rarr; Server | `{ phone: string }` | Fired when the hostess inputs the winner's phone number but submits without uploading a photo (e.g., if the participant declined a photo). |
| `game_pause_request` | Hostess &rarr; Server | *None* | Fired when the hostess toggles **PAUSE** on her smartphone dashboard. |
| `game_resume_request` | Hostess &rarr; Server | *None* | Fired when the hostess toggles **RESUME** on her smartphone dashboard. |
