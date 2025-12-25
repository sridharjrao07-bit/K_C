"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

export default function QuickStats({ artisanId }: { artisanId: string }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    storeViews: 42, // Mock for now
    activeProducts: 0,
    unseenMessages: 2 // Mock for now
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductCount = async () => {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('artisan_id', artisanId);

      if (!error && count !== null) {
        setStats(prev => ({ ...prev, activeProducts: count }));
      }
      setLoading(false);
    };

    fetchProductCount();
  }, [artisanId]);

  const statItems = [
    { label: t("dashboard.totalEarnings"), value: `₹${stats.totalEarnings}`, icon: "💰", color: "bg-green-50 text-green-600" },
    { label: t("dashboard.storeViews"), value: stats.storeViews, icon: "👁️", color: "bg-blue-50 text-blue-600" },
    { label: t("dashboard.activeProducts"), value: stats.activeProducts, icon: "📦", color: "bg-purple-50 text-purple-600" },
    { label: t("dashboard.pendingItems"), value: stats.unseenMessages, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-2xl border border-[#e5d1bf] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg ${item.color}`}>
              {item.icon}
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
          </div>
          <div className="text-2xl font-display font-bold text-[#6f5c46]">
            {loading && item.label === t("dashboard.activeProducts") ? "..." : item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
