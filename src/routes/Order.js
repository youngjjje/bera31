// Order.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  if (!order) return <p>결제 정보가 없습니다</p>;

  return (
    <div>
      <h2>결제 완료</h2>
      <p>이름: {order.name}</p>
      <p>전화번호: {order.phone}</p>
      <p>주소: {order.address}</p>
      <p>결제 수단: {order.paymentMethod}</p>
      <p>총 금액: {order.totalPrice.toLocaleString()}원</p>

      <h3>주문 상품</h3>
      <ul>
        {order.products.map((item, idx) => (
          <li key={idx}>
            {item.name} - 수량: {item.quantity} - 가격:{" "}
            {(item.price * item.quantity).toLocaleString()}원
          </li>
        ))}
      </ul>

      <div>
        <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
        <button onClick={() => navigate("/cart")}>장바구니로 돌아가기</button>
        <button onClick={() => navigate("/order")}>주문내역 확인하기</button>
      </div>
    </div>
  );
};

export default Order;
