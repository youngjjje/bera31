import React from "react";

const ProductModal = ({product, onClose}) => {
    if (!product) return null

    return (
        <div>
            <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <img src={product.image} alt={product.name} width="200" />

                <div>
                    <button>장바구니에 넣기</button>
                    <button>바로 구매하기</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal