import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload external resources */}
          <link 
            rel="preload" 
            href="https://api.geoapify.com/" 
            as="fetch" 
            type="application/json"
            crossOrigin="anonymous" 
          />
          <link 
            rel="preload" 
            href="https://www.openstreetmap.org/copyright" 
            as="fetch" 
            type="text/html"
            crossOrigin="anonymous" 
          />
          <link 
            rel="preload" 
            href="https://b.tile.openstreetmap.org" 
            as="image"
            type="image/png"
            crossOrigin="anonymous" 
          />
          
          {/* Optional: Add any additional meta tags or fonts */}
          <meta charSet="utf-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument