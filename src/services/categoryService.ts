import type {
    CategoryCreateType,
    CategoryType
} from "../types/CategoryType";

const CATEGORIES_URL = "https://localhost:7000/api/v1/categories";

const CATEGORY_TREE_URL =
    "https://localhost:7000/api/v1/categories/tree";

export const getCategories = async (): Promise<CategoryType[]> => {
    const response = await fetch(CATEGORY_TREE_URL);

    if (!response.ok) {
        throw new Error("Не вдалося отримати дерево категорій");
    }

    return response.json();
};

export const createCategory = async (
    category: CategoryCreateType
): Promise<CategoryType> => {
    const response = await fetch(CATEGORIES_URL, {
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