import { useState, useCallback } from "react";

// Custom hook used to manage multiple states on pages at once
export const useStateManager = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);

  // To update a single state value
  const updateState = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  // To update multiple state values
  const updateMultipleStates = useCallback(
    (actions: { key: keyof T; value: T[keyof T] }[]) => {
      setState((prevState) => {
        return actions.reduce((newState, action) => {
          const { key, value } = action;
          return { ...newState, [key]: value };
        }, prevState);
      });
    },
    []
  );

  return { state, updateState, updateMultipleStates };
};
