"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface VerificationRequest {
    id: string;
    user_id: string;
    id_proof_url: string;
    work_sample_urls: string[];
    signed_id_url?: string;
    signed_sample_urls?: string[];
    status: string;
    submitted_at: string;
    profiles: {
        full_name: string;
        email: string;
        craft: string;
    };
}

export default function AdminDashboard() {
    const router = useRouter();
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            const supabase = createClient();

            // Check if admin
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch pending requests
            // Note: RLS must allow this. You need to run admin_policies.sql
            const { data, error } = await supabase
                .from('verifications')
                .select(`
                    *,
                    profiles (full_name, email, craft)
                `)
                .eq('status', 'pending');

            if (error) {
                console.error("Error fetching requests:", error);
            } else if (data) {
                // Generate Signed URLs for private bucket access
                const enrichedRequests = await Promise.all(data.map(async (req: any) => {
                    const { data: idData } = await supabase.storage
                        .from('documents')
                        .createSignedUrl(req.id_proof_url, 3600); // 1 hour access

                    const signedSamples = await Promise.all((req.work_sample_urls || []).map(async (path: string) => {
                        const { data } = await supabase.storage
                            .from('documents')
                            .createSignedUrl(path, 3600);
                        return data?.signedUrl;
                    }));

                    return {
                        ...req,
                        signed_id_url: idData?.signedUrl,
                        signed_sample_urls: signedSamples
                    };
                }));
                setRequests(enrichedRequests as VerificationRequest[]);
            }
            setLoading(false);
        };

        fetchRequests();
    }, [router]);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        const supabase = createClient();
        const { error } = await supabase
            .from('verifications')
            .update({ status: action })
            .eq('id', id);

        if (error) {
            alert("Error updating status: " + error.message);
        } else {
            setRequests(requests.filter(req => req.id !== id));
            alert(`Request ${action} successfully`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6f5c46]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-[#6f5c46] mb-8">
                    Admin Verification Dashboard
                </h1>

                {requests.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                        <p className="text-gray-500 text-lg">No pending verification requests.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((req) => (
                            <div key={req.id} className="bg-white p-6 rounded-2xl shadow-md border border-[#e5d1bf] flex flex-col md:flex-row gap-6 animate-slide-up">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-[#6f5c46]">
                                            {req.profiles.full_name || "Unknown Artisan"}
                                        </h2>
                                        <span className="bg-[#e5d1bf] text-[#6f5c46] px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                            {req.profiles.craft || "Craft Unknown"}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{req.profiles.email}</p>
                                    <p className="text-xs text-gray-400">Submitted: {new Date(req.submitted_at).toLocaleDateString()}</p>

                                    <div className="mt-4">
                                        <h3 className="font-semibold text-sm text-[#6f5c46] mb-2">Documents:</h3>
                                        <div className="flex gap-4 overflow-x-auto pb-2">
                                            {req.signed_id_url && (
                                                <a
                                                    href={req.signed_id_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#c65d51] underline text-sm hover:text-[#a84e44]"
                                                >
                                                    View ID Proof
                                                </a>
                                            )}
                                            {req.signed_sample_urls?.map((url, idx) => (
                                                url && (
                                                    <a
                                                        key={idx}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#c65d51] underline text-sm hover:text-[#a84e44]"
                                                    >
                                                        Sample {idx + 1}
                                                    </a>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-[#e5d1bf] pt-4 md:pt-0 md:pl-6">
                                    <button
                                        onClick={() => handleAction(req.id, 'approved')}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-smooth font-semibold shadow-sm whitespace-nowrap"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.id, 'rejected')}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-smooth font-semibold shadow-sm whitespace-nowrap"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
