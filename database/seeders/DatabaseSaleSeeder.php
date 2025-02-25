<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderDetail;

class DatabaseSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['category_name' => 'Điện thoại']);
        Category::create(['category_name' => 'Laptop']);
        Category::create(['category_name' => 'Phụ kiện']);

        Product::create(['name' => 'iPhone 14', 'price' => 20000000, 'category_id' => 1]);
        Product::create(['name' => 'MacBook Air', 'price' => 30000000, 'category_id' => 2]);
        Product::create(['name' => 'Tai nghe Bluetooth', 'price' => 500000, 'category_id' => 3]);

        Promotion::create([
            'promo_name' => 'Giảm 10% VIP',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'start_date' => '2024-02-01',
            'end_date' => '2024-02-28',
            'category_id' => null
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 20% Sinh nhật',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'start_date' => '2024-03-01',
            'end_date' => '2024-03-31',
            'category_id' => null
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 500k Laptop',
            'discount_type' => 'amount',
            'discount_value' => 500000,
            'start_date' => '2024-02-15',
            'end_date' => '2024-03-15',
            'category_id' => 2
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 15% Phụ kiện',
            'discount_type' => 'percentage',
            'discount_value' => 15,
            'start_date' => '2024-02-10',
            'end_date' => '2024-04-10',
            'category_id' => 3
        ]);

        Promotion::create([
            'promo_name' => 'Fix giá 19tr iPhone',
            'discount_type' => 'fix_price',
            'discount_value' => 19000000,
            'start_date' => '2024-02-20',
            'end_date' => '2024-03-20',
            'category_id' => 1
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 1tr Điện thoại',
            'discount_type' => 'amount',
            'discount_value' => 1000000,
            'start_date' => '2024-03-01',
            'end_date' => '2024-03-31',
            'category_id' => 1
        ]);

        Promotion::create([
            'promo_name' => 'Fix giá 25tr Macbook',
            'discount_type' => 'fix_price',
            'discount_value' => 25000000,
            'start_date' => '2024-03-10',
            'end_date' => '2024-04-10',
            'category_id' => 2
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 30% Black Friday',
            'discount_type' => 'percentage',
            'discount_value' => 30,
            'start_date' => '2024-11-20',
            'end_date' => '2024-11-30',
            'category_id' => null
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 25% Tết',
            'discount_type' => 'percentage',
            'discount_value' => 25,
            'start_date' => '2024-12-25',
            'end_date' => '2025-01-25',
            'category_id' => null
        ]);

        Promotion::create([
            'promo_name' => 'Giảm 100k Phụ kiện',
            'discount_type' => 'amount',
            'discount_value' => 100000,
            'start_date' => '2024-04-01',
            'end_date' => '2024-04-30',
            'category_id' => 3
        ]);

        Customer::create([
            'name' => 'Nguyễn Văn A',
            'email' => 'a@gmail.com',
            'phone' => '0912345678',
            'member_type' => 'VIP'
        ]);

        Customer::create([
            'name' => 'Nguyễn Văn B',
            'email' => 'b@gmail.com',
            'phone' => '0912345679',
            'member_type' => 'VIP'
        ]);

        // Order::create(['customer_id' => 1, 'total_amount' => 18000000]);

        // OrderDetail::create([
        //     'order_id' => 1,
        //     'product_id' => 1,
        //     'quantity' => 1,
        //     'original_price' => 20000000,
        //     'final_price' => 18000000,
        //     'applied_promotion_id' => 1
        // ]);
    }
}
