import { createContext, useContext } from "react";

export const TimerStateContext = createContext(null);

export function useSharedTimerState() {
  const context = useContext(TimerStateContext);
  if (!context) {
    throw new Error("Timer components must be rendered inside TimerStateProvider.");
  }
  return context;
}
