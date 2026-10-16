import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItemType } from "../types/CartItemType";
import type { CategoryProductType } from "../types/CategoryProductType";

const CART_STORAGE_KEY = "cart";

const loadCart = (): CartItemType[] => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
        return [];
    }

    try {
        return JSON.parse(savedCart) as CartItemType[];
    } catch {
        return [];
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: loadCart(),
    reducers: {
        addToCart(state, action: PayloadAction<CategoryProductType>) {
            const existingItem = state.find(
                (item) => item.product.id === action.payload.id
            );

            if (existingItem) {
                existingItem.quantity += 1;
                return;
            }

            state.push({
                product: action.payload,
                quantity: 1
            });
        },
        removeFromCart(state, action: PayloadAction<number>) {
            return state.filter((item) => item.product.id !== action.payload);
        },
        increaseQuantity(state, action: PayloadAction<number>) {
            const item = state.find((entry) => entry.product.id === action.payload);

            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity(state, action: PayloadAction<number>) {
            const item = state.find((entry) => entry.product.id === action.payload);

            if (!item) {
                return;
            }

            if (item.quantity <= 1) {
                return state.filter((entry) => entry.product.id !== action.payload);
            }

            item.quantity -= 1;
        },
        clearCart() {
            return [];
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
