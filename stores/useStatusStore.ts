import { create } from "zustand";

import { SiteStatusData } from "@/components/pages-component/root/monitors/SystemStatusListTable/SystemStatusListTable";

interface StatusStore {
  status: SiteStatusData | null;
  setStatus: (status: SiteStatusData) => void;
}

export const useStatusStore = create<StatusStore>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
}));
