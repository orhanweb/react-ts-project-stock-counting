import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { countLocationAPI } from "./Services/countLocationAPI";
import { countFormAPI } from "./Services/countFormAPI";
import { userAPI } from "./Services/userAPI"; // Güncellenmiş import
import { productAPI } from "./Services/productAPI"; // Yeni import
import { sessionAPI } from "./Services/sessionAPI"; // Güncellenmiş import

const rtkQueryMiddleware = [
  countLocationAPI.middleware,
  countFormAPI.middleware,
  userAPI.middleware,
  productAPI.middleware,
  sessionAPI.middleware,
];

export const store = configureStore({
  reducer: {
    [countLocationAPI.reducerPath]: countLocationAPI.reducer,
    [countFormAPI.reducerPath]: countFormAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [sessionAPI.reducerPath]: sessionAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryMiddleware),
});

// Listener
setupListeners(store.dispatch);

// RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
