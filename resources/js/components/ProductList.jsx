import React, { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Select, MenuItem, Button, Box, Typography,
    Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

const ProductList = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", category_id: "" });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editProduct, setEditProduct] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [openDialog, setOpenDialog] = useState({ open: false, productId: null });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await getProducts();
        setProducts(response.data);
    };

    const fetchCategories = async () => {
        const response = await getCategories();
        setCategories(response.data);
    };

    const handleAdd = async () => {
        try {
            await addProduct({ ...newProduct, category_id: selectedCategory });
            fetchProducts();
            setNewProduct({ name: "", price: "", category_id: "" });
            setSelectedCategory("");
            setOpenSnackbar({ open: true, message: "Sản phẩm đã được thêm!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi thêm sản phẩm!", severity: "error" });
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
    };

    const handleUpdate = async () => {
        try {
            await updateProduct(editProduct.id, editProduct);
            fetchProducts();
            setEditProduct(null);
            setOpenSnackbar({ open: true, message: "Cập nhật sản phẩm thành công!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi cập nhật sản phẩm!", severity: "error" });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProduct(openDialog.productId);
            fetchProducts();
            setOpenDialog({ open: false, productId: null });
            setOpenSnackbar({ open: true, message: "Sản phẩm đã được xóa!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi xóa sản phẩm!", severity: "error" });
        }
    };

    return (
        <Box sx={{ maxWidth: "1000px", margin: "auto", p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                🎯 Quản Lý Sản Phẩm
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        label="Tên sản phẩm"
                        variant="outlined"
                        fullWidth
                        value={editProduct ? editProduct.name : newProduct.name}
                        onChange={(e) =>
                            editProduct
                                ? setEditProduct({ ...editProduct, name: e.target.value })
                                : setNewProduct({ ...newProduct, name: e.target.value })
                        }
                    />
                    <TextField
                        label="Giá"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={editProduct ? editProduct.price : newProduct.price}
                        onChange={(e) =>
                            editProduct
                                ? setEditProduct({ ...editProduct, price: e.target.value })
                                : setNewProduct({ ...newProduct, price: e.target.value })
                        }
                    />
                    <Select
                        fullWidth
                        value={editProduct ? editProduct.category_id || "" : selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">Chọn danh mục</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </MenuItem>
                        ))}
                    </Select>
                    {editProduct ? (
                        <Button variant="contained" color="warning" fullWidth onClick={handleUpdate}>
                            <FontAwesomeIcon icon={faSave} style={{ marginRight: "8px" }} />
                            Cập Nhật
                        </Button>
                    ) : (
                        <Button variant="contained" color="success" fullWidth onClick={handleAdd}>
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
                            Thêm
                        </Button>
                    )}
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2", color: "white" }}>
                            <TableCell sx={{ color: "white" }}>ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Tên Sản Phẩm</TableCell>
                            <TableCell sx={{ color: "white" }}>Giá</TableCell>
                            <TableCell sx={{ color: "white" }}>Danh Mục</TableCell>
                            <TableCell sx={{ color: "white" }}>Khuyến Mãi</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center" }}>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.category ? product.category.category_name : "Không có danh mục"}</TableCell>
                                <TableCell>
                                    {product.promotions && product.promotions.length > 0 ? (
                                        <Box sx={{ color: "green", fontWeight: "bold" }}>
                                            {product.promotions.map((promotion, index) => (
                                                <div key={promotion.id}>
                                                    {promotion.promo_name} ({promotion.discount_value}%)
                                                </div>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box sx={{ color: "gray" }}>Không có khuyến mãi</Box>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleEdit(product)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => setOpenDialog({ open: true, productId: product.id })}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={openSnackbar.open} autoHideDuration={3000} onClose={() => setOpenSnackbar({ open: false })}>
                <Alert severity={openSnackbar.severity}>{openSnackbar.message}</Alert>
            </Snackbar>

            <Dialog open={openDialog.open} onClose={() => setOpenDialog({ open: false, productId: null })}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn xóa sản phẩm này?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog({ open: false, productId: null })}>Hủy</Button>
                    <Button onClick={handleDelete} color="error">Xóa</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductList;
