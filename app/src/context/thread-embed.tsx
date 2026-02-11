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
  | { type: "SET_VIEW"; value: ThreadEmbedView }
  | { type: "SET_START"; value: number | undefined }
  | { type: "SET_END"; value: number | undefined }
  | { type: "SET_CANDIDATE"; value: number | undefined };

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
  from: undefined,
  to: undefined,
  setView: () => { },
  setStart: () => { },
  setEnd: () => { },
  setCandidate: () => { },
});

const reducer = (state: ThreadEmbedState, action: ThreadEmbedAction): ThreadEmbedState => {
  switch (action.type) {
    case "SET_VIEW":
      return action.value === "default" ? INITIAL_STATE : { ...state, view: action.value };
    case "SET_START":
      return { ...state, start: action.value, end: undefined, candidate: undefined };
    case "SET_END":
      return { ...state, end: action.value, candidate: undefined };
    case "SET_CANDIDATE":
      return { ...state, candidate: action.value };
  }
};

type ThreadEmbedProviderProps = {
  children: React.ReactNode;
};

const ThreadEmbedProvider = ({ children }: ThreadEmbedProviderProps) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const from = useMemo(() => {
    if (isNotNil(state.start) && isNotNil(state.end)) {
      return Math.min(state.start, state.end);
    }
    return undefined;
  }, [state.start, state.end]);

  const to = useMemo(() => {
    if (isNotNil(state.start) && isNotNil(state.end)) {
      return Math.max(state.start, state.end);
    }
    return undefined;
  }, [state.start, state.end]);

  const setView = (value: ThreadEmbedView) => {
    dispatch({ type: "SET_VIEW", value });
  };
  const setStart = (value: number | undefined) => {
    dispatch({ type: "SET_START", value });
  };
  const setEnd = (value: number | undefined) => {
    dispatch({ type: "SET_END", value });
  };
  const setCandidate = (value: number | undefined) => {
    dispatch({ type: "SET_CANDIDATE", value });
  };

  return (
    <ThreadEmbedContext.Provider
      value={{
        view: state.view,
        start: state.start,
        end: state.end,
        candidate: state.candidate,
        from,
        to,
        setView,
        setStart,
        setEnd,
        setCandidate,
      }}
    >
      {children}
    </ThreadEmbedContext.Provider>
  );
};

const useThreadEmbed = () => useContext(ThreadEmbedContext);

export { ThreadEmbedProvider, useThreadEmbed };
