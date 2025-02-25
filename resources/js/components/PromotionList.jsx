import React, { useEffect, useState } from "react";
import { getPromotions, addPromotion, updatePromotion, deletePromotion } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSave, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Button, Box, Typography,
    Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

const PromotionList = () => {
    const [promotions, setPromotions] = useState([]);
    const [newPromotion, setNewPromotion] = useState({ promo_name: "", discount_value: "" });
    const [editPromotion, setEditPromotion] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [openDialog, setOpenDialog] = useState({ open: false, promotionId: null });
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        let params = {
            promo_name: searchTerm,
            start_date: dateFilter.startDate,
            end_date: dateFilter.endDate
        };
        const response = await getPromotions(params);
        setPromotions(response.data);
    };

    const handleAdd = async () => {
        try {
            await addPromotion(newPromotion);
            fetchPromotions();
            setNewPromotion({ promo_name: "", discount_value: "" });
            setOpenSnackbar({ open: true, message: "Khuyến mãi đã được thêm!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi thêm khuyến mãi!", severity: "error" });
        }
    };

    const handleEdit = (promotion) => {
        setEditPromotion(promotion);
    };

    const handleUpdate = async () => {
        try {
            await updatePromotion(editPromotion.id, editPromotion);
            fetchPromotions();
            setEditPromotion(null);
            setOpenSnackbar({ open: true, message: "Cập nhật khuyến mãi thành công!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi cập nhật khuyến mãi!", severity: "error" });
        }
    };

    const handleDelete = async () => {
        try {
            await deletePromotion(openDialog.promotionId);
            fetchPromotions();
            setOpenDialog({ open: false, promotionId: null });
            setOpenSnackbar({ open: true, message: "Khuyến mãi đã được xóa!", severity: "success" });
        } catch (error) {
            setOpenSnackbar({ open: true, message: "Lỗi khi xóa khuyến mãi!", severity: "error" });
        }
    };

    const getFilteredPromotions = () => {
        return promotions.filter(promo => {
            if (!dateFilter.startDate && !dateFilter.endDate) return true;

            const promoStart = promo.start_date ? new Date(promo.start_date) : null;
            const promoEnd = promo.end_date ? new Date(promo.end_date) : null;
            const filterStart = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
            const filterEnd = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

            if (filterStart && filterEnd) {
                return (!promoStart || promoStart <= filterEnd) && (!promoEnd || promoEnd >= filterStart);
            } else if (filterStart) {
                return !promoEnd || promoEnd >= filterStart;
            } else if (filterEnd) {
                return !promoStart || promoStart <= filterEnd;
            }
            return true;
        });
    };

    return (
        <Box sx={{ maxWidth: "800px", margin: "auto", p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                🎁 Quản Lý Khuyến Mãi
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        label="Tên khuyến mãi"
                        variant="outlined"
                        fullWidth
                        value={editPromotion ? editPromotion.promo_name : newPromotion.promo_name}
                        onChange={(e) =>
                            editPromotion
                                ? setEditPromotion({ ...editPromotion, promo_name: e.target.value })
                                : setNewPromotion({ ...newPromotion, promo_name: e.target.value })
                        }
                    />
                    <TextField
                        label="Giá trị giảm (%)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={editPromotion ? editPromotion.discount_value : newPromotion.discount_value}
                        onChange={(e) =>
                            editPromotion
                                ? setEditPromotion({ ...editPromotion, discount_value: e.target.value })
                                : setNewPromotion({ ...newPromotion, discount_value: e.target.value })
                        }
                    />
                    {editPromotion ? (
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

            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                <Box display="flex" gap={2} flexWrap="wrap" sx={{justifyContent: "space-between" }}>
                    <TextField
                        label="Tìm theo tên khuyến mãi"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập tên khuyến mãi cần tìm..."
                    />
                    <TextField
                        label="Từ ngày"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={dateFilter.startDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    />
                    <TextField
                        label="Đến ngày"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={dateFilter.endDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    />
                    <Button variant="contained" color="primary" onClick={() => fetchPromotions()}>
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2", color: "white" }}>
                            <TableCell sx={{ color: "white" }}>ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Tên Khuyến Mãi</TableCell>
                            <TableCell sx={{ color: "white" }}>Giá Trị</TableCell>
                            <TableCell sx={{ color: "white" }}>Ngày Áp Dụng</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center" }}>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getFilteredPromotions().map((promo) => (
                            <TableRow key={promo.id}>
                                <TableCell>{promo.id}</TableCell>
                                <TableCell>{promo.promo_name}</TableCell>
                                <TableCell>{promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `$${promo.discount_value}`}</TableCell>
                                <TableCell>
                                    {promo.start_date ? new Date(promo.start_date).toLocaleDateString('vi-VN') : 'N/A'} - {promo.end_date ? new Date(promo.end_date).toLocaleDateString('vi-VN') : 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" color="warning" sx={{ mx: 1 }} onClick={() => handleEdit(promo)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => setOpenDialog({ open: true, promotionId: promo.id })}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PromotionList;
