import { useState } from "react";
import type { CategoryType } from "../types/CategoryType";

type CategoryProps = {
    category: CategoryType;
    onSelectCategory?: (category: CategoryType) => void;
};

function Category({
                      category,
                      onSelectCategory
                  }: CategoryProps) {
    const [isOpen, setIsOpen] = useState(false);

    const hasSubCategories = category.subCategories.length > 0;

    const handleCategoryClick = () => {
        if (hasSubCategories) {
            setIsOpen(!isOpen);
        } else if (onSelectCategory) {
            onSelectCategory(category);
        }
    };

    return (
        <div className="category-tree-item">
            <div
                className="category-card"
                onClick={handleCategoryClick}
            >
                <button
                    type="button"
                    className="category-name-button"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleCategoryClick();
                    }}
                >
                    {hasSubCategories && (
                        <span className="category-arrow">
                            {isOpen ? "▼" : "▶"}
                        </span>
                    )}

                    {category.name}
                </button>

                <p>
                    <strong>Slug:</strong> {category.slug}
                </p>

                <p>
                    <strong>URL:</strong>{" "}
                    {category.url || "Не вказано"}
                </p>

                <p>
                    <strong>Статус:</strong>{" "}
                    {category.isActive
                        ? "Активна"
                        : "Неактивна"}
                </p>
            </div>

            {isOpen && hasSubCategories && (
                <div className="subcategories-list">
                    {category.subCategories.map((subCategory) => (
                        <Category
                            key={subCategory.id}
                            category={subCategory}
                            onSelectCategory={onSelectCategory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;