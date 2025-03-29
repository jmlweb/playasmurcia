import { utmToLatLng } from './utmToLatLng';

describe('utmToLatLng', () => {
  it('should convert UTM coordinates to latitude/longitude', () => {
    // Test case 1: Known UTM coordinates for a point in Murcia region
    const result1 = utmToLatLng(678549, 4171429);
    expect(result1.lat).toBeCloseTo(37.6727, 3);
    expect(result1.lng).toBeCloseTo(-0.9754, 3);

    // Test case 2: Another known point
    const result2 = utmToLatLng(644432, 4142857);
    expect(result2.lat).toBeCloseTo(37.4213, 3);
    expect(result2.lng).toBeCloseTo(-1.3677, 3);

    // Test case 3: Third reference point
    const result3 = utmToLatLng(683214, 4170714);
    expect(result3.lat).toBeCloseTo(37.6653, 3);
    expect(result3.lng).toBeCloseTo(-0.9227, 3);
  });

  it('should handle edge cases properly', () => {
    // Test with minimum valid easting (zone 30)
    const minEasting = utmToLatLng(500000, 4000000);
    expect(minEasting.lat).toBeDefined();
    expect(minEasting.lng).toBeDefined();

    // Test with larger northing value
    const largeNorthing = utmToLatLng(600000, 4500000);
    expect(largeNorthing.lat).toBeDefined();
    expect(largeNorthing.lng).toBeDefined();
  });
});
