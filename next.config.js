import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // Keep the PDF render stack out of the Turbopack server bundle. pdfjs (used
    // by pdf-to-img) loads a separate worker file at runtime; when bundled, its
    // worker path is rewritten to a non-existent chunk and the job fails with
    // "Setting up fake worker failed". Loading it from node_modules fixes that.
    serverExternalPackages: ['pdf-to-img', 'pdfjs-dist'],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
                port: "",
                pathname: "**",
            },
        ],
    },
};

export default withPayload(nextConfig);
