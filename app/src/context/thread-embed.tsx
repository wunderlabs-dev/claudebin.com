"use client";

import { createContext, useContext, useState } from "react";

type ThreadEmbedView = "view" | "embed";

type ThreadEmbedContextValue = {
  view: ThreadEmbedView;
  onChangeEmbedMode: () => void;
};

const ThreadEmbedContext = createContext<ThreadEmbedContextValue>({
  view: "view",
  onChangeEmbedMode: () => {},
});

type ThreadEmbedProviderProps = {
  children: React.ReactNode;
};

const ThreadEmbedProvider = ({ children }: ThreadEmbedProviderProps) => {
  const [view, setView] = useState<ThreadEmbedView>("view");

  const onChangeEmbedMode = () => {
    if (view === "embed") {
      setView("view");
    } else {
      setView("embed");
    }
  };

  return (
    <ThreadEmbedContext.Provider
      value={{
        view,
        onChangeEmbedMode,
      }}
    >
      {children}
    </ThreadEmbedContext.Provider>
  );
};

const useThreadEmbed = () => useContext(ThreadEmbedContext);

export { ThreadEmbedProvider, useThreadEmbed };
