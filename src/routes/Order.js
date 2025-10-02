// Order.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Order.css"

import tropical from "../image/트로피컬.png"
import polarbear from "../image/폴라베어.png"
import watermelon from "../image/수박.png"
import mango from "../image/망고.png"
import rainbow from "../image/레인보우.png"

const productImages = {
    1: tropical,
    2: polarbear,
    3: watermelon,
    4: mango,
    5: rainbow,
}


const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  if (!order) return <p>결제 정보가 없습니다</p>;

  return (
    <div className="order-container">
      <h2 className="order-title">결제 완료</h2>
      <div className="order-info-box">
        <p>이름: {order.name}</p>
        <p>전화번호: {order.phone}</p>
        <p>주소: {order.address}</p>
        <p>결제 수단: {order.paymentMethod}</p>
        <p>총 금액: {order.totalPrice.toLocaleString()}원</p>
      </div>

      <div className="order-products-box">
        <h3>주문 상품</h3>
          {(() => {
              order.products.forEach((item, idx) => {
                console.log(
                  `상품 ${idx}:`,
                  "productId =", item.productId,
                  "타입 =", typeof item.productId
                );
          });
        })()}
        <ul>
          {order.products.map((item, idx) => (
            <li key={idx} className="order-product-item">
              <img src={productImages[Number(item.productId)] || "https://via.placeholder.com/80"}
                alt={item.name} className="order-product-img" />
              <div>
                <p>{item.name}</p>
                <p>{item.name} - 수량: {item.quantity} - 가격:{" "}</p>
                <p>{(item.price * item.quantity).toLocaleString()}원</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      

      <div className="order-buttons">
        <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
        <button onClick={() => navigate("/cart")}>장바구니로 돌아가기</button>
        <button onClick={() => navigate("/orderhistory")}>주문내역 확인하기</button>
      </div>
    </div>
  );
};

export default Order;
