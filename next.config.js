/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['deck.gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/react', '@deck.gl/geo-layers'],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            // Deck.gl requires these aliases for proper bundling
            '@deck.gl/core': require.resolve('@deck.gl/core'),
            '@deck.gl/layers': require.resolve('@deck.gl/layers'),
        };
        return config;
    },
}

module.exports = nextConfig
