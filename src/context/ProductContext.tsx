import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CategoryProductType } from "../types/CategoryProductType";
import { getProducts } from "../services/productService";

type ProductContextType = {
    products: CategoryProductType[];
    foundProducts: CategoryProductType[];
    searchValue: string;
    setSearchValue: (value: string) => void;
    searchProducts: () => void;
    hasSearched: boolean;
    productError: string;
};

type ProductProviderPropsType = {
    children: ReactNode;
};

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider(prop: ProductProviderPropsType) {
    const [products, setProducts] = useState<CategoryProductType[]>([]);
    const [foundProducts, setFoundProducts] = useState<CategoryProductType[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [productError, setProductError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const loadedProducts = await getProducts();

                setProducts(loadedProducts);
                setFoundProducts(loadedProducts);
            } catch {
                setProductError("Не вдалося завантажити товари");
            }
        };

        loadProducts();
    }, []);

    const searchProducts = () => {
        const searchText = searchValue.toLowerCase().trim();

        const filteredProducts = products.filter((product) => {
            return product.name.toLowerCase().includes(searchText);
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
                hasSearched,
                productError
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