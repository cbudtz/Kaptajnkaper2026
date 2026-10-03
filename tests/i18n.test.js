import { describe, expect, it } from 'vitest';
import { formatString, setActiveLocale } from '../src/i18n/index.js';

describe('i18n', () => {
  it('formats Danish map labels', () => {
    setActiveLocale('da');
    expect(formatString('Map1', 42)).toContain('42');
    expect(formatString('Welcome1')).toBe('Kaptajn Kaper i Kattegat');
  });

  it('switches to English', () => {
    setActiveLocale('en');
    expect(formatString('PlayerName1')).toMatch(/ship/i);
  });
});
