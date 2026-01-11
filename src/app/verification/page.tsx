"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ImageVerificationService, ImageCheckResult } from "@/lib/image-verification";
import { useLanguage } from "@/context/language-context";

export default function VerificationPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);

    // File State
    const [idFile, setIdFile] = useState<File | null>(null);
    const [workSamples, setWorkSamples] = useState<File[]>([]);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    // Verification Feedback State
    const [idStatus, setIdStatus] = useState<ImageCheckResult | null>(null);
    const [selfieStatus, setSelfieStatus] = useState<ImageCheckResult | null>(null);

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
        if (!idFile) return alert(t("verification_page.alertId"));
        if (!selfieFile) return alert(t("verification_page.alertSelfie"));

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
            await supabase
                .from('verifications')
                .insert({
                    user_id: user.id,
                    id_proof_url: idData.path,
                    work_sample_urls: [...sampleUrls, selfieData.path] // Appending selfie to samples for now
                });

            alert(t("verification_page.success"));
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
                    {t("verification_page.title")}
                </h1>

                {/* Friendly Guidelines */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] mb-8 animate-fade-in">
                    <h3 className="font-bold text-[#6f5c46] mb-4">{t("verification_page.whyTitle")}</h3>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-xl">🛡️</span>
                        <p>{t("verification_page.whyDesc")}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up">
                    <div className="space-y-8">

                        {/* 1. "Proof of Work" Selfie */}
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">{t("verification_page.step1Title")}</label>
                            <p className="text-sm text-gray-500 mb-4">{t("verification_page.step1Desc")}</p>

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
                                        <p className="font-semibold text-[#6f5c46]">{t("verification_page.takePhoto")}</p>
                                        <p className="text-sm text-gray-500 mt-1">{t("verification_page.clickUpload")}</p>
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
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">{t("verification_page.step2Title")}</label>
                            <p className="text-sm text-gray-500 mb-4">{t("verification_page.step2Desc")}</p>

                            <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-6 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, 'id')}
                                />
                                <div className="text-4xl mb-2">🆔</div>
                                <p className="font-semibold text-[#6f5c46]">{t("verification_page.uploadId")}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {idFile ? `${t("verification_page.selected")}: ${idFile.name}` : t("verification_page.uploadDoc")}
                                </p>
                                {idStatus && idStatus.status !== 'success' && (
                                    <p className="text-xs text-orange-500 mt-2 font-bold">{idStatus.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 3. Work Samples */}
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">{t("verification_page.step3Title")}</label>
                            <p className="text-sm text-gray-500 mb-4">{t("verification_page.step3Desc")}</p>

                            <div className="border-2 border-dashed border-[#b87d4b]/30 rounded-xl p-6 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, 'work')}
                                />
                                <div className="text-4xl mb-2">🎨</div>
                                <p className="font-semibold text-[#6f5c46]">{t("verification_page.uploadSamples")}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {workSamples.length > 0 ? `${workSamples.length} ${t("verification_page.filesSelected")}` : t("verification_page.selectPhotos")}
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {uploading ? t("verification_page.uploading") : t("verification_page.submit")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
