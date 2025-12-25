"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [idFile, setIdFile] = useState<File | null>(null);
    const [workSamples, setWorkSamples] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'work') => {
        if (!e.target.files || e.target.files.length === 0) return;

        if (type === 'id') {
            setIdFile(e.target.files[0]);
        } else {
            setWorkSamples(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!idFile) return alert("Please upload an ID proof");
        setUploading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not authenticated");

            // 1. Upload ID Proof
            const idFileName = `${user.id}/id_proof_${Date.now()}_${idFile.name}`;
            const { data: idData, error: idError } = await supabase.storage
                .from('documents')
                .upload(idFileName, idFile);

            if (idError) throw idError;

            // 2. Upload Work Samples
            const sampleUrls = [];
            for (const file of workSamples) {
                const fileName = `${user.id}/sample_${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);

                if (error) throw error;
                if (data) sampleUrls.push(data.path);
            }

            // 3. Create Verification Record
            const { error: dbError } = await supabase
                .from('verifications')
                .insert({
                    user_id: user.id, // Note: This might fail if profile trigger didn't run or profiles table empty
                    id_proof_url: idData.path,
                    work_sample_urls: sampleUrls
                });

            if (dbError) throw dbError;

            alert("Verification submitted successfully!");
            router.push('/dashboard');

        } catch (error: any) {
            console.error(error);
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] py-20 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-[#6f5c46] mb-8 text-center animate-fade-in">
                    Verify Your Craft
                </h1>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up">
                    <div className="space-y-8">
                        {/* ID Proof Section */}
                        <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-6 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, 'id')}
                            />
                            <div className="text-4xl mb-2">🆔</div>
                            <p className="font-semibold text-[#6f5c46]">Upload Identity Proof</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {idFile ? `Selected: ${idFile.name}` : "Aadhar Card, PAN Card, or Artisan Card"}
                            </p>
                        </div>

                        {/* Work Samples Section */}
                        <div className="border-2 border-dashed border-[#b87d4b]/30 rounded-xl p-6 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, 'work')}
                            />
                            <div className="text-4xl mb-2">🎨</div>
                            <p className="font-semibold text-[#6f5c46]">Upload Work Samples</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {workSamples.length > 0 ? `${workSamples.length} files selected` : "Photos of your best products (Max 5)"}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {uploading ? "Uploading Documents..." : "Submit for Verification"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
