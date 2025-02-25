<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promotion;
use Illuminate\Support\Facades\Log;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function search(Request $request)
    {
        $query = Promotion::query();
        $params = $request->all()['params'];

        if ($params['promo_name']) {
            $query->where('promo_name', 'LIKE', '%' . $params['promo_name'] . '%');
        }

        if ($params['start_date']) {
            $query->whereDate('start_date', '>=', $params['start_date']);
        }

        if ($params['end_date']) {
            $query->whereDate('end_date', '<=', $params['end_date']);
        }

        Log::info($params['promo_name']);
        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $promotion = Promotion::create($request->all());
        return response()->json($promotion);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $promotion = Promotion::find($id);
        return response()->json($promotion);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $promotion = Promotion::find($id);
        $promotion->update($request->all());
        return response()->json($promotion);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $promotion = Promotion::find($id);
        $promotion->delete();
        return response()->json(null, 204);
    }

    public function assignPromotionToProduct(Request $request)
    {
        $request->validate([
            'promotion_id' => 'required|exists:promotions,id',
            'product_id' => 'required|exists:products,id'
        ]);

        $promotion = Promotion::find($request->promotion_id);
        $promotion->products()->attach($request->product_id);

        return response()->json(['message' => 'Khuyến mãi đã được gán cho sản phẩm'], 200);
    }

    public function assignPromotionToCategory(Request $request)
    {
        $request->validate([
            'promotion_id' => 'required|exists:promotions,id',
            'category_id' => 'required|exists:categories,id'
        ]);

        $promotion = Promotion::find($request->promotion_id);
        $promotion->categories()->attach($request->category_id);

        return response()->json(['message' => 'Khuyến mãi đã được gán cho danh mục'], 200);
    }
}
