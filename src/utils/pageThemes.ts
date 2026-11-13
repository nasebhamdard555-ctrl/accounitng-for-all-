import type { AppPage } from '../types/accounting';

export interface PageTheme {
  canvasBg: string;
  headerBg: string;
  headerBorder: string;
  cardBorder: string;
  headingText: string;
  accentBg: string;
  accentHover: string;
  accentText: string;
  accentRing: string;
  navActiveBg: string;
  navActiveText: string;
  navActiveBorder: string;
  subtleCardBg: string;
  softButtonBg: string;
  softButtonText: string;
}

export const PAGE_THEMES: Record<AppPage, PageTheme> = {
  home: {
    canvasBg: 'bg-[#F4F6FA]',
    headerBg: 'bg-[#E8EEF7]',
    headerBorder: 'border-[#CBD7E6]',
    cardBorder: 'border-[#D3DFEE]',
    headingText: 'text-[#1E3A5F]',
    accentBg: 'bg-[#2B4C7E]',
    accentHover: 'hover:bg-[#223D66]',
    accentText: 'text-[#2B4C7E]',
    accentRing: 'focus:ring-[#2B4C7E]',
    navActiveBg: 'bg-[#E8EEF7]',
    navActiveText: 'text-[#1E3A5F]',
    navActiveBorder: 'border-[#B9CAE0]',
    subtleCardBg: 'bg-[#EFF4FA]',
    softButtonBg: 'bg-[#E2EBF6] hover:bg-[#D4E2F2]',
    softButtonText: 'text-[#1E3A5F]',
  },
  customers: {
    canvasBg: 'bg-[#F3F7F5]',
    headerBg: 'bg-[#E5EFEA]',
    headerBorder: 'border-[#C6DBD1]',
    cardBorder: 'border-[#CFE0D8]',
    headingText: 'text-[#1E4234]',
    accentBg: 'bg-[#2E6B52]',
    accentHover: 'hover:bg-[#245642]',
    accentText: 'text-[#2E6B52]',
    accentRing: 'focus:ring-[#2E6B52]',
    navActiveBg: 'bg-[#E5EFEA]',
    navActiveText: 'text-[#1E4234]',
    navActiveBorder: 'border-[#B5CFC3]',
    subtleCardBg: 'bg-[#EDF5F1]',
    softButtonBg: 'bg-[#E0EDE7] hover:bg-[#D1E4DC]',
    softButtonText: 'text-[#1E4234]',
  },
  vendors: {
    canvasBg: 'bg-[#F8F6F2]',
    headerBg: 'bg-[#F0E9DF]',
    headerBorder: 'border-[#DDD0BE]',
    cardBorder: 'border-[#E2D7C7]',
    headingText: 'text-[#4B3821]',
    accentBg: 'bg-[#8A5A2B]',
    accentHover: 'hover:bg-[#724921]',
    accentText: 'text-[#8A5A2B]',
    accentRing: 'focus:ring-[#8A5A2B]',
    navActiveBg: 'bg-[#F0E9DF]',
    navActiveText: 'text-[#4B3821]',
    navActiveBorder: 'border-[#D4C3AC]',
    subtleCardBg: 'bg-[#F5EFE7]',
    softButtonBg: 'bg-[#ECE1D3] hover:bg-[#E2D3C0]',
    softButtonText: 'text-[#4B3821]',
  },
  inventory: {
    canvasBg: 'bg-[#F4F5F9]',
    headerBg: 'bg-[#E7E9F3]',
    headerBorder: 'border-[#CBD0E4]',
    cardBorder: 'border-[#D3D7E8]',
    headingText: 'text-[#283254]',
    accentBg: 'bg-[#435384]',
    accentHover: 'hover:bg-[#36436C]',
    accentText: 'text-[#435384]',
    accentRing: 'focus:ring-[#435384]',
    navActiveBg: 'bg-[#E7E9F3]',
    navActiveText: 'text-[#283254]',
    navActiveBorder: 'border-[#BCC3DC]',
    subtleCardBg: 'bg-[#EEF0F7]',
    softButtonBg: 'bg-[#E1E5F2] hover:bg-[#D3D9EB]',
    softButtonText: 'text-[#283254]',
  },
  banking: {
    canvasBg: 'bg-[#F3F7F9]',
    headerBg: 'bg-[#E4EEF3]',
    headerBorder: 'border-[#C5D8E2]',
    cardBorder: 'border-[#CEE0E8]',
    headingText: 'text-[#1C4052]',
    accentBg: 'bg-[#2A627B]',
    accentHover: 'hover:bg-[#214F64]',
    accentText: 'text-[#2A627B]',
    accentRing: 'focus:ring-[#2A627B]',
    navActiveBg: 'bg-[#E4EEF3]',
    navActiveText: 'text-[#1C4052]',
    navActiveBorder: 'border-[#B2CDD9]',
    subtleCardBg: 'bg-[#ECF3F7]',
    softButtonBg: 'bg-[#DCEAF1] hover:bg-[#CEE1EB]',
    softButtonText: 'text-[#1C4052]',
  },
  pos_sync: {
    canvasBg: 'bg-[#F8F4F4]',
    headerBg: 'bg-[#F0E5E5]',
    headerBorder: 'border-[#DCC6C6]',
    cardBorder: 'border-[#E2D0D0]',
    headingText: 'text-[#522727]',
    accentBg: 'bg-[#8C3B3B]',
    accentHover: 'hover:bg-[#732F2F]',
    accentText: 'text-[#8C3B3B]',
    accentRing: 'focus:ring-[#8C3B3B]',
    navActiveBg: 'bg-[#F0E5E5]',
    navActiveText: 'text-[#522727]',
    navActiveBorder: 'border-[#D4B8B8]',
    subtleCardBg: 'bg-[#F5ECEC]',
    softButtonBg: 'bg-[#EBDDDD] hover:bg-[#E1CECE]',
    softButtonText: 'text-[#522727]',
  },
  reports: {
    canvasBg: 'bg-[#F6F4F8]',
    headerBg: 'bg-[#EBE6F1]',
    headerBorder: 'border-[#D4CAE0]',
    cardBorder: 'border-[#DCD3E6]',
    headingText: 'text-[#3A2B4D]',
    accentBg: 'bg-[#5B4578]',
    accentHover: 'hover:bg-[#493761]',
    accentText: 'text-[#5B4578]',
    accentRing: 'focus:ring-[#5B4578]',
    navActiveBg: 'bg-[#EBE6F1]',
    navActiveText: 'text-[#3A2B4D]',
    navActiveBorder: 'border-[#C6B9D6]',
    subtleCardBg: 'bg-[#F1EDF6]',
    softButtonBg: 'bg-[#E5DFF0] hover:bg-[#D9D0E8]',
    softButtonText: 'text-[#3A2B4D]',
  },
};
