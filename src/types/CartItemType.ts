import type { ProductType } from "./ProductType";

export type CartItemType = {
    product: ProductType;
    quantity: number;
};