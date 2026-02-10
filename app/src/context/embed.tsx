"use client";

import { createContext, useContext, useState } from "react";

type EmbedView = "view" | "embed";

type EmbedContextValue = {
  view: EmbedView;
  from: number | null;
  to: number | null;
  hovered: number | null;
  onChangeEmbedMode: () => void;
  onSelectMessage: (index: number) => void;
  onHoverMessage: (index: number | null) => void;
  onFromChange: (value: number | null) => void;
  onToChange: (value: number | null) => void;
};

const EmbedContext = createContext<EmbedContextValue>({
  view: "view",
  from: null,
  to: null,
  hovered: null,
  onChangeEmbedMode: () => {},
  onSelectMessage: () => {},
  onHoverMessage: () => {},
  onFromChange: () => {},
  onToChange: () => {},
});

type EmbedProviderProps = {
  children: React.ReactNode;
};

const EmbedProvider = ({ children }: EmbedProviderProps) => {
  const [view, setView] = useState<EmbedView>("view");
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const onChangeEmbedMode = () => {
    if (view === "embed") {
      setView("view");
      setFrom(null);
      setTo(null);
      setHovered(null);
    } else {
      setView("embed");
    }
  };

  const onSelectMessage = (index: number) => {
    if (from === null) {
      setFrom(index);
    } else if (to === null) {
      if (index < from) {
        setFrom(index);
      } else {
        setTo(index);
      }
    } else {
      setFrom(null);
      setTo(null);
    }
  };

  const onHoverMessage = (index: number | null) => {
    setHovered(index);
  };

  const onFromChange = (value: number | null) => {
    if (value !== null && to !== null && value > to) {
      return;
    }
    setFrom(value);
  };

  const onToChange = (value: number | null) => {
    if (value !== null && from !== null && value < from) {
      return;
    }
    setTo(value);
  };

  return (
    <EmbedContext.Provider
      value={{
        view,
        from,
        to,
        hovered,
        onChangeEmbedMode,
        onSelectMessage,
        onHoverMessage,
        onFromChange,
        onToChange,
      }}
    >
      {children}
    </EmbedContext.Provider>
  );
};

const useEmbedMode = () => useContext(EmbedContext);

export { EmbedProvider, useEmbedMode };
