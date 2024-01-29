const BE_URL = process.env.BE_URL || "https://api.dou-chi.com";
const RPC_URL = process.env.RPC_URL || "https://rpc.dou-chi.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${BE_URL}/api/:path*`,
			},
			{
				source: '/rpc/:path*',
				destination: `${RPC_URL}/:path*`,
			}
		];
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
}

module.exports = nextConfig // withTM();
