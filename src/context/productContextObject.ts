import { createContext } from "react";
import type { CategoryProductType } from "../types/CategoryProductType";

type ProductContextType = {
    products: CategoryProductType[];
    foundProducts: CategoryProductType[];
    searchValue: string;
    setSearchValue: (value: string) => void;
    searchProducts: () => void;
    hasSearched: boolean;
    productError: string;
};

export const ProductContext = createContext<ProductContextType | null>(null);
