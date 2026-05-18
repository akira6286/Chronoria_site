"use client";

import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="relative z-10 min-h-screen text-white px-6 py-16">

      {/* 標題 */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-widest mb-4">
          ADMIN PANEL
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      {/* 卡片 */}
      <div className="max-w-3xl mx-auto grid gap-6">

        <Link
          href="/admin/hero-background"
          className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition shadow-[0_0_30px_rgba(0,200,255,0.06)]"
        >
          <h2 className="text-xl font-semibold mb-2">
            首頁背景圖
          </h2>
          <p className="text-gray-400 text-sm">
            管理首頁最上方背景圖
          </p>
        </Link>

        <Link
          href="/admin/hero-logo"
          className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition shadow-[0_0_30px_rgba(0,200,255,0.06)]"
        >
          <h2 className="text-xl font-semibold mb-2">
            首頁 Logo
          </h2>
          <p className="text-gray-400 text-sm">
            管理首頁會飄動的 Logo
          </p>
        </Link>

        <Link
          href="/admin/world"
          className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition shadow-[0_0_30px_rgba(0,200,255,0.06)]"
        >
          <h2 className="text-xl font-semibold mb-2">
            世界觀設定
          </h2>
          <p className="text-gray-400 text-sm">
            管理首頁世界觀文字
          </p>
        </Link>

        <Link
          href="/admin/announcement"
          className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition shadow-[0_0_30px_rgba(0,200,255,0.06)]"
        >
          <h2 className="text-xl font-semibold mb-2">
            公告管理
          </h2>
          <p className="text-gray-400 text-sm">
            管理網站公告（新增 / 編輯 / 刪除）
          </p>
        </Link>
        <Link
            href="/admin/members"
            className="block p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition shadow-[0_0_30px_rgba(0,200,255,0.06)]"
          >
            <h2 className="text-xl font-semibold mb-2">
              成員管理
            </h2>
            <p className="text-gray-400 text-sm">
              管理角色資料（新增 / 編輯 / 刪除 / 排序）
            </p>
          </Link>        
      </div>
    </div>
  );
}
