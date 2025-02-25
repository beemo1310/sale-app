<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;

Route::prefix('api')->group(function () {
    Route::group(['prefix' => 'products'], function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{product}', [ProductController::class, 'update']);
        Route::delete('/{product}', [ProductController::class, 'destroy']);
    });

    Route::group(['prefix' => 'promotions'], function () {
        Route::post('/search', [PromotionController::class, 'search']);
        Route::post('/', [PromotionController::class, 'store']);
        Route::get('/{promotion}', [PromotionController::class, 'show']);
        Route::put('/{promotion}', [PromotionController::class, 'update']);
        Route::delete('/{promotion}', [PromotionController::class, 'destroy']);

        Route::post('/assign-to-product', [PromotionController::class, 'assignPromotionToProduct']);
        Route::post('/assign-to-category', [PromotionController::class, 'assignPromotionToCategory']);
    });

    Route::group(['prefix' => 'orders'], function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('search-orders', [OrderController::class, 'searchOrders']);
        Route::post('/', [OrderController::class, 'store']);
        Route::delete('/{order}', [OrderController::class, 'destroy']);
        Route::get('order-summary', [OrderController::class, 'getOrderSummary']);
        Route::get('order-details', [OrderController::class, 'getOrderDetails']);
    });

    Route::group(['prefix' => 'categories'], function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{category}', [CategoryController::class, 'update']);
        Route::delete('/{category}', [CategoryController::class, 'destroy']);
    });
});
