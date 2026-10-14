import { useForm } from "react-hook-form";
import { flattenCategories } from "../utils/categories";
import type { CategoryType } from "../types/CategoryType";
import type { CategoryProductType } from "../types/CategoryProductType";
import {
    createProduct,
    updateProduct
} from "../services/productService";

type ProductFormProps = {
    categories: CategoryType[];
    product?: CategoryProductType | null;
    onSaved: () => void;
};

type ProductFormValues = {
    name: string;
    price: number;
    description: string;
    stockQty: number;
    isActive: boolean;
    categoryId: string;
    images: FileList;
};

function ProductForm({ categories, product, onSaved }: ProductFormProps) {
    const categoryOptions = flattenCategories(categories);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<ProductFormValues>({
        defaultValues: {
            name: product?.name ?? "",
            price: product?.price ?? 0,
            description: product?.description ?? "",
            stockQty: product?.stockQty ?? 1,
            isActive: product?.isActive ?? true,
            categoryId: product?.categoryId ? String(product.categoryId) : ""
        }
    });

    const onSubmit = async (values: ProductFormValues) => {
        const payload = {
            name: values.name.trim(),
            price: values.price,
            description: values.description.trim(),
            stockQty: values.stockQty,
            isActive: values.isActive,
            categoryId: Number(values.categoryId),
            images: Array.from(values.images ?? [])
        };

        try {
            if (product) {
                await updateProduct(product.id, payload);
            } else {
                await createProduct(payload);
            }

            onSaved();
        } catch (caught) {
            setError("root", {
                message: caught instanceof Error
                    ? caught.message
                    : "Не вдалося зберегти товар"
            });
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>{product ? "Змінити товар" : "Новий товар"}</h2>

            <label>
                Назва
                <input
                    type="text"
                    maxLength={200}
                    {...register("name", {
                        required: "Назва товару обов'язкова",
                        minLength: {
                            value: 2,
                            message: "Назва має містити щонайменше 2 символи"
                        },
                        maxLength: {
                            value: 200,
                            message: "Назва не може бути довшою за 200 символів"
                        }
                    })}
                />
            </label>
            {errors.name && <p className="field-error">{errors.name.message}</p>}

            <label>
                Ціна, грн
                <input
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("price", {
                        required: "Вкажіть ціну",
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: "Ціна не може бути від'ємною"
                        }
                    })}
                />
            </label>
            {errors.price && <p className="field-error">{errors.price.message}</p>}

            <label>
                Опис
                <textarea {...register("description")} />
            </label>

            <label>
                Кількість
                <input
                    type="number"
                    min={0}
                    step={1}
                    {...register("stockQty", {
                        required: "Вкажіть кількість",
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: "Кількість не може бути від'ємною"
                        }
                    })}
                />
            </label>
            {errors.stockQty && <p className="field-error">{errors.stockQty.message}</p>}

            <label>
                Категорія
                <select
                    {...register("categoryId", {
                        required: "Оберіть категорію"
                    })}
                >
                    <option value="">Оберіть категорію</option>
                    {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>
            {errors.categoryId && <p className="field-error">{errors.categoryId.message}</p>}

            <label>
                Зображення, до 5 файлів
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("images", {
                        validate: (files) =>
                            !files || files.length <= 5 || "Можна додати не більше 5 зображень"
                    })}
                />
            </label>
            {errors.images && <p className="field-error">{errors.images.message}</p>}

            <label className="check-label">
                <input type="checkbox" {...register("isActive")} />
                Товар активний
            </label>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>

            {errors.root && <p className="error-message">{errors.root.message}</p>}
        </form>
    );
}

export default ProductForm;
