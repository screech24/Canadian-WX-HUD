/* ============================================================
   CYBERPUNK WEATHER HUD — app.js
   Canadian WX HUD — Pure HTML/CSS/JS, no build tools
   ============================================================ */

'use strict';

/* ============================================================
   1. WMO WEATHER CODE MAP
   ============================================================ */
const WMO_CODES = {
  0:  { day: { text: 'Clear Sky',           emoji: '☀️'  }, night: { text: 'Clear Sky',           emoji: '🌙' } },
  1:  { day: { text: 'Mainly Clear',        emoji: '🌤️' }, night: { text: 'Mainly Clear',        emoji: '🌤️' } },
  2:  { day: { text: 'Partly Cloudy',       emoji: '⛅' }, night: { text: 'Partly Cloudy',       emoji: '⛅' } },
  3:  { day: { text: 'Overcast',            emoji: '☁️'  }, night: { text: 'Overcast',            emoji: '☁️' } },
  45: { day: { text: 'Foggy',               emoji: '🌫️' }, night: { text: 'Foggy',               emoji: '🌫️' } },
  48: { day: { text: 'Icy Fog',             emoji: '🌫️' }, night: { text: 'Icy Fog',             emoji: '🌫️' } },
  51: { day: { text: 'Light Drizzle',       emoji: '🌦️' }, night: { text: 'Light Drizzle',       emoji: '🌧️' } },
  53: { day: { text: 'Drizzle',             emoji: '🌦️' }, night: { text: 'Drizzle',             emoji: '🌧️' } },
  55: { day: { text: 'Heavy Drizzle',       emoji: '🌧️' }, night: { text: 'Heavy Drizzle',       emoji: '🌧️' } },
  56: { day: { text: 'Freezing Drizzle',    emoji: '🌨️' }, night: { text: 'Freezing Drizzle',    emoji: '🌨️' } },
  57: { day: { text: 'Heavy Frz Drizzle',   emoji: '🌨️' }, night: { text: 'Heavy Frz Drizzle',   emoji: '🌨️' } },
  61: { day: { text: 'Light Rain',          emoji: '🌦️' }, night: { text: 'Light Rain',          emoji: '🌧️' } },
  63: { day: { text: 'Rain',                emoji: '🌧️' }, night: { text: 'Rain',                emoji: '🌧️' } },
  65: { day: { text: 'Heavy Rain',          emoji: '🌧️' }, night: { text: 'Heavy Rain',          emoji: '🌧️' } },
  66: { day: { text: 'Freezing Rain',       emoji: '🌨️' }, night: { text: 'Freezing Rain',       emoji: '🌨️' } },
  67: { day: { text: 'Heavy Frz Rain',      emoji: '🌨️' }, night: { text: 'Heavy Frz Rain',      emoji: '🌨️' } },
  71: { day: { text: 'Light Snow',          emoji: '🌨️' }, night: { text: 'Light Snow',          emoji: '🌨️' } },
  73: { day: { text: 'Snow',                emoji: '❄️'  }, night: { text: 'Snow',                emoji: '❄️' } },
  75: { day: { text: 'Heavy Snow',          emoji: '❄️'  }, night: { text: 'Heavy Snow',          emoji: '❄️' } },
  77: { day: { text: 'Snow Grains',         emoji: '🌨️' }, night: { text: 'Snow Grains',         emoji: '🌨️' } },
  80: { day: { text: 'Light Showers',       emoji: '🌦️' }, night: { text: 'Light Showers',       emoji: '🌧️' } },
  81: { day: { text: 'Showers',             emoji: '🌧️' }, night: { text: 'Showers',             emoji: '🌧️' } },
  82: { day: { text: 'Heavy Showers',       emoji: '⛈️' }, night: { text: 'Heavy Showers',       emoji: '⛈️' } },
  85: { day: { text: 'Snow Showers',        emoji: '🌨️' }, night: { text: 'Snow Showers',        emoji: '🌨️' } },
  86: { day: { text: 'Heavy Snow Showers',  emoji: '❄️'  }, night: { text: 'Heavy Snow Showers',  emoji: '❄️' } },
  95: { day: { text: 'Thunderstorm',        emoji: '⛈️' }, night: { text: 'Thunderstorm',        emoji: '⛈️' } },
  96: { day: { text: 'T-Storm w/ Hail',     emoji: '⛈️' }, night: { text: 'T-Storm w/ Hail',     emoji: '⛈️' } },
  99: { day: { text: 'T-Storm Heavy Hail',  emoji: '⛈️' }, night: { text: 'T-Storm Heavy Hail',  emoji: '⛈️' } },
};

/* ============================================================
   2. CONFIG
   ============================================================ */
const CONFIG = {
  lat:  null,
  lon:  null,
  locationName: null,
  timezone: 'auto',

  weatherUrl: () =>
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${CONFIG.lat}&longitude=${CONFIG.lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `precipitation,weather_code,cloud_cover,pressure_msl,` +
    `wind_speed_10m,wind_direction_10m,wind_gusts_10m,` +
    `visibility,uv_index,is_day,dew_point_2m` +
    `&hourly=temperature_2m,precipitation_probability,precipitation,snowfall,` +
    `weather_code,wind_speed_10m,wind_direction_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
    `sunrise,sunset,uv_index_max,precipitation_sum,snowfall_sum,` +
    `precipitation_probability_max,wind_speed_10m_max,` +
    `wind_direction_10m_dominant` +
    `&timezone=${encodeURIComponent(CONFIG.timezone)}&forecast_days=7&wind_speed_unit=kmh` +
    `&models=gem_seamless`,

  aqUrl: () =>
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${CONFIG.lat}&longitude=${CONFIG.lon}` +
    `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi` +
    `&timezone=${encodeURIComponent(CONFIG.timezone)}`,

  refreshInterval: 600000, // 10 minutes

  windyUrl: () =>
    `https://embed.windy.com/embed2.html?lat=${CONFIG.lat}&lon=${CONFIG.lon}&zoom=9&level=surface&overlay=radar&product=ecmwf&menu=&message=true&calendar=now&pressure=true&type=map&detail=false&detailLat=${CONFIG.lat}&detailLon=${CONFIG.lon}&metricWind=km%2Fh&metricTemp=%C2%B0C`,

  ttUrl: (pkg) => `https://www.tropicaltidbits.com/analysis/models/?model=gfs&region=ne&pkg=${pkg}`,
};

/* ============================================================
   3. STATE
   ============================================================ */
const STATE = {
  lastUpdated:  null,
  refreshTimer: null,
  isRefreshing: false,
  weatherData:  null,
  aqData:       null,
  currentModelPkg: 'mslp_pcpn',
  searchDebounce: null,
  searchResults: [],
  activeResultIdx: -1,
  locationReady: false,
};

/* ============================================================
   3a. LOCATION MANAGEMENT
   ============================================================ */

function setLocation(lat, lon, name, timezone) {
  // Track whether this is a genuinely new location (not just a reload)
  const locationChanged = CONFIG.lat !== lat || CONFIG.lon !== lon;

  CONFIG.lat = lat;
  CONFIG.lon = lon;
  CONFIG.locationName = name;
  CONFIG.timezone = timezone || 'auto';
  STATE.locationReady = true;

  // Update header location tag
  const tag = document.getElementById('location-tag');
  if (tag) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    tag.textContent = `${Math.abs(lat).toFixed(4)}°${latDir} / ${Math.abs(lon).toFixed(4)}°${lonDir} — ${name}`;
  }

  // Persist to localStorage
  try {
    localStorage.setItem('wxhud_location', JSON.stringify({ lat, lon, name, timezone }));
  } catch (_) {}

  // Only reload Windy iframe when the location actually changes
  // (avoids re-triggering geolocation prompts on page refresh)
  if (locationChanged) {
    updateWindyIframe();
  }
}

function loadSavedLocation() {
  try {
    const saved = localStorage.getItem('wxhud_location');
    if (saved) {
      const loc = JSON.parse(saved);
      if (loc.lat != null && loc.lon != null) {
        // Set config without triggering Windy reload (locationChanged will be true
        // since CONFIG.lat starts as null, so setLocation will call updateWindyIframe)
        setLocation(loc.lat, loc.lon, loc.name, loc.timezone);
        return true;
      }
    }
  } catch (_) {}
  return false;
}

function updateWindyIframe() {
  if (CONFIG.lat == null) return;
  const iframe = document.getElementById('windy-iframe');
  if (iframe) {
    iframe.src = CONFIG.windyUrl();
  }
}

/* ============================================================
   3b. LOCATION SEARCH (Open-Meteo Geocoding)
   ============================================================ */

async function searchLocations(query) {
  if (!query || query.length < 2) {
    hideSearchResults();
    return;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json&country_code=CA`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();

    STATE.searchResults = (data.results || []).map(r => ({
      lat: r.latitude,
      lon: r.longitude,
      name: r.name,
      admin1: r.admin1 || '',
      country: r.country || 'Canada',
      timezone: r.timezone || 'auto',
    }));

    renderSearchResults();
  } catch (e) {
    console.warn('Geocoding search failed:', e.message);
  }
}

function renderSearchResults() {
  const container = document.getElementById('search-results');
  if (!container) return;

  if (STATE.searchResults.length === 0) {
    container.innerHTML = '<div class="search-no-results">NO RESULTS FOUND</div>';
    container.classList.add('visible');
    return;
  }

  STATE.activeResultIdx = -1;
  container.innerHTML = STATE.searchResults.map((r, i) => `
    <div class="search-result-item" data-idx="${i}" onclick="selectSearchResult(${i})">
      <span class="search-result-name">${r.name}</span>
      <span class="search-result-detail">${r.admin1 ? r.admin1 + ', ' : ''}${r.country} — ${r.lat.toFixed(2)}°, ${r.lon.toFixed(2)}°</span>
    </div>
  `).join('');
  container.classList.add('visible');
}

function hideSearchResults() {
  const container = document.getElementById('search-results');
  if (container) {
    container.classList.remove('visible');
    STATE.searchResults = [];
    STATE.activeResultIdx = -1;
  }
}

function selectSearchResult(idx) {
  const r = STATE.searchResults[idx];
  if (!r) return;

  const displayName = r.admin1 ? `${r.name}, ${r.admin1}` : r.name;
  setLocation(r.lat, r.lon, displayName.toUpperCase(), r.timezone);

  // Update search input and close dropdown
  const input = document.getElementById('search-input');
  if (input) input.value = displayName;
  hideSearchResults();

  // Fetch all data for the new location
  refreshAll();
}

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', () => {
    clearTimeout(STATE.searchDebounce);
    STATE.searchDebounce = setTimeout(() => {
      searchLocations(input.value.trim());
    }, 300);
  });

  input.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.search-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      STATE.activeResultIdx = Math.min(STATE.activeResultIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('active', i === STATE.activeResultIdx));
      items[STATE.activeResultIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      STATE.activeResultIdx = Math.max(STATE.activeResultIdx - 1, 0);
      items.forEach((el, i) => el.classList.toggle('active', i === STATE.activeResultIdx));
      items[STATE.activeResultIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (STATE.activeResultIdx >= 0) {
        selectSearchResult(STATE.activeResultIdx);
      } else if (items.length > 0) {
        selectSearchResult(0);
      }
    } else if (e.key === 'Escape') {
      hideSearchResults();
      input.blur();
    }
  });

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('search-wrap');
    if (wrap && !wrap.contains(e.target)) {
      hideSearchResults();
    }
  });
}

/* ============================================================
   3c. BROWSER GEOLOCATION
   ============================================================ */

async function requestGeolocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  const btn = document.getElementById('geo-btn');
  if (btn) btn.classList.add('locating');

  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      });
    });

    const { latitude: lat, longitude: lon } = pos.coords;

    // Reverse geocode to get city name
    let name = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`
      );
      // Open-Meteo geocoding doesn't support reverse geocoding, so use a reverse approach
      // Use nominatim for reverse geocoding
      const revRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (revRes.ok) {
        const revData = await revRes.json();
        const addr = revData.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
        const prov = addr.state || addr.province || '';
        if (city) {
          name = prov ? `${city}, ${prov}` : city;
        }
      }
    } catch (_) {}

    setLocation(lat, lon, name.toUpperCase(), 'auto');

    const input = document.getElementById('search-input');
    if (input) input.value = name;
    hideSearchResults();

    refreshAll();
  } catch (err) {
    let msg = 'Could not get your location.';
    if (err.code === 1) msg = 'Location permission denied. Please allow location access.';
    else if (err.code === 2) msg = 'Location unavailable. Please try searching instead.';
    else if (err.code === 3) msg = 'Location request timed out. Please try again.';
    alert(msg);
  } finally {
    if (btn) btn.classList.remove('locating');
  }
}

/* ============================================================
   4. UTILITIES
   ============================================================ */
function wmoToText(code, isDay = true) {
  const entry = WMO_CODES[code];
  if (!entry) return 'Unknown';
  return isDay ? entry.day.text : entry.night.text;
}

function wmoToEmoji(code, isDay = true) {
  const entry = WMO_CODES[code];
  if (!entry) return '🌡️';
  return isDay ? entry.day.emoji : entry.night.emoji;
}

// EC alert colour tiers — uses CAP severity as primary source.
// Environment Canada's colour system: Yellow / Orange / Red (any alert type can be any colour).
// CAP severity values: Extreme → Red, Severe → Orange, Moderate → Yellow,
//                      Minor → Blue, Unknown/empty → Grey
// Special Weather Statements are always grey (informational, below formal alert level).
function getAlertTier(title, capSeverity) {
  const t   = (title || '').toLowerCase();
  const sev = (capSeverity || '').toLowerCase();

  // Special Weather Statement overrides everything — always grey
  if (t.includes('special weather statement'))
    return { cls: 'tier-sws', dot: '', icon: 'ℹ️' };

  // CAP severity is the authoritative colour source
  if (sev === 'extreme')  return { cls: 'tier-extreme',  dot: 'error',   icon: '🚨' };
  if (sev === 'severe')   return { cls: 'tier-warning',  dot: 'error',   icon: '⚠' };
  if (sev === 'moderate') return { cls: 'tier-watch',    dot: 'warning', icon: '⚠' };
  if (sev === 'minor')    return { cls: 'tier-advisory', dot: 'warning', icon: 'ℹ️' };

  // Fallback: infer from title keywords when CAP severity is absent
  if (t.includes('emergency'))  return { cls: 'tier-extreme',  dot: 'error',   icon: '🚨' };
  if (t.includes('warning'))    return { cls: 'tier-warning',  dot: 'error',   icon: '⚠' };
  if (t.includes('watch'))      return { cls: 'tier-watch',    dot: 'warning', icon: '⚠' };
  if (t.includes('advisory'))   return { cls: 'tier-advisory', dot: 'warning', icon: 'ℹ️' };

  // Default grey for anything unclassified
  return { cls: 'tier-sws', dot: '', icon: 'ℹ️' };
}

function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function degToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function uvIndexLabel(uv) {
  if (uv <= 2)  return { label: 'LOW',       color: '#00ff88' };
  if (uv <= 5)  return { label: 'MODERATE',  color: '#ffcc00' };
  if (uv <= 7)  return { label: 'HIGH',       color: '#ff8800' };
  if (uv <= 10) return { label: 'VERY HIGH', color: '#ff3333' };
  return              { label: 'EXTREME',    color: '#9d00ff' };
}

function aqiCategory(aqi) {
  if (aqi <= 50)  return { label: 'GOOD',            color: '#00ff88' };
  if (aqi <= 100) return { label: 'MODERATE',        color: '#ffcc00' };
  if (aqi <= 150) return { label: 'UNHEALTHY (SG)',  color: '#ff8800' };
  if (aqi <= 200) return { label: 'UNHEALTHY',       color: '#ff3333' };
  if (aqi <= 300) return { label: 'VERY UNHEALTHY',  color: '#9d00ff' };
  return                 { label: 'HAZARDOUS',       color: '#7e0023' };
}

function formatTime12(isoStr) {
  // Parse time from ISO-like string without timezone conversion
  // e.g. "2025-02-24T07:15" -> "7:15 AM"
  const timePart = isoStr.includes('T') ? isoStr.split('T')[1] : isoStr;
  const [hStr, mStr] = timePart.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function parseLocalTime(isoStr) {
  // Returns a Date from a local-time string (no timezone offset)
  // "2025-02-24T07:15" -> Date with local-time values
  const [datePart, timePart] = isoStr.split('T');
  const [y, mo, d] = datePart.split('-').map(Number);
  const [h, mi]    = (timePart || '00:00').split(':').map(Number);
  return new Date(y, mo - 1, d, h, mi, 0);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function dayName(isoDate) {
  const [y, mo, d] = isoDate.split('-').map(Number);
  const dt = new Date(y, mo - 1, d);
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  return days[dt.getDay()];
}

/* ============================================================
   5. MOON MODULE
   ============================================================ */
function getMoonPhase(date) {
  // Julian Date calculation
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;
  const JDN = d + Math.floor((153 * M + 2) / 5) + 365 * Y +
              Math.floor(Y / 4) - Math.floor(Y / 100) +
              Math.floor(Y / 400) - 32045;
  const JD = JDN - 0.5 + (date.getHours() + date.getMinutes() / 60) / 24;

  // Synodic cycle reference: Jan 6, 2000 was new moon (JD 2451549.5)
  const synodicPeriod = 29.53058867;
  const newMoonRef    = 2451549.5;
  const daysSince     = JD - newMoonRef;
  const cycle         = ((daysSince % synodicPeriod) + synodicPeriod) % synodicPeriod;
  const phase         = cycle / synodicPeriod; // 0=new, 0.5=full, 1=new

  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  let name, emoji;
  if      (phase < 0.0625) { name = 'New Moon';        emoji = '🌑'; }
  else if (phase < 0.1875) { name = 'Waxing Crescent'; emoji = '🌒'; }
  else if (phase < 0.3125) { name = 'First Quarter';   emoji = '🌓'; }
  else if (phase < 0.4375) { name = 'Waxing Gibbous';  emoji = '🌔'; }
  else if (phase < 0.5625) { name = 'Full Moon';        emoji = '🌕'; }
  else if (phase < 0.6875) { name = 'Waning Gibbous';  emoji = '🌖'; }
  else if (phase < 0.8125) { name = 'Last Quarter';    emoji = '🌗'; }
  else if (phase < 0.9375) { name = 'Waning Crescent'; emoji = '🌘'; }
  else                     { name = 'New Moon';        emoji = '🌑'; }

  return { phase, illumination, name, emoji };
}

function drawMoonCanvas(canvas, moonData) {
  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  const cx   = W / 2;
  const cy   = H / 2;
  const r    = Math.min(cx, cy) - 2;
  const { phase, illumination } = moonData;

  ctx.clearRect(0, 0, W, H);

  // Dark moon disc
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a1a';
  ctx.fill();
  ctx.strokeStyle = 'rgba(157,0,255,0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Lit portion — elliptical rendering
  // phase: 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter
  const isWaxing = phase < 0.5;
  const cyclePhase = phase <= 0.5 ? phase * 2 : (phase - 0.5) * 2; // 0..1 within half
  // ellipse x-scale: -1 (full dark side) to +1 (full lit side)
  // at 0 (new): left half dark, right half dark -> no lit
  // at 0.25 (first quarter): right half lit
  // at 0.5 (full): all lit

  const litGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  litGradient.addColorStop(0,   'rgba(240,230,180,0.95)');
  litGradient.addColorStop(0.7, 'rgba(200,190,140,0.8)');
  litGradient.addColorStop(1,   'rgba(180,170,120,0.6)');

  // Draw using clip path approach
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (illumination > 0.02) {
    ctx.fillStyle = litGradient;

    if (illumination > 0.97) {
      // Full moon
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw lit half + ellipse terminator
      const xScale = Math.cos(Math.PI * phase * 2); // -1..1

      ctx.beginPath();
      // Left or right semicircle lit?
      if (isWaxing) {
        // Right half lit (waxing: new->full)
        ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); // right arc top to bottom
        ctx.ellipse(cx, cy, Math.abs(xScale) * r, r, 0, Math.PI / 2, -Math.PI / 2, xScale > 0);
      } else {
        // Left half lit (waning: full->new)
        ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2); // left arc bottom to top
        ctx.ellipse(cx, cy, Math.abs(xScale) * r, r, 0, -Math.PI / 2, Math.PI / 2, xScale < 0);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();

  // Subtle crater texture (decorative dots)
  const craters = [
    { x: 0.3, y: -0.2, s: 0.08 },
    { x: -0.3, y: 0.1, s: 0.06 },
    { x: 0.1, y: 0.35, s: 0.05 },
  ];
  ctx.globalAlpha = 0.12;
  for (const c of craters) {
    ctx.beginPath();
    ctx.arc(cx + c.x * r, cy + c.y * r, c.s * r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Outer glow ring
  const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.15);
  glow.addColorStop(0, 'rgba(157,0,255,0.15)');
  glow.addColorStop(1, 'rgba(157,0,255,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();
}

/* ============================================================
   6. CANVAS RENDERERS
   ============================================================ */

/* --- Hourly Temperature Chart --- */
function drawHourlyChart(canvas, hours) {
  const ctx   = canvas.getContext('2d');
  const W     = canvas.width;
  const H     = canvas.height;
  const padL  = 36;
  const padR  = 12;
  const padT  = 14;
  const padB  = 24;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  ctx.clearRect(0, 0, W, H);

  if (!hours || hours.length < 2) return;

  const temps   = hours.map(h => h.temp);
  const precips = hours.map(h => h.precipProb);
  const minT    = Math.min(...temps) - 2;
  const maxT    = Math.max(...temps) + 2;
  const range   = maxT - minT || 1;

  const xOf = (i) => padL + (i / (hours.length - 1)) * plotW;
  const yOf = (t) => padT + plotH - ((t - minT) / range) * plotH;

  // Background grid lines
  ctx.strokeStyle = 'rgba(0,240,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
  }

  // Precip probability bars (background)
  for (let i = 0; i < hours.length; i++) {
    const pct = (precips[i] || 0) / 100;
    if (pct > 0) {
      const bw  = plotW / hours.length * 0.7;
      const bx  = xOf(i) - bw / 2;
      const bh  = plotH * pct;
      const by  = padT + plotH - bh;
      ctx.fillStyle = `rgba(0,150,255,${0.15 + pct * 0.2})`;
      ctx.fillRect(bx, by, bw, bh);
    }
  }

  // Gradient fill under curve
  const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
  grad.addColorStop(0,   'rgba(0,240,255,0.3)');
  grad.addColorStop(0.6, 'rgba(0,240,255,0.06)');
  grad.addColorStop(1,   'rgba(0,240,255,0)');

  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(temps[0]));
  for (let i = 1; i < hours.length; i++) {
    const cpx = (xOf(i - 1) + xOf(i)) / 2;
    ctx.bezierCurveTo(cpx, yOf(temps[i - 1]), cpx, yOf(temps[i]), xOf(i), yOf(temps[i]));
  }
  ctx.lineTo(xOf(hours.length - 1), padT + plotH);
  ctx.lineTo(xOf(0), padT + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Temperature curve line
  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(temps[0]));
  for (let i = 1; i < hours.length; i++) {
    const cpx = (xOf(i - 1) + xOf(i)) / 2;
    ctx.bezierCurveTo(cpx, yOf(temps[i - 1]), cpx, yOf(temps[i]), xOf(i), yOf(temps[i]));
  }
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00f0ff';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Y-axis labels
  ctx.fillStyle = 'rgba(180,220,240,0.5)';
  ctx.font = '9px "Share Tech Mono", monospace';
  ctx.textAlign = 'right';
  const tempStep = (maxT - minT) / 2;
  for (let i = 0; i <= 2; i++) {
    const t = minT + tempStep * i;
    ctx.fillText(Math.round(t) + '°', padL - 4, yOf(t) + 3);
  }

  // Hour labels on x-axis (every 6 hours)
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(180,220,240,0.4)';
  ctx.font = '8px "Share Tech Mono", monospace';
  for (let i = 0; i < hours.length; i += 6) {
    ctx.fillText(hours[i].label, xOf(i), H - 4);
  }

  // Legend (top-right corner)
  const legX = padL + plotW - 110;
  const legY = padT + 2;
  ctx.font = '8px "Share Tech Mono", monospace';
  ctx.textAlign = 'left';

  // Cyan line — Temperature
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(legX, legY + 4);
  ctx.lineTo(legX + 14, legY + 4);
  ctx.stroke();
  ctx.fillStyle = 'rgba(180,220,240,0.6)';
  ctx.fillText('TEMP', legX + 18, legY + 7);

  // Blue bar — Precip Probability
  ctx.fillStyle = 'rgba(0,150,255,0.35)';
  ctx.fillRect(legX + 56, legY, 14, 8);
  ctx.fillStyle = 'rgba(180,220,240,0.6)';
  ctx.fillText('PRECIP %', legX + 74, legY + 7);
}

/* --- AQI Semicircle Gauge --- */
function drawAqiGauge(canvas, aqiValue) {
  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;
  const cx  = W / 2;
  const cy  = H * 0.78;
  const r   = Math.min(W, H * 1.5) * 0.38;

  ctx.clearRect(0, 0, W, H);

  const startAngle = Math.PI;
  const endAngle   = 2 * Math.PI;

  // Color segments: Good/Moderate/USG/Unhealthy/VeryUnhealthy/Hazardous
  const segments = [
    { max: 50,  color: '#00ff88' },
    { max: 100, color: '#ffcc00' },
    { max: 150, color: '#ff8800' },
    { max: 200, color: '#ff3333' },
    { max: 300, color: '#9d00ff' },
    { max: 500, color: '#7e0023' },
  ];
  const totalAqi = 500;

  // Draw arc segments
  let prevAngle = startAngle;
  for (const seg of segments) {
    const segFrac = seg.max / totalAqi;
    const nextAngle = startAngle + segFrac * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, r, prevAngle, nextAngle);
    ctx.arc(cx, cy, r * 0.6, nextAngle, prevAngle, true);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(cx, cy, r, prevAngle, nextAngle);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = 6;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;

    prevAngle = nextAngle;
  }

  // Needle
  const clampedAqi = clamp(aqiValue || 0, 0, 500);
  const needleFrac = clampedAqi / 500;
  const needleAngle = startAngle + needleFrac * Math.PI;
  const nx = cx + Math.cos(needleAngle) * r * 0.75;
  const ny = cy + Math.sin(needleAngle) * r * 0.75;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(nx, ny);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#ffffff';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

/* ============================================================
   7. API FETCHERS
   ============================================================ */

async function fetchWeather() {
  const url = CONFIG.weatherUrl();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather HTTP ${res.status}`);
  const data = await res.json();
  STATE.weatherData = data;
  renderCurrent(data);
  renderHourly(data);
  renderDaily(data);
  renderAstronomy(data);
}

async function fetchAirQuality() {
  const url = CONFIG.aqUrl();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AQ HTTP ${res.status}`);
  const data = await res.json();
  STATE.aqData = data;
  renderAirQuality(data);
}

async function fetchAlerts() {
  // Use EC GeoMet WFS — has CORS enabled, no proxy needed.
  // Query Current-Alerts layer with a BBOX around the user's location.
  // Then do point-in-polygon filtering to only show alerts that actually
  // cover the user's exact location (BBOX alone returns nearby regions too).
  const lat = CONFIG.lat;
  const lon = CONFIG.lon;
  const delta = 0.8;
  const bbox = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`;

  const wfsUrl =
    `https://geo.weather.gc.ca/geomet?SERVICE=WFS&VERSION=2.0.0` +
    `&REQUEST=GetFeature&TYPENAME=ec-msc:Current-Alerts&COUNT=50` +
    `&BBOX=${bbox}`;

  try {
    const res = await fetch(wfsUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`GeoMet WFS HTTP ${res.status}`);

    const xmlText = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');

    if (xml.querySelector('parsererror') || xml.querySelector('ExceptionReport')) {
      throw new Error('GeoMet WFS returned error or unparseable XML');
    }

    const members = Array.from(xml.querySelectorAll('member'));
    const seen = new Set();

    const alerts = members
      .map(m => {
        const get = (tag) => {
          const el = m.getElementsByTagNameNS('*', tag)[0];
          return el ? el.textContent.trim() : '';
        };

        const id = get('id');
        if (!id || seen.has(id)) return null;

        // Point-in-polygon check: extract all polygons for this alert
        // and verify the user's location falls inside at least one.
        const polygons = Array.from(m.getElementsByTagNameNS('*', 'posList'));
        if (polygons.length > 0) {
          let insideAny = false;
          for (const posListEl of polygons) {
            const ring = parseGMLPosList(posListEl.textContent);
            if (ring.length >= 3 && pointInPolygon(lat, lon, ring)) {
              insideAny = true;
              break;
            }
          }
          if (!insideAny) return null; // alert doesn't cover this location
        }

        seen.add(id);

        const alertType   = get('alert_type');
        const alertName   = get('alert_name_en');
        const alertText   = get('alert_text_en');
        const pubDate     = get('publication_datetime');
        const riskColour  = (get('risk_colour_en') || '').toLowerCase();
        const featureName = get('feature_name_en');
        const province    = get('province');

        // Use EC's risk_colour_en as the authoritative colour source
        let capSeverity = '';
        if (riskColour === 'red')          capSeverity = 'Extreme';
        else if (riskColour === 'orange')  capSeverity = 'Severe';
        else if (riskColour === 'yellow')  capSeverity = 'Moderate';
        else {
          // Fallback: infer from alert_type when risk_colour_en is absent
          if (alertType === 'warning')        capSeverity = 'Severe';
          else if (alertType === 'watch')     capSeverity = 'Moderate';
          else if (alertType === 'advisory')  capSeverity = 'Minor';
          else if (alertType === 'statement') capSeverity = '';
        }

        // Build title with EC colour prefix: e.g. "YELLOW WARNING - Cold warning"
        let displayTitle = alertName ? alertName.charAt(0).toUpperCase() + alertName.slice(1) : 'Weather Alert';
        if (riskColour && alertType) {
          const colourWord = riskColour.toUpperCase();
          const typeWord   = alertType.toUpperCase();
          // Only prepend if the alert name doesn't already include the colour
          if (!displayTitle.toLowerCase().includes(riskColour)) {
            displayTitle = `${colourWord} ${typeWord} — ${displayTitle}`;
          }
        }

        return {
          title:       displayTitle,
          summary:     alertText,
          updated:     pubDate,
          link:        'https://weather.gc.ca/warnings/index_e.html',
          capSeverity: capSeverity,
          area:        featureName || '',
          province:    province || '',
        };
      })
      .filter(a => a !== null);

    console.log(`EC alerts: ${alerts.length} active via GeoMet WFS (point-in-polygon filtered)`);
    renderAlerts(alerts);
  } catch (e) {
    console.warn('EC GeoMet WFS failed:', e.message);
    renderAlertsUnavailable();
  }
}

// Parse GML posList "lat1 lon1 lat2 lon2 ..." into [{lat, lon}, ...]
function parseGMLPosList(text) {
  const nums = text.trim().split(/\s+/).map(Number);
  const ring = [];
  // GML posList with srsName EPSG:4326 is lat lon pairs
  for (let i = 0; i < nums.length - 1; i += 2) {
    ring.push({ lat: nums[i], lon: nums[i + 1] });
  }
  return ring;
}

// Ray-casting point-in-polygon test
function pointInPolygon(testLat, testLon, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i].lat, xi = ring[i].lon;
    const yj = ring[j].lat, xj = ring[j].lon;
    if (((yi > testLat) !== (yj > testLat)) &&
        (testLon < (xj - xi) * (testLat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function renderAlertsUnavailable() {
  const el = document.getElementById('body-alerts');
  el.innerHTML = `
    <div class="alerts-none" style="color:var(--text-dim)">
      <div class="alerts-none-icon" style="font-size:1.6rem;opacity:0.5">📡</div>
      <div class="alerts-none-text" style="color:var(--text-dim)">EC FEED UNAVAILABLE<br><span style="font-size:0.55rem;opacity:0.7">Check weather.gc.ca directly</span></div>
    </div>
  `;
  setLoading('alerts', false);
  setStatusDot('status-alerts', '');  // neutral — no dot color
}

/* ============================================================
   8. RENDERERS
   ============================================================ */

function renderCurrent(data) {
  const c   = data.current;
  const cu  = data.current_units;
  const isDay = c.is_day === 1;

  const emoji  = wmoToEmoji(c.weather_code, isDay);
  const desc   = wmoToText(c.weather_code, isDay);
  const uv     = uvIndexLabel(c.uv_index || 0);
  const compass = degToCompass(c.wind_direction_10m);
  const visKm  = ((c.visibility || 0) / 1000).toFixed(1);

  const el = document.getElementById('body-current');
  el.innerHTML = `
    <div class="current-main">
      <div class="current-icon">${emoji}</div>
      <div class="current-temp-block">
        <div class="current-temp">${Math.round(c.temperature_2m)}°C</div>
        <div class="current-feels">FEELS LIKE ${Math.round(c.apparent_temperature)}°C</div>
        <div class="current-desc">${desc.toUpperCase()}</div>
      </div>
    </div>

    <div class="current-grid">
      <div class="data-row">
        <span class="data-label">HUMIDITY</span>
        <span class="data-value">${c.relative_humidity_2m}%</span>
      </div>
      <div class="data-row">
        <span class="data-label">DEW POINT</span>
        <span class="data-value">${Math.round(c.dew_point_2m)}°C</span>
      </div>
      <div class="data-row">
        <span class="data-label">PRESSURE</span>
        <span class="data-value">${Math.round(c.pressure_msl)} hPa</span>
      </div>
      <div class="data-row">
        <span class="data-label">VISIBILITY</span>
        <span class="data-value">${visKm} km</span>
      </div>
      <div class="data-row">
        <span class="data-label">CLOUD COVER</span>
        <span class="data-value">${c.cloud_cover}%</span>
      </div>
      <div class="data-row">
        <span class="data-label">UV INDEX</span>
        <span class="data-value">
          <span class="uv-badge" style="background:${uv.color}20;color:${uv.color};border:1px solid ${uv.color}40">
            ${c.uv_index || 0} ${uv.label}
          </span>
        </span>
      </div>
      <div class="data-row">
        <span class="data-label">PRECIP</span>
        <span class="data-value">${c.precipitation} mm</span>
      </div>
      <div class="data-row">
        <span class="data-label">GUSTS</span>
        <span class="data-value">${Math.round(c.wind_gusts_10m)} km/h</span>
      </div>
    </div>

    <div class="wind-block">
      ${buildWindCompassSVG(c.wind_direction_10m, compass)}
      <div class="wind-info">
        <div class="wind-speed">${Math.round(c.wind_speed_10m)} <small style="font-size:0.55em">km/h</small></div>
        <div class="wind-details">FROM ${compass} (${c.wind_direction_10m}°)</div>
        <div class="wind-details">GUSTS ${Math.round(c.wind_gusts_10m)} km/h</div>
      </div>
    </div>
  `;

  setLoading('current', false);
  setStatusDot('status-current', 'ok');
}

function buildWindCompassSVG(deg, compass) {
  return `
    <svg class="wind-compass" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" class="compass-ring"/>
      <text x="40" y="10" text-anchor="middle" class="compass-label">N</text>
      <text x="40" y="74" text-anchor="middle" class="compass-label">S</text>
      <text x="8"  y="44" text-anchor="middle" class="compass-label">W</text>
      <text x="72" y="44" text-anchor="middle" class="compass-label">E</text>
      <g transform="rotate(${deg}, 40, 40)">
        <polygon points="40,12 44,40 40,50 36,40" class="compass-arrow"/>
        <polygon points="40,68 44,40 40,50 36,40" class="compass-arrow" style="opacity:0.3"/>
      </g>
      <text x="40" y="44" text-anchor="middle" class="compass-dir">${compass}</text>
    </svg>
  `;
}

function renderHourly(data) {
  const times    = data.hourly.time;
  const temps    = data.hourly.temperature_2m;
  const pProb    = data.hourly.precipitation_probability;
  const precipH  = data.hourly.precipitation;   // mm/hr liquid
  const snowH    = data.hourly.snowfall;         // cm/hr
  const codes    = data.hourly.weather_code;
  const wspd     = data.hourly.wind_speed_10m;

  // Find start index (current hour)
  const now      = new Date();
  const nowStr   = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:00`;
  let startIdx   = times.findIndex(t => t >= nowStr);
  if (startIdx < 0) startIdx = 0;

  const slice = 24;
  const hours = [];
  for (let i = startIdx; i < Math.min(startIdx + slice, times.length); i++) {
    const t    = times[i];
    const h    = parseInt(t.split('T')[1].split(':')[0], 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h % 12 || 12;
    hours.push({
      time:       t,
      label:      `${h12}${ampm}`,
      temp:       temps[i],
      precipProb: pProb[i] || 0,
      precip:     precipH[i] || 0,
      snow:       snowH[i] || 0,
      code:       codes[i],
      wind:       Math.round(wspd[i] || 0),
    });
  }

  STATE.hourlySlice = hours;

  // Canvas chart
  const canvas = document.getElementById('hourly-chart');
  canvas.width = canvas.parentElement.clientWidth - 20;
  drawHourlyChart(canvas, hours);

  // Hour cards — show amounts when meaningful, probability when trace/dry
  const cards = document.getElementById('hourly-cards');
  cards.innerHTML = hours.map(h => {
    let precipDisplay, precipCls;
    if (h.snow >= 0.1) {
      precipDisplay = `❄️${h.snow.toFixed(1)}cm`;
      precipCls = 'precip-snow';
    } else if (h.precip >= 0.1) {
      precipDisplay = `💧${h.precip.toFixed(1)}mm`;
      precipCls = 'precip-rain';
    } else {
      precipDisplay = `${h.precipProb}%💧`;
      precipCls = '';
    }
    return `
      <div class="hour-card">
        <div class="hour-time">${h.label}</div>
        <div class="hour-icon">${wmoToEmoji(h.code)}</div>
        <div class="hour-temp">${Math.round(h.temp)}°</div>
        <div class="hour-precip ${precipCls}">${precipDisplay}</div>
      </div>
    `;
  }).join('');

  setLoading('hourly', false);
  setStatusDot('status-hourly', 'ok');
}

function renderDaily(data) {
  const d   = data.daily;
  const el  = document.getElementById('body-daily');

  const rows = d.time.map((date, i) => {
    const hi      = Math.round(d.temperature_2m_max[i]);
    const lo      = Math.round(d.temperature_2m_min[i]);
    const pPct    = d.precipitation_probability_max[i] || 0;
    const precipMm = d.precipitation_sum[i] || 0;
    const snowCm   = d.snowfall_sum[i] || 0;
    const wSpd    = Math.round(d.wind_speed_10m_max[i] || 0);
    const wDir    = degToCompass(d.wind_direction_10m_dominant[i] || 0);
    const emoji   = wmoToEmoji(d.weather_code[i]);
    const desc    = wmoToText(d.weather_code[i]);
    const day     = i === 0 ? 'TODAY' : (i === 1 ? 'TOMORROW' : dayName(date));

    // precipitation_sum is liquid-equivalent total (includes melted snow),
    // so snow always takes priority — no mixed display needed.
    let precipLabel, precipClass;
    if (snowCm >= 0.1) {
      precipLabel = `❄️ ${snowCm.toFixed(1)}cm`;
      precipClass = 'precip-snow';
    } else if (precipMm >= 0.1) {
      precipLabel = `💧 ${precipMm.toFixed(1)}mm`;
      precipClass = 'precip-rain';
    } else {
      precipLabel = `💧${pPct}%`;
      precipClass = '';
    }

    return `
      <div class="daily-row">
        <span class="daily-day">${day}</span>
        <span class="daily-icon">${emoji}</span>
        <span class="daily-desc">${desc.toUpperCase()}</span>
        <span class="daily-temps">
          <span class="temp-hi">${hi}°</span>
          <span style="color:rgba(180,220,240,0.3)"> / </span>
          <span class="temp-lo">${lo}°</span>
        </span>
        <span class="daily-precip ${precipClass}">${precipLabel}</span>
        <span class="daily-wind">${wSpd}km/h ${wDir}</span>
      </div>
    `;
  }).join('');

  el.innerHTML = rows;
  setLoading('daily', false);
  setStatusDot('status-daily', 'ok');
}

function renderAlerts(alerts) {
  const el = document.getElementById('body-alerts');

  if (!alerts || alerts.length === 0) {
    el.innerHTML = `
      <div class="alerts-none">
        <div class="alerts-none-icon">✅</div>
        <div class="alerts-none-text">NO ACTIVE ALERTS<br>FOR ${CONFIG.locationName || 'SELECTED AREA'}</div>
      </div>
    `;
    setStatusDot('status-alerts', 'ok');
  } else {
    // Determine highest-severity tier present for the status dot
    const tierPriority = { 'tier-extreme': 4, 'tier-warning': 3, 'tier-watch': 2, 'tier-advisory': 1, 'tier-sws': 0 };
    const tiers = alerts.map(a => getAlertTier(a.title, a.capSeverity));
    const highestTier = tiers.reduce((best, t) => (tierPriority[t.cls] > tierPriority[best.cls] ? t : best), tiers[0]);

    el.innerHTML = alerts.map(a => {
      const tier = getAlertTier(a.title, a.capSeverity);

      // Strip HTML from summary and convert line breaks to <br>
      const cleanBody = stripHtml(a.summary)
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('<br>');

      // Format the updated timestamp
      let timeDisplay = '';
      if (a.updated) {
        // ISO: "2025-02-24T17:00:00Z" or RFC822: "Tue, 24 Feb 2025 17:00:00 +0000"
        try {
          const d = new Date(a.updated);
          if (!isNaN(d.getTime())) {
            timeDisplay = d.toLocaleString('en-CA', {
              month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
              timeZoneName: 'short',
            });
          }
        } catch (_) {}
      }

      return `
        <div class="alert-item ${tier.cls}">
          <div class="alert-header" onclick="this.parentElement.classList.toggle('expanded')">
            <div class="alert-title-wrap">
              <div class="alert-title">${tier.icon} ${a.title}</div>
              ${a.area ? `<div class="alert-area">${a.area}${a.province ? ', ' + a.province : ''}</div>` : ''}
            </div>
            ${timeDisplay ? `<div class="alert-time">${timeDisplay}</div>` : ''}
            <span class="alert-chevron">▾</span>
          </div>
          <div class="alert-detail">
            ${cleanBody ? `<div class="alert-body">${cleanBody}</div>` : ''}
            ${a.link ? `<a class="alert-link" href="${a.link}" target="_blank" rel="noopener noreferrer">FULL ALERT ↗</a>` : ''}
          </div>
        </div>
      `;
    }).join('');

    setStatusDot('status-alerts', highestTier.dot || 'ok');
  }

  setLoading('alerts', false);
}

function renderAirQuality(data) {
  const c   = data.current;
  const aqi = c.us_aqi ?? 0;
  const cat = aqiCategory(aqi);

  const el  = document.getElementById('body-aqi');

  const pollutants = [
    { label: 'PM2.5', value: c.pm2_5,            unit: 'µg/m³', max: 150 },
    { label: 'PM10',  value: c.pm10,              unit: 'µg/m³', max: 250 },
    { label: 'O₃',    value: c.ozone,             unit: 'µg/m³', max: 200 },
    { label: 'CO',    value: (c.carbon_monoxide || 0) / 1000, unit: 'mg/m³', max: 15 },
    { label: 'NO₂',   value: c.nitrogen_dioxide,  unit: 'µg/m³', max: 200 },
  ];

  el.innerHTML = `
    <div class="aqi-main">
      <canvas id="aqi-gauge" width="160" height="90"></canvas>
      <div class="aqi-value-display">
        <div class="aqi-number" style="color:${cat.color};text-shadow:0 0 16px ${cat.color}40">${Math.round(aqi)}</div>
        <div class="aqi-category" style="color:${cat.color}">${cat.label}</div>
      </div>
    </div>
    <div class="pollutant-bars">
      ${pollutants.map(p => {
        const val  = p.value ?? 0;
        const pct  = Math.min(100, (val / p.max) * 100);
        return `
          <div class="pollutant-row">
            <span class="pollutant-label">${p.label}</span>
            <div class="pollutant-bar-wrap">
              <div class="pollutant-bar-fill" style="width:${pct.toFixed(1)}%"></div>
            </div>
            <span class="pollutant-val">${typeof val === 'number' ? val.toFixed(1) : '--'}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Draw gauge after DOM insert
  requestAnimationFrame(() => {
    const gaugeCanvas = document.getElementById('aqi-gauge');
    if (gaugeCanvas) drawAqiGauge(gaugeCanvas, aqi);
  });

  setLoading('aqi', false);
  setStatusDot('status-aqi', aqi <= 100 ? 'ok' : aqi <= 150 ? 'warning' : 'error');
}

function renderAstronomy(data) {
  const today     = data.daily;
  const sunrise   = today.sunrise[0];
  const sunset    = today.sunset[0];
  const srDate    = parseLocalTime(sunrise);
  const ssDate    = parseLocalTime(sunset);
  const now       = new Date();

  // Daylight duration
  const totalMs   = ssDate - srDate;
  const elapsedMs = clamp(now - srDate, 0, totalMs);
  const pct       = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 0;

  const totalHrs  = totalMs / 3600000;
  const hh        = Math.floor(totalHrs);
  const mm        = Math.round((totalHrs - hh) * 60);

  // Moon
  const moon = getMoonPhase(now);

  const el = document.getElementById('body-astronomy');
  el.innerHTML = `
    <div class="astro-grid">
      <div class="astro-data">
        <div class="astro-row">
          <span class="astro-label">🌅 SUNRISE</span>
          <span class="astro-value">${formatTime12(sunrise)}</span>
        </div>
        <div class="astro-row">
          <span class="astro-label">🌇 SUNSET</span>
          <span class="astro-value">${formatTime12(sunset)}</span>
        </div>
        <div class="astro-row">
          <span class="astro-label">☀️ DAYLIGHT</span>
          <span class="astro-value">${hh}h ${mm}m</span>
        </div>

        <div class="daylight-bar-wrap">
          <div class="daylight-bar-label">
            <span>${formatTime12(sunrise)}</span>
            <span>${formatTime12(sunset)}</span>
          </div>
          <div class="daylight-bar">
            <div class="daylight-fill" style="width:${pct.toFixed(1)}%"></div>
          </div>
        </div>

        <div class="moon-section">
          <div class="moon-canvas-wrap">
            <canvas id="moon-canvas" width="64" height="64"></canvas>
          </div>
          <div class="moon-info">
            <div class="moon-phase-name">${moon.emoji} ${moon.name.toUpperCase()}</div>
            <div class="moon-illumination">ILLUMINATION: ${Math.round(moon.illumination * 100)}%</div>
          </div>
        </div>
      </div>

      <div class="astro-image-section">
        <div class="astro-image-label">AURORA FORECAST</div>
        <img class="astro-image" src="https://services.swpc.noaa.gov/experimental/images/aurora_dashboard/tonights_static_viewline_forecast.png?t=${Date.now()}" alt="Aurora Forecast">
      </div>

      <div class="astro-image-section">
        <div class="astro-image-label">SOLAR ACTIVITY — SUVI 171</div>
        <img class="astro-image" src="https://services.swpc.noaa.gov/images/animations/suvi/primary/171/latest.png?t=${Date.now()}" alt="Solar SUVI 171">
      </div>
    </div>
  `;

  // Draw moon after DOM insert
  requestAnimationFrame(() => {
    const moonCanvas = document.getElementById('moon-canvas');
    if (moonCanvas) drawMoonCanvas(moonCanvas, moon);
  });

  setLoading('astronomy', false);
  setStatusDot('status-astronomy', 'ok');
}

/* ============================================================
   9. UI HELPERS
   ============================================================ */

function setLoading(panelId, isLoading) {
  const el = document.getElementById(`loading-${panelId}`);
  if (!el) return;
  if (isLoading) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function setStatusDot(dotId, state) {
  const el = document.getElementById(dotId);
  if (!el) return;
  el.className = `status-dot ${state}`;
}

function showError(panelId, msg) {
  const body = document.getElementById(`body-${panelId}`);
  if (body) {
    body.innerHTML = `<div class="error-banner">⚠ ${msg || 'DATA UNAVAILABLE'}</div>`;
  }
  setLoading(panelId, false);
  setStatusDot(`status-${panelId}`, 'error');
}

function updateClock() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  const el  = document.getElementById('clock');
  if (el) el.textContent = `${hh}:${mm}:${ss}`;
}

function updateLastUpdated() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  const el  = document.getElementById('last-updated');
  if (el) el.textContent = `UPDATED: ${hh}:${mm}:${ss}`;
  STATE.lastUpdated = now;
}

function setRefreshButtonState(spinning) {
  const btn = document.getElementById('refresh-btn');
  if (!btn) return;
  if (spinning) {
    btn.classList.add('refreshing');
    btn.disabled = true;
  } else {
    btn.classList.remove('refreshing');
    btn.disabled = false;
  }
}

/* ============================================================
   10. OVERLAY / TAB SWITCHERS
   ============================================================ */

function unlockRadar() {
  const guard = document.getElementById('radar-guard');
  const badge = document.getElementById('radar-badge');
  if (!guard) return;
  guard.classList.add('unlocked');
  badge.classList.add('unlocked');
  badge.textContent = '🔓 SCROLL UNLOCKED';
}

function lockRadar() {
  const guard = document.getElementById('radar-guard');
  const badge = document.getElementById('radar-badge');
  if (!guard) return;
  guard.classList.remove('unlocked');
  badge.classList.remove('unlocked');
  badge.textContent = '🔒 CLICK MAP TO INTERACT';
}

function switchRadarOverlay(btn) {
  const overlay = btn.dataset.overlay;
  if (!overlay) return;

  // Skip if already on this overlay (avoid iframe reload + geolocation re-prompt)
  if (btn.classList.contains('active')) return;

  document.querySelectorAll('#radar-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const product = 'ecmwf';

  const iframe = document.getElementById('windy-iframe');
  if (iframe && CONFIG.lat != null) {
    iframe.src =
      `https://embed.windy.com/embed2.html?lat=${CONFIG.lat}&lon=${CONFIG.lon}&zoom=9` +
      `&level=surface&overlay=${overlay}&product=${product}` +
      `&menu=&message=true&calendar=now&pressure=true&type=map` +
      `&detail=false&metricWind=km%2Fh&metricTemp=%C2%B0C`;
  }
}

function switchModelTab(btn) {
  const pkg = btn.dataset.pkg;
  if (!pkg) return;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const newUrl   = CONFIG.ttUrl(pkg);
  const fallback = document.getElementById('models-fallback-link');
  if (fallback) fallback.href = newUrl;

  STATE.currentModelPkg = pkg;
}

/* ============================================================
   11. LIFECYCLE — REFRESH & INIT
   ============================================================ */

async function refreshAll() {
  if (STATE.isRefreshing) return;
  if (CONFIG.lat == null || CONFIG.lon == null) {
    // No location set — show prompt state
    showNoLocation();
    return;
  }

  STATE.isRefreshing = true;
  setRefreshButtonState(true);

  // Show loading on data panels (not radar/models iframes)
  ['current', 'hourly', 'daily', 'alerts', 'aqi', 'astronomy'].forEach(id => {
    setLoading(id, true);
  });

  const results = await Promise.allSettled([
    fetchWeather(),
    fetchAirQuality(),
    fetchAlerts(),
  ]);

  // Handle individual failures
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const panels = [
        ['current', 'hourly', 'daily', 'astronomy'],
        ['aqi'],
        ['alerts'],
      ];
      const errPanels = panels[i];
      console.error(`Fetch ${i} failed:`, r.reason);
      errPanels.forEach(id => showError(id, 'SIGNAL LOST'));
    }
  });

  updateLastUpdated();
  refreshSatellite();
  setRefreshButtonState(false);
  STATE.isRefreshing = false;
}

function showNoLocation() {
  const panels = ['current', 'hourly', 'daily', 'alerts', 'aqi', 'astronomy'];
  panels.forEach(id => {
    const body = document.getElementById(`body-${id}`);
    if (body) {
      body.innerHTML = `
        <div class="alerts-none" style="color:var(--text-dim)">
          <div class="alerts-none-icon" style="font-size:1.6rem;opacity:0.5">📍</div>
          <div class="alerts-none-text" style="color:var(--text-dim)">SEARCH FOR A LOCATION<br><span style="font-size:0.55rem;opacity:0.7">Or use the geolocation button</span></div>
        </div>
      `;
    }
    setLoading(id, false);
  });
}

function startRefreshLoop() {
  if (STATE.refreshTimer) clearInterval(STATE.refreshTimer);
  STATE.refreshTimer = setInterval(() => {
    refreshAll();
  }, CONFIG.refreshInterval);
}

function initWindy() {
  // Auto-relock the scroll guard whenever the mouse leaves the radar panel
  const panel = document.getElementById('panel-radar');
  if (panel) {
    panel.addEventListener('mouseleave', lockRadar);
  }
}

function initModels() {
  // Tropical Tidbits sets X-Frame-Options: sameorigin — iframe embedding is blocked.
  // The fallback link panel is shown by default in HTML; tab buttons update the link URL.
}

function initClockTick() {
  updateClock();
  setInterval(updateClock, 1000);
}

function resizeHourlyChart() {
  const canvas = document.getElementById('hourly-chart');
  if (!canvas) return;
  const newWidth = canvas.parentElement.clientWidth - 20;
  if (canvas.width !== newWidth && STATE.hourlySlice) {
    canvas.width = newWidth;
    drawHourlyChart(canvas, STATE.hourlySlice);
  }
}

function switchSatelliteTab(btn) {
  const tabs = document.querySelectorAll('#satellite-tabs .tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const img = document.getElementById('satellite-img');
  if (img) {
    img.src = btn.dataset.src + '?t=' + Date.now();
  }
}

function initSatellite() {
  const activeTab = document.querySelector('#satellite-tabs .tab-btn.active');
  if (activeTab) {
    const img = document.getElementById('satellite-img');
    if (img) {
      img.src = activeTab.dataset.src + '?t=' + Date.now();
    }
  }
}

function refreshSatellite() {
  const activeTab = document.querySelector('#satellite-tabs .tab-btn.active');
  if (activeTab) {
    const img = document.getElementById('satellite-img');
    if (img) {
      img.src = activeTab.dataset.src + '?t=' + Date.now();
    }
  }
}

function init() {
  initClockTick();
  initWindy();
  initModels();
  initSatellite();
  initSearch();

  // Try to load saved location
  const hasLocation = loadSavedLocation();

  if (hasLocation) {
    // Pre-fill search input with saved location name
    const input = document.getElementById('search-input');
    if (input && CONFIG.locationName) {
      input.value = CONFIG.locationName;
    }
    // Initial data load
    refreshAll();
  } else {
    // No saved location — show prompt
    showNoLocation();
  }

  // Start 10-minute refresh loop
  startRefreshLoop();

  // Re-draw hourly chart on resize
  window.addEventListener('resize', resizeHourlyChart);
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);
