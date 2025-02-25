import React, { useEffect, useState } from "react";
import { getProducts, getCategories, getPromotions, assignPromotionToProduct, assignPromotionToCategory } from "../services/api";
import {
    Box, Typography, Paper, Select, MenuItem, Button, Snackbar, Alert
} from "@mui/material";

const AssignPromotion = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchPromotions();
    }, []);

    const fetchProducts = async () => {
        const response = await getProducts();
        setProducts(response.data);
    };

    const fetchCategories = async () => {
        const response = await getCategories();
        setCategories(response.data);
    };

    const fetchPromotions = async () => {
        const response = await getPromotions();
        setPromotions(response.data);
    };

    const handleAssignToProduct = async () => {
        if (!selectedPromotion || !selectedProduct) {
            setOpenSnackbar({ open: true, message: "Vui lòng chọn khuyến mãi và sản phẩm!", severity: "warning" });
            return;
        }
        try {
            await assignPromotionToProduct(selectedPromotion, selectedProduct);
            setOpenSnackbar({ open: true, message: "Gán khuyến mãi thành công!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi gán khuyến mãi!", severity: "error" });
        }
    };

    const handleAssignToCategory = async () => {
        if (!selectedPromotion || !selectedCategory) {
            setOpenSnackbar({ open: true, message: "Vui lòng chọn khuyến mãi và danh mục!", severity: "warning" });
            return;
        }
        try {
            await assignPromotionToCategory(selectedPromotion, selectedCategory);
            setOpenSnackbar({ open: true, message: "Gán khuyến mãi cho danh mục thành công!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi gán khuyến mãi!", severity: "error" });
        }
    };

    return (
        <Box sx={{ maxWidth: "800px", margin: "auto", p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                🎁 Gán Khuyến Mãi
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Gán Khuyến Mãi Cho Sản Phẩm</Typography>
                <Select fullWidth value={selectedPromotion} onChange={(e) => setSelectedPromotion(e.target.value)} displayEmpty>
                    <MenuItem value="">Chọn khuyến mãi</MenuItem>
                    {promotions.map((promo) => (
                        <MenuItem key={promo.id} value={promo.id}>
                            {promo.discount_name} ({promo.discount_value}%)
                        </MenuItem>
                    ))}
                </Select>
                <Select fullWidth value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} displayEmpty sx={{ mt: 2 }}>
                    <MenuItem value="">Chọn sản phẩm</MenuItem>
                    {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                            {product.name}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleAssignToProduct}>
                    Gán Khuyến Mãi
                </Button>
            </Paper>

            <Paper sx={{ p: 3 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Gán Khuyến Mãi Cho Danh Mục</Typography>
                <Select fullWidth value={selectedPromotion} onChange={(e) => setSelectedPromotion(e.target.value)} displayEmpty>
                    <MenuItem value="">Chọn khuyến mãi</MenuItem>
                    {promotions.map((promo) => (
                        <MenuItem key={promo.id} value={promo.id}>
                            {promo.discount_name} ({promo.discount_value}%)
                        </MenuItem>
                    ))}
                </Select>
                <Select fullWidth value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty sx={{ mt: 2 }}>
                    <MenuItem value="">Chọn danh mục</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.category_name}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleAssignToCategory}>
                    Gán Khuyến Mãi Cho Danh Mục
                </Button>
            </Paper>

            <Snackbar open={openSnackbar.open} autoHideDuration={3000} onClose={() => setOpenSnackbar({ open: false })}>
                <Alert severity={openSnackbar.severity}>{openSnackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AssignPromotion;
