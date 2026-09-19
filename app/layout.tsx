import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Onchain Primer',
  description: 'Follow private credit onchain, into DeFi, and back out.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* This site has no wallet integration. MetaMask's own injected inpage.js
            occasionally fails to reconnect to the extension (e.g. after it updates
            or its service worker sleeps) and throws unrelated to any code here —
            swallow that before Next's dev error overlay can catch it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function isMetaMask(msg) {
                  return typeof msg === 'string' && msg.indexOf('MetaMask') !== -1;
                }
                window.addEventListener('unhandledrejection', function (e) {
                  if (isMetaMask(e && e.reason && e.reason.message)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
                window.addEventListener('error', function (e) {
                  if (isMetaMask(e && e.message)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
