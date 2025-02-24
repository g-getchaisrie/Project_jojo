<?php

use App\Http\Controllers\CreateController;
use App\Http\Controllers\ReservationsController;
use App\Http\Controllers\TablesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// เส้นทางหลัก (Welcome Page)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// เส้นทาง Dashboard (ต้องล็อกอิน)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// กลุ่มเส้นทางที่ต้องล็อกอิน
Route::middleware('auth')->group(function () {
    // เส้นทางจัดการโปรไฟล์
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // กลุ่มเส้นทางการจองโต๊ะ
    Route::prefix('reserve')->name('reserve.')->group(function () {
        // หน้าแสดงรายการโต๊ะ
        Route::get('/', [TablesController::class, 'index'])->name('index');

        // ใช้ Route Resource สำหรับการจัดการการจอง (CRUD)
        Route::resource('reservations', ReservationsController::class)->except(['create', 'store']);

        // เส้นทางสำหรับหน้าแสดงฟอร์มการจอง โดยรับ table_id
        // ใช้ Query Parameter
        Route::get('/create', [ReservationsController::class, 'create'])->name('create');


        // เส้นทาง POST สำหรับสร้างการจอง
        Route::post('/store', [ReservationsController::class, 'store'])->name('store');

        // เส้นทางแสดงรายละเอียดการจอง
        Route::get('/{id}', [ReservationsController::class, 'show'])->name('show');

        // เส้นทางลบการจอง
        Route::delete('/{id}', [ReservationsController::class, 'delete'])->name('destroy');
    });
});

// กลุ่มเส้นทาง API (ต้องล็อกอิน)
Route::prefix('api')->middleware('auth')->group(function () {
    // จองโต๊ะผ่าน API
    Route::post('/tables/{id}/reserve', [ReservationsController::class, 'store'])->name('api.tables.reserve');
});

// เส้นทาง Authentication (ล็อกอิน, ลงทะเบียน, ลืมรหัสผ่าน)
require __DIR__ . '/auth.php';
