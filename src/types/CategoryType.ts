export type CategoryType = {
    id: number;
    name: string;
    slug: string;
    url: string;
    isActive: boolean;
    parentId: number | null;
};

export type CategoryCreateType = {
    name: string;
    slug: string;
    url: string;
    isActive: boolean;
    parentId: number | null;
};