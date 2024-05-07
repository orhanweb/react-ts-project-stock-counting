import { useState, useEffect } from "react";

interface LoadingState {
  isLoading: boolean;
  messages: string[];
}

interface LoadingConfig {
  isLoading: boolean;
  message: string;
}

// Custom hook to manage multiple loading states
export const useLoadingManager = (configs: LoadingConfig[]) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    messages: [],
  });

  useEffect(() => {
    const messages = configs.filter((c) => c.isLoading).map((c) => c.message);
    const isLoading = messages.length > 0;

    setLoadingState({ isLoading, messages });
  }, [configs.map((c) => c.isLoading).join(",")]);

  return loadingState;
};
