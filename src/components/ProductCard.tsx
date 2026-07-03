import CartButton from "./CartButton";
import type {ProductType} from "../types/ProductType";

function ProductCard(prop: { product: ProductType }) {
    const {
        title,
        image,
        price,
        oldPrice,
        discountPercent,
        monoPercent,
        rating,
        reviewsCount,
        isFavorite,
        hasAction
    } = prop.product;

    return (
        <div className="product-card">
            <div className="favorite-block">
                <span className="favorite-icon">
                    {isFavorite ? "♥" : "♡"}
                </span>
            </div>

            <img src={image} alt={title} className="product-image" />

            <h3 className="product-title">{title}</h3>

            <div className="badges">
                {monoPercent > 0 && (
                    <span className="badge mono-badge">{monoPercent}% МОНО</span>
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

                <CartButton />
            </div>
        </div>
    );
}

export default ProductCard;