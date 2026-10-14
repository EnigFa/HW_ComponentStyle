import { normalizeProduct } from "../utils/normalizeProduct";
import type { CategoryProductType } from "../types/CategoryProductType";
import { readApiError } from "../utils/apiError";
import { apiFetch } from "./http";

const PRODUCTS_URL = "/api/v1/Product";

const readProductList = async (response: Response) => {
    if (!response.ok) {
        throw new Error("Не вдалося отримати товари");
    }

    const data = await response.json();
    const products = Array.isArray(data) ? data : [];

    return products.map(normalizeProduct);
};

export const getProducts = async (): Promise<CategoryProductType[]> => {
    const response = await fetch(PRODUCTS_URL);

    return readProductList(response);
};

export const getProductsByCategory = async (
    categoryId: number
): Promise<CategoryProductType[]> => {
    const response = await fetch(`${PRODUCTS_URL}/by-category/${categoryId}`);

    if (response.status === 404) {
        return [];
    }

    return readProductList(response);
};

export const getProductById = async (
    productId: number
): Promise<CategoryProductType> => {
    const response = await fetch(`${PRODUCTS_URL}/${productId}`);

    if (!response.ok) {
        throw new Error(await readApiError(response, "Не вдалося відкрити товар"));
    }

    return normalizeProduct(await response.json());
};

export type ProductSaveType = {
    name: string;
    price: number;
    description: string;
    stockQty: number;
    isActive: boolean;
    categoryId: number;
    images: File[];
};

const appendProductForm = (product: ProductSaveType) => {
    const formData = new FormData();

    formData.append("Name", product.name);
    formData.append("Price", String(product.price));
    formData.append("Description", product.description);
    formData.append("StockQty", String(product.stockQty));
    formData.append("IsActive", String(product.isActive));
    formData.append("CategoryId", String(product.categoryId));

    product.images.slice(0, 5).forEach((image) => {
        formData.append("ImagesFiles", image);
    });

    return formData;
};

export const createProduct = async (product: ProductSaveType): Promise<void> => {
    const response = await apiFetch(PRODUCTS_URL, {
        method: "POST",
        body: appendProductForm(product)
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Не вдалося створити товар"));
    }
};

export const updateProduct = async (
    productId: number,
    product: ProductSaveType
): Promise<void> => {
    const response = await apiFetch(`${PRODUCTS_URL}/${productId}`, {
        method: "PUT",
        body: appendProductForm(product)
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Не вдалося оновити товар"));
    }
};

export const deleteProduct = async (productId: number): Promise<void> => {
    const response = await apiFetch(`${PRODUCTS_URL}/${productId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Не вдалося видалити товар"));
    }
};
