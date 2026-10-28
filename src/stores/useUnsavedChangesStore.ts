import { create } from "zustand";

type UnsavedChangesState = {
  /** 저장하지 않은 변경이 있는 섹션들 — SettingsSection이 스스로 등록·해제한다 */
  dirtyIds: string[];
  /** 확인을 기다리는 이동. 있으면 「나갈까요?」 창이 뜬다 */
  pendingLeave: (() => void) | null;
  setDirty: (id: string, isDirty: boolean) => void;
  /** 이동하기 전에 부른다. 변경이 없으면 바로 이동하고, 있으면 확인을 받는다 */
  requestLeave: (leave: () => void) => void;
  confirmLeave: () => void;
  cancelLeave: () => void;
};

export const useUnsavedChangesStore = create<UnsavedChangesState>((set, get) => ({
  dirtyIds: [],
  pendingLeave: null,
  setDirty: (id, isDirty) =>
    set(state => {
      const has = state.dirtyIds.includes(id);
      if (isDirty === has) {
        return state;
      }
      return { dirtyIds: isDirty ? [...state.dirtyIds, id] : state.dirtyIds.filter(dirtyId => dirtyId !== id) };
    }),
  requestLeave: leave => {
    if (get().dirtyIds.length === 0) {
      leave();
      return;
    }
    set({ pendingLeave: leave });
  },
  confirmLeave: () => {
    const leave = get().pendingLeave;
    // 나가기로 했으면 변경은 버린 것이다. 이동 중에 다시 묻지 않게 비운다
    set({ pendingLeave: null, dirtyIds: [] });
    leave?.();
  },
  cancelLeave: () => set({ pendingLeave: null }),
}));
