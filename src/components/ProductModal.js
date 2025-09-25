import React, {useEffect, useState} from "react";
import {auth, db} from "../fbase"
import {doc, collection, addDoc} from "firebase/firestore"
import { useNavigate } from "react-router-dom";

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

    return (
        <div className="modal">
            <h2>{product.name}</h2>
            <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <img src={product.image} alt={product.name} width="200" />

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.max(1, q + 1))}>+</button>
                </div>
                
                <div>
                    <button onClick={handleAddToCart}>장바구니에 넣기</button>
                    <button>바로 구매하기</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal