<?php

namespace App\Http\Controllers;

use App\Models\Reservations;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ReservationsController extends Controller
{
    // แสดงฟอร์มสร้างการจอง
    public function create(Request $request)
    {
        $table_id = $request->query('table_id');
        $tables = Table::where('available', true)->get();

        return Inertia::render('Shabu/Create', [
            'table_id' => $table_id,
            'tables' => $tables,
        ]);
    }

    // บันทึกการจอง
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:reservations,email',
            'phone' => 'required|numeric|digits_between:10,15',
            'table_id' => 'required|exists:tables,id',
        ]);

        return DB::transaction(function () use ($request) {
            try {
                $reservation = $this->createReservation($request);
                Log::info('Reservation Created: ', $reservation->toArray());

                $userId = Auth::check() ? Auth::id() : null;
                $this->updateTableStatus($request->table_id, $userId);

                return redirect()->route('reserve.index')->with('success', 'จองโต๊ะสำเร็จ!');
            } catch (\Exception $e) {
                Log::error('Reservation Error: ' . $e->getMessage(), ['exception' => $e]);
                return redirect()->route('reserve.index')->withErrors(['error' => $e->getMessage()]);
            }
        });
    }

    // แสดงฟอร์มแก้ไขการจอง
    public function edit($id)
    {
        $reservation = Reservations::findOrFail($id);
        $tables = Table::where('available', true)->get();

        return Inertia::render('Shabu/Edit', [
            'reservation' => $reservation,
            'tables' => $tables,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    // อัปเดตการจอง
    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:reservations,email,' . $id,
            'phone' => 'required|numeric|digits_between:10,15',
            'table_id' => 'required|exists:tables,id',
        ]);

        return DB::transaction(function () use ($request, $id) {
            try {
                $reservation = Reservations::findOrFail($id);
                $newTable = Table::find($request->table_id);
                if (!$newTable) {
                    throw new \Exception('โต๊ะที่เลือกไม่พบ');
                }

                if (!$newTable->available) {
                    throw new \Exception('โต๊ะที่เลือกไม่สามารถจองได้เนื่องจากถูกจองแล้ว');
                }

                if ($reservation->table_id != $request->table_id) {
                    $this->updateTableStatus($reservation->table_id, null, true);
                }

                $reservation->update([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'table_id' => $request->table_id,
                ]);

                $this->updateTableStatus($request->table_id, Auth::id());

                return redirect()->route('reserve.index')->with('success', 'แก้ไขการจองสำเร็จ!');
            } catch (\Exception $e) {
                Log::error('Update Reservation Error: ' . $e->getMessage(), ['exception' => $e]);
                return redirect()->route('reserve.index')->withErrors(['error' => $e->getMessage()]);
            }
        });
    }

    // แสดงรายละเอียดการจอง
    public function show($id)
    {
        $reservation = Reservations::with('table')->findOrFail($id);
        return Inertia::render('Shabu/Show', [
            'reservation' => $reservation,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    // ลบการจอง
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            try {
                $reservation = Reservations::findOrFail($id);
                $reservation->delete();
                $this->updateTableStatus($reservation->table_id, null, true);

                return redirect()->route('reserve.index')->with('success', 'การจองถูกลบเรียบร้อย');
            } catch (\Exception $e) {
                Log::error('Delete Reservation Error: ' . $e->getMessage(), ['exception' => $e]);
                return redirect()->route('reserve.index')->withErrors(['error' => $e->getMessage()]);
            }
        });
    }

    // แสดงรายการการจอง (พร้อม Pagination)
    public function index()
    {
        $reservations = Reservations::with('table')->paginate(10); // เพิ่ม Pagination
        return Inertia::render('Shabu/Index', [
            'reservations' => $reservations,
        ]);
    }

    // สร้างการจอง (method ย่อย)
    private function createReservation($request)
    {
        $table = Table::find($request->table_id);
        if (!$table) {
            throw new \Exception('โต๊ะที่เลือกไม่พบ');
        }

        if (!$table->available) {
            throw new \Exception('โต๊ะนี้ไม่สามารถจองได้เนื่องจากถูกจองแล้ว');
        }

        return Reservations::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'table_id' => $request->table_id,
            'reserved_at' => now(),
            'expires_at' => now()->addMinutes(150),
        ]);
    }

    // อัปเดตสถานะโต๊ะ (method ย่อย)
    private function updateTableStatus($tableId, $userId = null, $release = false)
    {
        $table = Table::find($tableId);
        if (!$table) {
            throw new \Exception('โต๊ะไม่พบ');
        }

        $status = $release ? true : false;
        $reservedByUser = $release ? null : $userId;

        $table->update([
            'available' => $status,
            'reserved_by_user_id' => $reservedByUser,
        ]);
    }
}
