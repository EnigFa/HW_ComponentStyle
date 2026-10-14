import { resolveMediaUrl } from "../config/api";
import type { CategoryProductType } from "../types/CategoryProductType";

type ProductImageType = {
    id?: number;
    url?: string;
};

const asRecord = (value: unknown) => {
    if (value && typeof value === "object") {
        return value as Record<string, unknown>;
    }

    return {};
};

const readString = (value: unknown) => {
    return typeof value === "string" ? value : "";
};

const readNumber = (value: unknown) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
};

const readImages = (value: unknown): ProductImageType[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map((item) => {
        if (typeof item === "string") {
            return { url: resolveMediaUrl(item, "products") };
        }

        const image = asRecord(item);
        const url = readString(image.url ?? image.Url);

        return {
            id: readNumber(image.id ?? image.Id) || undefined,
            url: resolveMediaUrl(url, "products") || undefined
        };
    });
};

export const normalizeProduct = (value: unknown): CategoryProductType => {
    const product = asRecord(value);

    return {
        id: readNumber(product.id ?? product.Id),
        name: readString(product.name ?? product.Name) || "Без назви",
        description: readString(product.description ?? product.Description) || null,
        price: readNumber(product.price ?? product.Price),
        stockQty: readNumber(product.stockQty ?? product.StockQty),
        isActive: Boolean(product.isActive ?? product.IsActive ?? true),
        categoryId: readNumber(product.categoryId ?? product.CategoryId),
        images: readImages(product.images ?? product.Images)
    };
};
