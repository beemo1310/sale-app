import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList.jsx";
import PromotionList from "./components/PromotionList.jsx";
import OrderList from "./components/OrderList.jsx";
import Navbar from "./components/Navbar.jsx";
import AssignPromotion from "./components/AssignPromotion.jsx";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/promotions" element={<PromotionList />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/assign-promotion" element={<AssignPromotion />} />
                <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
            </Routes>
        </Router>
    );
};

export default App;
