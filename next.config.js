if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

module.exports = {
  reactStrictMode: true,
	typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    images: {
        allowFutureImage: true
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  images: {
    domains: ['i.gabirmotors.com'],
  },
  async redirects() {
    return [
      {
        source: '/specmapping',
        destination: '/tools/specmapping',
        permanent: true,
      },
      {
        source: '/status',
        destination: 'https://stats.uptimerobot.com/p9AxGf9VMk',
        permanent: true,
      }
    ];
  },
}
