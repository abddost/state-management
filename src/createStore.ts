// src/createStore.ts

import { EventStore } from "./eventStore";
import { createCommandHandler } from "./commandHandler";
import { createStateProjection } from "./stateProjection";
import { createUseStore } from "./useStore"; // <-- Import the useStore hook

import {
  Command,
  Event,
  State,
  Subscriber,
  Selector,
  SetState,
  CommandHandlers,
} from "./types";

export function createStore(
  initializer: (set: SetState) => any,
  initialState: State = {},
  middlewares: ((store: any) => (next: SetState) => SetState)[] = []
) {
  const eventStore = new EventStore();
  const subscribers: Subscriber[] = [];

  const updaters: Record<string, (state: State, event: Event) => State> = {};

  const { applyEvent, getState } = createStateProjection(
    initialState,
    updaters
  );

  const stateProjection = { applyEvent, getState };

  const commandHandlers: CommandHandlers = {
    UpdateState: (command) => {
      const updater = command.payload;
      const newState = updater(stateProjection.getState());
      const event: Event = {
        type: "StateUpdated",
        payload: newState,
        timestamp: Date.now(),
      };
      return [event]; // Return an array of events
    },
    // You can add more command handlers here
  };

  const commandHandler = createCommandHandler(commandHandlers);

  const set: SetState = (updater) => {
    // Create a command
    const command: Command = {
      type: "UpdateState",
      payload: updater,
    };

    // Process command
    const events = commandHandler(command);

    // Store events and apply them to the state
    events.forEach((event) => {
      eventStore.append(event as any);
      stateProjection.applyEvent(event as Event);
    });

    // Notify subscribers
    subscribers.forEach((subscriber) => subscriber());
  };

  const enhancedSet: SetState = middlewares
    .slice()
    .reverse()
    // @ts-ignore
    .reduce((next, middleware) => middleware(store)(next), set);

  // Use enhancedSet instead of set
  // Initialize the user-defined API (state and actions)
  const api = initializer(enhancedSet);

  const subscribe = (subscriber: Subscriber) => {
    subscribers.push(subscriber);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  // At the end of createStore function
  const useStoreHook = createUseStore({
    getState: stateProjection.getState,
    subscribe,
  });

  return {
    ...api,
    getState: stateProjection.getState,
    subscribe,
    useStore: useStoreHook,
  };
}
