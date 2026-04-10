# Pstryk UPS AI Dashboard

A ready-to-use Home Assistant Lovelace dashboard for the
[Pstryk UPS AI](https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI) integration.
Install the integration first, paste this dashboard YAML, and you get a complete
four-view monitoring and control UI — no manual entity wiring required.

---

## Views

| View | What it shows |
|------|--------------|
| **Overview** | Battery gauge, live power draw, current schedule mode, financial metrics, UPS controls |
| **Schedule** | AI-generated 24-hour charge/discharge/idle plan, past 3-hour history, upcoming windows |
| **Energy** | History graphs for power, battery, price, and savings; daily consumption breakdown |
| **System** | Pstryk API & Claude AI health, MQTT status, last request URL, full Claude prompt inspection |

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| Home Assistant ≥ 2023.9 | Earlier versions lack some built-in card features used here |
| [Pstryk UPS AI integration](https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI) | Must be installed and configured first |

The dashboard uses **only built-in Home Assistant cards** and works with zero extra dependencies.
Optional custom cards are documented below and improve the visual experience but are not required.

---

## Installation

### Method 1 — Raw configuration editor (simplest)

1. In Home Assistant go to **Settings → Dashboards → Add Dashboard**.
2. Choose **New empty dashboard**, give it a name (e.g. *UPS AI*), and open it.
3. Click the **Edit** pencil → three-dot menu → **Raw configuration editor**.
4. Select all existing content, delete it, and paste the contents of [`dashboard.yaml`](dashboard.yaml).
5. Click **Save**.

### Method 2 — File-based dashboard (advanced, survives UI edits)

1. Copy `dashboard.yaml` into your Home Assistant config directory, e.g.
   `config/dashboards/ups-ai.yaml`.
2. Add the following to `configuration.yaml`:

   ```yaml
   lovelace:
     mode: storage          # keep existing dashboards
     dashboards:
       ups-ai:
         mode: yaml
         title: UPS AI
         icon: mdi:battery-charging
         show_in_sidebar: true
         filename: dashboards/ups-ai.yaml
   ```

3. Restart Home Assistant.

### Method 3 — HACS custom repository

1. In HACS go to **Frontend → three-dot menu → Custom repositories**.
2. Add `https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI-Dashboard`
   with category **Lovelace**.
3. Download the repository.
4. The `dashboard.yaml` file is now available in your HA config — follow
   Method 1 or 2 above to activate it.

---

## Optional custom cards (HACS)

Install any of these from HACS **Frontend** to upgrade specific sections of the dashboard.
The dashboard works fine without them; the cards listed here replace built-in cards
with richer equivalents. Commented upgrade examples are embedded in `dashboard.yaml`.

| Card | HACS repository | Enhances |
|------|----------------|---------|
| **mini-graph-card** | `kalkih/mini-graph-card` | Energy view graphs — adds sparklines, average, min/max overlays |
| **mushroom** | `piitaya/lovelace-mushroom` | Overview entity chips — adds colour coding, animated icons, tap actions |
| **button-card** | `custom-cards/button-card` | Controls section — fully styled charge/discharge buttons with state colours |
| **apexcharts-card** | `RomRider/apexcharts-card` | Energy/price charts — candlestick, area, and multi-axis charts |

---

## Entity reference

All entities are created automatically by the Pstryk UPS AI integration.
No manual configuration or helper entities are needed.

### Sensors

| Entity ID | Description | Unit |
|-----------|-------------|------|
| `sensor.pstryk_ups_electricity_price` | Current total electricity price (TGE spot + all fees + VAT) | PLN/kWh |
| `sensor.pstryk_ups_household_power_draw` | Live household power draw | kW |
| `sensor.pstryk_ups_schedule_status` | Current scheduled action (`charge` / `discharge` / `idle`) | — |
| `sensor.pstryk_ups_next_charge_window` | Timestamp of next planned charge start | timestamp |
| `sensor.pstryk_ups_next_discharge_window` | Timestamp of next planned discharge start | timestamp |
| `sensor.pstryk_ups_battery_level` | Battery state of charge | % |
| `sensor.pstryk_ups_estimated_daily_savings` | Estimated PLN saved vs always-idle baseline | PLN |
| `sensor.pstryk_ups_pstryk_api_status` | Pstryk API reachability (`ok` / `error` / `unknown`) | — |
| `sensor.pstryk_ups_claude_api_status` | Claude AI API status (`ok` / `error` / `unknown`) | — |
| `sensor.pstryk_ups_last_pstryk_api_request_url` | Last API endpoint called | — |
| `sensor.pstryk_ups_last_claude_prompt` | Summary of the last prompt sent to Claude | — |
| `sensor.pstryk_ups_schedule_next_24h` | Structured next-24h schedule (see `slots` attribute) | — |
| `sensor.pstryk_ups_schedule_past_3h` | Structured past-3h schedule history (see `slots` attribute) | — |

### Switches

| Entity ID | Description |
|-----------|-------------|
| `switch.pstryk_ups_auto_schedule` | Enable / disable AI-driven automatic scheduling |
| `switch.pstryk_ups_ups_charging` | Manually force UPS charging on/off |
| `switch.pstryk_ups_ups_discharging` | Manually force UPS discharging on/off |

### Buttons

| Entity ID | Description |
|-----------|-------------|
| `button.pstryk_ups_refresh_prices` | Immediately fetch fresh prices and regenerate the schedule |

---

## Key attributes used by the dashboard

| Entity | Attribute | Used for |
|--------|-----------|---------|
| `sensor.pstryk_ups_battery_level` | `projected_end_level_pct` | Projected battery % at end of current window |
| `sensor.pstryk_ups_schedule_status` | `schedule`, `auto_schedule_enabled` | Full 24-h plan, AI on/off flag |
| `sensor.pstryk_ups_schedule_next_24h` | `slots` | 24-h schedule table (list of `{hour, action, price}`) |
| `sensor.pstryk_ups_schedule_past_3h` | `slots` | Past 3-h table |
| `sensor.pstryk_ups_next_charge_window` | `charge_windows` | List of upcoming charge windows |
| `sensor.pstryk_ups_next_discharge_window` | `discharge_windows` | List of upcoming discharge windows |
| `sensor.pstryk_ups_electricity_price` | `upcoming_prices`, `price_count`, `last_refresh` | Price forecast table |
| `sensor.pstryk_ups_household_power_draw` | `history_daily_entries`, `history_hourly_entries` | Daily consumption breakdown |
| `sensor.pstryk_ups_pstryk_api_status` | `last_request`, `last_error`, `mqtt_status` | Diagnostics panel |
| `sensor.pstryk_ups_claude_api_status` | `schedule_source`, `last_prompt` | AI vs heuristic fallback indicator |
| `sensor.pstryk_ups_last_claude_prompt` | `full_prompt` | Full prompt text in System view |
| `sensor.pstryk_ups_last_pstryk_api_request_url` | `full_url` | Full URL in System view |

---

## Troubleshooting

**Dashboard shows "Entity not found" or "unavailable"**
→ Make sure the Pstryk UPS AI integration is installed, configured, and has completed
at least one successful price refresh. Check **Settings → Devices & Services**.

**Schedule table is empty**
→ Click **Refresh Prices & Regenerate Schedule** on the Overview tab and wait ~30 seconds.

**"heuristic" shown as schedule source instead of "claude"**
→ The Claude AI API call failed and the integration fell back to a rule-based schedule.
Check your Anthropic API key and the Claude API status in the System view.

**Cards show "Template error"**
→ Home Assistant's template engine is strict about undefined variables. If the
integration version you're running exposes attributes with different names, the
template will gracefully show `—` or an italic fallback message rather than crashing.

---

## License

MIT — see [LICENSE](LICENSE) if present, otherwise use freely.
