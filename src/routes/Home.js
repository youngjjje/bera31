import React, {useState, useEffect, useRef} from "react";
import {collection, getDoc, getDocs} from "firebase/firestore"
import {db} from "../fbase"
import ProductModal from "../components/ProductModal";

import "../css/HomeCss.css"

import tropical from "../image/트로피컬.png"
import polarbear from "../image/폴라베어.png"
import watermelon from "../image/수박.png"
import mango from "../image/망고.png"
import rainbow from "../image/레인보우.png"

import mangobg from "../image/mangobg.webp"
import tropicalsummer from "../image/tropicalsummer.jpg"
import polarbg from "../image/polabg.jpg"
import soobakbg from "../image/soobakbg.jpg"
import rainbowbg from "../image/rainbowbg.jpg"

const productImages = [tropical, polarbear, watermelon, mango, rainbow]
const backgroundImages = [tropicalsummer, polarbg, soobakbg, mangobg, rainbowbg];

const Home = () => {
    const [products, setProducts] = useState([])
    const [selectProduct, setSelectProduct] = useState(null)
    const imgRefs = useRef([])
    //const [visibleIds, setVisibleIds] = useState([])

    // firestore에서 상품 데이터 가져오기
    useEffect (() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "products"))

            const productList = querySnapshot.docs.map((doc, index) => {
                const data = doc.data()
                return {
                    id: index + 1,
                    ...data,
                    image: productImages[index] || "https://via.placeholder.com/150",
                    background: backgroundImages[index] || null,
                }
            })
            
            setProducts(productList)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible")
                    } else {
                        entry.target.classList.remove("visible")
                    }
                })
            },
            {threshold: 0.3}
        )

        imgRefs.current.forEach((img) => {
            if (img) observer.observe(img)
        })

        return () => observer.disconnect()
    }, [products])

    /* 스크롤 시 이미지 등장
    useEffect(() => {
        const handleScroll = () => {
            products.forEach((product) => {
                const element = document.getElementById(`product-${product.id}`)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top < window.innerHeight * 0.8) {
                        setVisibleIds((prev) =>
                            prev.includes(product.id) ? prev : [...prev, product.id])
                    }
                }
            })
        }
        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [products])
    */
    return (
     <div className="home-container">
        {products.map((product, index) => (
            <section key={product.id} className="product-section" style={{backgroundImage: `url(${product.background})`}}
                onClick={() => setSelectProduct(product)}>
                    <img ref={(el) => {imgRefs.current[index] = el}} src={product.image} alt={product.name}
                        className="product-image" />
                    {/*<img id={`product-${product.id}`} src={product.image} alt={product.name}
                        className={`product-image ${visibleIds.includes(product.id) ? "visible" : ""}`}
                        onClick={() => setSelectProduct(product)}/>*/}
            </section>
        ))}
        {/*상품 모달*/}
        <ProductModal product={selectProduct} onClose={()=> setSelectProduct(null)}/>
     </div>
    )
}

export default Home