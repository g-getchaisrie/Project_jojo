import React, { useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ reservation }) {
    useEffect(() => {
        console.log(reservation);
    }, [reservation]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    const handleCancel = () => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?")) {
            router.delete(`/reserve/${reservation.id}`, {
                onSuccess: () => alert("ยกเลิกการจองเรียบร้อยแล้ว"),
                onError: () => alert("เกิดข้อผิดพลาดในการยกเลิกการจอง")
            });
        }
    };

    if (!reservation) {
        return (
            <AuthenticatedLayout>
                <Head title="Reservation Details" />
                <div className="mt-10 text-center">
                    <p className="font-semibold text-lg text-gray-800">ไม่พบข้อมูลการจอง</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Reservation Details" />
            <div className="mt-10">
                <p className="text-center font-semibold text-lg text-gray-800">ข้อมูลการจอง</p>
                <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xl sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                            <div className="p-6 text-gray-900">
                                <h2 className="font-medium text-gray-800 mb-2">
                                    โต๊ะที่: {reservation.table?.id || "N/A"}
                                </h2>
                                <p className="font-medium text-gray-800">จำนวนที่นั่ง: {reservation.table?.seat || "N/A"} คน</p>
                                <div className="mt-4 space-y-2">
                                    <p><strong>ชื่อ:</strong> {reservation.first_name} {reservation.last_name}</p>
                                    <p><strong>Email:</strong> {reservation.email}</p>
                                    <p><strong>โทรศัพท์:</strong> {reservation.phone}</p>
                                    <p><strong>เวลาจอง:</strong> {formatDate(reservation.reserved_at)}</p>
                                    <p><strong>เวลาหมดอายุ:</strong> {formatDate(reservation.expires_at)}</p>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <Link
                                        href={`/reserve/${reservation.id}/edit`}
                                        className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-lg transition duration-300"
                                    >
                                        แก้ไขการจอง
                                    </Link>

                                    <button
                                        onClick={handleCancel}
                                        className="text-white bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg text-lg transition duration-300"
                                    >
                                        ยกเลิกการจอง
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
