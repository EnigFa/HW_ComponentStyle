import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CategoryProductType } from "../types/CategoryProductType";
import { ProductContext } from "./productContextObject";
import { getProducts } from "../services/productService";

type ProductProviderPropsType = {
    children: ReactNode;
};

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
