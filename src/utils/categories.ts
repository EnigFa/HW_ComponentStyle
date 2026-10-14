import { resolveMediaUrl } from "../config/api";
import type { CategoryType } from "../types/CategoryType";

const asRecord = (value: unknown) => {
    if (value && typeof value === "object") {
        return value as Record<string, unknown>;
    }

    return {};
};

const readNumber = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const readProductIds = (value: unknown) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (typeof item === "number") {
                return item;
            }

            const product = asRecord(item);

            return readNumber(product.id ?? product.Id) ?? 0;
        })
        .filter((id) => id > 0);
};

export const normalizeCategory = (value: unknown): CategoryType => {
    const category = asRecord(value);

    return {
        id: readNumber(category.id ?? category.Id) ?? 0,
        name: String(category.name ?? category.Name ?? ""),
        slug: String(category.slug ?? category.Slug ?? ""),
        url: resolveMediaUrl(String(category.url ?? category.Url ?? "")),
        isActive: Boolean(category.isActive ?? category.IsActive ?? true),
        parentId: readNumber(category.parentId ?? category.ParentId),
        productIds: readProductIds(category.products ?? category.Products),
        subCategories: []
    };
};

export const buildCategoryTree = (categories: CategoryType[]) => {
    const nodes = categories.map((category) => ({
        ...category,
        subCategories: [] as CategoryType[]
    }));

    const nodesById = new Map(nodes.map((category) => [category.id, category]));
    const roots: CategoryType[] = [];

    nodes.forEach((category) => {
        const parent = category.parentId
            ? nodesById.get(category.parentId)
            : undefined;

        if (parent) {
            parent.subCategories.push(category);
        } else {
            roots.push(category);
        }
    });

    return roots;
};

export const collectCategoryIds = (category: CategoryType): number[] => {
    return [
        category.id,
        ...category.subCategories.flatMap(collectCategoryIds)
    ];
};

export const flattenCategories = (categories: CategoryType[]): CategoryType[] => {
    return categories.flatMap((category) => [
        category,
        ...flattenCategories(category.subCategories)
    ]);
};
