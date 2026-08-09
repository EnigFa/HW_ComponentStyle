export type CategoryProductType = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stockQty: number;
    isActive: boolean;
    categoryId: number;
    images: {
        id?: number;
        url?: string;
    }[];
};