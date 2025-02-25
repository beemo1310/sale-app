<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::get('/{any}', function () {
    return view('app'); // Trả về file React
})->where('any', '.*');
