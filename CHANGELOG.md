# Changelog

All notable changes to CANADIAN WX HUD are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.2.0] — 2026-03-03

### Added
- Aurora forecast image (NOAA SWPC) in Astronomy panel below moon section
- Solar SUVI 171 image (NOAA SWPC) in Astronomy panel
- New GOES-19 Satellite panel with three tabs: GL GeoColor (default), GL IR (Band 13), Full Disk GeoColor
- Satellite images refresh on manual REFRESH and cache-bust on tab switch
- NOAA SWPC and NOAA NESDIS/GOES-19 added to data sources in README

### Changed
- Dashboard grid updated from 8 to 9 panels
- Version bumped to v2.2.0

---

## [2.1.0] — 2026-02-27

### Fixed
- EC alert colours now use `risk_colour_en` from WFS for correct EC colour mapping (red → Extreme, orange → Severe, yellow → Moderate) with `alert_type` keyword fallback
- Deprecated `apple-mobile-web-app-capable` meta tag replaced with `mobile-web-app-capable`

### Added
- Alert location display using `feature_name_en` and `province` from WFS

### Changed
- Hourly forecast reduced from 48 to 24 hours with chart legend (cyan line = Temperature, blue bars = Precip Probability)
- Tropical Tidbits TEMP button now links to 2m Temp Anomaly (`T2ma`) instead of plain 2m temp
- "OPEN FULL VIEWER" → "OPEN LINK" on Tropical Tidbits panel
- Version badge in footer now links to GitHub changelog
- Version bumped to v2.1.0

---

## [1.0.1] — 2026-02-25

### Changed

#### Panel 6 — EC Alerts
- Alert colours now sourced from `<cap:severity>` in the EC ATOM feed rather than inferred from title keywords — correctly reflects Environment Canada's three-colour system (Yellow / Orange / Red) where any alert type (warning, watch, advisory) can be any colour based on impact severity
- Special Weather Statements always render grey regardless of CAP severity (informational, below formal alert level)
- Title keyword matching retained as fallback when CAP severity is absent

---

## [1.0.0] — 2026-02-25

### Added

#### Core Dashboard
- 8-panel cyberpunk weather HUD for Orillia, Ontario (44.5903°N, 79.4214°W)
- Pure HTML/CSS/JS — no build tools, no API keys, opens directly as `index.html`
- Auto-refresh every 10 minutes via `setInterval`; manual REFRESH button
- Live clock display updating every second
- "UPDATED: HH:MM:SS" timestamp on last successful data fetch

#### Panel 1 — Current Conditions
- Temperature (°C), feels-like, weather condition with WMO emoji
- Humidity, dew point, pressure (hPa), visibility (km), cloud cover (%)
- UV index with colour-coded severity badge (Low → Extreme)
- Current precipitation (mm)
- Animated SVG wind compass with direction arrow, cardinal label, speed, and gusts

#### Panel 2 — Hourly Forecast
- Canvas bezier-curve temperature chart with gradient fill and precipitation probability bars
- Scrollable 48-hour cards: time, WMO emoji, temperature
- Precipitation display: shows ❄️ Xcm (snow/hr) or 💧 Xmm (rain/hr) when amounts ≥ 0.1; falls back to probability % for trace/dry hours
- Chart redraws on window resize

#### Panel 3 — 7-Day Forecast
- Daily rows: day name, WMO emoji, condition text, high/low temps
- Precipitation column: ❄️ Xcm for snow days, 💧 Xmm for rain days, probability % for dry/trace days
- Wind speed (km/h) and dominant direction
- Correct priority logic: `snowfall_sum` takes precedence over `precipitation_sum` (liquid-equivalent) to avoid false "mixed" displays in cold weather

#### Panel 4 — Live Radar / Wind Map
- Windy.com iframe embed centered on Orillia
- Three switchable overlays via tab buttons:
  - **RADAR** — composite precipitation radar
  - **⚡ LIGHTNING** — real-time Blitzortung strike data via Windy (`overlay=thunder`)
  - **WIND** — surface wind speed and barbs
- iframe loaded once at init; never reloaded by auto-refresh loop
- **Scroll lock guard** — transparent overlay blocks scroll-to-zoom on the map while the user is scrolling the page; click the map to unlock interaction, auto-relocks when mouse leaves the panel

#### Panel 5 — Weather Models
- Tropical Tidbits GFS viewer (NE region) — opens in new tab (site blocks iframe embedding)
- Tab buttons update the target URL: PRECIP (`mslp_pcpn`), TEMP (`temp_2m`), SNOW (`snow_dpth`)

#### Panel 6 — EC Alerts
- Environment Canada battleboard ATOM feed for Ontario Region 20 (Simcoe/Muskoka/Orillia)
- Full alert text displayed — no truncation; HTML/CDATA stripped cleanly
- "FULL ALERT ↗" link to weather.gc.ca
- Timestamp formatted to local readable date/time
- 4-proxy CORS fallback chain:
  1. `api.allorigins.win/get?url=` (JSON wrapper)
  2. `api.allorigins.win/raw?url=`
  3. `api.codetabs.com/v1/proxy?quest=`
  4. `corsproxy.io/?` (raw URL)
- Graceful "EC Feed Unavailable" state (neutral, not error) if all proxies fail
- **EC colour system** driven by CAP severity field in the ATOM feed — matches Environment Canada's official three-colour system where any alert type (warning, watch, advisory) can be any colour based on impact level:
  - 🔘 Grey — Special Weather Statement (always grey; informational, below formal alert level)
  - 🟡 Yellow — CAP severity `Moderate` or `Minor` (hazardous weather may cause damage)
  - 🟠 Orange — CAP severity `Severe` (significant damage, widespread impacts)
  - 🔴 Red — CAP severity `Extreme` (very dangerous, possibly life-threatening)
- Colour parsed from `<cap:severity>` XML element (`getElementsByTagNameNS` wildcard catches any namespace prefix); title keyword matching used as fallback when CAP data is absent
- Status dot on panel reflects the highest-severity alert present

#### Panel 7 — Air Quality
- US AQI value from Open-Meteo Air Quality API (pre-calculated `us_aqi`)
- Canvas semicircle gauge with colour-segmented arcs and needle
- Category label with matching colour: Good / Moderate / Unhealthy (SG) / Unhealthy / Very Unhealthy / Hazardous
- Pollutant bar chart: PM2.5, PM10, O₃, CO, NO₂

#### Panel 8 — Astronomy
- Sunrise and sunset times (parsed from local-time ISO strings — no UTC conversion artifacts)
- Total daylight duration (h m)
- Daylight progress bar showing current position between sunrise and sunset
- Moon phase calculated from Julian Date / synodic cycle math
- Canvas moon drawing with elliptical lit-side rendering and phase name
- Illumination percentage

#### Design System
- CSS custom properties for all colours, fonts, spacing
- Cyberpunk palette: `#090b13` base, `#00f0ff` cyan, `#ff0090` magenta, `#9d00ff` purple
- Orbitron (display) + Share Tech Mono (data) from Google Fonts
- Fixed scanline overlay with subtle flicker animation
- 8-second CSS glitch animation on dashboard title
- HUD corner brackets (4 × `position: absolute`) on every panel
- Neon box-shadow glow intensifies on panel hover
- Pulsing status dot per panel (green OK / amber warning / red error)
- Blinking "ACQUIRING SIGNAL..." loading overlay per panel
- Responsive grid: 4-col ≥ 1200px → 2-col → 1-col ≤ 768px
- Themed scrollbars: dark track, cyan thumb (WebKit + Firefox)

#### Weather Model
- Switched from Open-Meteo default (GFS-heavy) to **`gem_seamless`**
- Automatic cascade: HRDPS (2.5 km, 0–48h) → RDPS (10 km, 48–84h) → GDPS (15 km, 84–168h)
- Significantly more accurate snowfall totals for Ontario, especially Alberta Clippers and Georgian Bay/Lake Simcoe events

#### Credits Footer
- Data provider links: Open-Meteo, Environment Canada, Windy.com, Blitzortung, Tropical Tidbits
- Built with Claude Code attribution
- Version number display

---

*Built with [Claude Code](https://claude.ai/claude-code) by Anthropic*
