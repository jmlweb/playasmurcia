# Create Services - Real-Time Beach Data

> **Goal**: Implement services for ephemeral, real-time beach data that should not be stored in `beaches.json`. These services provide dynamic information like weather, beach status, and user-generated content.

## 📋 Table of Contents

- [Overview](#overview)
- [Data Sources](#data-sources)
- [API Integration Examples](#api-integration-examples)
- [Frontend Integration Ideas](#frontend-integration-ideas)
- [Service Architecture](#service-architecture)

---

## Overview

This document covers services for **ephemeral data** - information that changes frequently and should be fetched in real-time rather than stored in `beaches.json`:

- **Weather predictions** (AEMET)
- **Beach status** (112 Murcia)
- **Real-time jellyfish alerts** (user-generated)
- **Google Reviews** (dynamic content)
- **Webcam feeds** (live streams)

**Key Principle**: These services use static identifiers stored in `beaches.json` (like `aemetId`, `googlePlaceId`) but fetch and display dynamic data in real-time.

---

## Data Sources

### 1. AEMET OpenData (Weather Prediction)

**Documentation**: https://opendata.aemet.es/dist/index.html

**Beach codes**: Stored in `beaches.json` as `aemetId` field (65 beaches have this)

**Endpoint**: `GET /api/prediccion/especifica/playa/{aemetId}`

**Authentication**: Requires API key (free registration at https://opendata.aemet.es/centrodedescargas/inicio)

**Response data**: 
- Cloud conditions (11:00/17:00)
- Precipitation likelihood (08-14h / 14-20h)
- Wind conditions
- UV index

**Update frequency**: Multiple times per day

**Note**: Weather data is ephemeral - use for real-time display only, do not store.

### 2. Región de Murcia Open Data (Beach Status)

**Portal**: https://datosabiertos.regiondemurcia.es/carm/catalogo/turismo/informacion-del-estado-de-las-playas-de-la-region-de-murcia

**Endpoint**: `https://www.112rmurcia.es/copla/copla.xml`

**Format**: XML

**Update frequency**: Hourly (summer only, 9:00-23:00)

**License**: http://datosabiertos.regiondemurcia.es/avisolegal

**Data includes**:
- Lifeguard presence (real-time)
- Beach conditions
- Safety flags
- Water temperature (when available)

**Note**: This is ephemeral data - use for real-time widget, do not store conditions.

### 3. Google Places API

**API**: https://developers.google.com/maps/documentation/places/web-service

**Use cases**:
- Fetch user reviews dynamically
- Get current ratings
- Display user photos

**Note**: Requires `googlePlaceId` stored in `beaches.json` (see [ENRICH_BEACHES.md](./ENRICH_BEACHES.md) for adding this field).

**Cost**: Google Places API has usage costs. Cache responses appropriately.

---

## API Integration Examples

### AEMET Weather Widget

To show real-time weather on the frontend:

```typescript
const AEMET_BASE = 'https://opendata.aemet.es/opendata/api'

async function getBeachWeather(aemetId: string, apiKey: string) {
  const response = await fetch(
    `${AEMET_BASE}/prediccion/especifica/playa/${aemetId}`,
    { headers: { 'api_key': apiKey } }
  )
  const { datos } = await response.json()
  // datos contains URL to actual prediction data
  return fetch(datos).then(r => r.json())
}

// Usage example
const weather = await getBeachWeather(beach.aemetId, process.env.AEMET_API_KEY)
// weather contains: cielo, prob_precipitacion, viento, etc.
```

**Response structure**:
```json
{
  "elaborado": "2025-01-15T10:00:00",
  "nombre": "Playa de Bolnuevo",
  "prediccion": [
    {
      "dia": "2025-01-15",
      "cielo": [
        { "periodo": "11-14", "value": "11" },  // 11 = despejado
        { "periodo": "14-17", "value": "12" }   // 12 = poco nuboso
      ],
      "prob_precipitacion": [
        { "periodo": "00-06", "value": "0" },
        { "periodo": "06-12", "value": "0" },
        { "periodo": "12-18", "value": "0" },
        { "periodo": "18-24", "value": "0" }
      ],
      "viento": [
        { "periodo": "00-06", "direccion": "E", "velocidad": "10" },
        { "periodo": "06-12", "direccion": "SE", "velocidad": "15" }
      ],
      "uv_max": "5"
    }
  ]
}
```

### Beach Status Widget (Región de Murcia)

XML endpoint for summer beach status:

```typescript
async function getBeachStatus() {
  const response = await fetch('https://www.112rmurcia.es/copla/copla.xml')
  const xml = await response.text()
  // Parse XML to get current beach conditions
  // XML structure includes: playa, estado, socorrista, bandera, etc.
  return parseXML(xml)
}

// Example XML structure:
// <playas>
//   <playa>
//     <nombre>Playa de Bolnuevo</nombre>
//     <estado>Abierta</estado>
//     <socorrista>Si</socorrista>
//     <bandera>Verde</bandera>
//   </playa>
// </playas>
```

**Implementation notes**:
- Only available during summer (June-September, 9:00-23:00)
- Handle XML parsing (use `xml2js` or similar)
- Match beach names to our database (fuzzy matching may be needed)
- Cache responses for 15-30 minutes to reduce requests

### Google Reviews Widget

Display user reviews on beach pages:

```typescript
async function getBeachReviews(googlePlaceId: string, apiKey: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${googlePlaceId}&fields=rating,reviews,user_ratings_total&key=${apiKey}`
  )
  return response.json()
}

// Usage
const reviews = await getBeachReviews(beach.googlePlaceId, process.env.GOOGLE_API_KEY)
// reviews.result contains: rating, user_ratings_total, reviews array
```

**Note**: Reviews are fetched in real-time (not stored). Display responsibly per Google ToS.

**Caching strategy**:
- Cache reviews for 24 hours (they don't change frequently)
- Implement rate limiting to respect API quotas
- Consider using Google Places API client library for better error handling

### Beach Orientation Calculation

Calculate cardinal direction based on coastline (for static data, but included here as it's a calculation service):

```typescript
function calculateOrientation(lat: number, lng: number): string {
  // For Murcia coast, beaches generally face:
  // - East/Southeast: Mediterranean coast (Cartagena, Mazarrón, Águilas)
  // - Various: Mar Menor (enclosed lagoon)

  // Simplified approach: use coastline normal vector
  // More accurate: calculate perpendicular to nearest coastline segment
  
  // This is a one-time calculation that should be stored in beaches.json
  // See ENRICH_BEACHES.md for script implementation
}
```

**Note**: This calculation should be done once and stored in `beaches.json` as `orientation` field. See [ENRICH_BEACHES.md](./ENRICH_BEACHES.md).

---

## Frontend Integration Ideas

### 1. Beach Recommendation Chatbot

AI-powered beach finder widget using existing data:

```typescript
// Example prompt for chatbot
const systemPrompt = `
You are a beach recommendation assistant for Costa Cálida (Murcia, Spain).
Use the beach database to recommend beaches based on user preferences.
Consider: weather, accessibility, activities, crowd level, dog-friendly, etc.
Always respond in the user's language.
`

// Integration: Ollama (free) or Claude API
// Query current weather via AEMET before responding
async function recommendBeach(userQuery: string, beaches: Beach[]) {
  // 1. Parse user preferences from query
  // 2. Filter beaches based on static criteria
  // 3. Fetch current weather for matching beaches
  // 4. Rank beaches considering weather + preferences
  // 5. Generate natural language response
}
```

**User query examples**:
- "¿Qué playa me recomiendas hoy en Cartagena con poco viento?"
- "Beach for families with easy parking near La Manga?"
- "Où puis-je faire du snorkeling?"

**Implementation**:
- Use Ollama (free, local) or Claude API for AI responses
- Integrate AEMET weather service for real-time conditions
- Cache weather data for 30 minutes to reduce API calls

### 2. Social Media Feeds

Display user-generated content on beach pages:

**Tools**:
- **Curator.io**: Aggregate Instagram/TikTok by hashtag or location
- **Juicer**: Social wall with moderation
- **Elfsight**: Instagram feed widget

**Implementation**:
1. Store `instagramHashtag` per beach in `beaches.json` (e.g., "#PlayaDeBolnuevo")
2. Embed widget filtered by that hashtag
3. Keeps content fresh without manual updates

**Note**: See [ENRICH_BEACHES.md](./ENRICH_BEACHES.md) for adding `instagramHashtag` field.

### 3. Real-Time Jellyfish Reporting

User-generated alerts (ephemeral, not stored in JSON):

```typescript
// Store reports in Redis/memory with TTL (e.g., 4 hours)
interface JellyfishReport {
  beachCode: string
  reportedAt: Date
  severity: 'few' | 'moderate' | 'many'
  // Auto-expires after 4 hours
}

// API endpoint
POST /api/jellyfish/report
{
  "beachCode": "playa-bolnuevo",
  "severity": "moderate"
}

// Get current reports
GET /api/jellyfish/reports?beachCode=playa-bolnuevo
// Returns: { count: 3, lastReported: "2025-01-15T14:30:00Z" }

// Display: "3 users reported jellyfish today" badge
```

**Implementation**:
- Use Redis or in-memory store with TTL
- Validate beach codes against `beaches.json`
- Rate limit reports (e.g., 1 per user per beach per hour)
- Display aggregated counts on beach pages

**Note**: This complements the static `jellyfishRisk` field in `beaches.json` (historical risk). Real-time reports show current conditions.

### 4. Webcam Integration

Display live webcam feeds on beach pages:

```typescript
// beaches.json contains webcamUrl (static)
// Frontend displays live feed

function BeachWebcam({ webcamUrl }: { webcamUrl: string }) {
  // Option 1: Direct embed (if webcam provider supports it)
  // Option 2: Iframe embed
  // Option 3: Image refresh (if webcam provides static image URL)
  
  return (
    <div className="webcam-container">
      <img 
        src={webcamUrl} 
        alt="Live beach webcam"
        onError={() => setError(true)}
      />
      <p className="webcam-note">
        Webcam provided by {getWebcamProvider(webcamUrl)}
      </p>
    </div>
  )
}
```

**Implementation notes**:
- Verify webcam URLs are still active (periodic health checks)
- Handle webcam failures gracefully
- Consider caching webcam provider information
- Some webcams require authentication or have CORS restrictions

### 5. Dynamic Sitemap

Auto-update sitemap when beaches change:

```typescript
// Generate sitemap.xml from beaches.json
function generateSitemap(beaches: Beach[]): string {
  const urls = beaches.map(beach => `
    <url>
      <loc>https://playasmurcia.com/playas/${beach.code}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`
}

// Trigger on deploy or data update
// Submit to Google Search Console via API
```

**Implementation**:
- Generate sitemap as part of build process
- Include dynamic pages (beach detail pages)
- Submit to Google Search Console programmatically
- Update `lastmod` when beach data changes

### 6. Schema Markup (JSON-LD)

Auto-generate structured data for SEO:

```typescript
function generateBeachSchema(beach: Beach, municipalities: Municipality[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "Beach",
    "name": beach.name,
    "description": beach.metaDescription || beach.description,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": beach.coordinates[0],
      "longitude": beach.coordinates[1]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": municipalities[beach.municipality].name,
      "addressRegion": "Murcia",
      "addressCountry": "ES"
    },
    "amenityFeature": beach.services?.map(s => ({
      "@type": "LocationFeatureSpecification",
      "name": s,
      "value": true
    })),
    "image": beach.pictures?.map(p => `${IMAGE_BASE_URL}${p}`),
    "isAccessibleForFree": true,
    "publicAccess": true
  }
}
```

**Implementation**:
- Generate JSON-LD for each beach page
- Include in `<head>` section
- Update when beach data changes
- Validate with Google Rich Results Test

---

## Service Architecture

### Recommended Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js App)  │
└────────┬────────┘
         │
         ├─── Static Data (beaches.json)
         │
         ├─── Real-Time Services
         │    ├─── AEMET Weather API
         │    ├─── 112 Murcia XML
         │    ├─── Google Places API
         │    └─── Jellyfish Reports (Redis)
         │
         └─── Caching Layer
              ├─── Weather: 30 min cache
              ├─── Beach Status: 15 min cache
              ├─── Reviews: 24 hour cache
              └─── Jellyfish: 4 hour TTL
```

### Caching Strategy

**Weather (AEMET)**:
- Cache duration: 30 minutes
- Key: `weather:${aemetId}`
- Invalidate on error

**Beach Status (112 Murcia)**:
- Cache duration: 15 minutes
- Key: `status:${beachCode}`
- Only available summer 9:00-23:00

**Google Reviews**:
- Cache duration: 24 hours
- Key: `reviews:${googlePlaceId}`
- Refresh on user request

**Jellyfish Reports**:
- TTL: 4 hours per report
- Key: `jellyfish:${beachCode}:${userId}`
- Aggregate counts cached for 1 hour

### Error Handling

All services should handle:
- API rate limits (429 errors)
- Network timeouts
- Invalid API keys
- Missing data (beach without `aemetId`, etc.)
- Service unavailability

**Graceful degradation**:
- Show cached data if available
- Display "Data unavailable" message
- Log errors for monitoring
- Don't break page rendering

### Rate Limiting

**AEMET API**:
- Free tier: Limited requests per day
- Implement request queuing
- Cache aggressively

**Google Places API**:
- Cost per request
- Use client-side caching
- Batch requests when possible

**112 Murcia XML**:
- Public endpoint, no auth
- Still implement rate limiting
- Cache responses

---

## Implementation Checklist

- [ ] Set up AEMET API key and test weather endpoint
- [ ] Implement weather widget component
- [ ] Parse 112 Murcia XML and create status widget
- [ ] Set up Google Places API (if using reviews)
- [ ] Implement jellyfish reporting system (Redis/memory)
- [ ] Create caching layer for all services
- [ ] Add error handling and graceful degradation
- [ ] Implement rate limiting
- [ ] Add monitoring/logging for service health
- [ ] Create API documentation for frontend team
- [ ] Test all services with real data
- [ ] Set up environment variables for API keys

