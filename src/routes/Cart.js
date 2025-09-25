import React, {useEffect, useState} from "react";
import {collection, getDocs, doc, deleteDoc, updateDoc} from "firebase/firestore"
import {auth, db} from "../fbase"
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCart =  async () => {
            const user = auth.currentUser
            if(!user) return

            const querySnapshot = await getDocs(collection(db, "users", user.uid, "cart"))
            const items = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data(),
            }))
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
        navigate("/order")
    }
    
    return (
        <div>
            <h1>장바구니 페이지</h1>
            {cartItems.length === 0 ? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <p>{item.name}</p>
                            <p>수량: {item.quantity}</p>
                            <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                            <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                            <button onClick={() => handleDelete(item.id)}>삭제</button>
                        </li>
                    ))}
                </ul>
            )}
            
            <button onClick={handleOrder}>주문하기</button>
        </div>
        
    )
}

export default Cart