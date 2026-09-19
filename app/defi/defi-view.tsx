'use client';

// This is the DeFi page. Rebuilding from scratch — everything that was here
// (the three-tab Collateral/borrow · Loop · Allocator design, real Morpho +
// Kamino data) has been removed on purpose. The verified data it used to
// read is still sitting in lib/defi-data.ts, untouched, if you want it back.
export function DefiView() {
  return (
    <main className="page wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
      <p style={{ fontSize: 18, color: 'var(--muted)' }}>This is the DeFi page.</p>
    </main>
  );
}
