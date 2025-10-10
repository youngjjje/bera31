import React, {useEffect, useState} from "react"
import {auth, db} from "../fbase"
import { collection, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import "../css/OrderHistory.css"

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

const OrderHistory = () => {
    const [OrderHistory, setOrderHistory] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            const user = auth.currentUser
            if(!user) return

            try {
                const querySnapshot = await getDocs(collection(db, "users", user.uid, "orders"))
                const orderList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))

                setOrderHistory(orderList)
            } catch (error) {
                console.error("주문 내역 불러오기 실패: ", error)
            }
        }
        fetchOrders()

                
    }, [])

    return (
        <div className="orderhistory-container">
            <h2 className="orderhistory-title">내 주문 내역</h2>
            
            {OrderHistory.length === 0 ? (
                <p>주문 내역이 없습니다</p>
            ) : (
                <ul>
                    {OrderHistory.map((order) => (
                        <li key={order.id} className="orderhistory-order">
                            <p>이름: {order.name}</p>
                            <p>전화번호: {order.phone}</p>
                            <p>주소: {order.address}</p>
                            <p>결제 수단: {order.paymentMethod}</p>
                            <p>총 금액: {order.totalPrice.toLocaleString()}원</p>

                            <h4>주문 상품</h4>
                            <ul>
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="orderhistory-itembox">
                                        <img src={productImages[Number(item.productId)] || "https://via.placeholder.com/120"} alt={item.name}
                                            className="orderhistory-product-img"/>
                                        <li key={idx} className="orderhistory-iteminfo">
                                            <ul>
                                                <li>상품명 {item.name}</li>
                                                <li>수량 {item.quantity}</li>
                                                <li>가격 {(item.price * item.quantity).toLocaleString()}원</li>
                                            </ul>
                                        </li>

                                    </div>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}

            <div className="orderhistory-buttons">
                <button onClick={() => navigate("/")}>홈으로</button>
                <button onClick={() => navigate("/cart")}>장바구니로</button>
            </div>
        </div>
    )
}

export default OrderHistory