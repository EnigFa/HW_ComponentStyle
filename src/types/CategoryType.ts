export type CategoryType = {
    id: number;
    name: string;
    slug: string;
    url: string;
    isActive: boolean;
    parentId: number | null;
    productIds: number[];
    subCategories: CategoryType[];
};

export type CategoryCreateType = {
    name: string;
    slug: string;
    url: string;
    parentId: number | null;
    image?: File | null;
};