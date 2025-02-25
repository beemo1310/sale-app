<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('orders')->truncate();
        DB::table('order_details')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');


        $orders = [
            ['customer_id' => 1, 'total_amount' => 1200, 'order_date' => Carbon::now()],
            ['customer_id' => 1, 'total_amount' => 800, 'order_date' => Carbon::now()->subDays(2)],
        ];

        foreach ($orders as $orderData) {
            $order = Order::create($orderData);

            $products = Product::inRandomOrder()->take(2)->get();
            foreach ($products as $product) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                    'original_price' => $product->price,
                    'final_price' => $product->price,
                ]);
            }
        }
    }
}
