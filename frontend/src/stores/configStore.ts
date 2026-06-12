import { create } from 'zustand'

interface ConfigState {
  sidebarCollapsed: boolean
  themeColor: string
  language: 'zh-CN' | 'en-US'
  toggleSidebar: () => void
  setThemeColor: (color: string) => void
  setLanguage: (lang: 'zh-CN' | 'en-US') => void
}

export const useConfigStore = create<ConfigState>()((set) => ({
  sidebarCollapsed: false,
  themeColor: '#1677FF',
  language: 'zh-CN',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setThemeColor: (color) => set({ themeColor: color }),
  setLanguage: (lang) => set({ language: lang }),
}))
