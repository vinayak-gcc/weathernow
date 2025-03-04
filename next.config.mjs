/** @type {import('next').NextConfig} */
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // your existing next config
};

const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "vinayak-0x",
  project: "weathernow",
};

export default withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions
);
