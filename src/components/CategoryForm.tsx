import { useForm } from "react-hook-form";
import { flattenCategories } from "../utils/categories";
import { toSlug } from "../utils/slug";
import type { CategoryType } from "../types/CategoryType";
import { createCategory } from "../services/categoryService";

type CategoryFormProps = {
    categories: CategoryType[];
    onCategoryCreated: () => void;
};

type CategoryFormValues = {
    name: string;
    slug: string;
    parentId: string;
    image: FileList;
};

function CategoryForm({ categories, onCategoryCreated }: CategoryFormProps) {
    const parentOptions = flattenCategories(categories);
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
            slug: "",
            parentId: ""
        }
    });

    const onSubmit = async (values: CategoryFormValues) => {
        const categorySlug = toSlug(values.slug || values.name);

        try {
            await createCategory({
                name: values.name.trim(),
                slug: categorySlug,
                url: "",
                parentId: values.parentId === "" ? null : Number(values.parentId),
                image: values.image?.[0] ?? null
            });

            reset();
            onCategoryCreated();
        } catch (caught) {
            setError("root", {
                message: caught instanceof Error
                    ? caught.message
                    : "Не вдалося створити категорію. Увійдіть і спробуйте ще раз."
            });
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>Нова категорія</h2>

            <label>
                Назва
                <input
                    type="text"
                    maxLength={20}
                    {...register("name", {
                        required: "Назва категорії обов'язкова",
                        maxLength: {
                            value: 20,
                            message: "Назва не може бути довшою за 20 символів"
                        }
                    })}
                />
            </label>
            {errors.name && <p className="field-error">{errors.name.message}</p>}

            <label>
                Slug
                <input
                    type="text"
                    maxLength={100}
                    placeholder="латиниця, від 5 символів"
                    {...register("slug", {
                        validate: (slug, formValues) => {
                            const value = toSlug(slug || formValues.name);

                            if (value.length < 5) {
                                return "Slug має містити щонайменше 5 латинських символів";
                            }

                            if (!/^[a-z0-9_-]+$/.test(value)) {
                                return "Slug повинен містити лише латинські літери, цифри та символи - та _";
                            }

                            return true;
                        }
                    })}
                />
            </label>
            {errors.slug && <p className="field-error">{errors.slug.message}</p>}

            <label>
                Батьківська категорія
                <select {...register("parentId")}>
                    <option value="">Без батьківської</option>
                    {parentOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Зображення
                <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                />
            </label>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>

            {errors.root && <p className="error-message">{errors.root.message}</p>}
        </form>
    );
}

export default CategoryForm;
