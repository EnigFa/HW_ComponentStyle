import type {
    CategoryCreateType,
    CategoryType
} from "../types/CategoryType";

const API_URL = "https://localhost:7000/api/v1/categories";

export const getCategories = async (): Promise<CategoryType[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Не вдалося отримати категорії");
    }

    return response.json();
};

export const createCategory = async (
    category: CategoryCreateType
): Promise<CategoryType> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    });

    if (!response.ok) {
        throw new Error("Не вдалося створити категорію");
    }

    return response.json();
};