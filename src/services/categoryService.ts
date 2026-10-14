import { normalizeCategory, buildCategoryTree } from "../utils/categories";
import type {
    CategoryCreateType,
    CategoryType
} from "../types/CategoryType";
import { readApiError } from "../utils/apiError";
import { apiFetch } from "./http";

const CATEGORIES_URL = "/api/v1/Category";

export const getCategories = async (): Promise<CategoryType[]> => {
    const response = await fetch(CATEGORIES_URL);

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error("Не вдалося отримати категорії");
    }

    const data = await response.json();
    const categories = Array.isArray(data)
        ? data.map(normalizeCategory)
        : [];

    return buildCategoryTree(categories);
};

export const createCategory = async (
    category: CategoryCreateType
): Promise<void> => {
    const formData = new FormData();

    formData.append("Name", category.name);
    formData.append("Slug", category.slug);
    formData.append("Url", category.url);

    if (category.parentId !== null) {
        formData.append("ParentId", String(category.parentId));
    }

    if (category.image) {
        formData.append("Image", category.image);
    }

    const response = await apiFetch(CATEGORIES_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Не вдалося створити категорію"));
    }
};
