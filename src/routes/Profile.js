import React, {useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import {auth, db} from "../fbase"
import {doc, getDoc} from "firebase/firestore"

const Profile = () => {
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser
            if(currentUser) {
                const userRef = doc(db, "users", currentUser.uid)
                const userSnap = await getDoc(userRef)
                if(userSnap.exists()) {
                    setUserData(userSnap.data())
                }else {
                    console.log("사용자 데이터 없음")
                }
            }
        }
        fetchUserData()
    }, [])

    return (
        <div style={{padding: "20px"}}>
            <h2>프로필</h2>

            {!userData ? (
                <p>로딩 중</p>
            ) : (
                <>
                    <p><strong>이름:</strong>{userData.name}</p>
                    <p><strong>메일:</strong>{userData.email}</p>
                    <p><strong>전화번호:</strong>{userData.phone}</p>

                    <div>
                        <button onClick={() => navigate("/orderhistory")}>주문목록</button>
                        <button onClick={() => navigate("/cart")}>장바구니</button>
                    </div>
                </>
            )}
            
        </div>
    )
}

export default Profile