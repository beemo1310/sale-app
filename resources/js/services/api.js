import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// PRODUCTS API
export const getProducts = () => api.get("/products");
export const addProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// PROMOTIONS API
export const getPromotions = (params) =>
    api.post("/promotions/search", { params });
export const addPromotion = (data) => api.post("/promotions", data);
export const updatePromotion = (id, data) => api.put(`/promotions/${id}`, data);
export const deletePromotion = (id) => api.delete(`/promotions/${id}`);
// API Gán Khuyến Mãi Cho Sản Phẩm
export const assignPromotionToProduct = (promotionId, productId) =>
    api.post("/promotions/assign-to-product", {
        promotion_id: promotionId,
        product_id: productId,
    });
// API Gán Khuyến Mãi Theo Danh Mục
export const assignPromotionToCategory = (promotionId, categoryId) =>
    api.post("/promotions/assign-to-category", {
        promotion_id: promotionId,
        category_id: categoryId,
    });

// ORDERS API
export const getOrders = () => api.get("/orders");
export const searchOrders = (params) =>
    api.get("/orders/search-orders", { params });
export const getOrderSummary = () => api.get("/orders/order-summary");
export const getOrderDetails = () => api.get("/orders/order-details");

// CATEGORIES API
export const getCategories = () => api.get("/categories");
export const addCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
