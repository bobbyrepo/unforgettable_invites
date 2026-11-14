import React from 'react';
import type { Metadata } from 'next';
import { Template09 } from '@/components/templates/Template09_BuddhaReact';
import defaultData from '@/components/templates/Template09_BuddhaReact/data/content.default.json';
import { WeddingInviteData } from '@/data/types';

export async function generateMetadata(): Promise<Metadata> {
  const bride = defaultData.couple.bride.name;
  const groom = defaultData.couple.groom.name;
  const venue = defaultData.events[0]?.venueName || 'The Sacred Lotus Sanctuary';

  return {
    title: `${bride} & ${groom} — Sacred Buddhist Wedding Invitation`,
    description: `Auspicious vivah ceremony in ${venue}. Celebrate our sacred journey.`,
    openGraph: {
      title: `${bride} & ${groom} — Auspicious Buddhist Vivah`,
      description: `Auspicious vivah ceremony at ${venue}. Click to open full invitation.`,
      url: '/templates/09_unforgettable_buddha_react',
      siteName: 'Unforgettable Invites',
      images: [
        {
          url: '/templates/08_unforgettable_buddhist_wedding/images/og_preview.webp',
          width: 1200,
          height: 630,
          alt: `${bride} & ${groom} Wedding Card`,
        },
      ],
      type: 'website',
    },
  };
}

export default function Template09Page() {
  return <Template09 data={defaultData as unknown as WeddingInviteData} />;
}
