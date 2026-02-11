"use client";

import { createContext, useContext, useReducer } from "react";

import { isIndexWithin } from "@/utils/helpers";

export type EmbedRange =
  | { status: "idle" }
  | { status: "selecting"; from: number }
  | { status: "complete"; from: number; to: number };

type ThreadEmbedContextValue = {
  isEmbedMode: boolean;
  embedRange: EmbedRange;
  previewTo: number | undefined;
  setEmbedMode: (value: boolean) => void;
  selectEmbedIndex: (idx: number) => void;
  setEmbedPreviewTo: (value: number | undefined) => void;
  isInEmbedSelection: (idx: number) => boolean;
};

const INITIAL_RANGE: EmbedRange = { status: "idle" };

const ThreadEmbedContext = createContext<ThreadEmbedContextValue>({
  isEmbedMode: false,
  embedRange: INITIAL_RANGE,
  previewTo: undefined,
  setEmbedMode: () => {},
  selectEmbedIndex: () => {},
  setEmbedPreviewTo: () => {},
  isInEmbedSelection: () => false,
});

type ThreadEmbedProviderProps = {
  children: React.ReactNode;
};

type ThreadEmbedState = {
  isEmbedMode: boolean;
  embedRange: EmbedRange;
  previewTo: number | undefined;
};

type ThreadEmbedAction =
  | { type: "setMode"; value: boolean }
  | { type: "select"; idx: number }
  | { type: "preview"; value: number | undefined };

const INITIAL_STATE: ThreadEmbedState = {
  isEmbedMode: false,
  embedRange: INITIAL_RANGE,
  previewTo: undefined,
};

const reducer = (state: ThreadEmbedState, action: ThreadEmbedAction): ThreadEmbedState => {
  if (action.type === "setMode") {
    if (action.value) return { ...state, isEmbedMode: true };
    return { ...INITIAL_STATE };
  }

  if (action.type === "select") {
    const prev = state.embedRange;

    if (prev.status === "idle") {
      return { ...state, embedRange: { status: "selecting", from: action.idx } };
    }
    if (prev.status === "selecting") {
      const from = Math.min(prev.from, action.idx);
      const to = Math.max(prev.from, action.idx);

      return { ...state, embedRange: { status: "complete", from, to } };
    }
    return { ...state, embedRange: { status: "selecting", from: action.idx } };
  }

  return { ...state, previewTo: action.value };
};

const ThreadEmbedProvider = ({ children }: ThreadEmbedProviderProps) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setEmbedMode = (value: boolean) => {
    dispatch({ type: "setMode", value });
  };

  const selectEmbedIndex = (idx: number) => {
    dispatch({ type: "select", idx });
  };

  const setEmbedPreviewTo = (value: number | undefined) => {
    dispatch({ type: "preview", value });
  };

  const isInEmbedSelection = (idx: number) => {
    if (state.embedRange.status === "idle") return false;

    const from = state.embedRange.from;
    const to = state.embedRange.status === "complete" ? state.embedRange.to : state.previewTo;
    if (to === undefined) return false;

    return isIndexWithin(idx, from, to);
  };

  return (
    <ThreadEmbedContext.Provider
      value={{
        isEmbedMode: state.isEmbedMode,
        embedRange: state.embedRange,
        previewTo: state.previewTo,
        setEmbedMode,
        selectEmbedIndex,
        setEmbedPreviewTo,
        isInEmbedSelection,
      }}
    >
      {children}
    </ThreadEmbedContext.Provider>
  );
};

const useThreadEmbed = () => useContext(ThreadEmbedContext);

export { ThreadEmbedProvider, useThreadEmbed };
