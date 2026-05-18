"use client";

import { useEffect, useState } from "react";

const defaultHeroLogo = "/images/時序之境_B_單色_光暈.png";

export default function AdminHeroLogoPage() {
  const [heroLogoImage, setHeroLogoImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/site-settings", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        if (typeof data.heroLogoImage === "string") {
          setHeroLogoImage(data.heroLogoImage);
        }
      } catch (err) {
        console.error("fetch hero logo error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heroLogoImage }),
      });

      if (!res.ok) throw new Error("API error");

      alert("首頁 Logo 已更新");
    } catch (err) {
      console.error("update hero logo error:", err);
      alert("更新失敗");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen text-white px-6 py-16">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-widest mb-4">
          首頁 Logo
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_40px_rgba(0,200,255,0.08)]">
        {loading ? (
          <div className="text-gray-400">載入中...</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Logo 圖路徑
              </label>
              <input
                value={heroLogoImage}
                onChange={(e) => setHeroLogoImage(e.target.value)}
                placeholder={defaultHeroLogo}
                className="w-full p-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-cyan-400 transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                留空則使用原本會飄動的時序之境 Logo。
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-5 flex justify-center">
              <img
                src={heroLogoImage || defaultHeroLogo}
                alt="首頁 Logo 預覽"
                className="max-h-64 w-full object-contain"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "儲存中..." : "儲存 Logo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
