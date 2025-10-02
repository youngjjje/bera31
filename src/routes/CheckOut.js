import React, {useEffect, useState} from "react"
import {auth, db} from "../fbase"
import {collection, deleteDoc, getDoc, getDocs, doc, addDoc, query, orderBy} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import "../css/CheckOut.css"

import tropical from "../image/트로피컬.png"
import polarbear from "../image/폴라베어.png"
import watermelon from "../image/수박.png"
import mango from "../image/망고.png"
import rainbow from "../image/레인보우.png"

const productImages = {
    "1": tropical,
    "2": polarbear,
    "3": watermelon,
    "4": mango,
    "5": rainbow,
}


const CheckOut = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: "",
        address: "",
    })
    const [cartItems, setCartItems] = useState([])
    const [paymentMethod, setPaymentMethod] = useState("card")
    const navigate = useNavigate()

    // 유저 기본정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            const user = auth.currentUser
            if (!user) return

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid))
                if (userDoc.exists()) {
                    const data = userDoc.data()
                    setUserInfo((prev) => ({
                        ...prev,
                        name: data.name || "",
                        phone: data.phone || "",
                    }))
                }
            } catch (error) {
                    console.error("사용자 정보 불러오기 실패: ", error)
                }
        }
        fetchUserInfo()
    }, [])

    // 장바구니 불러오기
    useEffect(() => {
        const fetchCart = async () => {
            const user = auth.currentUser
            if (!user) return

            const q = query(
                collection(db, "users", user.uid, "cart"),
                orderBy("createAt", "asc")
            )
            try {
                const querySnapshot = await getDocs(q)
                const items = querySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data()
                    return {id: docSnap.id,
                        ...data,
                        image: productImages[Number(data.productId)] || "https://via.placeholder.com/150"
                    }
                    })
                setCartItems(items)
            } catch (error) {
                console.error("장바구니 불러오기 실패: ", error)
            }
        }

        fetchCart()
    }, [])

    // 총 금액
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0
    )

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // 결제
    const handleSubmit = async () => {
        const user = auth.currentUser
        if(!user) {
            alert("로그인을 해주세요")
            return
        }

        try {
            //주문 데이터 저장
            const newOrder =  {
                name: userInfo.name,
                phone: userInfo.phone,
                address: userInfo.address,
                products: cartItems.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price || 0,
                })),
                totalPrice,
                paymentMethod,
                createAt: new Date(),
            }
            await addDoc(collection(db, "users", user.uid, "orders"), newOrder)

            // 결제 완료된 장바구니 목록 삭제
            for(let item of cartItems) {
                await deleteDoc(doc(db, "users", user.uid, "cart", item.id))
            }

            alert("결제가 완료되었습니다.")
            navigate("/order", {state: newOrder})
        } catch (error) {
            alert("결제 실패: " + error.message)
        }
    }

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">주문서 작성</h2>

            {/*주문자 정보*/}
            <div className="checkout-box1">
                <h3>배송자 정보</h3>
                <label>
                    이  름 <input type="text" name="name" placeholder="이름" value={userInfo.name} onChange={handleInputChange} />
                </label>
                <br />
                <label>                    
                    전  화 <input type="tell" name="phone" placeholder="전화번호" value={userInfo.phone} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    주  소 <input type="text" name="address" placeholder="주소" value={userInfo.address} onChange={handleInputChange} />
                </label>
            </div>

            {/*배송 상품*/}
            <div className="checkout-box2">
                <h3>배송 상품</h3>
                    {cartItems.length === 0 ? (
                        <p>장바구니가 비어있습니다</p>
                    ) : (
                        <ul className="product-list">
                            {cartItems.map((item) => (
                                
                                <li key={item.id} className="product-box">
                                    <div className="checkout-image-box">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="product-info">
                                        {item.name} - 수량: {item.quantity} - 가격:{" "}
                                        {((item.price || 0) * (item.quantity || 1)). toLocaleString()}원
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>

            {/*결제 수단*/}
            <div className="checkout-box3">
                <h3>결제 수단</h3>
                <label>
                    <input type="radio" value={"card"} checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)} />
                    신용카드
                </label>
                <label>
                    <input type="radio" value={"kakao"} checked={paymentMethod === "kakao"}
                        onChange={(e) => setPaymentMethod(e.target.value)} />
                    카카오페이
                </label>
                <label>
                    <input type="radio" value={"bank"} checked={paymentMethod === "bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)} />
                    계좌이체
                </label>
            </div>

            {/*최종 결제*/}
            <div className="checkout-box4">
                <h3>결제 정보</h3>
                <p>총 상품 금액: {totalPrice.toLocaleString()}원</p>
                <div className="button-wrapper">
                    <button className="pay-button" onClick={handleSubmit}>결제하기</button>
                </div>
            </div>
        </div>
        
    )
}

export default CheckOut