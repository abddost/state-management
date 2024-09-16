export const persistence =
  (key: string) => (store: any) => (next: Function) => (updater: Function) => {
    next(updater);
    const state = store.getState();
    localStorage.setItem(key, JSON.stringify(state));
  };
