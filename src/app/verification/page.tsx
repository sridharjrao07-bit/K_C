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
    const [bankProofFile, setBankProofFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        gst: '',
        accountName: '',
        accountNumber: '',
        ifsc: ''
    });

    // Verification Feedback State
    const [idStatus, setIdStatus] = useState<ImageCheckResult | null>(null);
    const [selfieStatus, setSelfieStatus] = useState<ImageCheckResult | null>(null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'work' | 'selfie' | 'bank') => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        if (type === 'id') {
            setIdFile(file);
            const quality = await ImageVerificationService.verifyImageQuality(file);
            setIdStatus(quality);
        } else if (type === 'selfie') {
            setSelfieFile(file);
            setSelfiePreview(URL.createObjectURL(file));
            const quality = await ImageVerificationService.verifyImageQuality(file);
            const safety = await ImageVerificationService.simulateContentSafety(file);

            if (quality.status === 'error' || safety.status === 'error') {
                setSelfieStatus({ status: 'error', message: 'Issue Found', details: quality.details || safety.details });
            } else if (quality.status === 'warning') {
                setSelfieStatus(quality);
            } else {
                setSelfieStatus({ status: 'success', message: 'Perfect!', details: 'You look great!' });
            }
        } else if (type === 'bank') {
            setBankProofFile(file);
        } else {
            setWorkSamples(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!idFile) return alert(t("verification_page.alertId"));
        if (!selfieFile) return alert(t("verification_page.alertSelfie"));
        if (!bankProofFile || !formData.accountNumber || !formData.ifsc) return alert(t("verification_page.alertBank"));

        setUploading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not authenticated");

            // Helper to upload
            const upload = async (file: File, prefix: string) => {
                const fileName = `${user.id}/${prefix}_${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage.from('documents').upload(fileName, file);
                if (error) throw error;
                return data.path;
            }

            // 1. Upload All Files
            const idPath = await upload(idFile, 'id_proof');
            const selfiePath = await upload(selfieFile, 'selfie');
            const bankPath = await upload(bankProofFile, 'bank_proof');

            const sampleUrls = [];
            for (const file of workSamples) {
                const path = await upload(file, 'sample');
                sampleUrls.push(path);
            }

            // 2. Create Verification Record (Enhanced)
            await supabase
                .from('verifications')
                .insert({
                    user_id: user.id,
                    id_proof_url: idPath,
                    work_sample_urls: [...sampleUrls, selfiePath],

                    // Banking Fields
                    gst_number: formData.gst,
                    account_holder_name: formData.accountName,
                    account_number: formData.accountNumber,
                    ifsc_code: formData.ifsc,
                    bank_proof_url: bankPath
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
            <div className="max-w-3xl mx-auto">
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

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up space-y-10">

                    {/* 1. "Proof of Work" Selfie */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">{t("verification_page.step1Title")}</label>
                            <p className="text-sm text-gray-500 mb-4">{t("verification_page.step1Desc")}</p>

                            <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-4 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative overflow-hidden group h-64 flex items-center justify-center bg-gray-50">
                                {selfiePreview ? (
                                    <div className="relative w-full h-full">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover rounded-lg" />
                                        {selfieStatus && (
                                            <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white py-1 px-3 text-xs">
                                                {selfieStatus.status === 'success' ? '✅ Great!' : '⚠️ Issue'}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-4xl">🤳</div>
                                        <p className="font-semibold text-[#6f5c46] text-sm">{t("verification_page.takePhoto")}</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'selfie')} />
                            </div>
                        </div>

                        {/* 2. ID Proof Section */}
                        <div>
                            <label className="block text-lg font-bold text-[#6f5c46] mb-2">{t("verification_page.step2Title")}</label>
                            <p className="text-sm text-gray-500 mb-4">{t("verification_page.step2Desc")}</p>

                            <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-4 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative h-64 flex flex-col items-center justify-center bg-gray-50">
                                <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'id')} />
                                <div className="text-4xl mb-2">🆔</div>
                                <p className="font-semibold text-[#6f5c46] text-sm">{t("verification_page.uploadId")}</p>
                                <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
                                    {idFile ? idFile.name : t("verification_page.uploadDoc")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Banking & Business (New Section) */}
                    <div>
                        <label className="block text-lg font-bold text-[#6f5c46] mb-2">{t("verification_page.step4Title")}</label>
                        <p className="text-sm text-gray-500 mb-6">{t("verification_page.step4Desc")}</p>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("verification_page.labelGST")}</label>
                                <input
                                    type="text"
                                    placeholder="22AAAAA0000A1Z5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6f5c46] outline-none"
                                    value={formData.gst}
                                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("verification_page.labelAccountName")}</label>
                                <input
                                    type="text"
                                    placeholder="Name as per Passbook"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6f5c46] outline-none"
                                    value={formData.accountName}
                                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("verification_page.labelAccountNumber")}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6f5c46] outline-none"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("verification_page.labelIFSC")}</label>
                                <input
                                    type="text"
                                    placeholder="SBIN0001234"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6f5c46] outline-none uppercase"
                                    value={formData.ifsc}
                                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Bank Proof Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t("verification_page.labelBankProof")}</label>
                            <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer relative">
                                <span className="text-2xl">🏦</span>
                                <div>
                                    <p className="font-semibold text-gray-700 text-sm">{t("verification_page.uploadBankProof")}</p>
                                    <p className="text-xs text-gray-500">{bankProofFile ? bankProofFile.name : "Cancelled Cheque or Passbook Front Page"}</p>
                                </div>
                                <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'bank')} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

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
    )
}
