import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Walking Route Navigator 🚶‍♂️',
  description: 'Find the most pleasant walking routes with sidewalks',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">🚶</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#B3D9FF" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
        <meta name="mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Walk Nav" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
