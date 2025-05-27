import { createContext } from "react";
import { useAppSettings as useAppSettingsHook } from "@/hooks/useAppSettings";
import { PlayMode } from "@/types";

export const AppSettingsContext = createContext<ReturnType<
  typeof useAppSettingsHook
> | null>(null);

export const AppSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const settings = useAppSettingsHook();

  return (
    <AppSettingsContext.Provider value={settings}>
      {children}
    </AppSettingsContext.Provider>
  );
};
