const toDegrees = (radians: number) => (radians / Math.PI) * 180;

// The semi-major axis of the WGS84 ellipsoid in meters (6378137m).
// This represents the equatorial radius of the Earth according to the WGS84 coordinate system,
// which is the standard used for GPS and most modern mapping applications.
const smAxis = 6378137;

// The eccentricity squared of the WGS84 ellipsoid.
// This parameter describes the shape of the ellipsoid and is used in various calculations.
const eccSquared = 0.00669438;

// The prime vertical curvature (N) of the ellipsoid.
// This is a measure of how much the ellipsoid's curvature deviates from a perfect sphere.
const eccPrimeSquared = eccSquared / (1 - eccSquared);

// The origin longitude for the UTM coordinate system.
// This is the central meridian of the UTM zone and is used to determine the position of the zone.
const longitudeOrigin = (30 - 1) * 6 - 180 + 3;

export const utmToLatLng = (easting: number, northing: number) => {
  // The first eccentricity of the ellipsoid.
  // This parameter describes the shape of the ellipsoid and is used in various calculations.
  const e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));

  // The northing value from the UTM coordinate system.
  // This represents the distance north of the equator in meters.
  const y = northing;

  // The easting value from the UTM coordinate system.
  // This represents the distance east of the central meridian in meters.
  const x = easting - 500000.0; //remove 500,000 meter offset for longitude

  // The meridional arc distance from the equator to the point in meters.
  const M = y / 0.9996;

  // The reduced latitude (mu) of the point.
  // This is a normalized latitude value that simplifies calculations.
  const mu =
    M /
    (smAxis *
      (1 -
        eccSquared / 4 -
        (3 * eccSquared * eccSquared) / 64 -
        (5 * eccSquared * eccSquared * eccSquared) / 256));

  // The first approximation of the latitude (phi1) in radians.
  // This is an intermediate calculation used to refine the latitude estimate.
  const phi1Rad =
    mu +
    ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) * Math.sin(4 * mu) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * mu);

  const N1 =
    smAxis / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  const C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  const R1 =
    (smAxis * (1 - eccSquared)) /
    Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  const D = x / (N1 * 0.9996);

  let lat =
    phi1Rad -
    ((N1 * Math.tan(phi1Rad)) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) *
          D *
          D *
          D *
          D) /
          24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * T1 * T1 -
          252 * eccPrimeSquared -
          3 * C1 * C1) *
          D *
          D *
          D *
          D *
          D *
          D) /
          720);
  lat = toDegrees(lat);

  let lng =
    (D -
      ((1 + 2 * T1 + C1) * D * D * D) / 6 +
      ((5 -
        2 * C1 +
        28 * T1 -
        3 * C1 * C1 +
        8 * eccPrimeSquared +
        24 * T1 * T1) *
        D *
        D *
        D *
        D *
        D) /
        120) /
    Math.cos(phi1Rad);
  lng = longitudeOrigin + toDegrees(lng);

  return [lat, lng] as [number, number];
};
