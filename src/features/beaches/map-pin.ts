// One pin for the static Mapbox image and the live Leaflet marker, so the map
// does not change its marker when it becomes interactive. Colours are literal
// because a data URL cannot read CSS custom properties: #14637e is ocean-600.
export const MAP_PIN_WIDTH = 32
export const MAP_PIN_HEIGHT = 40

const MAP_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${MAP_PIN_WIDTH}" height="${MAP_PIN_HEIGHT}" viewBox="0 0 32 40"><path d="M16 1.5C8.3 1.5 2.5 7.4 2.5 15c0 9.8 11.3 21.4 12.6 22.7a1.3 1.3 0 0 0 1.8 0C18.2 36.4 29.5 24.8 29.5 15 29.5 7.4 23.7 1.5 16 1.5Z" fill="#14637e" stroke="#fff" stroke-width="2"/><circle cx="16" cy="15" r="5" fill="#fff"/></svg>`

export const mapPinDataUrl = `data:image/svg+xml,${encodeURIComponent(MAP_PIN_SVG)}`
