import React, {useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import {auth, db} from "../fbase"
import {doc, getDoc} from "firebase/firestore"
import "../css/Profile.css"

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
        <div className="profile-container">
            <h2 className="profile-title">프로필</h2>

            {!userData ? (
                <p>로딩 중</p>
            ) : (
                <>
                    <p className="profile-item"><strong>이름:</strong>{userData.name}</p>
                    <p className="profile-item"><strong>메일:</strong>{userData.email}</p>
                    <p className="profile-item"><strong>전화번호:</strong>{userData.phone}</p>

                    <div className="profile-buttons">
                        <button onClick={() => navigate("/orderhistory")}>주문목록</button>
                        <button onClick={() => navigate("/cart")}>장바구니</button>
                    </div>
                </>
            )}
            
        </div>
    )
}

export default Profile