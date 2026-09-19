import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import { DefiView } from './defi-view';

export const metadata: Metadata = {
  title: 'What you can do with a credit token · Onchain Primer',
  description: 'Borrow against it, earn on it, or trade its yield.',
};

export default function DefiPage() {
  return (
    <>
      <SiteHeader active="/defi" />
      <Suspense fallback={null}>
        <DefiView />
      </Suspense>
    </>
  );
}
