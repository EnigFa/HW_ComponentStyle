import CartButton from "./CartButton";
import type { CategoryProductType } from "../types/CategoryProductType";

type ProductCardPropsType = {
    product: CategoryProductType;
    onAddToCart: (product: CategoryProductType) => void;
    onToggleFavorite: (product: CategoryProductType) => void;
    isFavorite: boolean;
};

function ProductCard(prop: ProductCardPropsType) {
    const {
        name,
        description,
        price,
        stockQty,
        isActive,
        images
    } = prop.product;

    const imageUrl = images[0]?.url;

    return (
        <div className="product-card">
            <div className="favorite-block">
                <button
                    className="favorite-button"
                    onClick={() => prop.onToggleFavorite(prop.product)}
                >
                    {prop.isFavorite ? "♥" : "♡"}
                </button>
            </div>

            <div className="product-image-wrapper">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="product-image"
                    />
                ) : (
                    <div className="no-image">
                        Немає зображення
                    </div>
                )}
            </div>

            <h3 className="product-title">{name}</h3>

            {description && (
                <p className="product-description">
                    {description}
                </p>
            )}

            <div className="product-info">
                <span className={isActive ? "active-status" : "inactive-status"}>
                    {isActive ? "Є в продажу" : "Неактивний"}
                </span>

                <span className="stock-info">
                    Залишок: {stockQty}
                </span>
            </div>

            <div className="price-block">
                <p className="price">{price} ₴</p>

                <CartButton
                    onClick={() => prop.onAddToCart(prop.product)}
                />
            </div>
        </div>
    );
}

export default ProductCard;