import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import {auth} from "../fbase"
import { onAuthStateChanged } from "firebase/auth";
import "../css/Navbar.css"

const Navbar = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        //로그인 상태 확인
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="nav-btn">Home</Link>
            </div>

            <div className="navbar-right">
                <Link to="/cart" className="nav-btn">Cart</Link>
                {user ? (
                    <Link to="/profile">Profile</Link>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar