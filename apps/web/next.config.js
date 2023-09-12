module.exports = {
  async redirects() {
    return [
      {
        source: '/municipio/:slug/1',
        destination: '/municipio/:slug',
        permanent: true,
      },
      {
        source: '/caracteristica/:slug/1',
        destination: '/caracteristica/:slug',
        permanent: true,
      },
      {
        source: '/lista-playas/1',
        destination: '/lista-playas',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  reactStrictMode: true,
};
