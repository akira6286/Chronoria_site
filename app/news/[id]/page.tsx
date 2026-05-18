"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Background from "@/components/Background";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/announcements/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [id]);

  // ⭐ 載入中
  if (!data) {
    return (
      <>
        <Background />
        <div className="relative z-10 min-h-screen flex items-center justify-center text-white">
          載入中...
        </div>
      </>
    );
  }

  return (
    <>
      <Background />

      {/* ⭐ 整頁淡入 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 min-h-screen text-white px-6 py-16"
      >

        <div className="max-w-3xl mx-auto">

          {/* ⭐ 標題動畫 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl font-bold mb-6 tracking-wide"
          >
            {data.title}
          </motion.h1>

          {/* ⭐ 日期 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 mb-8"
          >
            {data.created_at
              ? new Date(data.created_at).toLocaleString()
              : ""}
          </motion.div>

          {/* ⭐ 內容卡片滑入 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 leading-relaxed shadow-[0_0_40px_rgba(0,200,255,0.08)]"
          >
            <p className="whitespace-pre-line text-gray-300">
              {data.content}
            </p>
          </motion.div>

          {/* 🔙 返回按鈕（右下角） */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.35 }}
  className="flex justify-end mt-6"
>
  <button
    onClick={() => router.push("/news")}
    className="text-sm text-cyan-300 hover:text-cyan-200 transition"
  >
    ← 返回公告列表
  </button>
</motion.div>

        </div>

      </motion.div>
    </>
  );
}
