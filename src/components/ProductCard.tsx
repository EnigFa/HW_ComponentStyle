import CartButton from "./CartButton";
import type { ProductType } from "../types/ProductType";

type ProductCardPropsType = {
    product: ProductType;
    onAddToCart: (product: ProductType) => void;
    onToggleFavorite: (product: ProductType) => void;
    isFavorite: boolean;
};

function ProductCard(prop: ProductCardPropsType) {
    const {
        title,
        image,
        price,
        oldPrice,
        discountPercent,
        monoPercent,
        rating,
        reviewsCount,
        hasAction
    } = prop.product;

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

            <img src={image} alt={title} className="product-image" />

            <h3 className="product-title">{title}</h3>

            <div className="badges">
                {monoPercent > 0 && (
                    <span className="badge mono-badge">{monoPercent}% моно</span>
                )}

                {discountPercent > 0 && (
                    <span className="badge discount-badge">{discountPercent}% знижка</span>
                )}

                {hasAction && (
                    <span className="badge action-badge">Акція</span>
                )}
            </div>

            <div className="rating-block">
                <span>{"★".repeat(rating)}</span>
                <span className="reviews-count">💬 {reviewsCount}</span>
            </div>

            <div className="price-block">
                <div>
                    {oldPrice > 0 && <p className="old-price">{oldPrice} ₴</p>}
                    <p className="price">{price} ₴</p>
                </div>

                <CartButton onClick={() => prop.onAddToCart(prop.product)} />
            </div>
        </div>
    );
}

export default ProductCard;