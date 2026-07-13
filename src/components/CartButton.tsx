type CartButtonPropsType = {
    onClick: () => void;
};

function CartButton(prop: CartButtonPropsType) {
    return (
        <button className="cart-button" onClick={prop.onClick}>
            🛒
        </button>
    );
}

export default CartButton;