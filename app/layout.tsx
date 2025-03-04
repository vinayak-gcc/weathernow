import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Providers/ThemeProvider";
import ApolloWrapper from './Providers/ApolloWrapper';
import { Analytics } from '@vercel/analytics/next'
import { PostHogProvider } from './Providers/PostHogProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeatherNow",
  description: "A weather app built with Next.js",
  icons: {
    icon: '/icon.ico', // /public path
  },
  verification: {
    google: 'google',
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="google-site-verification" content="OrlvMUAuvv9XFQNtK1ca_3iX2-pvO-83iEay0yx08BE" />
      <meta httpEquiv="refresh" content="300"></meta>
      </head>
      <body className={inter.className} >
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
            <ApolloWrapper>
              <PostHogProvider>
                {children}
                <Analytics />
              </PostHogProvider>
            </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
