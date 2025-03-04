'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SwaggerUI with a more explicit configuration
const SwaggerUI = dynamic(
  async () => {
    const mod = await import('swagger-ui-react');
    return mod.default;
  },
  { 
    ssr: false,
    loading: () => <p>Loading API documentation...</p>
  }
);

export default function ApiDocs() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load CSS
    import('swagger-ui-react/swagger-ui.css');
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="swagger-wrapper">
      <SwaggerUI url="/api/docs" />
      <style jsx global>{`
        .swagger-wrapper {
          margin: 0;
          padding: 20px;
        }
        .swagger-ui {
          max-width: 1460px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
} 