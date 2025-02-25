<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = ['promo_name', 'discount_type', 'discount_value', 'start_date', 'end_date', 'category_id'];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'promotion_category');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'promotion_product');
    }
}
