import CartButton from "./CartButton";
import type { CategoryProductType } from "../types/CategoryProductType";

type ProductCardPropsType = {
    product: CategoryProductType;
    onAddToCart: (product: CategoryProductType) => void;
    onToggleFavorite: (product: CategoryProductType) => void;
    onOpen: (product: CategoryProductType) => void;
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

    const imageUrl = images?.[0]?.url;
    const formattedPrice = new Intl.NumberFormat("uk-UA", {
        style: "currency",
        currency: "UAH",
        maximumFractionDigits: 0
    }).format(price);

    return (
        <article
            className="product-card"
            onClick={() => prop.onOpen(prop.product)}
        >
            <div className="favorite-block">
                <button
                    className={
                        prop.isFavorite
                            ? "favorite-button is-active"
                            : "favorite-button"
                    }
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        prop.onToggleFavorite(prop.product);
                    }}
                    aria-label="Додати в обране"
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
                        Aura
                    </div>
                )}
            </div>

            <div className="product-body">
                <p className={isActive && stockQty > 0 ? "stock-pill" : "stock-pill stock-pill--out"}>
                    {isActive && stockQty > 0 ? "В наявності" : "Немає"}
                </p>

                <h3 className="product-title">{name}</h3>

                {description && (
                    <p className="product-description">
                        {description}
                    </p>
                )}

                <div className="price-block">
                    <p className="price">{formattedPrice}</p>

                    <CartButton
                        onClick={(event) => {
                            event.stopPropagation();
                            prop.onAddToCart(prop.product);
                        }}
                    />
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
