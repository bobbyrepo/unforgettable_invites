import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://unforgettableinvites.com'),
};

export default function Template09Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: '#fff8f0', minHeight: '100vh', position: 'relative' }}>
      <link rel="stylesheet" href="/templates/08_unforgettable_buddhist_wedding/css/fonts.css" />
      <link rel="stylesheet" href="/templates/08_unforgettable_buddhist_wedding/css/flags.css" />
      <link rel="stylesheet" href="/templates/08_unforgettable_buddhist_wedding/css/audio-player.css" />
      {children}
      <Script 
        src="/templates/08_unforgettable_buddhist_wedding/scripts/flag-simulation.js" 
        strategy="afterInteractive" 
      />
      <Script 
        src="/templates/08_unforgettable_buddhist_wedding/scripts/tree-parallax.js" 
        strategy="afterInteractive" 
      />
      <Script 
        src="/templates/08_unforgettable_buddhist_wedding/scripts/audio-player.js" 
        strategy="afterInteractive" 
      />
    </div>
  );
}
