"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewsPage() {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        // ✅ 最新 → 最舊
        const sorted = [...data].sort((a, b) => {
  const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
  const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
  return dateB - dateA; // 最新在前
});
        setList(sorted);
      })
      .catch(console.error);
  }, []);

  // ✅ 分頁切割
  const start = (page - 1) * pageSize;
  const current = list.slice(start, start + pageSize);
  const totalPages = Math.ceil(list.length / pageSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-white px-6 py-16"
    >
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-widest mb-4">
          ANNOUNCEMENTS
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ⭐ 卡片動畫 */}
        {current.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.08, // ⭐ 一個一個出現
              duration: 0.4,
            }}
          >
            <Link
              href={`/news/${item.id}`}
              className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {item.title}
              </h2>

              <p className="text-gray-400 line-clamp-2">
                {item.content}
              </p>

              <div className="text-xs text-gray-500 mt-3">
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : ""}
              </div>
            </Link>
          </motion.div>
        ))}

      </div>

      {/* ⭐ 分頁 */}
      <div className="flex justify-center mt-12 gap-2">

        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border border-white/20 rounded hover:bg-white/10"
        >
          ←
        </button>

        <span className="px-4 py-2 text-gray-400">
          {page} / {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
          className="px-4 py-2 border border-white/20 rounded hover:bg-white/10"
        >
          →
        </button>

      </div>
    </motion.div>
  );
}
