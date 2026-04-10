# Pstryk UPS AI Dashboard

A ready-to-use Home Assistant Lovelace dashboard for the
[Pstryk UPS AI](https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI) integration.
Install the integration, paste the dashboard YAML, and get a complete four-view
monitoring and control UI — no manual entity wiring required.

---

## Views

| View | Contents |
|------|---------|
| **Overview** | Battery gauge · live power draw · schedule mode · price & savings tiles · UPS controls |
| **Harmonogram** | AI-generated 24-hour charge/discharge/idle plan · past 3 h · upcoming windows |
| **Energia** | History graphs (power, battery, price, savings) · daily consumption · price forecast |
| **System** | Pstryk API & Claude AI health · MQTT status · AI prompt inspection · entity inventory |

---

## Requirements

| Requirement | Notes |
|-------------|-------|
| Home Assistant ≥ 2023.9 | Required for `type: grid` card and footer buttons |
| [Pstryk UPS AI integration](https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI) | Must be installed and fully configured before loading this dashboard |

No additional HACS cards are required. Optional enhancements are listed at the end of this file.

---

## Installation

### Method 1 — Raw configuration editor (recommended)

1. In Home Assistant go to **Settings → Dashboards → Add Dashboard**.
2. Choose **New empty dashboard**, name it *UPS AI*, and open it.
3. Click the **Edit** pencil → three-dot menu → **Raw configuration editor**.
4. Select all existing content, delete it, and paste the full contents of [`dashboard.yaml`](dashboard.yaml).
5. Click **Save**.

### Method 2 — File-based dashboard (survives UI edits)

1. Copy `dashboard.yaml` to your HA config directory, e.g. `config/dashboards/ups-ai.yaml`.
2. Add to `configuration.yaml`:

   ```yaml
   lovelace:
     mode: storage
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
2. Add `https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI-Dashboard` with category **Lovelace**.
3. Download the repository, then follow Method 1 or 2 above to activate the dashboard.

---

## ⚠️ Entity ID adaptation (important)

Entity IDs created by the integration depend on **two user-specific factors**:

| Factor | Example | Effect on entity ID |
|--------|---------|-------------------|
| UPS model name (set during integration setup) | `Eaton UPS` | Becomes `eaton_ups` in every ID |
| Home Assistant language | Polish | Entity names are translated → Polish slugs in IDs |

The resulting pattern is:

```
{platform}.pstryk_ups_{ups_model_slug}_{translated_entity_name_slug}
```

The `dashboard.yaml` shipped in this repository was validated against a **Polish HA with UPS model "Eaton UPS"**.
If your setup differs, do a global find-and-replace in the file:

| Find | Replace with |
|------|-------------|
| `eaton_ups` | your model slug (e.g. `apc_smart_ups_1500`) |

To find your exact entity IDs:
1. Go to **Developer Tools → States** in Home Assistant.
2. Filter by `pstryk_ups`.
3. Copy the IDs shown and compare with the table below.

---

## Entity reference

### Sensors — Polish HA / Eaton UPS

| Friendly name | Entity ID | Unit |
|---------------|-----------|------|
| Cena energii elektrycznej | `sensor.pstryk_ups_eaton_ups_cena_energii_elektrycznej` | PLN/kWh |
| Bieżący pobór mocy | `sensor.pstryk_ups_eaton_ups_biezacy_pobor_mocy` | kW |
| Status harmonogramu | `sensor.pstryk_ups_eaton_ups_status_harmonogramu` | charge / discharge / idle |
| Następne okno ładowania | `sensor.pstryk_ups_eaton_ups_nastepne_okno_ladowania` | timestamp |
| Następne okno rozładowywania | `sensor.pstryk_ups_eaton_ups_nastepne_okno_rozladowywania` | timestamp |
| Poziom naładowania baterii | `sensor.pstryk_ups_eaton_ups_poziom_naladowania_baterii` | % |
| Szacowane oszczędności dzienne | `sensor.pstryk_ups_eaton_ups_szacowane_oszczednosci_dzienne` | PLN |
| Status API Pstryk | `sensor.pstryk_ups_eaton_ups_status_api_pstryk` | ok / error / unknown |
| Status API Claude | `sensor.pstryk_ups_eaton_ups_status_api_claude` | ok / error / unknown |
| Harmonogram – następne 24h | `sensor.pstryk_ups_eaton_ups_harmonogram_nastepne_24h` | — |
| Harmonogram – ostatnie 3h | `sensor.pstryk_ups_eaton_ups_harmonogram_ostatnie_3h` | — |

### Switches — Polish HA / Eaton UPS

| Friendly name | Entity ID |
|---------------|-----------|
| Automatyczny harmonogram | `switch.pstryk_ups_eaton_ups_automatyczny_harmonogram` |
| Ładowanie UPS | `switch.pstryk_ups_eaton_ups_ladowanie_ups` |
| Rozładowywanie UPS | `switch.pstryk_ups_eaton_ups_rozladowywanie_ups` |

### Buttons — Polish HA / Eaton UPS

| Friendly name | Entity ID |
|---------------|-----------|
| Odśwież ceny | `button.pstryk_ups_eaton_ups_odswiez_ceny` |

### Generic translation keys (English HA)

If your HA runs in English, entity IDs follow this pattern instead:

| Translation key | Expected entity ID suffix |
|----------------|--------------------------|
| `current_price` | `…_current_price` |
| `current_power` | `…_current_power` |
| `schedule_status` | `…_schedule_status` |
| `next_charge_window` | `…_next_charge_window` |
| `next_discharge_window` | `…_next_discharge_window` |
| `battery_level` | `…_battery_level` |
| `daily_savings` | `…_daily_savings` |
| `pstryk_api_status` | `…_pstryk_api_status` |
| `claude_api_status` | `…_claude_api_status` |
| `schedule_next_24h` | `…_schedule_next_24h` |
| `schedule_past_3h` | `…_schedule_past_3h` |
| `charging` (switch) | `…_charging` |
| `discharging` (switch) | `…_discharging` |
| `auto_schedule` (switch) | `…_auto_schedule` |
| `refresh_prices` (button) | `…_refresh_prices` |

---

## Key attributes

| Entity (Polish ID suffix) | Attribute | Used by dashboard for |
|--------------------------|-----------|----------------------|
| `…_poziom_naladowania_baterii` | `projected_end_level_pct` | Projected battery % at end of current window |
| `…_status_harmonogramu` | `auto_schedule_enabled` | AI on/off flag in schedule banner |
| `…_harmonogram_nastepne_24h` | `slots` | 24-hour plan table — list of `{hour, action, price}` |
| `…_harmonogram_ostatnie_3h` | `slots` | Past 3-hour table — same structure |
| `…_nastepne_okno_ladowania` | `charge_windows` | Upcoming charge windows list |
| `…_nastepne_okno_rozladowywania` | `discharge_windows` | Upcoming discharge windows list |
| `…_cena_energii_elektrycznej` | `upcoming_prices`, `price_count`, `last_refresh` | Price forecast table |
| `…_biezacy_pobor_mocy` | `history_daily_entries`, `history_hourly_entries` | Daily consumption breakdown |
| `…_status_api_pstryk` | `last_request`, `last_error`, `mqtt_status` | System diagnostics panel |
| `…_status_api_claude` | `schedule_source`, `last_prompt` | AI vs heuristic fallback indicator |

---

## Dashboard cards overview

All cards use **built-in Home Assistant card types only** — no HACS cards required.

| Card type | Used for |
|-----------|---------|
| `gauge` | Battery level with green/yellow/red severity bands |
| `entity` | Individual sensor values (mode, power, price) |
| `grid` | 1-column layout for financial metric tiles |
| `entities` | Switch controls, button, entity inventory |
| `glance` | Compact multi-sensor snapshots |
| `history-graph` | Time-series graphs for power, battery, price, savings |
| `markdown` | Jinja2-templated status summaries and schedule tables |

### How template cards work

Cards on the **Harmonogram** and **Energia** views use Jinja2 templates to read entity
states and attributes directly, without needing hardcoded entity IDs in every property:

```jinja2
{% set slots = state_attr('sensor.pstryk_ups_eaton_ups_harmonogram_nastepne_24h', 'slots') %}
{% set slots = slots if (slots is iterable and slots is not string) else [] %}
{% if slots | length > 0 %}
  ...render table...
{% endif %}
```

The `iterable` guard is required because the integration stores `0` (integer) as a
placeholder when data has not been populated yet — calling `| length` on an integer
raises a `TypeError`.

---

## Optional custom cards (HACS Frontend)

The dashboard works without these. Install to upgrade specific sections.

| Card | Repository | Improves |
|------|-----------|---------|
| **mini-graph-card** | `kalkih/mini-graph-card` | Energy graphs — sparklines, average line, min/max markers |
| **mushroom** | `piitaya/lovelace-mushroom` | Entity display — colour coding, animated icons, tap actions |
| **button-card** | `custom-cards/button-card` | Controls — styled charge/discharge buttons with live state colours |
| **apexcharts-card** | `RomRider/apexcharts-card` | Advanced charts — area, candlestick, multi-axis price/power overlay |

Commented-out upgrade examples for each card are embedded directly in `dashboard.yaml`.

---

## Troubleshooting

**"Entity not found" on all cards**
→ The integration is not installed or hasn't finished its first price refresh.
Check **Settings → Devices & Services** and confirm *Pstryk UPS AI Optimizer* is listed.

**Entity IDs don't match**
→ Your UPS model name or HA language differs from the example.
Go to **Developer Tools → States**, filter by `pstryk_ups`, and do a
find-and-replace of `eaton_ups` with your actual model slug in `dashboard.yaml`.

**Schedule table shows "Harmonogram jeszcze niedostępny"**
→ Click **Odśwież ceny i wygeneruj harmonogram** (Overview tab) and wait ~30 seconds.
The Claude AI call can take up to 20 s on first run.

**`TypeError: object of type 'int' has no len()`**
→ An attribute hasn't been populated yet and contains `0` instead of a list.
The dashboard guards against this with an `is iterable` check — if you still see this
error, the template card may be from an older version. Re-paste `dashboard.yaml`.

**"heuristic" shown as schedule source instead of "claude"**
→ The Claude AI API call failed and the integration fell back to rule-based scheduling.
Check your Anthropic API key and review the Claude API status in the **System** tab.

**Cards show "Template error" / red error banner**
→ Open **Developer Tools → Template** in HA and paste the failing template to inspect
the exact error. Most commonly caused by a mismatched entity ID.

---

## Repository structure

```
HACS-Pstryk-UPS-AI-Dashboard/
├── dashboard.yaml              # Lovelace dashboard — paste into Raw Config Editor
├── pstryk-ups-ai-dashboard.js  # HACS Lovelace plugin entry point (version banner only)
├── hacs.json                   # HACS metadata
├── info.md                     # Short description shown in HACS UI
└── README.md                   # This file
```

---

## Changelog

| Version | Changes |
|---------|---------|
| 1.3.0 | Financial metrics grid changed from 2×2 to 1×4 single column |
| 1.2.0 | Removed auto-entities dependency; restored gauge and history-graph cards with exact entity IDs |
| 1.1.0 | Added HACS compliance JS file; switched to auto-entities for model-agnostic entity discovery |
| 1.0.0 | Initial release — four views, all 15 entities, built-in cards only |

---

## License

MIT — use freely.
