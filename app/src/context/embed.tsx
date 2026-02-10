"use client";

import { createContext, useContext, useState } from "react";

type EmbedView = "view" | "embed";

type EmbedContextValue = {
  view: EmbedView;
  onChangeEmbedMode: () => void;
};

const EmbedContext = createContext<EmbedContextValue>({
  view: "view",
  onChangeEmbedMode: () => {},
});

type EmbedProviderProps = {
  children: React.ReactNode;
};

const EmbedProvider = ({ children }: EmbedProviderProps) => {
  const [view, setView] = useState<EmbedView>("view");

  const onChangeEmbedMode = () => {
    if (view === "embed") {
      setView("view");
    } else {
      setView("embed");
    }
  };

  return (
    <EmbedContext.Provider
      value={{
        view,
        onChangeEmbedMode,
      }}
    >
      {children}
    </EmbedContext.Provider>
  );
};

const useEmbedMode = () => useContext(EmbedContext);

export { EmbedProvider, useEmbedMode };
