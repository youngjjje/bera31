import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom"
import {auth} from "../fbase"
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../css/Navbar.css"

import bera from "../image/bera.svg"
import cart from "../image/cart.png"
import people from "../image/people.png"


const Navbar = () => {
    const [user, setUser] = useState(null)
    const [openMenu, setOpenMenu] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        //로그인 상태 확인
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])


    const handleLogout = async () => {
        await signOut(auth)
        navigate("/login")
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">
                    <img src={bera} alt="Home" className="nav-icon" />
                </Link>
            </div>

            <div className="navbar-right">
                <Link to="/cart">
                    <img src={cart} alt="Cart" className="nav-icon"/>
                </Link>

                {user ? (
                    <div className="profile-menu" onMouseEnter={() => setOpenMenu(true)}
                        onMouseLeave={() => setOpenMenu(false)}>
                        <img src={people} alt="Profile" className="nav-icon" />

                        {openMenu && (
                            <div className="dropdown">
                                <Link to="/profile">Profile</Link>
                                <button onClick={handleLogout}>로그아웃</button>
                            </div> 
                        )}                   
                    </div>
                ) : (
                    <Link to="/login">
                        <img src={people} alt="Login" className="nav-icon" />
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar