# Step 12: Add Webcam URLs

## Objective

Add `webcamUrl` field for beaches with public webcams.

## Field

```typescript
webcamUrl?: string  // Direct URL to webcam
```

## Data Sources

- **SkylineWebcams**: https://www.skylinewebcams.com
- **Windy**: https://www.windy.com/webcams
- **Municipal webcams**: Ayuntamiento websites
- **Port authorities**: Puerto de Cartagena, Águilas

## Script: `scripts/add-webcams.js`

1. Manual research of webcam sources for Murcia beaches
2. Verify webcam is active (HTTP 200)
3. Store permanent URL (not embed)
4. Map to beach codes

## Known Webcams

| Location | Source | URL |
|----------|--------|-----|
| La Manga | SkylineWebcams | TBD |
| Puerto de Mazarrón | Municipal | TBD |
| Águilas | Port authority | TBD |

## Validation

- [ ] URLs are accessible
- [ ] Webcams show correct beach
