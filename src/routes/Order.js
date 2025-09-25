import React, {useEffect, useState} from "react"
import {auth, db} from "../fbase"
import {collection, deleteDoc, getDoc, getDocs} from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const Orders = () => {
    const [orders, setOders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            const user = auth.currentUser
            if(!user) return

            const querySnapshot = await getDocs(collection(db,"users", user.uid, "cart"))
            const orderList = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
            setOders(orderList)
        }
            fetchOrders()
    }, [])
    return (
        <div>
            <h2>주문목록</h2>
            {orders.length === 0 ? (
                <p>주문 내역이 없습니다</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            {order.name} - 수량: {order.quantity}
                        </li>
                    ))}
                </ul>
            )}    
        </div>
        
    )
}

export default Orders