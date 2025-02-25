-- =============================
-- Tạo Database (nếu cần)
-- =============================
USE master;
DROP DATABASE IF EXISTS SalesDB;
CREATE DATABASE SalesDB;
USE SalesDB;

-- =============================
-- Tạo bảng chính
-- =============================

-- Bảng Khách hàng
CREATE TABLE Customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    member_type VARCHAR(50) CHECK (member_type IN ('Regular', 'VIP', 'Gold', 'Silver')),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng Danh mục sản phẩm
CREATE TABLE Categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Bảng Sản phẩm
CREATE TABLE Products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE
);

-- Bảng Khuyến mãi
CREATE TABLE Promotions (
    promotion_id INT IDENTITY(1,1) PRIMARY KEY,
    promo_name VARCHAR(255) NOT NULL,
    discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'amount', 'fix_price')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    priority INT DEFAULT 0,  
    applicable_member_type VARCHAR(50), 
    applicable_category INT REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- Bảng Đơn hàng
CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,
    order_date DATETIME2 DEFAULT GETDATE(),
    total_amount DECIMAL(10,2) NOT NULL
);

-- Bảng Chi tiết đơn hàng
CREATE TABLE OrderDetails (
    order_detail_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2) NOT NULL,
    applied_promotion_id INT REFERENCES Promotions(promotion_id) ON DELETE SET NULL
);

-- =============================
-- Chèn dữ liệu mẫu
-- =============================

-- Dữ liệu khách hàng
INSERT INTO Customers (name, email, phone, member_type) VALUES
('Nguyễn Văn A', 'a@gmail.com', '0912345678', 'VIP'),
('Trần Thị B', 'b@gmail.com', '0987654321', 'Regular'),
('Lê Văn C', 'c@gmail.com', '0934567890', 'Gold');

-- Dữ liệu danh mục sản phẩm
INSERT INTO Categories (category_name) VALUES
('Điện thoại'), ('Laptop'), ('Phụ kiện');

-- Dữ liệu sản phẩm
INSERT INTO Products (name, price, category_id) VALUES
('iPhone 14', 20000000, 1),
('MacBook Air', 30000000, 2),
('Tai nghe Bluetooth', 500000, 3);

-- Dữ liệu chương trình khuyến mãi
INSERT INTO Promotions (promo_name, discount_type, discount_value, start_date, end_date, priority, applicable_member_type, applicable_category) VALUES
('Giảm 10% VIP', 'percentage', 10, '2024-02-01', '2024-02-28', 1, 'VIP', NULL),
('Giảm 500K Laptop', 'amount', 500000, '2024-02-01', '2024-02-28', 2, NULL, 2),
('iPhone giá sốc', 'fix_price', 18000000, '2024-02-15', '2024-02-20', 3, NULL, 1);

-- Dữ liệu đơn hàng
INSERT INTO Orders (customer_id, total_amount) VALUES
(1, 18000000), 
(2, 29500000);

-- Dữ liệu chi tiết đơn hàng
INSERT INTO OrderDetails (order_id, product_id, quantity, original_price, final_price, applied_promotion_id) VALUES
(1, 1, 1, 20000000, 18000000, 3),
(2, 2, 1, 30000000, 29500000, 2);

-- =============================
-- Truy vấn báo cáo
-- =============================

-- 1. Tổng doanh thu bán hàng
SELECT SUM(total_amount) AS total_revenue FROM Orders;

-- 2. Số lượng sản phẩm bán ra theo danh mục
SELECT c.category_name, SUM(od.quantity) AS total_sold
FROM OrderDetails od
JOIN Products p ON od.product_id = p.product_id
JOIN Categories c ON p.category_id = c.category_id
GROUP BY c.category_name;

-- 3. Hiệu quả của từng chương trình khuyến mãi
SELECT p.promo_name, COUNT(od.order_detail_id) AS total_orders, SUM(od.final_price) AS total_revenue
FROM OrderDetails od
JOIN Promotions p ON od.applied_promotion_id = p.promotion_id
GROUP BY p.promo_name
ORDER BY total_orders DESC;
