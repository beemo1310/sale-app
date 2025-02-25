import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Hệ Thống Quản Lý
                </Typography>
                <Box>
                    <Button component={Link} to="/" color="inherit" sx={{ mx: 1 }}>
                        Sản Phẩm
                    </Button>
                    <Button component={Link} to="/promotions" color="inherit" sx={{ mx: 1 }}>
                        Khuyến Mãi
                    </Button>
                    <Button component={Link} to="/assign-promotion" color="inherit" sx={{ mx: 1 }}>
                        Gán Khuyến Mãi
                    </Button>
                    <Button component={Link} to="/orders" color="inherit" sx={{ mx: 1 }}>
                        Đơn Hàng
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
