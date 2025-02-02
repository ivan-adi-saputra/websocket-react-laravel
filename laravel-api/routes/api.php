<?php

use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/hay', function (Request $request) {
    return response()->json([
        'message' => 'Welcome to api'
    ]);
});

Route::get('/message', function (Request $request) {
    broadcast(new MessageSent($request->message ?? ''))->toOthers();

    return response()->json([
        'message' => $request->message ?? '',
        'status' => 200,
    ], 200);
});
