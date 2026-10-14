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

        if (!searchText) {
            setFoundProducts(products);
            setHasSearched(false);
            return;
        }

        const filteredProducts = products.filter((product) => {
            return product.name.toLowerCase().includes(searchText);
        });

        setFoundProducts(filteredProducts);
        setHasSearched(true);
    };

    const clearSearch = () => {
        setSearchValue("");
        setFoundProducts(products);
        setHasSearched(false);
    };

    const reloadProducts = async () => {
        const loadedProducts = await getProducts();
        const searchText = searchValue.toLowerCase().trim();

        setProducts(loadedProducts);
        setProductError("");
        setFoundProducts(
            searchText
                ? loadedProducts.filter((product) =>
                    product.name.toLowerCase().includes(searchText)
                )
                : loadedProducts
        );

        return loadedProducts;
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                foundProducts,
                searchValue,
                setSearchValue,
                searchProducts,
                clearSearch,
                reloadProducts,
                hasSearched,
                productError
            }}
        >
            {prop.children}
        </ProductContext.Provider>
    );
}
