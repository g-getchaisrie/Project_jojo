<?php

namespace App\Http\Controllers;

use App\Models\Reservations;
use App\Models\Cancelled; // ใช้โมเดล Cancelled
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ReservationsController extends Controller
{
    // ฟังก์ชัน store สำหรับการจอง
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'table_id' => 'required|exists:tables,id',
        ]);

        DB::beginTransaction();

        try {
            $table = Table::findOrFail($request->table_id);
            if (!$table->available) {
                return redirect()->route('reserve.index')->withErrors(['error' => 'โต๊ะนี้ไม่สามารถจองได้เนื่องจากถูกจองแล้ว']);
            }

            $reservation = Reservations::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'table_id' => $request->table_id,
                'reserved_at' => now(),
                'expires_at' => now()->addMinutes(150),
            ]);

            Log::info('Reservation Created: ', $reservation->toArray());

            $userId = Auth::check() ? Auth::id() : null;
            $this->updateTableStatus($request->table_id, $userId);

            DB::commit();

            return redirect()->route('reserve.index')->with('success', 'จองโต๊ะสำเร็จ!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Reservation Error: ' . $e->getMessage());
            return redirect()->route('reserve.index')->withErrors(['error' => 'เกิดข้อผิดพลาดในการจองโต๊ะ']);
        }
    }

    // ฟังก์ชันแก้ไขการจอง
    public function edit($id)
    {
        $reservation = Reservations::findOrFail($id);
        $tables = Table::where('available', true)->get();

        return Inertia::render('Shabu/Edit', [
            'reservation' => $reservation,
            'tables' => $tables,
        ]);
    }

    // ฟังก์ชันอัปเดตการจอง
    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'table_id' => 'required|exists:tables,id',
        ]);

        DB::beginTransaction();

        try {
            $reservation = Reservations::findOrFail($id);
            $newTable = Table::findOrFail($request->table_id);
            if (!$newTable->available) {
                return redirect()->route('reserve.index')->withErrors(['error' => 'โต๊ะที่เลือกไม่สามารถจองได้เนื่องจากถูกจองแล้ว']);
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

            DB::commit();

            return redirect()->route('reserve.index')->with('success', 'แก้ไขการจองสำเร็จ!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update Reservation Error: ' . $e->getMessage());
            return redirect()->route('reserve.index')->withErrors(['error' => 'เกิดข้อผิดพลาดในการแก้ไขการจอง']);
        }
    }

    // ฟังก์ชันแสดงข้อมูลการจอง
    public function show($id)
    {
        $reservation = Reservations::with('table')->findOrFail($id);
        return Inertia::render('Shabu/Show', [
            'reservation' => $reservation,
        ]);
    }

    // ฟังก์ชันลบการจอง (ยกเลิก)
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            // ค้นหาการจองที่ต้องการยกเลิก
            $reservation = Reservations::findOrFail($id);

            // ย้ายข้อมูลการจองไปยังตาราง cancelleds
            Cancelled::create([
                'table_id' => $reservation->table_id,
                'first_name' => $reservation->first_name,
                'last_name' => $reservation->last_name,
                'email' => $reservation->email,
                'phone' => $reservation->phone,
                'reserved_at' => $reservation->reserved_at,
                'canceled_at' => now(),
            ]);

            // ลบข้อมูลการจองจากตาราง reservations
            $reservation->delete();

            // ปล่อยโต๊ะให้สามารถจองได้อีก
            $this->updateTableStatus($reservation->table_id, null, true);

            DB::commit();

            return redirect()->route('reserve.index')->with('success', 'การจองถูกยกเลิกเรียบร้อย');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cancel Reservation Error: ' . $e->getMessage());
            return redirect()->route('reserve.index')->withErrors(['error' => 'เกิดข้อผิดพลาดในการยกเลิกการจอง']);
        }
    }

    // ฟังก์ชันอัปเดตสถานะโต๊ะ
    private function updateTableStatus($tableId, $userId = null, $release = false)
    {
        $status = $release ? true : false;
        $reservedByUser = $release ? null : $userId;

        Table::where('id', $tableId)->update([
            'available' => $status,
            'reserved_by_user_id' => $reservedByUser,
        ]);
    }
}
