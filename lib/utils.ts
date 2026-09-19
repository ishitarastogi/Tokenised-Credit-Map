// lib/utils.ts — small shared helpers.

export const initials = (name: string): string =>
  name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '.';

export const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? '' : 's'}`;

export const listWords = (items: string[]): string =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
