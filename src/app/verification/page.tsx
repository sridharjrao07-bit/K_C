"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ImageVerificationService, ImageCheckResult } from "@/lib/image-verification";

export default function VerificationPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);

    // File State
    const [idFile, setIdFile] = useState<File | null>(null);
    const [workSamples, setWorkSamples] = useState<File[]>([]);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    // Verification Feedback State
    const [idStatus, setIdStatus] = useState<ImageCheckResult | null>(null);
    const [selfieStatus, setSelfieStatus] = useState<ImageCheckResult | null>(null);
    // For work samples, we track generic count or last result for simplicity in this demo
    // ideally we map index -> result like AddProduct

    // Preview URLs
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'work' | 'selfie') => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        if (type === 'id') {
            setIdFile(file);
            // Run Check
            const quality = await ImageVerificationService.verifyImageQuality(file);
            setIdStatus(quality);
        } else if (type === 'selfie') {
            setSelfieFile(file);
            setSelfiePreview(URL.createObjectURL(file));

            // Run Checks
            const quality = await ImageVerificationService.verifyImageQuality(file);
            const safety = await ImageVerificationService.simulateContentSafety(file);

            if (quality.status === 'error' || safety.status === 'error') {
                setSelfieStatus({ status: 'error', message: 'Issue Found', details: quality.details || safety.details });
            } else if (quality.status === 'warning') {
                setSelfieStatus(quality);
            } else {
                setSelfieStatus({ status: 'success', message: 'Perfect!', details: 'You look great!' });
            }
        } else {
            setWorkSamples(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!idFile) return alert("Please upload an ID proof");
        if (!selfieFile) return alert("Please upload a selfie with your work");

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

            // 2. Upload Selfie (Proof of Work)
            const selfieFileName = `${user.id}/selfie_${Date.now()}_${selfieFile.name}`;
            const { data: selfieData, error: selfieError } = await supabase.storage
                .from('documents')
                .upload(selfieFileName, selfieFile);

            if (selfieError) throw selfieError;

            // 3. Upload Work Samples
            const sampleUrls = [];
            for (const file of workSamples) {
                const fileName = `${user.id}/sample_${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);

                if (error) throw error;
                if (data) sampleUrls.push(data.path);
            }

            // 4. Create Verification Record
            // Note: Schema might need update for 'selfie_url' if strict, 
            // but for now we can store it in metadata or wait for schema update.
            // Assuming 'verifications' has loose columns or we reuse work_sample_urls for now to avoid migration block.
            // We adding it to work_sample_urls for simplicity in this turn without SQL migration loop

            await supabase
                .from('verifications')
                .insert({
                    user_id: user.id,
                    id_proof_url: idData.path,
                    work_sample_urls: [...sampleUrls, selfieData.path] // Appending selfie to samples for now
                });

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

                {/* Friendly Guidelines */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] mb-8 animate-fade-in">
                    <h3 className="font-bold text-[#6f5c46] mb-4">Why we need this?</h3>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-xl">🛡️</span>
                        <p>We want to ensure every product on Kaarigar Connect is 100% handmade by real artisans like you. This protects your hard work from resellers.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up">
                    <div className="space-y-8">

                        {/* 1. "Proof of Work" Selfie */}
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">1. The &quot;Proof of Work&quot; Selfie</label>
                            <p className="text-sm text-gray-500 mb-4">Please upload a photo of YOU holding your product or working in your workshop.</p>

                            <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-6 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative overflow-hidden group">
                                {selfiePreview ? (
                                    <div className="relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={selfiePreview} alt="Selfie" className="w-full h-48 object-cover rounded-lg mb-2" />
                                        {selfieStatus && (
                                            <div className="absolute inset-x-0 bottom-2 bg-black/70 text-white py-1 px-3 text-sm rounded-b-lg">
                                                {selfieStatus.status === 'success' ? '✅ Great Shot!' : selfieStatus.status === 'warning' ? '⚠️ ' + selfieStatus.message : '🛑 ' + selfieStatus.message}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-4xl mb-2">🤳</div>
                                        <p className="font-semibold text-[#6f5c46]">Take a Photo</p>
                                        <p className="text-sm text-gray-500 mt-1">Click to upload</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, 'selfie')}
                                />
                            </div>
                        </div>

                        {/* 2. ID Proof Section */}
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">2. Identity Proof</label>
                            <p className="text-sm text-gray-500 mb-4">Aadhar Card, PAN Card, or Artisan Card</p>

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
                                    {idFile ? `Selected: ${idFile.name}` : "Upload Document"}
                                </p>
                                {idStatus && idStatus.status !== 'success' && (
                                    <p className="text-xs text-orange-500 mt-2 font-bold">{idStatus.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 3. Work Samples */}
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">3. Work Samples</label>
                            <p className="text-sm text-gray-500 mb-4">Photos of your best products (Optional but recommended)</p>

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
                                    {workSamples.length > 0 ? `${workSamples.length} files selected` : "Select up to 5 photos"}
                                </p>
                            </div>
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
