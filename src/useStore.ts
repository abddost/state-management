// src/useStore.ts

import { useEffect, useState } from "react";
import { Selector, Subscriber } from "./types";

export function createUseStore(store: any) {
  return function useStore<T>(selector: Selector<T>): T {
    const [selectedState, setSelectedState] = useState(() =>
      selector(store.getState())
    );

    useEffect(() => {
      const checkForUpdates = () => {
        const newSelectedState = selector(store.getState());
        setSelectedState(newSelectedState);
      };
      const unsubscribe = store.subscribe(checkForUpdates);
      return () => unsubscribe();
    }, [selector]);

    return selectedState;
  };
}
