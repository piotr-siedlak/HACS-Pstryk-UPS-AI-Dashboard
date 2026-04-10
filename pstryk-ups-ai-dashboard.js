/**
 * pstryk-ups-ai-dashboard.js
 *
 * Companion resource file for the Pstryk UPS AI Dashboard.
 * This file satisfies the HACS Lovelace plugin requirement and prints a
 * version banner to the browser console so you can confirm the resource
 * loaded correctly.
 *
 * The actual dashboard configuration lives in dashboard.yaml — paste it
 * into the Lovelace Raw Configuration Editor to activate the dashboard.
 *
 * Compatible with: https://github.com/piotr-siedlak/HACS-Pstryk-UPS-AI
 */

const VERSION = "1.0.0";
const REPO    = "piotr-siedlak/HACS-Pstryk-UPS-AI-Dashboard";

console.info(
  `%c PSTRYK-UPS-AI-DASHBOARD %c v${VERSION} `,
  "color:#fff;background:#2196F3;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px",
  "color:#2196F3;background:#fff;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0"
);
console.info(
  `[Pstryk UPS AI Dashboard] Loaded. Dashboard YAML: https://github.com/${REPO}/blob/main/dashboard.yaml`
);
