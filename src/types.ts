// src/types.ts

export type Command = {
  type: string;
  payload?: any;
};

export type Event = {
  type: string;
  payload?: any;
  timestamp: number;
};

export type State = any;

export type CommandHandler = (command: Command) => Event[];

export type CommandHandlers = Record<string, (command: Command) => Event[]>;

export type EventHandler = (event: Event) => void;

export type StateUpdater = (state: State, event: Event) => State;

export type Subscriber = () => void;

export type Selector<T> = (state: State) => T;

export type SetState = (updater: (state: State) => State) => void;
