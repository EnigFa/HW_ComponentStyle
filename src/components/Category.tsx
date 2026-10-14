import { useState } from "react";
import type { CategoryType } from "../types/CategoryType";

type CategoryProps = {
    category: CategoryType;
    selectedId: number | null;
    onSelectCategory: (category: CategoryType) => void;
};

function Category({
    category,
    selectedId,
    onSelectCategory
}: CategoryProps) {
    const [isOpen, setIsOpen] = useState(false);

    const subCategories = category.subCategories || [];
    const hasSubCategories = subCategories.length > 0;
    const isSelected = selectedId === category.id;

    return (
        <div className="catalog-item">
            <div
                className={
                    isSelected
                        ? "catalog-row catalog-row--active"
                        : "catalog-row"
                }
            >
                {hasSubCategories ? (
                    <button
                        type="button"
                        className="catalog-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Згорнути" : "Розгорнути"}
                    >
                        {isOpen ? "▾" : "▸"}
                    </button>
                ) : (
                    <span className="catalog-toggle catalog-toggle--empty"></span>
                )}

                {category.url ? (
                    <img
                        src={category.url}
                        alt=""
                        className="catalog-thumb"
                    />
                ) : (
                    <span className="catalog-thumb catalog-thumb--empty"></span>
                )}

                <button
                    type="button"
                    className="catalog-name"
                    onClick={() => onSelectCategory(category)}
                >
                    {category.name}
                </button>
            </div>

            {isOpen && hasSubCategories && (
                <div className="catalog-children">
                    {subCategories.map((subCategory) => (
                        <Category
                            key={subCategory.id}
                            category={subCategory}
                            selectedId={selectedId}
                            onSelectCategory={onSelectCategory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Category;
