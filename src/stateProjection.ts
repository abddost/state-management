// src/stateProjection.ts

import { Event, State, StateUpdater } from "./types";

export function createStateProjection(
  initialState: State,
  updaters: Record<string, (state: State, event: Event) => State>
) {
  let state = initialState;

  const applyEvent = (event: Event) => {
    const updater = updaters[event.type];
    if (updater) {
      state = updater(state, event);
    }
  };

  const getState = () => state;

  return { applyEvent, getState };
}
