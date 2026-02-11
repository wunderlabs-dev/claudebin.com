"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { isNotNil } from "ramda";

type ThreadEmbedView = "default" | "embed";

type ThreadEmbedContextValue = {
  view: ThreadEmbedView;
  start: number | undefined;
  end: number | undefined;
  candidate: number | undefined;
  setView: (view: ThreadEmbedView) => void;
  setStart: (idx: number | undefined) => void;
  setEnd: (idx: number | undefined) => void;
  setCandidate: (idx: number | undefined) => void;
  from: number | undefined;
  to: number | undefined;
};

type ThreadEmbedState = {
  view: ThreadEmbedView;
  start: number | undefined;
  end: number | undefined;
  candidate: number | undefined;
};

type ThreadEmbedAction =
  | { type: "setView"; value: ThreadEmbedView }
  | { type: "setStart"; value: number | undefined }
  | { type: "setEnd"; value: number | undefined }
  | { type: "setCandidate"; value: number | undefined };

const INITIAL_STATE: ThreadEmbedState = {
  view: "default",
  start: undefined,
  end: undefined,
  candidate: undefined,
};

const ThreadEmbedContext = createContext<ThreadEmbedContextValue>({
  view: "default",
  start: undefined,
  end: undefined,
  candidate: undefined,
  setView: () => {},
  setStart: () => {},
  setEnd: () => {},
  setCandidate: () => {},
  from: undefined,
  to: undefined,
});

const reducer = (state: ThreadEmbedState, action: ThreadEmbedAction): ThreadEmbedState => {
  switch (action.type) {
    case "setView":
      if (action.value === "default") return { ...INITIAL_STATE };
      return { ...state, view: action.value };
    case "setStart":
      return { ...state, start: action.value, end: undefined, candidate: undefined };
    case "setEnd":
      return { ...state, end: action.value, candidate: undefined };
    case "setCandidate":
      return { ...state, candidate: action.value };
  }
};

type ThreadEmbedProviderProps = {
  children: React.ReactNode;
};

const ThreadEmbedProvider = ({ children }: ThreadEmbedProviderProps) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setView = (value: ThreadEmbedView) => dispatch({ type: "setView", value });
  const setStart = (value: number | undefined) => dispatch({ type: "setStart", value });
  const setEnd = (value: number | undefined) => dispatch({ type: "setEnd", value });
  const setCandidate = (value: number | undefined) => dispatch({ type: "setCandidate", value });

  const from = useMemo(
    () =>
      isNotNil(state.start) && isNotNil(state.end) ? Math.min(state.start, state.end) : undefined,
    [state.start, state.end],
  );

  const to = useMemo(
    () =>
      isNotNil(state.start) && isNotNil(state.end) ? Math.max(state.start, state.end) : undefined,
    [state.start, state.end],
  );

  return (
    <ThreadEmbedContext.Provider
      value={{
        view: state.view,
        start: state.start,
        end: state.end,
        candidate: state.candidate,
        setView,
        setStart,
        setEnd,
        setCandidate,
        from,
        to,
      }}
    >
      {children}
    </ThreadEmbedContext.Provider>
  );
};

const useThreadEmbed = () => useContext(ThreadEmbedContext);

export { ThreadEmbedProvider, useThreadEmbed };
