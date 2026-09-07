import { useProductContext } from "../context/useProductContext";

function Search() {
    const {
        searchValue,
        setSearchValue,
        searchProducts
    } = useProductContext();

    return (
        <div className="search-block">
            <input
                type="text"
                value={searchValue}
                placeholder="Я шукаю..."
                onChange={(event) => setSearchValue(event.target.value)}
            />

            <button
                className="search-button"
                onClick={searchProducts}
            >
                Знайти
            </button>
        </div>
    );
}

export default Search;