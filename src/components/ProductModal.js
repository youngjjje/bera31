import React, {useEffect, useState} from "react";
import {auth, db} from "../fbase"
import {doc, collection, addDoc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import "../css/ProductModal.css"

const ProductModal = ({product, onClose}) => {

    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()
    
    useEffect(() => {
        if (product){
            setQuantity(1)
        }
    }, [product])

    if (!product) return null

    const handleAddToCart = async () => {
        const user = auth.currentUser
        if(!user) {
            alert("로그인을 해주세요")
            return
        }

        try {
            await addDoc(collection(db,"users", user.uid, "cart"), {
                productId: product.id,
                name: product.name,
                quantity: quantity,
                createAt: new Date()
            })
            const goToCart = window.confirm("장바구니에 담았습니다. 장바구니 페이지로 이동하겠습니까?")
            if (goToCart) {
                navigate("/cart")
            } else {
                onClose()
            }
        } catch (error) {
            alert("장바구니에 담지 못 했습니다")
        }
    }

    const handleBuyNow = async () => {
        const user = auth.currentUser
        if (!user) {
            alert("로그인을 해주세요")
            return
        }

        try {
            // 바로 checkout 페이지로 데이터 전달
            navigate("/checkout", {
                state: {
                    productId: product.id,
                    name: product.name,
                    quantity: quantity,
                    price: product.price,
                }
            })
        } catch (error) {
            alert("구매 페이지로 이동하지 못 했습니다")
        }
    }

    const hanldeOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose()
        }
    }

    return (
        <div className="modal-overlay" onClick={hanldeOverlayClick}>
            <div className="modal-box">
                <button className="close-btn" onClick={onClose}>X</button>

                <h2 className="modal-title">{product.name}</h2>

                <img src={product.image} alt={product.name} className="modal-image"/>

                <div className="quantity-box">
                    <button className="quantity-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                    <span className="quantity-num">{quantity}</span>
                    <button className="quantity-btn" onClick={() => setQuantity((q) => Math.max(1, q + 1))}>+</button>
                </div>
                    <button className="order-btn" onClick={handleAddToCart}>장바구니에 넣기</button>
                    <button className="order-btn" onClick={handleBuyNow}>바로 구매하기</button>
            </div>
        </div>
    )
}

export default ProductModal