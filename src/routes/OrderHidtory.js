import React, {useEffect, useState} from "react"
import {auth, db} from "../fbase"
import { collection, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

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
        <div>
            <h2>내 주문 내역</h2>
            
            {OrderHistory.length === 0 ? (
                <p>주문 내역이 없습니다</p>
            ) : (
                <ul>
                    {OrderHistory.map((order) => (
                        <li key={order.id}>
                            <p>이름: {order.name}</p>
                            <p>전화번호: {order.phone}</p>
                            <p>주소: {order.address}</p>
                            <p>결제 수단: {order.paymentMethod}</p>
                            <p>총 금액: {order.totalPrice.toLocaleString()}원</p>

                            <h4>주문 상품</h4>
                            <ul>
                                {order.products.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} - 수량: {item.quantity} -가격:{" "}
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <button onClick={() => navigate("/")}>홈으로</button>
                <button onClick={() => navigate("/cart")}>장바구니로</button>
            </div>
        </div>
    )
}

export default OrderHistory