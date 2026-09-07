import { useContext } from "react";
import { ProductContext } from "./productContextObject";

export function useProductContext() {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProductContext must be used inside ProductProvider");
    }

    return context;
}
