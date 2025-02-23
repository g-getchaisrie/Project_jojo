<?php

use App\Http\Controllers\CreateController;
use App\Http\Controllers\ReservationsController;
use App\Http\Controllers\TablesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // เส้นทางการจองโต๊ะ
    Route::get('/reserve', [TablesController::class, 'index'])->name('reserve.index');
    Route::post('/reserve', [ReservationsController::class, 'store'])->name('reserve.store');
    Route::post('/tables/{table}/reserve', [ReservationsController::class, 'store'])->name('tables.reserve');
    Route::patch('/api/tables/{id}/reserve', [ReservationsController::class, 'store']);

    // หน้าสร้างการจอง
    Route::get('/create', [CreateController::class, 'showCreateForm'])->name('create');

    // API สำหรับการจอง
    Route::post('/reserve-table', [ReservationsController::class, 'reserveTable']);

    // เส้นทางสำหรับการแก้ไขข้อมูลการจอง
    Route::get('/reserve/{reservation}/edit', [ReservationsController::class, 'edit'])->name('reserve.edit');
    Route::put('/reserve/{reservation}', [ReservationsController::class, 'update'])->name('reserve.update');

    // เส้นทางสำหรับแสดงข้อมูลการจอง
    Route::get('/reserve/{reservation}', [ReservationsController::class, 'show'])->name('reserve.show');

    // เส้นทางสำหรับการลบการจอง
    Route::delete('/reserve/{reservation}', [ReservationsController::class, 'destroy'])->name('reservations.destroy');
});

require __DIR__ . '/auth.php';
