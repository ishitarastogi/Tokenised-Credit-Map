import Link from 'next/link';

const NAV = [
  { href: '/onchain', label: 'Onchain' },
  { href: '/defi', label: 'DeFi' },
  { href: '/exit', label: 'Exit' },
  { href: '/directory', label: 'Directory' },
  { href: '/learn', label: 'Learn' },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="site">
      <div className="wrap">
        <Link className="brand" href="/">
          <span className="mark" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <i key={i} />
            ))}
          </span>
          <span className="serif" style={{ fontSize: 24 }}>
            Onchain Primer
          </span>
        </Link>
        <nav className="primary" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={active === item.href ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
