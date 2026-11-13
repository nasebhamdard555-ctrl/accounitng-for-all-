import { createContext, useContext, type ReactNode } from 'react';
import type { AppPage, AppThemeId } from '../types/accounting';
import { getThemePreset, type PageTheme, type ThemePreset } from './pageThemes';

interface ThemeContextValue {
  themeId: AppThemeId;
  setThemeId: (id: AppThemeId) => void;
  preset: ThemePreset;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'classic_ledger',
  setThemeId: () => undefined,
  preset: getThemePreset('classic_ledger'),
});

export function ThemeProvider({
  themeId,
  setThemeId,
  children,
}: {
  themeId: AppThemeId;
  setThemeId: (id: AppThemeId) => void;
  children: ReactNode;
}) {
  const preset = getThemePreset(themeId);
  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, preset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function usePageTheme(page: AppPage): PageTheme {
  const { preset } = useContext(ThemeContext);
  return preset.pages[page];
}
