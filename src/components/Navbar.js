import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom"
import {auth} from "../fbase"
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../css/Navbar.css"

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
                <Link to="/" className="nav-btn">Home</Link>
            </div>

            <div style={{ display: "flex", gap: "15px", position: "relative" }}>
                <Link to="/cart" className="nav-btn">Cart</Link>

                {/*profile login*/}
                {user ? (
                    <div style={{position: "relative"}} onMouseEnter={() => setOpenMenu(true)}
                    onMouseLeave={() => setOpenMenu(false)}>
                        <span style={{cursor: "pointer"}}>Profile</span>

                    {openMenu && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            background: "white",
                            border: "1px solid gray",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            minWidth: "120px",
                            }}>
                            
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleLogout}>로그아웃</button>
                            </div>
                        )}
                        </div>
                ) : (
                        <Link to="/login">Login</Link>
                )}
                </div>
        </nav>
    )
}

export default Navbar