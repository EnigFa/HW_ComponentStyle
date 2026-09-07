import type { CategoryProductType } from "../types/CategoryProductType";
import ProductCard from "./ProductCard";

type CategoryProductsProps = {
    categoryName: string;
    products: CategoryProductType[];
    onAddToCart: (product: CategoryProductType) => void;
    onToggleFavorite: (product: CategoryProductType) => void;
    favorites: CategoryProductType[];
};

function CategoryProducts({
                              categoryName,
                              products,
                              onAddToCart,
                              onToggleFavorite,
                              favorites
                          }: CategoryProductsProps) {
    return (
        <section className="category-products">
            <h2>Товари категорії: {categoryName}</h2>

            {products.length === 0 ? (
                <p className="empty-message">
                    У цій категорії немає товарів
                </p>
            ) : (
                <div className="products-list">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={favorites.some(
                                (item) => item.id === product.id
                            )}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default CategoryProducts;