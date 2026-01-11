"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function AdminDashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [verifications, setVerifications] = useState<any[]>([]);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        // Check if user is in admins table
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !admin) {
            router.push('/dashboard'); // Kick out non-admins
            return;
        }

        fetchVerifications();
    };

    const fetchVerifications = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('verifications')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (data) setVerifications(data);
        setLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('verifications')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchVerifications(); // Refresh list
        } else {
            alert("Error updating status: " + error.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;

    const getFileUrl = (path: string) => {
        if (!path) return '#';
        const supabase = createClient();
        return supabase.storage.from('documents').getPublicUrl(path).data.publicUrl;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">{t("admin.title")}</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{t("admin.pendingRequests")}</h2>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                            {verifications.length} Pending
                        </span>
                    </div>

                    {verifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {t("admin.noRequests")}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium text-sm uppercase">
                                    <tr>
                                        <th className="p-4">UserID</th>
                                        <th className="p-4">{t("admin.bank")}</th>
                                        <th className="p-4">{t("admin.status")}</th>
                                        <th className="p-4">{t("admin.viewProof")}</th>
                                        <th className="p-4 text-right">{t("admin.action")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {verifications.map((v) => (
                                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm font-mono text-gray-500">
                                                {v.user_id.substring(0, 8)}...
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p className="font-bold">{v.gst_number || "No GST"}</p>
                                                    <p className="text-gray-500">{v.bank_account_number || "N/A"}</p>
                                                    <span className="text-xs text-gray-400">{v.ifsc_code}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <a href={getFileUrl(v.id_proof_url)} target="_blank" className="text-blue-600 hover:underline text-xs">ID</a>
                                                    <a href={getFileUrl(v.bank_proof_url)} target="_blank" className="text-blue-600 hover:underline text-xs">Bank</a>
                                                    <a href={getFileUrl(v.work_sample_urls?.[v.work_sample_urls.length - 1])} target="_blank" className="text-blue-600 hover:underline text-xs">Selfie</a>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleStatusUpdate(v.id, 'rejected')}
                                                        className="px-3 py-1 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
                                                    >
                                                        {t("admin.reject")}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(v.id, 'verified')}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shadow-sm"
                                                    >
                                                        {t("admin.approve")}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
