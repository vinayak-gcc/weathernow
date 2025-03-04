import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1400446da9c5d01c679e240ccc02df00@o4508534898032640.ingest.us.sentry.io/4508918608101376",
  tracesSampleRate: 1.0, // Adjust between 0 and 1
  replaysSessionSampleRate: 0.1, // Adjust between 0 and 1
  replaysOnErrorSampleRate: 1.0,
}); 