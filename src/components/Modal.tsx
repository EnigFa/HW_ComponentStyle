import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import "./Modal.css";

type ModalPropsType = {
    open: boolean;
    close: () => void;
    children: ReactNode;
    wide?: boolean;
};

const modalNode = document.getElementById("modal");

const renderContent = (props: ModalPropsType) => {
    if (!modalNode) {
        return null;
    }

    return createPortal(
        <>
            <div className="background" onClick={props.close}></div>
            <div className={props.wide ? "modal modal--wide" : "modal"}>
                <button
                    className="modal__close"
                    type="button"
                    onClick={props.close}
                >
                    ×
                </button>
                {props.children}
            </div>
        </>,
        modalNode
    );
};

function Modal(props: ModalPropsType) {
    return props.open === true ? renderContent(props) : null;
}

export default Modal;
