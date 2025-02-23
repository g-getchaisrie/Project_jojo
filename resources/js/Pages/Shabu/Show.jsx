import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ reservation }) {
    useEffect(() => {
        console.log(reservation); // ตรวจสอบค่า reservation ในคอนโซล
    }, [reservation]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    if (!reservation) {
        return (
            <AuthenticatedLayout>
                <Head title="Reservation Details" />
                <div className="mt-10">
                    <p className="flex justify-center font-semibold text-lg text-gray-800">ไม่พบข้อมูลการจอง</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Reservation Details" />
            <div className="mt-10">
                <p className="flex justify-center font-semibold text-lg text-gray-800">ข้อมูลการจอง</p>
                <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h2 className="font-medium text-gray-800 mb-2">โต๊ะที่: {reservation.table.id}</h2>
                                <p className="font-medium text-gray-800">จำนวนที่นั่ง: {reservation.table.seat} คน</p>
                                <div className="mt-4">
                                    <p><strong>ชื่อ:</strong> {reservation.first_name} {reservation.last_name}</p>
                                    <p><strong>Email:</strong> {reservation.email}</p>
                                    <p><strong>โทรศัพท์:</strong> {reservation.phone}</p>
                                    <p><strong>เวลาจอง:</strong> {formatDate(reservation.reserved_at)}</p>
                                    <p><strong>เวลาหมดอายุ:</strong> {formatDate(reservation.expires_at)}</p>
                                </div>

                                {/* Edit and Cancel buttons */}
                                <div className="mt-6 flex justify-between">
                                    {/* Edit Button */}
                                    <a href={`/reserve/${reservation.id}/edit`} className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-lg transition duration-300">
                                        แก้ไขการจอง
                                    </a>

                                    {/* Cancel Button */}
                                    <form method="POST" action={`/reserve/${reservation.id}`} className="flex">
                                        <input type="hidden" name="_method" value="DELETE" />
                                        <button type="submit" className="text-white bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg text-lg transition duration-300">
                                            ยกเลิกการจอง
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
