"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Announcement = {
  id: number;
  title: string;
  content: string;
};

export default function AnnouncementOverlay() {
  const [list, setList] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/announcements", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setList(data.slice(0, 3)); // 只取最新3筆
        setOpen(true);
      });
  }, []);

  return (
    <AnimatePresence>
      {open && list.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 right-6 z-[9999]"
        >
          <div className="w-[320px] rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_0_40px_rgba(0,200,255,0.15)] p-5">

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-cyan-300">📢 最新公告</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[240px] overflow-hidden">
              {list.map((item) => (
                <div key={item.id}>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 text-right">
              <a
                href="/news"
                className="text-xs text-cyan-300 hover:text-cyan-200"
              >
                查看更多 →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
