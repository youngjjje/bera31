import React, {useState} from "react";
import {auth} from "../fbase"
import {Link, useNavigate} from "react-router-dom"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    //로그인
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            alert("로그인 성공")
            navigate("/")
        } catch (error) {
            alert("로그인 실패: " + error.message)
        }
    }

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            alert("회원가입 성공")
        } catch (error) {
            alert("회원가입 실패: " + error.message)
        }
    }

    return (
        <div>
            <h1>로그인</h1>
            <input type="email" placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
            <input type="password" placeholder="비밀번호 입력" value={password} onChange={(e) => setPassword(e.target.value)}/><br />

            <button onClick={handleLogin}>로그인</button>
            <Link to="/register">
                <button onClick={handleSignup}>회원가입</button>
            </Link>
            

        </div>
    )
}

export default Login