"use client";

export default function ArtisanStory({ artisan }: { artisan: any }) {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e5d1bf] mb-16 animate-fade-in">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-[#6f5c46] mb-6 flex items-center gap-4">
          The Artisan&apos;s Story
          <div className="h-1 flex-1 bg-gradient-to-r from-[#e5d1bf] to-transparent"></div>
        </h2>
        <div className="prose prose-lg text-gray-600 leading-relaxed font-light">
          {artisan.bio ? (
            artisan.bio.split('\n').map((para: string, i: number) => (
              <p key={i} className="mb-6 last:mb-0">
                {para}
              </p>
            ))
          ) : (
            <p>This master artisan has been perfecting their craft for generations. Each piece tells a story of heritage, patience, and meticulous skill passed down through time.</p>
          )}
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-[#faf7f2]">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Origin</p>
            <p className="text-[#6f5c46] font-medium">{artisan.location || "India"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Specialty</p>
            <p className="text-[#6f5c46] font-medium">{artisan.craft || "Handicrafts"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Partnership</p>
            <p className="text-[#6f5c46] font-medium">Verified since 2024</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Support</p>
            <p className="text-[#c65d51] font-bold">100% Artisan Direct</p>
          </div>
        </div>
      </div>
    </div>
  );
}
