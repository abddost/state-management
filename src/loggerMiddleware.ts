// src/loggerMiddleware.ts

export const logger =
  (store: any) => (next: Function) => (updater: Function) => {
    console.log("Previous State:", store.getState());
    next(updater);
    console.log("Next State:", store.getState());
  };
