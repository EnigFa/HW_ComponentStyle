import type { CategoryType } from "../types/CategoryType";

type CategoryProps = {
    category: CategoryType;
};

function Category({ category }: CategoryProps) {
    return (
        <div className="category-card">
            <h3>{category.name}</h3>

            <p>
                <strong>Slug:</strong> {category.slug}
            </p>

            <p>
                <strong>URL:</strong> {category.url || "Не вказано"}
            </p>

            <p>
                <strong>Статус:</strong>{" "}
                {category.isActive ? "Активна" : "Неактивна"}
            </p>

            <p>
                <strong>Parent ID:</strong>{" "}
                {category.parentId === null ? "Немає" : category.parentId}
            </p>
        </div>
    );
}

export default Category;