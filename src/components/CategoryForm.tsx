import { useState, type FormEvent } from "react";
import type {
    CategoryCreateType,
    CategoryType
} from "../types/CategoryType";
import { createCategory } from "../services/categoryService";

type CategoryFormProps = {
    onCategoryCreated: (category: CategoryType) => void;
};

function CategoryForm({ onCategoryCreated }: CategoryFormProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [url, setUrl] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [parentId, setParentId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const category: CategoryCreateType = {
            name: name,
            slug: slug,
            url: url,
            isActive: isActive,
            parentId: parentId === "" ? null : Number(parentId)
        };

        try {
            const createdCategory = await createCategory(category);

            onCategoryCreated(createdCategory);

            setName("");
            setSlug("");
            setUrl("");
            setIsActive(true);
            setParentId("");
            setMessage("Категорію успішно створено");
        } catch {
            setError("Не вдалося створити категорію");
        }
    };

    return (
        <form className="category-form" onSubmit={handleSubmit}>
            <h2>Додати категорію</h2>

            <label>
                Назва категорії
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={100}
                />
            </label>

            <label>
                Slug
                <input
                    type="text"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    required
                    maxLength={100}
                />
            </label>

            <label>
                URL
                <input
                    type="text"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                />
            </label>

            <label>
                Parent ID
                <input
                    type="number"
                    value={parentId}
                    onChange={(event) => setParentId(event.target.value)}
                />
            </label>

            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                />
                Активна категорія
            </label>

            <button type="submit">
                Додати категорію
            </button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

export default CategoryForm;