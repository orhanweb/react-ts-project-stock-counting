import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { countLocationAPI } from "./Services/countLocationAPI";
import { productsInfosAPI } from "./Services/productsInfosAPI";
import { countFormAPI } from "./Services/countFormAPI";

const rtkQueryMiddleware = [
  countLocationAPI.middleware,
  productsInfosAPI.middleware,
  countFormAPI.middleware,
];

export const store = configureStore({
  reducer: {
    // Add API reducers here
    [countLocationAPI.reducerPath]: countLocationAPI.reducer,
    [productsInfosAPI.reducerPath]: productsInfosAPI.reducer,
    [countFormAPI.reducerPath]: countFormAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryMiddleware),
});

// Listener
setupListeners(store.dispatch);

// RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
