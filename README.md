# CANADIAN WX HUD — v2.0.0

A cyberpunk-themed live weather monitoring dashboard for any Canadian location.
Pure HTML/CSS/JS — no build tools, no API keys, no dependencies.
Installable as a PWA on mobile. Hostable on GitHub Pages.

---

## Features

### Location Search & Geolocation
- **Search bar** with autocomplete — type any Canadian city, results from Open-Meteo Geocoding API
- **Geolocation button** — uses browser location with reverse geocoding via Nominatim
- Last-used location **persisted to localStorage** — remembered on reload
- All panels update dynamically when location changes

### 8 Live Panels

| Panel | Description |
|-------|-------------|
| **Current Conditions** | Temp, feels-like, humidity, dew point, pressure, visibility, cloud cover, UV index, animated SVG wind compass |
| **Hourly Forecast** | Bezier-curve canvas chart + scrollable 48-hour cards with snow (cm) or rain (mm) amounts |
| **7-Day Forecast** | Daily high/low, WMO condition icon, precipitation amounts, wind |
| **Live Radar / Wind Map** | Windy.com embed centered on selected location — switchable: Radar / Lightning / Wind |
| **Weather Models** | Tropical Tidbits GFS viewer link with PRECIP / TEMP / SNOW tab switcher |
| **EC Alerts** | Environment Canada alerts via GeoMet WFS — point-in-polygon filtered, expandable cards |
| **Air Quality** | US AQI canvas semicircle gauge + PM2.5, PM10, O3, CO, NO2 bars |
| **Astronomy** | Sunrise/sunset, daylight progress bar, canvas moon phase with illumination % |

### Design
- Cyberpunk dark theme — neon cyan/magenta/purple glows, scanline overlay
- Glitch title animation, HUD corner brackets, pulsing status dots
- **Orbitron** (display) + **Share Tech Mono** (data) via Google Fonts
- Auto-refreshes every **10 minutes**; manual REFRESH button with spin animation
- Live clock, last-updated timestamp

### Responsive Layout
| Breakpoint | Layout |
|-----------|--------|
| >= 1200px | 4-column grid |
| 768px - 1200px | 2-column grid |
| < 768px | Single column (alerts above current conditions) |

### PWA Support
- Installable on mobile (Android / iOS) as a standalone app
- Service worker caches app shell for offline loading
- Custom app icons (192x192, 512x512)

---

## Usage

### Local
No server required — open directly in any browser:

```bash
xdg-open "index.html"          # Linux
open "index.html"              # macOS
start "index.html"             # Windows
```

### GitHub Pages
1. Push the repo to GitHub
2. Go to **Settings > Pages > Deploy from branch > main**
3. Your app will be live at `https://<username>.github.io/<repo-name>/`

---

## File Structure

```
Weather App 2.0/
├── index.html      — Dashboard layout, search bar, PWA meta tags
├── style.css       — Cyberpunk theme, grid, animations, responsive
├── app.js          — All logic: location search, API fetchers, canvas renderers
├── manifest.json   — PWA manifest
├── sw.js           — Service worker for offline caching
├── icons/
│   ├── icon.svg    — Source icon
│   ├── icon-192.png
│   └── icon-512.png
├── README.md       — This file
├── CHANGELOG.md    — Version history
└── .gitignore
```

---

## Data Sources

| Provider | Used For | Cost |
|----------|----------|------|
| [Open-Meteo](https://open-meteo.com) | Weather forecast (current, hourly, 7-day), air quality, geocoding | Free, no key |
| [EC GeoMet WFS](https://geo.weather.gc.ca/geomet) | Weather alerts — BBOX + point-in-polygon filtering (CORS enabled) | Free, public |
| [Windy.com](https://windy.com) | Radar / lightning / wind map embed | Free embed |
| [Blitzortung.org](https://www.blitzortung.org) | Lightning strike data (via Windy overlay) | Free, community |
| [Tropical Tidbits](https://www.tropicaltidbits.com) | GFS model viewer (external link) | Free |
| [Nominatim / OSM](https://nominatim.openstreetmap.org) | Reverse geocoding for geolocation | Free |
| [Google Fonts](https://fonts.google.com) | Orbitron, Share Tech Mono | Free CDN |

---

## Weather Model

Snowfall and rainfall data uses Open-Meteo's **`gem_seamless`** — Environment Canada's own GEM model stack, automatically selected by forecast horizon:

| Range | Model | Resolution |
|-------|-------|-----------|
| 0 - 48 h | **HRDPS** | 2.5 km |
| 48 - 84 h | **RDPS** | 10 km |
| 84 - 168 h | **GDPS** | 15 km |

This gives significantly more accurate snowfall totals for Canadian locations than the GFS default.

---

## EC Alerts

Fetches active alerts from **Environment Canada's GeoMet WFS** service (`geo.weather.gc.ca`):

- Queries `ec-msc:Current-Alerts` layer with a BBOX around the user's location
- **Point-in-polygon filtering** ensures only alerts whose geographic boundary covers the exact location are shown
- No CORS proxy needed — GeoMet has `Access-Control-Allow-Origin: *`
- Alert severity mapped to EC's colour system (Grey / Yellow / Orange / Red)
- Expandable alert cards — title always visible, click to expand full details

---

## Credits

Built with [Claude Code](https://claude.ai/claude-code) by Anthropic.
