// instrumentation.ts
import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  // Hook for server request errors
  return {
    onRequestError: (error: unknown) => {
      Sentry.captureException(error);
    },
  };
}
