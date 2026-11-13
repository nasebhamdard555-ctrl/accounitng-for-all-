import test from 'node:test';
import assert from 'node:assert/strict';
import type { AppPage } from '../types/accounting';
import {
  getPageTheme,
  getThemePreset,
  isValidThemeId,
  THEME_PRESET_IDS,
} from './pageThemes';

const ALL_PAGES: AppPage[] = [
  'home',
  'customers',
  'vendors',
  'inventory',
  'banking',
  'pos_sync',
  'reports',
  'settings',
];

test('all theme presets define complete and distinct per-page themes', () => {
  assert.equal(THEME_PRESET_IDS.length, 4);

  for (const id of THEME_PRESET_IDS) {
    assert.equal(isValidThemeId(id), true);
    const preset = getThemePreset(id);
    assert.equal(preset.swatches.length, 3);

    const headerColors = new Set<string>();
    for (const page of ALL_PAGES) {
      const pTheme = getPageTheme(id, page);
      assert.ok(pTheme.canvasBg.length > 0);
      assert.ok(pTheme.accentBg.length > 0);
      assert.ok(pTheme.headingText.length > 0);
      headerColors.add(pTheme.headerBg);
    }

    assert.equal(headerColors.size, ALL_PAGES.length);
  }
});

test('getThemePreset and getPageTheme safely fall back to classic_ledger for invalid IDs', () => {
  assert.equal(isValidThemeId('flashy_neon'), false);
  const fallback = getThemePreset('unknown_theme');
  assert.equal(fallback.id, 'classic_ledger');
  assert.equal(
    getPageTheme('unknown_theme', 'customers').accentBg,
    getPageTheme('classic_ledger', 'customers').accentBg
  );
});
