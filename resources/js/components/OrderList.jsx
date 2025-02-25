import React, { useEffect, useState } from "react";
import { getOrders } from "../services/api";

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const response = await getOrders();
        setOrders(response.data);
    };

    return (
        <div>
            <h2>Lịch Sử Mua Hàng</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        ID Đơn: {order.id} - Tổng tiền: ${order.total_amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
