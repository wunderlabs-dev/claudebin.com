"use client";

import { createContext, useContext, useState } from "react";

type EmbedView = "view" | "embed";

type EmbedContextValue = {
  view: EmbedView;
  handleEmbedMode: () => void;
};

const EmbedContext = createContext<EmbedContextValue>({
  view: "view",
  handleEmbedMode: () => {},
});

type EmbedProviderProps = {
  children: React.ReactNode;
};

const EmbedProvider = ({ children }: EmbedProviderProps) => {
  const [view, setView] = useState<EmbedView>("view");

  const handleEmbedMode = () => {
    if (view === "embed") {
      setView("view");
    } else {
      setView("embed");
    }
  };

  return (
    <EmbedContext.Provider value={{ view, handleEmbedMode }}>{children}</EmbedContext.Provider>
  );
};

const useEmbedMode = () => useContext(EmbedContext);

export { EmbedProvider, useEmbedMode };
