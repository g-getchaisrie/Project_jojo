import React, { useEffect } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "@inertiajs/react"; // import Link

export default function Reserve() {
    const { tables } = usePage().props;

    const handleReserve = (table) => {
        if (table.available) {
            window.location.href = `/create?table_id=${table.id}`;
        }
    };

    useEffect(() => {
        router.reload();
    }, []);

    return (
        <AuthenticatedLayout key={tables.length}>
            <Head title="Reserve Table" />
            <div className="mt-10 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 w-full max-w-4xl">
                    {tables && tables.length > 0 ? (
                        tables.map((table) => (
                            <Card
                                key={table.id}
                                className={`p-4 rounded-xl shadow-lg w-full h-auto ${table.available ? "bg-white cursor-pointer" : "bg-red-300"
                                    }`}
                                onClick={() => handleReserve(table)}
                            >
                                <CardContent className="p-3 flex items-center justify-between gap-4">
                                    {/* รูปโต๊ะ */}
                                    <img
                                        src="https://cf-sparkai-live.s3.amazonaws.com/users/2tKoi2Njfioyq36jT7MT0jKJPLq/spark_ai/o_bg-remover-gen_2tOsgGuRgE1y8kmlJ3DQUdTeQy8.png"
                                        alt={`Table ${table.id}`}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />

                                    {/* รายละเอียดโต๊ะ */}
                                    <div className="flex-1 text-left">
                                        <h2 className="text-lg font-bold">โต๊ะ {table.id}</h2>
                                        <p className="text-sm">นั่งได้: {table.seat} คน</p>
                                        <p className="text-sm mt-1">
                                            {table.available ? "ว่าง" : `จองโดย ${table.reserved_by_user_id ? "User ID: " + table.reserved_by_user_id : "ไม่ระบุ"}`}
                                        </p>
                                    </div>

                                    {/* ปุ่มจอง */}
                                    <Button
                                        className={`text-sm px-4 py-2 rounded-md transition duration-300
                                        ${table.available ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
                                        disabled={!table.available}
                                    >
                                        {table.available ? "จองโต๊ะ" : "ถูกจองแล้ว"}
                                    </Button>

                                    {/* ปุ่มดูรายละเอียด */}
                                    <Link
                                        href={`/reserve/${table.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                                    >
                                        ดูรายละเอียด
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>No tables available.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
