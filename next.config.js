module.exports = {
  reactStrictMode: true,
	typescript: {
    ignoreBuildErrors: true,
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
}
