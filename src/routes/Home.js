import React, {useState, useEffect} from "react";
import {collection, getDoc, getDocs} from "firebase/firestore"
import {db} from "../fbase"
import ProductModal from "../components/ProductModal";


const Home = () => {
    const [products, setProducts] = useState([])
    const [selecteProduct, setSelectProduct] = useState(null)

    // firestore에서 상품 데이터 가져오기
    useEffect (() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "products"))
            const productList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                image: "https://via.placeholder.com/150" // 임시
            }))
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
        <ProductModal product={selecteProduct} onClose={()=> setSelectProduct(null)}/>
     </div>
    )
}

export default Home