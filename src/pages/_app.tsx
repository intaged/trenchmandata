import type { AppProps } from 'next/app';
import Head from 'next/head';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Head>
        <title>DataTrench - Solana Analytics Platform</title>
        <meta name="description" content="Your premium gateway to the Solana ecosystem. Track tokens, analyze trends, and discover opportunities with real-time data and advanced analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DataTrench" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="DataTrench - Solana Analytics Platform" />
        <meta property="og:description" content="Your premium gateway to the Solana ecosystem. Track tokens, analyze trends, and discover opportunities with real-time data and advanced analytics." />
        <meta property="og:site_name" content="DataTrench" />
        
        {/* PWA Assets */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#8B5CF6" />
        
        {/* Preconnect to API domain */}
        <link rel="preconnect" href="https://data.solanatracker.io" />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
} 