import type { MouseEvent } from "react";

type CartButtonPropsType = {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

function CartButton(prop: CartButtonPropsType) {
    return (
        <button className="cart-button" type="button" onClick={prop.onClick}>
            🛒
        </button>
    );
}

export default CartButton;