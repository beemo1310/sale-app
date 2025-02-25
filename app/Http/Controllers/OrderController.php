<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['customer', 'details.product'])->get();
    }

    public function searchOrders(Request $request)
    {
        $query = OrderDetail::with(['order.customer', 'product.promotions']);

        // 🔎 Lọc theo khoảng thời gian
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereHas('order', function ($q) use ($request) {
                $q->whereBetween('order_date', [$request->start_date, $request->end_date]);
            });
        }

        // 🔎 Lọc theo user (customer_id)
        if ($request->has('customer_id')) {
            $query->whereHas('order', function ($q) use ($request) {
                $q->where('customer_id', $request->customer_id);
            });
        }

        // 🔎 Lọc theo tên sản phẩm
        if ($request->has('product_name')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->product_name . '%');
            });
        }

        $orderDetails = $query->get()->map(function ($detail) {
            return [
                'product_name' => $detail->product->name,
                'order_date' => $detail->order->order_date,
                'customer_name' => $detail->order->customer->name,
                'product_code' => 'P-' . str_pad($detail->product->id, 5, '0', STR_PAD_LEFT),
                'applied_promotions' => $detail->product->promotions->pluck('discount_name')->toArray()
            ];
        });

        return response()->json($orderDetails);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'order_date' => 'required|date',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        if (!Customer::where('id', $request->customer_id)->exists()) {
            return response()->json(['error' => 'Khách hàng không tồn tại!'], 400);
        }

        $totalAmount = 0;
        foreach ($request->products as $product) {
            $productData = Product::findOrFail($product['product_id']);
            $totalAmount += $productData->price * $product['quantity'];
        }

        $order = Order::create([
            'customer_id' => $request->customer_id,
            'total_amount' => $totalAmount,
            'order_date' => $request->order_date,
        ]);

        foreach ($request->products as $product) {
            $productData = Product::findOrFail($product['product_id']);
            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $product['product_id'],
                'quantity' => $product['quantity'],
                'unit_price' => $productData->price,
            ]);
        }

        return response()->json(['message' => 'Đơn hàng đã được tạo'], 201);
    }



    public function delete(Order $order)
    {
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }

    public function getOrderSummary()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::sum('total_amount');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        return response()->json([
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'average_order_value' => round($averageOrderValue, 2),
        ]);
    }

    public function getOrderDetails()
    {
        $orderDetails = OrderDetail::with([
            'product.promotions',
            'order'
        ])->get();

        $data = $orderDetails->map(function ($detail) {
            return [
                'product_name' => $detail->product->name,
                'order_date' => $detail->order->order_date,
                'product_code' => 'P-' . str_pad($detail->product->id, 5, '0', STR_PAD_LEFT),
                'applied_promotions' => $detail->product->promotions->pluck('discount_name')->toArray()
            ];
        });

        return response()->json($data);
    }
}
