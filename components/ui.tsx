'use client';

import type { ReactNode } from 'react';
import { chainMeta } from '@/lib/chains';
import { logoFor } from '@/lib/logos';
import { initials } from '@/lib/utils';

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; color?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.color ? <span className="dot" style={{ background: o.color }} /> : null}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Pill({ children, tint, text }: { children: ReactNode; tint: string; text: string }) {
  return (
    <span className="pill" style={{ background: tint, color: text }}>
      {children}
    </span>
  );
}

export function Logo({
  name,
  tint,
  color,
  size = 30,
}: {
  /** Project or issuer name; used to find /public/logos/<slug>.<ext> */
  name: string;
  tint: string;
  color: string;
  size?: number;
}) {
  const src = logoFor(name);
  const radius = size > 34 ? 12 : 8;

  if (src) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: '#fff',
          boxShadow: 'inset 0 0 0 1px #E8EBEA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          overflow: 'hidden',
        }}
      >
        {/* plain <img> so any file type in /public/logos works without next/image config */}
        <img
          src={src}
          alt={`${name} logo`}
          width={Math.round(size * 0.72)}
          height={Math.round(size * 0.72)}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: tint,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size > 34 ? 13 : 11,
        fontWeight: 600,
        flex: 'none',
      }}
    >
      {initials(name)}
    </span>
  );
}

export function ChainBadge({ name, size = 20 }: { name: string; size?: number }) {
  const meta = chainMeta(name);
  const glyph = meta.glyph ?? meta.label.charAt(0).toUpperCase();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      role="img"
      aria-label={meta.label}
      style={{ flex: 'none', borderRadius: '50%', boxShadow: '0 0 0 2px #fff' }}
    >
      <title>{meta.label}</title>
      <circle cx="10" cy="10" r="10" fill={meta.color} />
      {meta.mark === 'diamond' && <polygon points="10,4 16,10 10,16 4,10" fill="#fff" />}
      {meta.mark === 'hexagon' && <polygon points="10,3 16,6.5 16,13.5 10,17 4,13.5 4,6.5" fill="#fff" />}
      {meta.mark === 'triangle' && <polygon points="10,4 16,15 4,15" fill="#fff" />}
      {meta.mark === 'bars' && (
        <>
          <rect x="4" y="6" width="12" height="2" rx="1" fill="#fff" />
          <rect x="4" y="9" width="12" height="2" rx="1" fill="#fff" />
          <rect x="4" y="12" width="12" height="2" rx="1" fill="#fff" />
        </>
      )}
      {meta.mark === 'letter' && (
        <text
          x="10"
          y="13.5"
          textAnchor="middle"
          fontSize={glyph.length > 1 ? 7.5 : 10}
          fontWeight={700}
          fill="#fff"
        >
          {glyph}
        </text>
      )}
    </svg>
  );
}

export function ChainRow({ names, max = 4, size = 20 }: { names: string[]; max?: number; size?: number }) {
  if (names.length === 0) return <span className="muted" style={{ fontSize: 12.5 }}>—</span>;
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {shown.map((n, i) => (
        <span key={n} style={{ marginLeft: i === 0 ? 0 : -6, lineHeight: 0 }}>
          <ChainBadge name={n} size={size} />
        </span>
      ))}
      {extra > 0 ? (
        <span
          style={{
            marginLeft: -6,
            width: size,
            height: size,
            borderRadius: '50%',
            background: '#EDEFEE',
            color: '#56626C',
            fontSize: size * 0.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 2px #fff',
            flex: 'none',
          }}
        >
          +{extra}
        </span>
      ) : null}
    </span>
  );
}

export function SearchBox({
  placeholder,
  value,
  onChange,
  children,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="searchbox">
      <label>
        <span className="sr">{placeholder}</span>
        <svg width="16" height="16" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="#56626C" strokeWidth="1.6" />
          <path d="M11 11 L15 15" stroke="#56626C" strokeWidth="1.6" />
        </svg>
        <input
          className="search"
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      {children}
    </div>
  );
}
