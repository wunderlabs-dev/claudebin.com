"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type ThreadEmbedView = "view" | "embed";

export type ThreadEmbedSelection = {
  from: number | undefined;
  to: number | undefined;
};

type ThreadEmbedContextValue = {
  view: ThreadEmbedView;
  selection: ThreadEmbedSelection;
  onChangeEmbedMode: () => void;
  onSetSelection: (idx: number) => void;
};

const INITIAL_SELECTION: ThreadEmbedSelection = { from: undefined, to: undefined };

const ThreadEmbedContext = createContext<ThreadEmbedContextValue>({
  view: "view",
  selection: INITIAL_SELECTION,
  onChangeEmbedMode: () => {},
  onSetSelection: () => {},
});

type ThreadEmbedProviderProps = {
  children: React.ReactNode;
};

const ThreadEmbedProvider = ({ children }: ThreadEmbedProviderProps) => {
  const [view, setView] = useState<ThreadEmbedView>("view");
  const [selection, setSelection] = useState<ThreadEmbedSelection>(INITIAL_SELECTION);

  const onChangeEmbedMode = () => {
    if (view === "embed") {
      setView("view");
    } else {
      setView("embed");
    }
    setSelection(INITIAL_SELECTION);
  };

  const onSetSelection = useCallback((idx: number) => {
    setSelection((prev) => {
      if (prev.from === undefined) {
        return { from: idx, to: undefined };
      }
      if (prev.to === undefined) {
        return { from: prev.from, to: idx };
      }
      return { from: idx, to: undefined };
    });
  }, []);

  return (
    <ThreadEmbedContext.Provider
      value={{
        view,
        selection,
        onChangeEmbedMode,
        onSetSelection,
      }}
    >
      {children}
    </ThreadEmbedContext.Provider>
  );
};

const useThreadEmbed = () => useContext(ThreadEmbedContext);

export { ThreadEmbedProvider, useThreadEmbed };
export type { ThreadEmbedSelection };
