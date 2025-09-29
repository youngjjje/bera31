import React, {useEffect, useState} from "react"
import {auth, db} from "../fbase"
import {collection, deleteDoc, getDoc, getDocs, doc, addDoc} from "firebase/firestore"
import { useNavigate } from "react-router-dom"

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

            try {
                const querySnapshot = await getDocs(
                    collection(db, "users", user.uid, "cart")
                )
                const item = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setCartItems(item)
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
        <div>
            <h2>주문서</h2>

            {/*주문자 정보*/}
            <div>
                <h3>배송자 정보</h3>
                <input type="text" name="name" placeholder="이름" value={userInfo.name} onChange={handleInputChange} />
                <br />
                <input type="tell" name="phone" placeholder="전화번호" value={userInfo.phone} onChange={handleInputChange} />
                <br />
                <input type="text" name="address" placeholder="주소" value={userInfo.address} onChange={handleInputChange} />
            </div>

            {/*배송 상품*/}
            <div>
                <h3>배송 상품</h3>
                    {cartItems.length === 0 ? (
                        <p>장바구니가 비어있습니다</p>
                    ) : (
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id}>
                                    {item.name} - tnfid: {item.quantity} - 가격:{" "}
                                    {((item.price || 0) * (item.quantity || 1)). toLocaleString()}원
                                </li>
                            ))}
                        </ul>
                    )}
            </div>

            {/*결제 수단*/}
            <div>
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
            <div>
                <h3>결제 정보</h3>
                <p>총 상품 금액: {totalPrice.toLocaleString()}원</p>
                <button onClick={handleSubmit}>결제하기</button>
            </div>
        </div>
        
    )
}

export default CheckOut