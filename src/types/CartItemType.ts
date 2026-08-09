import type { CategoryProductType } from "./CategoryProductType";

export type CartItemType = {
    product: CategoryProductType;
    quantity: number;
};