"use client";

import { useEffect, useState } from "react";

const defaultWorldText =
  "在時間交錯的縫隙之中，誕生了無數的意識與存在。時序之境，是所有時間的交會點。\n" +
  "原本穩定流動的時間，近來開始出現異常——裂隙，在不同的世界悄然展開。\n\n" +
  "那些裂隙吞噬了片段的時間，扭曲了記憶，也改變了既定的命運。\n" +
  "而在時之塔中——負責觀測與修復時間的精靈們，察覺到了這些異變。\n\n" +
  "她，是剛成為實習生的時間精靈。能力尚未成熟，卻被賦予了一項任務：\n\n" +
  "修復那些逐漸崩壞的時間線。\n\n" +
  "然而她很快發現...單靠自己，無法支撐整個時序的穩定。\n" +
  "於是...她做了一個「不被允許」的決定。\n\n" +
  "她開始介入裂隙，\n" +
  "將那些被影響、被改變，甚至本該消失的存在...帶離原本的時間。\n" +
  "他們，被引導至時之塔。在這裡來自不同世界、不同時間的存在，開始交會。\n\n" +
  "有人失去了過去，有人無法回到原本的未來，也有人，開始懷疑自己是否仍屬於原本的世界。\n\n" +
  "而她，仍在學習如何修復這一切。\n" +
  "只是，她還不知道——這些被帶來的人，或許並不只是「被拯救的存在」。\n" +
  "而是——改變時間的關鍵。";

export default function AdminWorldPage() {
  const [worldText, setWorldText] = useState("");
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
        if (typeof data.worldText === "string") {
          setWorldText(data.worldText);
        }
      } catch (err) {
        console.error("fetch world text error:", err);
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
        body: JSON.stringify({ worldText }),
      });

      if (!res.ok) throw new Error("API error");

      alert("世界觀文字已更新");
    } catch (err) {
      console.error("update world text error:", err);
      alert("更新失敗");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen text-white px-6 py-16">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-widest mb-4">
          世界觀設定
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
                世界觀文字
              </label>
              <textarea
                value={worldText}
                onChange={(e) => setWorldText(e.target.value)}
                placeholder={defaultWorldText}
                className="w-full p-3 bg-white/5 border border-white/10 rounded h-80 focus:outline-none focus:border-cyan-400 transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                留空則使用原本寫死的世界觀文字。換行會保留在首頁動畫中。
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "儲存中..." : "儲存世界觀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
