import React from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit() {
    const { reservation, tables } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        first_name: reservation.first_name || '',
        last_name: reservation.last_name || '',
        email: reservation.email || '',
        phone: reservation.phone || '',
        table_id: reservation.table_id, // ใช้ค่า table_id จาก reservation
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await put(`/reserve/${reservation.id}`, {
            onSuccess: () => {
                window.location.href = "/reserve"; // กลับไปหน้าเลือกโต๊ะหลังจากการแก้ไขสำเร็จ
            },
            onError: () => {
                console.log("มีข้อผิดพลาด", errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Reservation" />
            <div className='mt-10'>
                <p className="flex justify-center font-semibold text-lg text-gray-800">แก้ไขข้อมูลการจอง</p>
                <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h2 className="font-medium text-gray-800">
                                    โต๊ะที่: {reservation.table ? reservation.table.id : 'ไม่พบข้อมูลโต๊ะ'}
                                </h2>
                                <p className="font-medium text-gray-800">
                                    จำนวนที่นั่ง: {reservation.table ? reservation.table.seat : 'ไม่พบข้อมูลโต๊ะ'}
                                </p>
                                <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">เลือกโต๊ะ</label>
                                        <select
                                            value={data.table_id}
                                            onChange={e => setData('table_id', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">เลือกโต๊ะ</option>
                                            {tables.map((table) => (
                                                <option key={table.id} value={table.id}>
                                                    โต๊ะที่ {table.id} (จำนวนที่นั่ง: {table.seat})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.table_id && <p className="text-red-500 text-sm">{errors.table_id}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-700 mt-4"
                                    >
                                        {processing ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
