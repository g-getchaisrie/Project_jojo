import React, { useEffect } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "@inertiajs/react";

const TableCard = ({ table }) => {
    const handleReserve = (table) => {
        if (table.available) {
            router.visit(`/reserve/create?table_id=${table.id}`);
        } else {
            alert('โต๊ะนี้ไม่สามารถจองได้เนื่องจากถูกจองแล้ว');
        }
    };

    return (
        <Card
            className={`p-4 rounded-xl shadow-lg w-full h-auto ${
                table.available ? "bg-white cursor-pointer hover:shadow-xl transition-shadow" : "bg-red-100 cursor-not-allowed"
            }`}
            onClick={() => handleReserve(table)}
        >
            <CardContent className="p-3 flex items-center justify-between gap-4">
                <img
                    src="https://cf-sparkai-live.s3.amazonaws.com/users/2tKoi2Njfioyq36jT7MT0jKJPLq/spark_ai/o_bg-remover-gen_2tOsgGuRgE1y8kmlJ3DQUdTeQy8.png"
                    alt={`Table ${table.id}`}
                    className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 text-left">
                    <h2 className="text-lg font-bold">โต๊ะ {table.id}</h2>
                    <p className="text-sm">นั่งได้: {table.seat} คน</p>
                    <p className="text-sm mt-1">
                        {table.available ? "ว่าง" : `จองโดย ${table.reserved_by_user_id ? "User ID: " + table.reserved_by_user_id : "ไม่ระบุ"}`}
                    </p>
                </div>
                <Button
                    className={`text-sm px-4 py-2 rounded-md transition duration-300 ${
                        table.available ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    disabled={!table.available}
                >
                    {table.available ? "จองโต๊ะ" : "ถูกจองแล้ว"}
                </Button>
                <Link
                    href={`/reserve/${table.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                    ดูรายละเอียด
                </Link>
            </CardContent>
        </Card>
    );
};

const ReservePage = ({ tables }) => {
    const { props } = usePage();

    // Reload ข้อมูลโต๊ะเมื่อโหลดหน้า
    useEffect(() => {
        router.reload({ only: ['tables'] });
    }, []);

    return (
        <AuthenticatedLayout key={tables.length}>
            <Head title="จองโต๊ะ" />
            <div className="mt-10 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8 w-full max-w-6xl">
                    {tables && tables.length > 0 ? (
                        tables.map((table) => <TableCard key={table.id} table={table} />)
                    ) : (
                        <div className="text-center text-gray-500 py-8 col-span-full">
                            <p className="text-lg">ไม่มีโต๊ะว่างในขณะนี้</p>
                            <p className="text-sm">กรุณาตรวจสอบอีกครั้งในภายหลัง</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ReservePage;
