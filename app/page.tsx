import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Logo } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Onchain Primer',
  description: 'Follow private credit onchain, into DeFi, and back out.',
};

const STEPS = [
  {
    num: '01',
    title: 'Onchain',
    href: '/onchain',
    color: 'var(--tradfi)',
    meta: '[58] tokens · [40] projects',
    desc: "Who's behind the token: the managers who run the loans and the platforms that issue them.",
  },
  {
    num: '02',
    title: 'DeFi',
    href: '/defi',
    color: 'var(--onchain)',
    meta: '[24] venues',
    desc: 'Where you can use it: lending markets, curated vaults and yield trading.',
  },
  {
    num: '03',
    title: 'Exit',
    href: '/exit',
    color: 'var(--direct)',
    meta: '[5] exit routes',
    desc: 'How you get out: redeeming with the issuer, selling onchain, or unwinding a position.',
  },
];

const LOGOS = [
  'Securitize', 'Centrifuge', 'Maple', 'Midas', 'Superstate', 'Pareto',
  'Fasanara', 'Apollo', 'Hamilton Lane', 'Janus Henderson', 'OnRe', 'Huma',
];

function StepBlock({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <Link className="block" href={step.href} style={{ ['--c' as string]: step.color }}>
      <span className="num mono">{step.num}</span>
      <span className="meta">{step.meta}</span>
      <span className="title serif">{step.title}</span>
      <span className="desc">{step.desc}</span>
    </Link>
  );
}

function Handover({ label, color }: { label: string; color: string }) {
  return (
    <div className="hand">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 6 L40 40 M40 24 L40 40 L24 40" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
      <div>
        <div className="muted" style={{ fontSize: 13 }}>
          hands over
        </div>
        <div style={{ fontSize: 16, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="page wrap">
        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 48, padding: '48px 0 8px' }}>
          <h1 className="serif" style={{ margin: 0, fontSize: 62, lineHeight: 1, letterSpacing: '-.02em', maxWidth: 820 }}>
            Follow private credit onchain, into DeFi, and back out
          </h1>
          <p style={{ margin: '0 0 6px', maxWidth: 340, fontSize: 16, lineHeight: 1.6, color: 'var(--muted)' }}>
            Three steps, and the projects behind each one. Built for DeFi users, curators and credit teams.
          </p>
        </section>

        <section className="matrix" aria-label="The three steps">
          <StepBlock step={STEPS[0]} />
          <Handover label="the token" color="#0E7C6B" />
          <div />

          <div />
          <StepBlock step={STEPS[1]} />
          <Handover label="your position" color="#4F5FD9" />

          <div className="searchcell">
            <span style={{ fontSize: 15, fontWeight: 500 }}>Know what you&rsquo;re looking for?</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['ACRED', 'syrupUSDC', 'Midas'].map((t) => (
                <Link key={t} className="btn" style={{ height: 36, padding: '0 12px', fontSize: 13 }} href="/onchain">
                  {t}
                </Link>
              ))}
            </div>
          </div>
          <div />
          <StepBlock step={STEPS[2]} />
        </section>

        <section
          aria-labelledby="projects-h"
          style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 28, borderTop: '1px solid var(--line-strong)', marginTop: 36 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 id="projects-h" style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              Projects on the Primer
            </h2>
            <Link href="/directory" style={{ fontSize: 14 }}>
              See all in the Directory
            </Link>
          </div>
          <div className="tiles">
            {LOGOS.map((name) => (
              <Link className="tile" key={name} href="/directory">
                <Logo name={name} tint="#EEF0EF" color="#4A5660" />
                <span className="name">{name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
