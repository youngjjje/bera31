import React, {useState, useEffect} from "react";
import {collection, getDoc, getDocs} from "firebase/firestore"
import {db} from "../fbase"
import ProductModal from "../components/ProductModal";

import tropical from "../image/트로피컬.png"
import polarbear from "../image/폴라베어.png"
import watermelon from "../image/수박.png"
import mango from "../image/망고.png"
import rainbow from "../image/레인보우.png"

const productImages = [tropical, polarbear, watermelon, mango, rainbow]

const Home = () => {
    const [products, setProducts] = useState([])
    const [selectProduct, setSelectProduct] = useState(null)

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
                }
            })
            
            setProducts(productList)
        }
        fetchData()
    }, [])

    return (
     <div>
        <h1>상품 목록</h1>
        {products.map((product) => (
            <div key={product.id}>
            <p>{product.name} - {product.description}</p>
            <img src={product.image} alt={product.name} width="150" style={{cursor: "pointer"}}
                onClick={() => setSelectProduct(product)}
                />
            </div>
        ))}

        {/*상품 모달*/}
        <ProductModal product={selectProduct} onClose={()=> setSelectProduct(null)}/>
     </div>
    )
}

export default Home