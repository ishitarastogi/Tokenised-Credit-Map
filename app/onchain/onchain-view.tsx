'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { ChainRow, Logo, SearchBox } from '@/components/ui';
import { parseNetworks } from '@/lib/chains';
import {
  ALL_ASSETS,
  KIND_META,
  KIND_ORDER,
  ORIGINS,
  ORIGIN_ORDER,
  PLATFORMS,
  USES,
  defiLabel,
  findPlatform,
  type Asset,
  type Platform,
} from '@/lib/data';
import { listWords, plural } from '@/lib/utils';

type View = 'origin' | 'kind';

/** One block section on the onchain page: a color-coded group of platforms. */
type Group = { key: string; label: string; color: string; tint: string; text: string; platforms: Platform[] };

const DRAWER_WIDTH = 560;

/** Largest column count (up to `max`) that divides `n` evenly, so the last row is never a lone orphan. */
const bestColumns = (n: number, max = 3): number => {
  for (let c = max; c > 1; c--) {
    if (n % c === 0) return c;
  }
  return Math.min(n, max);
};

export function OnchainView() {
  const [view, setView] = useState<View>('origin');
  const [selected, setSelected] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [tableOpen, setTableOpen] = useState(true);
  const [query, setQuery] = useState('');

  const originGroups: Group[] = useMemo(
    () =>
      ORIGIN_ORDER.map((key) => {
        const meta = ORIGINS[key];
        return { key, label: meta.label, color: meta.color, tint: meta.tint, text: meta.text, platforms: PLATFORMS.filter((p) => p.origin === key) };
      }).filter((g) => g.platforms.length > 0),
    [],
  );

  const kindGroups: Group[] = useMemo(
    () =>
      KIND_ORDER.map((key) => {
        const meta = KIND_META[key];
        return {
          key,
          label: meta.label,
          color: meta.color,
          tint: meta.tint,
          text: meta.text,
          platforms: PLATFORMS.filter((p) => p.assets.some((a) => a.kind === key)),
        };
      }).filter((g) => g.platforms.length > 0),
    [],
  );

  const groups = view === 'origin' ? originGroups : kindGroups;
  const cols = bestColumns(groups.length);
  const rows = ALL_ASSETS;

  const stats = useMemo(() => {
    const all = PLATFORMS.flatMap((p) => p.assets);
    return {
      tokens: all.length,
      platforms: PLATFORMS.length,
      issuers: new Set(all.map((a) => a.issuer)).size,
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { assets: [], platforms: [] };
    const starts = ALL_ASSETS.filter((x) => x.asset.t.toLowerCase().startsWith(q));
    const rest = ALL_ASSETS.filter(
      (x) => !starts.includes(x) && (x.asset.t.toLowerCase().includes(q) || x.asset.n.toLowerCase().includes(q)),
    );
    return {
      assets: [...starts, ...rest].slice(0, 5),
      platforms: PLATFORMS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query]);

  const selectedPlatform = findPlatform(selected);

  const pick = (platform: string, ticker?: string) => {
    setSelected(platform);
    setFocus(ticker ?? null);
    setQuery('');
  };

  const switchView = (v: View) => {
    setView(v);
    setSelected(null);
    setFocus(null);
  };

  return (
    <>
      <main className="page wrap" style={{ paddingRight: selectedPlatform ? DRAWER_WIDTH + 40 : undefined }}>
        {/* hero */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '40px 0 8px' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.12em', color: 'var(--onchain)' }}>
            ONCHAIN PRIVATE CREDIT
          </span>
          <h1 className="serif" style={{ margin: 0, fontSize: 60, lineHeight: 1, letterSpacing: '-.02em', maxWidth: 900 }}>
            How credit becomes a token
          </h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 640 }}>
            Explore the platforms that run the credit, the tokens they issue, and who mints them. Pick any platform to see its
            path.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 36, marginTop: 6 }}>
            <Stat value={stats.tokens} label="tokens" />
            <Stat value={stats.platforms} label="platforms" />
            <Stat value={3} label="layers" />
            <Stat value={stats.issuers} label="issuers" />
          </div>
        </section>

        {/* mode: group by origin or by credit type — never both at once */}
        <section className="controls" aria-label="Group by">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <ModeTab active={view === 'origin'} onClick={() => switchView('origin')}>
              Credit Origin
            </ModeTab>
            <ModeTab active={view === 'kind'} onClick={() => switchView('kind')}>
              Tokenised credit type
            </ModeTab>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SearchBox placeholder="Search a ticker or platform" value={query} onChange={setQuery}>
              {results.assets.length || results.platforms.length ? (
                <div className="results" role="listbox" aria-label="Search results">
                  {results.assets.map(({ asset, platform }) => (
                    <button key={asset.t} type="button" onClick={() => pick(platform.name, asset.t)}>
                      <span className="mono">{asset.t}</span>
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {platform.name} · {asset.issuer}
                      </span>
                    </button>
                  ))}
                  {results.platforms.map((p) => (
                    <button key={p.name} type="button" onClick={() => pick(p.name)}>
                      <span>{p.name}</span>
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {ORIGINS[p.origin].role}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </SearchBox>
          </div>
        </section>

        {/* blocks — grouped by whichever mode is active above */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 16,
            marginTop: 14,
            alignItems: 'start',
          }}
        >
          {groups.map((g) => (
            <fieldset
              key={g.key}
              aria-label={g.label}
              style={{
                margin: 0,
                padding: '18px 20px 20px',
                border: '1px solid #DCE0E2',
                borderRadius: 12,
                minWidth: 0,
              }}
            >
              <legend
                className="mono"
                style={{
                  padding: '0 8px',
                  fontSize: 12,
                  letterSpacing: '.08em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                }}
              >
                {g.label} [{g.platforms.length}]
              </legend>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 8px' }}>
                {g.platforms.map((platform) => {
                  const on = selected === platform.name;
                  return (
                    <button
                      key={platform.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(platform.name)}
                      title={platform.name}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        width: 76,
                        flex: '0 0 auto',
                        padding: 4,
                        background: 'transparent',
                        border: 0,
                        borderRadius: 8,
                        cursor: 'pointer',
                        outline: on ? `2px solid ${g.color}` : 'none',
                        outlineOffset: 2,
                      }}
                    >
                      <Logo name={platform.name} tint={g.tint} color={g.text} size={34} />
                      <span
                        style={{
                          fontSize: 11.5,
                          lineHeight: 1.2,
                          color: 'var(--ink)',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {platform.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/* table */}
        <section
          aria-labelledby="table-h"
          style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16, paddingTop: 24, borderTop: '1px solid var(--line-strong)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 id="table-h" style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                Every token
              </h2>
              <span style={{ fontSize: 13, color: 'var(--faint)' }}>
                {plural(rows.length, 'token')} · Data verified [date]
              </span>
            </div>
            <button className="btn" type="button" aria-expanded={tableOpen} onClick={() => setTableOpen((v) => !v)}>
              {tableOpen ? 'Hide table' : 'Show table'}
            </button>
          </div>
          {tableOpen ? <TokenTable platforms={PLATFORMS} focus={focus} onPickPlatform={pick} /> : null}
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Tokenized public ETFs and bond wrappers (Ondo, Reality, Dinari, xStocks, Backed) aren&rsquo;t private credit, so they
            live in the <Link href="/directory">Directory</Link>.
          </p>
        </section>

        <nav className="next" aria-label="Next step">
          <div>
            <div style={{ fontSize: 13, color: '#AEB9C0' }}>Step 2 of 3</div>
            <div className="serif" style={{ marginTop: 2 }}>
              What you can do with a credit token
            </div>
          </div>
          <Link className="btn" style={{ background: '#fff', borderColor: '#fff', color: 'var(--ink)' }} href="/defi">
            Go to DeFi →
          </Link>
        </nav>
      </main>

      {selectedPlatform ? (
        <PlatformDrawer
          platform={selectedPlatform}
          focus={focus}
          onClose={() => {
            setSelected(null);
            setFocus(null);
          }}
        />
      ) : null}
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span style={{ fontSize: 15, color: 'var(--muted)' }}>
      <b style={{ fontSize: 20, color: 'var(--ink)' }}>{value}</b> {label}
    </span>
  );
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        height: 44,
        padding: '0 18px',
        borderRadius: 12,
        border: active ? '1px solid transparent' : '1px solid #D2D7DA',
        background: active ? 'var(--onchain)' : '#fff',
        color: active ? '#fff' : 'var(--ink)',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer: platform → tokens → issuers, joined by curved connectors     */
/* ------------------------------------------------------------------ */

function PlatformDrawer({
  platform,
  focus,
  onClose,
}: {
  platform: Platform;
  focus: string | null;
  onClose: () => void;
}) {
  const meta = ORIGINS[platform.origin];

  // Group by issuer so each issuer block spans the rows of the tokens it mints.
  const issuers = Array.from(new Set(platform.assets.map((a) => a.issuer)));
  const ordered: Asset[] = issuers.flatMap((issuer) => platform.assets.filter((a) => a.issuer === issuer));

  const ROW = 52;
  const PITCH = 60;
  const height = ordered.length * PITCH - 8;
  const rowCenter = (i: number) => i * PITCH + ROW / 2;
  const middle = height / 2;
  const issuerCenter = (issuer: string) => {
    const idx = ordered.map((a, i) => (a.issuer === issuer ? i : -1)).filter((i) => i >= 0);
    return (rowCenter(idx[0]) + rowCenter(idx[idx.length - 1])) / 2;
  };

  const leftCurve = (y: number) => `M0 ${middle} C20 ${middle} 16 ${y} 30 ${y} M25 ${y - 3} L30 ${y} L25 ${y + 3}`;
  const rightCurve = (y: number, yi: number) => `M4 ${y} C22 ${y} 16 ${yi} 32 ${yi} M27 ${yi - 3} L32 ${yi} L27 ${yi + 3}`;

  const verb =
    platform.origin === 'onchain'
      ? 'runs the credit and mints '
      : platform.origin === 'direct'
        ? 'originates the loans behind '
        : 'runs the fund behind ';
  const by = issuers.length === 1 && issuers[0] === platform.name ? ' itself.' : `, issued by ${listWords(issuers)}.`;
  const kinds = Array.from(new Set(platform.assets.map((a) => a.detail))).join(', ');

  const rowBox: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: ROW,
    padding: '0 10px',
    border: '1px solid #ECEEED',
    borderRadius: 10,
    background: '#fff',
    alignSelf: 'center',
  };

  return (
    <aside
      aria-label={`${platform.name} details`}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: DRAWER_WIDTH,
        height: '100vh',
        overflowY: 'auto',
        background: '#fff',
        borderLeft: '1px solid var(--line-strong)',
        boxShadow: '-24px 0 48px rgba(17,28,36,.10)',
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '24px 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <Logo name={platform.name} tint={meta.tint} color={meta.text} size={52} />
          <div style={{ minWidth: 0 }}>
            <h2 className="serif" style={{ margin: 0, fontSize: 28, lineHeight: 1.05 }}>
              {platform.name}
            </h2>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: meta.text }}>
              {meta.role.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            border: '1px solid var(--line-strong)',
            borderRadius: 10,
            background: '#fff',
            color: '#4A5660',
            fontSize: 17,
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          ×
        </button>
      </div>

      <Block label="ABOUT">
        <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.6, color: '#2B3640' }}>
          {`${platform.name} ${verb}${plural(platform.assets.length, 'token')}${by}`}
        </p>
      </Block>

      <div style={{ display: 'flex', gap: 8, padding: '0 24px 18px' }}>
        <a className="btn" href="#website" style={{ flex: 1 }}>
          Visit website ↗
        </a>
        <Link className="btn" href={`/platform/${encodeURIComponent(platform.name)}`} style={{ flex: 1 }}>
          Full profile
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, padding: '18px 24px', borderTop: '1px solid #EDF0F1' }}>
        <Field label="LAYER" value={meta.role} />
        <Field label="KIND OF CREDIT" value={kinds} />
      </div>

      <div style={{ padding: '18px 24px 24px', borderTop: '1px solid #EDF0F1', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'var(--faint)' }}>THE PATH</span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `92px 36px minmax(0, 1fr) 36px 120px`,
            gridTemplateRows: `repeat(${ordered.length}, ${ROW}px)`,
            rowGap: 8,
            alignItems: 'stretch',
          }}
        >
          <div style={{ ...rowBox, gridColumn: 1, gridRow: `1 / span ${ordered.length}` }}>
            <Logo name={platform.name} tint={meta.tint} color={meta.text} size={24} />
            <span style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {platform.name}
            </span>
          </div>

          <Lane column={2} rows={ordered.length}>
            {ordered.map((a, i) => (
              <Curve key={a.t} d={leftCurve(rowCenter(i))} height={height} color={meta.color} />
            ))}
          </Lane>

          {ordered.map((a, i) => (
            <Fragment key={a.t}>
              <div
                style={{
                  gridColumn: 3,
                  gridRow: i + 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 2,
                  height: ROW,
                  padding: '0 12px',
                  border: '1px solid #ECEEED',
                  borderRadius: 10,
                  background: focus === a.t ? meta.tint : '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
                  <Link
                    className="mono"
                    href={`/token/${encodeURIComponent(a.t)}`}
                    style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {a.t}
                  </Link>
                  {USES[a.t] ? (
                    <Link
                      href={`/defi?token=${encodeURIComponent(a.t)}`}
                      style={{ fontSize: 11, fontWeight: 500, color: '#3342A8', textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      {defiLabel(a.t)}
                    </Link>
                  ) : null}
                </div>
                <span style={{ fontSize: 11.5, color: '#6A757E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.n}
                </span>
              </div>
            </Fragment>
          ))}

          <Lane column={4} rows={ordered.length}>
            {ordered.map((a, i) => (
              <Curve key={a.t} d={rightCurve(rowCenter(i), issuerCenter(a.issuer))} height={height} color={meta.color} />
            ))}
          </Lane>

          {issuers.map((issuer) => {
            const idx = ordered.map((a, i) => (a.issuer === issuer ? i : -1)).filter((i) => i >= 0);
            return (
              <div key={issuer} style={{ ...rowBox, gridColumn: 5, gridRow: `${idx[0] + 1} / span ${idx.length}` }}>
                <Logo name={issuer} tint="#F0F2F1" color="#4A5660" size={22} />
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {issuer}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--faint)' }}>{plural(idx.length, 'token')}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 24px 26px' }}>
        <Link className="btn" href="/directory" style={{ width: '100%', background: 'var(--ink)', borderColor: 'var(--ink)', color: '#fff', height: 48 }}>
          View in the Directory →
        </Link>
      </div>
    </aside>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '18px 24px', borderTop: '1px solid #EDF0F1' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'var(--faint)' }}>{label}</div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'var(--faint)' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 15 }}>{value}</div>
    </div>
  );
}

function Lane({ column, rows, children }: { column: number; rows: number; children: React.ReactNode }) {
  return <div style={{ gridColumn: column, gridRow: `1 / span ${rows}`, position: 'relative' }}>{children}</div>;
}

function Curve({ d, height, color }: { d: string; height: number; color: string }) {
  return (
    <svg width={36} height={height} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.3} />
    </svg>
  );
}

/** Every column from the source sheet: expand a platform row to see its own tokens. */
function TokenTable({
  platforms,
  focus,
  onPickPlatform,
}: {
  platforms: Platform[];
  focus: string | null;
  onPickPlatform: (platform: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!focus) return;
    const owner = platforms.find((p) => p.assets.some((a) => a.t === focus));
    if (owner) setExpanded((prev) => (prev.has(owner.name) ? prev : new Set(prev).add(owner.name)));
  }, [focus, platforms]);

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: '24%' }}>Name</th>
            <th>Ticker</th>
            <th>Asset Manager</th>
            <th>Asset Class</th>
            <th>Platform</th>
            <th>Networks</th>
            <th>Origin</th>
            <th>Form</th>
            <th style={{ textAlign: 'right' }}>In DeFi</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform, i) => {
            const open = expanded.has(platform.name);
            const meta = ORIGINS[platform.origin];
            const issuers = Array.from(new Set(platform.assets.map((a) => a.issuer)));
            const kinds = Array.from(new Set(platform.assets.map((a) => a.kind)));
            const forms = Array.from(new Set(platform.assets.map((a) => a.detail)));
            const networks = Array.from(new Set(platform.assets.flatMap((a) => parseNetworks(a.networks))));
            const inDefi = platform.assets.filter((a) => USES[a.t]).length;
            return (
              <Fragment key={platform.name}>
                <tr style={{ background: '#FAFBFA', cursor: 'pointer' }} onClick={() => toggle(platform.name)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Chevron open={open} />
                      <span className="mono" style={{ fontSize: 12, color: 'var(--faint)', width: 16, flex: 'none' }}>
                        {i + 1}
                      </span>
                      <Logo name={platform.name} tint={meta.tint} color={meta.text} size={28} />
                      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <button
                          className="linklike"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPickPlatform(platform.name);
                          }}
                          style={{ minHeight: 'auto', fontWeight: 500, fontSize: 13.5 }}
                        >
                          {platform.name}
                        </button>
                        <span style={{ fontSize: 12, color: 'var(--faint)' }}>{plural(platform.assets.length, 'asset')}</span>
                      </span>
                    </div>
                  </td>
                  <td className="muted">—</td>
                  <td style={{ color: 'var(--ink-2)' }}>{issuers.length > 1 ? `${issuers.length} managers` : issuers[0]}</td>
                  <td>{kinds.length > 1 ? `${kinds.length} kinds` : <span className="kpill">{kinds[0]}</span>}</td>
                  <td style={{ color: 'var(--ink-2)' }}>{platform.name}</td>
                  <td>
                    <ChainRow names={networks} />
                  </td>
                  <td style={{ color: 'var(--ink-2)' }}>{meta.label}</td>
                  <td className="muted">{forms.length > 1 ? `${forms.length} forms` : forms[0]}</td>
                  <td style={{ textAlign: 'right', color: 'var(--faint)' }}>{inDefi > 0 ? `${inDefi}/${platform.assets.length}` : '—'}</td>
                </tr>
                {open
                  ? platform.assets.map((asset, ai) => (
                      <tr key={asset.t} style={{ background: focus === asset.t ? '#F5F6FE' : 'transparent' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 26 }}>
                            <span className="mono" style={{ fontSize: 12, color: 'var(--faint)', width: 16, flex: 'none' }}>
                              {ai + 1}
                            </span>
                            <Logo name={platform.name} tint={meta.tint} color={meta.text} size={24} />
                            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                              <Link
                                className="mono"
                                href={`/token/${encodeURIComponent(asset.t)}`}
                                style={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: 'var(--ink)',
                                  textDecoration: 'none',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {asset.n}
                              </Link>
                              <span style={{ fontSize: 12, color: 'var(--faint)' }}>{asset.t}</span>
                            </span>
                          </div>
                        </td>
                        <td className="mono" style={{ color: 'var(--ink-2)' }}>
                          {asset.t}
                        </td>
                        <td style={{ color: 'var(--ink-2)' }}>{asset.issuer}</td>
                        <td>
                          <span className="kpill">{asset.kind}</span>
                        </td>
                        <td style={{ color: 'var(--ink-2)' }}>{platform.name}</td>
                        <td>
                          <ChainRow names={parseNetworks(asset.networks)} />
                        </td>
                        <td style={{ color: 'var(--ink-2)' }}>{asset.originLabel}</td>
                        <td className="muted">{asset.detail}</td>
                        <td style={{ textAlign: 'right' }}>
                          <Link
                            href={`/defi?token=${encodeURIComponent(asset.t)}`}
                            style={{ textDecoration: 'none', fontWeight: 500, color: USES[asset.t] ? '#3342A8' : '#9AA3AA' }}
                          >
                            {USES[asset.t] ? defiLabel(asset.t) : '—'}
                          </Link>
                        </td>
                      </tr>
                    ))
                  : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', flex: 'none' }}
    >
      <path d="M4 2 L8 6 L4 10" fill="none" stroke="#8A949C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
