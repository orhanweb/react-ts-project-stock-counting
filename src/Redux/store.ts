import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { countLocationAPI } from './Services/countLocationAPI';
import { productsInfosAPI } from './Services/productsInfosAPI';

const rtkQueryMiddleware = [
    countLocationAPI.middleware,
    productsInfosAPI.middleware,
];

export const store = configureStore({
  reducer: {
    // API reducer'larını buraya ekleyin
    [countLocationAPI.reducerPath]: countLocationAPI.reducer,
    [productsInfosAPI.reducerPath]: productsInfosAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryMiddleware),
});

// Listener
setupListeners(store.dispatch);

// RootState ve AppDispatch tipler
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
