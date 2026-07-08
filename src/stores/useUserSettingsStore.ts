import { create } from "zustand";

type UserSettingsState = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

export const useUserSettingsStore = create<UserSettingsState>(set => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
