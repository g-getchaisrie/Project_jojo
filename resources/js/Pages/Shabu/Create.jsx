import React from "react";
import { useForm, Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { table_id, table } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        table_id: table_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/reserve/store", {
            onSuccess: () => {
                router.visit("/reserve");
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reserve Table" />
            <div className='mt-10'>
                <p className="flex justify-center font-semibold text-lg text-gray-800">ป้อนข้อมูลการจองและยืนยันการจอง</p>
                <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h2 className="font-medium text-gray-800">โต๊ะที่: {table?.id || "ไม่พบข้อมูลโต๊ะ"}</h2>
                                <p className="font-medium text-gray-800">จำนวนที่นั่ง: {table?.seat || "N/A"}</p>
                                <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            required
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                    </div>

                                    <p className='text-sm text-red-600 flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        **หมายเหตุ กรุณามาถึงก่อนเวลาที่จองไว้ อย่างน้อย 15 นาที หากมาช้ากว่าเวลาที่กำหนด
                                        ทางร้านขอสงวนสิทธิ์ในการปล่อยโต๊ะให้กับลูกค้าท่านอื่น
                                    </p>

                                    <div className='flex justify-center mt-4'>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-1/4 px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-700 mt-4"
                                        >
                                            {processing ? 'กำลังดำเนินการ...' : 'จอง'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <p className='mt-8 flex justify-center'>เมื่อคลิกปุ่มจองทันที ฉันยอมรับ ข้อกำหนดในการให้บริการของทางร้าน และ นโยบายความเป็นส่วนตัว</p>
            </div>
        </AuthenticatedLayout>
    );
}
