import React, {useState} from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore"
import {auth, db} from "../fbase"
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            // firebase auth에 계정 생성
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            
            // firestore에 추가 정보 저장
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email,
                name,
                phone,
                createAt: new Date()
            })

            alert("회원가입 성공")
            navigate("/login")
        } catch (error) {
            alert("회원가입 실패: " + error.message)
        }

        
    }
    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <input
                        type="tel"
                        placeholder="전화번호"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}

export default SignUp