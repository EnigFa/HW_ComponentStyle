import { type FormEvent } from "react";
import { useProductContext } from "../context/useProductContext";

function Search() {
    const {
        searchValue,
        setSearchValue,
        searchProducts,
        clearSearch,
        hasSearched
    } = useProductContext();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchProducts();
    };

    const handleChange = (value: string) => {
        if (!value.trim()) {
            clearSearch();
            return;
        }

        setSearchValue(value);
    };

    const showClear = searchValue.trim().length > 0 || hasSearched;

    return (
        <form className="search-block" onSubmit={handleSubmit}>
            <div className="search-field">
                <input
                    type="search"
                    value={searchValue}
                    placeholder="Пошук товарів"
                    onChange={(event) => handleChange(event.target.value)}
                />

                {showClear && (
                    <button
                        className="search-clear"
                        type="button"
                        onClick={clearSearch}
                        aria-label="Очистити пошук"
                    >
                        ×
                    </button>
                )}
            </div>

            <button
                className="search-button"
                type="submit"
            >
                Знайти
            </button>
        </form>
    );
}

export default Search;
