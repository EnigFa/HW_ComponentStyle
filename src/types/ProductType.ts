export type ProductType = {
    id: number;
    title: string;
    image: string;
    price: number;
    oldPrice: number;
    discountPercent: number;
    monoPercent: number;
    rating: number;
    reviewsCount: number;
    isFavorite: boolean;
    hasAction: boolean;
};