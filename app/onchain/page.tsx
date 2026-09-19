import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { OnchainView } from './onchain-view';

export const metadata: Metadata = {
  title: 'How credit becomes a token · Onchain Primer',
  description: 'Who runs the book. What the token is. Who mints it.',
};

export default function OnchainPage() {
  return (
    <>
      <SiteHeader active="/onchain" />
      <OnchainView />
    </>
  );
}
