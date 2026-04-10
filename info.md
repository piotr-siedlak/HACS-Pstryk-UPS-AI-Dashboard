# Pstryk UPS AI Dashboard

A complete four-view Lovelace dashboard for the
[Pstryk UPS AI](https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI) integration.

**Views included:**
- **Overview** — battery gauge, live power draw, schedule mode, controls
- **Schedule** — AI-generated 24-hour charge/discharge plan with price table
- **Energy** — history graphs for power, battery level, price, and savings
- **System** — API health, MQTT status, full Claude prompt inspection

Works with built-in Home Assistant cards only.
Optional enhancements: `mini-graph-card`, `mushroom`, `button-card`, `apexcharts-card`.

**Installation:** paste `dashboard.yaml` into the Lovelace Raw Configuration Editor.
See the [README](README.md) for full instructions.
