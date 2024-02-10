"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface SidebarContextValue {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const value: SidebarContextValue = {
    isSidebarOpen,
    toggleSidebar,
    setIsSidebarOpen,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
