import React, {useEffect, useState} from "react";
import {collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy} from "firebase/firestore"
import {auth, db} from "../fbase"
import { useNavigate } from "react-router-dom";
import "../css/Cart.css"

import tropical from "../image/트로피컬.png"
import polarbear from "../image/폴라베어.png"
import watermelon from "../image/수박.png"
import mango from "../image/망고.png"
import rainbow from "../image/레인보우.png"

const productImages = {
    1: tropical,
    2: polarbear,
    3: watermelon,
    4: mango,
    5: rainbow,
}

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCart =  async () => {
            const user = auth.currentUser
            if(!user) return

            const q = query(
                collection(db, "users", user.uid, "cart"),
                orderBy("createAt", "asc")
            )
            const querySnapshot = await getDocs(q)
            const items = querySnapshot.docs.map((docSnap) => {
                const data = docSnap.data()
                return {
                    id: docSnap.id,
                    productId: data.productId,
                    ...data,
                    image: productImages[Number(data.productId)] || "https://via.placeholder.com/150"
                }
            })
            setCartItems(items)
        }
        fetchCart()
    }, [])

    // 수량 증가
    const handleIncrease = async (id, quantity) => {
        const user = auth.currentUser
        const itemRef = doc(db, "users", user.uid, "cart", id)
        await updateDoc(itemRef, {quantity: quantity + 1})
        setCartItems(cartItems.map(item =>
            item.id === id ? {...item, quantity: quantity + 1} : item
        ))
    }

    // 수량 감소
    const handleDecrease = async (id, quantity) => {
        if (quantity <= 1) return
        const user = auth.currentUser
        const itemRef = doc(db, "users", user.uid, "cart", id)
        await updateDoc(itemRef, {quantity: quantity - 1})
        setCartItems(cartItems.map(item =>
            item.id === id ? {...item, quantity: quantity - 1} : item
        ))
    }

    // 삭제
    const handleDelete = async (id) => {
        const user = auth.currentUser
        const confirmDelete = window.confirm("상품을 삭제하겠습니까?")
        
        if(!confirmDelete) return

        try {            
            await deleteDoc(doc(db, "users", user.uid, "cart", id))
            alert("상품이 삭제되었습니다")
        } catch (error) {
            alert("삭제 실패: " + error.message)
        }
        setCartItems(cartItems.filter(item => item.id !== id))
    }

    // 주문하기
    const handleOrder = () => {
        if(cartItems.length === 0) {
            alert("장바구니가 비어 있습니다")
            return
        }
        navigate("/checkout")
    }
    
    return (
        <div className="cart-container">
            <h1 className="cart-title">장바구니 페이지</h1>
            {cartItems.length === 0 ? (
                <p className="empty-cart">장바구니가 비어있습니다.</p>
            ) : (
                <ul className="cart-list">
                    {cartItems.map(item => (
                        <li className="cart-item" key={item.id}>
                            <div className="cart-image-box">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="divider"></div>
                            <div className="cart-info">
                                <p className="cart-name">{item.name}</p>
                                <p className="cart-quantity">수량: {item.quantity}</p>
                                <div className="cart-buttons">
                                    <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                                    <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                                    <button onClick={() => handleDelete(item.id)}>삭제</button>
                                </div>
                            </div>                            
                        </li>
                    ))}
                </ul>
            )}
            
            <button className="order-button" onClick={handleOrder}>주문하기</button>
        </div>        
    )
}

export default Cart