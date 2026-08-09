import type { CategoryProductType } from "../types/CategoryProductType";

const PRODUCTS_URL = "https://localhost:7000/api/Product";

export const getProducts = async (): Promise<CategoryProductType[]> => {
    const response = await fetch(PRODUCTS_URL);

    if (!response.ok) {
        throw new Error("Не вдалося отримати товари");
    }

    return response.json();
};