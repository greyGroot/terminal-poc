# Mastercard Terminal - Randomizer Algorithm Specification

This document details the proposed randomizer algorithm for the Mastercard Terminal Interactive Experience. It is designed to ensure a fair, exciting event flow while strictly meeting the operational constraints of the event floor.

### 🧭 Quick Navigation
[1. Core Requirements](#1-core-requirements) | [2. Proposed Algorithm Design](#2-proposed-algorithm-design) | [3. Step-by-Step Selection Flow](#3-step-by-step-selection-flow) | [4. Example Calculations](#4-example-calculations) | [5. Edge Cases & Fail-Safes](#5-edge-cases--fail-safes) | [6. Admin Parameters & Dependencies](#6-admin-parameters--dependencies)

---

## 1. Core Requirements
- **Stock-Proportional Probability:** The probability of winning a specific prize must decrease as its remaining quantity decreases.
- **Cooldown Safeguard:** Major prizes must have a cooldown period to prevent consecutive wins and ensure rewards are spread out.
- **Guaranteed Daily Distribution:** All configured prizes for the active day must be won by the end of that day.
- **Fail-Safe Fallback:** If a spin does not award a physical prize (due to probability, cooldowns, or empty stocks), the player receives a comforting prediction message.

---

## 2. Proposed Algorithm Design
The proposed randomizer combines **Weighted Stock Selection**, **Temporal Time-Pacing Adjustment**, and **Individual Tier Cooldowns**.

### A. Base Weight Calculation (Stock-Proportional)
Each physical prize $i$ has a base weight $W_i$ directly proportional to its remaining stock $S_i$:
$$W_i = S_i$$
This mathematically guarantees that as a prize's stock decreases, its chance of being selected relative to other prizes drops.

### B. Time-Pacing Adjustment (Guaranteed Distribution)
To ensure all prizes are distributed smoothly over the day's duration $D$ (e.g., 8 hours), the server calculates a **Time-Pacing Factor ($F_{\text{pace}}$)** on every spin.

1. **Target Time Ratio ($R_{\text{time}}$):**
   $$R_{\text{time}} = \frac{t_{\text{elapsed}}}{D}$$
   *Where $t_{\text{elapsed}}$ is the elapsed time since the day started.*

2. **Actual Prize Distribution Ratio ($R_{\text{prize}}$):**
   $$R_{\text{prize}} = \frac{I_{\text{total}} - S_{\text{total}}}{I_{\text{total}}}$$
   *Where $I_{\text{total}}$ is the initial total prize stock for the day, and $S_{\text{total}}$ is the current total remaining stock.*

3. **Dynamic Win Probability ($P_{\text{win}}$):**
   The base win probability $P_{\text{base}}$ (e.g., configured by the admin as $40\%$) is adjusted dynamically:
   - **If $R_{\text{prize}} < R_{\text{time}}$ (Prizes are being won too slowly):** Increase the win probability to speed up distribution.
     $$P_{\text{win}} = P_{\text{base}} + (R_{\text{time}} - R_{\text{prize}}) \times K$$
   - **If $R_{\text{prize}} > R_{\text{time}}$ (Prizes are being won too quickly):** Decrease the win probability to slow down distribution.
     $$P_{\text{win}} = P_{\text{base}} - (R_{\text{prize}} - R_{\text{time}}) \times K$$
   *Where $K$ is a tuning sensitivity multiplier (default $K = 0.5$).*

### C. Individual Cooldown Rules
Each prize tier has a configurable cooldown duration $C_i$:
- **Major Prizes (e.g., Golden Mastercard, Earbuds):** Enforced cooldowns (e.g., 15 to 60 minutes) to prevent high-value prizes from being won back-to-back.
- **Minor/Consolation Prizes (e.g., Tickets to Museum):** Cooldown is set to 0 seconds (disabled). These high-volume items act as "buffer stock" to ensure that if a player rolls a win outcome while major prizes are cooling down, the system can still award a physical prize instead of forcing a prediction fallback.
- **Mechanism:** When a prize $i$ is won, the server saves the win timestamp $T_{\text{last}, i}$. On a spin, if:
  $$t_{\text{current}} - T_{\text{last}, i} < C_i$$
  The prize weight is temporarily forced to 0 ($W_i = 0$), making it ineligible for that roll.

---

## 3. Step-by-Step Selection Flow

- **Step 1: Check Global Fallback**
  If all physical prize stocks $S_{\text{total}} = 0$, immediately return a **Prediction Outcome** (Scenario 7).
- **Step 2: Roll for Win/Prediction Split**
  Generate a random number $r_1 \in [0, 1)$. If $r_1 \ge P_{\text{win}}$ (adjusted by time-pacing), return a **Prediction Outcome**.
- **Step 3: Filter Eligible Prizes**
  For each prize $i$ in stock:
  - If $S_i \le 0$, exclude it.
  - If the cooldown condition is active ($t_{\text{current}} - T_{\text{last}, i} < C_i$), exclude it.
- **Step 4: Resolve Winner Selection**
  - If no physical prizes are eligible (all are on cooldown), fallback and return a **Prediction Outcome**.
  - Otherwise, calculate the sum of remaining weights:
    $$\Sigma W = \sum_{i \in \text{eligible}} S_i$$
  - Roll a random number $r_2 \in [0, \Sigma W)$.
  - Iterate through the eligible prizes, accumulating weights until the sum exceeds $r_2$. Select that prize, decrement its stock ($S_i = S_i - 1$), update its cooldown timestamp $T_{\text{last}, i}$, and return a **Winner Outcome**.

---

## 4. Example Calculations

To show how the time-pacing adjustments, individual cooldowns, and stock-weighted probability resolve in real-time, consider the following active day scenario:

### Scenario Parameters
- **Event Day Duration ($D$):** 8 hours (480 minutes total).
- **Base Win Probability ($P_{\text{base}}$):** $40\%$ ($0.40$).
- **Sensitivity Multiplier ($K$):** $0.5$.
- **Initial Total Prize Stock ($I_{\text{total}}$):** 61 items.
  - *Golden Mastercard:* 1 item (Cooldown $C_1 = 60$ minutes).
  - *Earbuds:* 10 items (Cooldown $C_2 = 15$ minutes).
  - *Dinner for 2:* 20 items (Cooldown $C_3 = 10$ minutes).
  - *Ticket to Museum:* 30 items (Cooldown $C_4 = 5$ minutes).

---

### Case A: Mid-Day (Exactly on Pace)
- **Elapsed Time ($t_{\text{elapsed}}$):** 4 hours (240 minutes elapsed).
  - *Target Time Ratio:* $R_{\text{time}} = \frac{240}{480} = 0.50$ ($50\%$ of day elapsed).
- **Prizes Won:** 30 prizes distributed.
  - *Actual Prize Ratio:* $R_{\text{prize}} = \frac{30}{61} \approx 0.49$ ($49\%$ of prizes won).
- **Dynamic Probability Calculation ($P_{\text{win}}$):**
  $$P_{\text{win}} = P_{\text{base}} + (R_{\text{time}} - R_{\text{prize}}) \times K$$
  $$P_{\text{win}} = 0.40 + (0.50 - 0.49) \times 0.5 = 0.40 + 0.005 = 0.405 \text{ (or } 40.5\%)$$
- **Spin Execution:**
  1. Roll random number $r_1 \in [0, 1)$. Suppose $r_1 = 0.35$.
  2. Since $r_1 < P_{\text{win}}$ ($0.35 < 0.405$), the spin results in a **Win Outcome**.
- **Eligible Prize Weighing:**
  Assume the *Golden Mastercard* is on cooldown (last won 40 minutes ago; $40 < C_1 = 60$). It is excluded. All other tiers are off cooldown.
  - Remaining stocks and weights:
    - Earbuds: 5 remaining (Weight = 5)
    - Dinner for 2: 11 remaining (Weight = 11)
    - Ticket to Museum: 15 remaining (Weight = 15)
  - Sum of eligible weights ($\Sigma W$): $5 + 11 + 15 = 31$.
  - Roll random weight number $r_2 \in [0, 31)$. Suppose $r_2 = 12.4$.
  - Resolve selected prize:
    - Range `[0.0, 5.0)`: Earbuds
    - Range `[5.0, 16.0)`: Dinner for 2 (since $5 + 11 = 16$)
    - Range `[16.0, 31.0)`: Ticket to Museum
  - Since $r_2 = 12.4$ falls within the `[5.0, 16.0)` range, the winning outcome is **Dinner for 2** (remaining stock decreases to 10).

---

### Case B: Slow Pace (Prizes won too slowly)
- **Elapsed Time ($t_{\text{elapsed}}$):** 6 hours (360 minutes elapsed).
  - *Target Time Ratio:* $R_{\text{time}} = \frac{360}{480} = 0.75$ ($75\%$ of day elapsed).
- **Prizes Won:** Only 10 prizes distributed.
  - *Actual Prize Ratio:* $R_{\text{prize}} = \frac{10}{61} \approx 0.164$ ($16.4\%$ of prizes won).
- **Dynamic Probability Calculation ($P_{\text{win}}$):**
  $$P_{\text{win}} = P_{\text{base}} + (R_{\text{time}} - R_{\text{prize}}) \times K$$
  $$P_{\text{win}} = 0.40 + (0.75 - 0.164) \times 0.5 = 0.40 + (0.586) \times 0.5 = 0.40 + 0.293 = 0.693 \text{ (or } 69.3\%)$$
- **Outcome:** The win probability dynamically inflates to **$69.3\%$** to increase winning frequency and ensure all remaining stock is won by end of day.

---

### Case C: Fast Pace (Prizes won too quickly)
- **Elapsed Time ($t_{\text{elapsed}}$):** 2 hours (120 minutes elapsed).
  - *Target Time Ratio:* $R_{\text{time}} = \frac{120}{480} = 0.25$ ($25\%$ of day elapsed).
- **Prizes Won:** 30 prizes distributed.
  - *Actual Prize Ratio:* $R_{\text{prize}} = \frac{30}{61} \approx 0.49$ ($49\%$ of prizes won).
- **Dynamic Probability Calculation ($P_{\text{win}}$):**
  $$P_{\text{win}} = P_{\text{base}} - (R_{\text{prize}} - R_{\text{time}}) \times K$$
  $$P_{\text{win}} = 0.40 - (0.49 - 0.25) \times 0.5 = 0.40 - (0.24) \times 0.5 = 0.40 - 0.12 = 0.28 \text{ (or } 28\%)$$
- **Outcome:** The win probability dynamically drops to **$28\%$** to slow down wins and prevent the terminal from running out of prizes before the event ends.

---

## 5. Edge Cases & Fail-Safes

### A. Low Foot Traffic (Prizes remaining in final hour)
- **Problem:** If fewer people participate than expected, some prizes might remain at the end of the day.
- **Fail-Safe:** In the last $10\%$ of the day's duration (e.g., the final 48 minutes), the win probability bounds are lifted, allowing $P_{\text{win}}$ to scale up to $100\%$. If prizes are still left, individual cooldowns $C_i$ are automatically cut in half every 15 minutes to guarantee remaining stock is won.

### B. High Foot Traffic (Prizes won too early)
- **Problem:** A surge of players in the morning could drain the inventory before the afternoon.
- **Fail-Safe:** The pacing factor ($F_{\text{pace}}$) will aggressively reduce $P_{\text{win}}$ down to the $5\%$ minimum, naturally spacing out winning spins. Additionally, cooldowns are strictly enforced to prevent prize clusters.

---

## 6. Admin Parameters & Dependencies

To allow administrators to fine-tune the experience in real-time and manage key dependencies, the following settings and states should be managed directly within the Admin Panel (`/admin`):

### A. Configurable Admin Settings (Input Parameters)
- **Base Win Probability ($P_{\text{base}}$):** Baseline target percentage (e.g., $40\%$) for awarding physical prizes vs. predictions.
  - *To Increase Win Chances:* Raise $P_{\text{base}}$ (e.g., to $60\%$). This immediately lifts the baseline win probability across all spins, resulting in more physical wins.
  - *To Decrease Win Chances:* Lower $P_{\text{base}}$ (e.g., to $20\%$). This increases the frequency of prediction comfort outcomes.
- **Sensitivity Multiplier ($K$):** Tuning coefficient (e.g., $0.5$) determining how aggressively win probability adapts to time-pacing drift.
- **Session Duration ($D$):** Automatically calculated based on configured `Start Time` and `End Time` timestamps for the day.
- **Inactivity Timeouts:**
  - *iPad Form Warning:* Duration of idle time (default 45s) before triggering the "Are you still here?" prompt.
  - *iPad Auto-Reset:* Duration of idle time (default 30s) before returning to the Welcome Screen.
  - *TV Result Display:* Duration of result visibility (default 3 mins) before returning to Attract Mode.
- **Dynamic Stock Editor:** Real-time table allowing the administrator to manually override stocks ($S_i$) and cooldowns ($C_i$) on the fly.
  - *To Increase Win Chances:* Manually add prize stock quantities ($S_i$) or **decrease individual cooldown values ($C_i$)** (e.g., setting major prize cooldowns to 0). This makes more prizes eligible for selection and allows high-value prizes to be won in quick succession.
  - *To Decrease Win Chances:* Manually reduce stock levels or **increase individual cooldown values ($C_i$)** (e.g., raising Golden Mastercard cooldown to 120 minutes). This locks high-value prizes out of eligibility for longer periods, driving down the overall win frequency.

### B. Global State Dependencies
Modifying these admin values triggers cascading changes across other connected views:
- **Changing the Active Day (`set_active_day`):** Immediately invalidates current hostess cookie session caches (forcing password re-entry), resets elapsed time metrics ($t_{\text{elapsed}} = 0$), and loads the new day's initial stock.
- **State Changes (`day_status`):** Toggling status between `"started"`, `"paused"`, `"restarted"`, and `"ended"` pushes socket broadcasts to lock/unlock interactive controls (e.g., disabling iPad start triggers during pauses or switching the TV to Variant 4 Hall of Fame).
- **Restart Database Logs Isolation:** Tapping "Restart" wipes active winner queues and resets inventory stock to initial values but **never** clears visitor logs or technical error logs, protecting audit integrity.
