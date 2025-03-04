'use client'

import * as Sentry from "@sentry/nextjs";

export default function ErrorTest() {
  const handleError = () => {
    try {
      // Intentionally throw an error
      throw new Error("This is a test error for Sentry!");
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleUnhandledError = () => {
    // This will be caught by Sentry automatically
    throw new Error("This is an unhandled error test!");
  };

  return (
    <div className="p-4">
      <h1>Sentry Error Test Page</h1>
      <div className="space-x-4 mt-4">
        <button 
          onClick={handleError}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Trigger Handled Error
        </button>
        <button 
          onClick={handleUnhandledError}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Trigger Unhandled Error
        </button>
      </div>
    </div>
  );
} 