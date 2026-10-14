import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import type { CategoryProductType } from "../types/CategoryProductType";

type ProductDetailsProps = {
    productId: number;
    canManage: boolean;
    onEdit: (product: CategoryProductType) => void;
    onDelete: (product: CategoryProductType) => void;
};

function ProductDetails({
    productId,
    canManage,
    onEdit,
    onDelete
}: ProductDetailsProps) {
    const [product, setProduct] = useState<CategoryProductType | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        getProductById(productId)
            .then((loadedProduct) => {
                if (active) {
                    setProduct(loadedProduct);
                }
            })
            .catch((caught) => {
                if (active) {
                    setError(
                        caught instanceof Error
                            ? caught.message
                            : "Не вдалося відкрити товар"
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [productId]);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!product) {
        return <p className="empty-message">Завантаження...</p>;
    }

    const formattedPrice = new Intl.NumberFormat("uk-UA", {
        style: "currency",
        currency: "UAH",
        maximumFractionDigits: 2
    }).format(product.price);
    const images = product.images.filter((image) => image.url);

    return (
        <article className="product-details">
            <h2>{product.name}</h2>

            {images.length > 0 ? (
                <div className="product-details-gallery">
                    {images.map((image) => (
                        <img
                            key={image.id ?? image.url}
                            src={image.url}
                            alt={product.name}
                            className="product-details-image"
                        />
                    ))}
                </div>
            ) : (
                <div className="no-image">Aura</div>
            )}

            {product.description && <p>{product.description}</p>}

            <p className="price">{formattedPrice}</p>
            <p>
                {product.isActive && product.stockQty > 0
                    ? `В наявності: ${product.stockQty}`
                    : "Немає в наявності"}
            </p>

            {canManage && (
                <div className="details-actions">
                    <button type="button" onClick={() => onEdit(product)}>
                        Змінити
                    </button>
                    <button type="button" onClick={() => onDelete(product)}>
                        Видалити
                    </button>
                </div>
            )}
        </article>
    );
}

export default ProductDetails;
