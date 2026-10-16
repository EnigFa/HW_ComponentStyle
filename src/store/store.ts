import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const CART_STORAGE_KEY = "cart";

export const store = configureStore({
    reducer: {
        cart: cartReducer
    }
});

store.subscribe(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
