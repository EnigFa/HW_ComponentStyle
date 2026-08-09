import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ProductType } from "../types/ProductType";

type ProductContextType = {
    products: ProductType[];
    foundProducts: ProductType[];
    searchValue: string;
    setSearchValue: (value: string) => void;
    searchProducts: () => void;
    hasSearched: boolean;
};

type ProductProviderPropsType = {
    children: ReactNode;
};

const products: ProductType[] = [
    {
        id: 1,
        title: "Навушники Esperanza EH187K Black",
        image: "https://i.allo.ua/media/catalog/product/cache/3/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/e/h/eh187k_black.webp",
        price: 229,
        oldPrice: 0,
        discountPercent: 5,
        monoPercent: 5,
        rating: 2,
        reviewsCount: 1,
        isFavorite: false,
        hasAction: true
    },
    {
        id: 2,
        title: "Навушники Canyon GTWS2 Orange",
        image: "https://i.allo.ua/media/catalog/product/cache/3/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/c/n/cnd-gtws2o_.webp",
        price: 549,
        oldPrice: 899,
        discountPercent: 39,
        monoPercent: 0,
        rating: 4,
        reviewsCount: 24,
        isFavorite: false,
        hasAction: false
    }
];

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider(prop: ProductProviderPropsType) {
    const [foundProducts, setFoundProducts] = useState<ProductType[]>(products);
    const [searchValue, setSearchValue] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const searchProducts = () => {
        const searchText = searchValue.toLowerCase().trim();

        const filteredProducts = products.filter((product) => {
            return product.title.toLowerCase().includes(searchText);
        });

        setFoundProducts(filteredProducts);
        setHasSearched(true);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                foundProducts,
                searchValue,
                setSearchValue,
                searchProducts,
                hasSearched
            }}
        >
            {prop.children}
        </ProductContext.Provider>
    );
}

export function useProductContext() {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProductContext must be used inside ProductProvider");
    }

    return context;
}