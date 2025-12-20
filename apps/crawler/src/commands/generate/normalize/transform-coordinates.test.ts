import { transformCoordinates } from './transform-coordinates';

describe('utmToLatLng', () => {
  it('should convert UTM coordinates to latitude/longitude', () => {
    // Test case 1: Known UTM coordinates for a point in Murcia region
    const result1 = transformCoordinates(678549, 4171429);
    expect(result1[0]).toBeCloseTo(37.6727, 3);
    expect(result1[1]).toBeCloseTo(-0.9754, 3);

    // Test case 2: Another known point
    const result2 = transformCoordinates(644432, 4142857);
    expect(result2[0]).toBeCloseTo(37.4213, 3);
    expect(result2[1]).toBeCloseTo(-1.3677, 3);

    // Test case 3: Third reference point
    const result3 = transformCoordinates(683214, 4170714);
    expect(result3[0]).toBeCloseTo(37.6653, 3);
    expect(result3[1]).toBeCloseTo(-0.9227, 3);
  });

  it('should handle edge cases properly', () => {
    // Test with minimum valid easting (zone 30)
    const minEasting = transformCoordinates(500000, 4000000);
    expect(minEasting[0]).toBeDefined();
    expect(minEasting[1]).toBeDefined();

    // Test with larger northing value
    const largeNorthing = transformCoordinates(600000, 4500000);
    expect(largeNorthing[0]).toBeDefined();
    expect(largeNorthing[1]).toBeDefined();
  });
});
