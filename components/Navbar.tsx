"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.push("/");
      router.refresh(); // 🔥 很重要（清掉快取）
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* 左邊 LOGO */}
        <span className="font-bold text-lg tracking-wide">
          Chronoria
        </span>

        {/* 右邊導航 */}
        <div className="flex gap-6 text-sm text-gray-300 items-center">

          <a href="/" className="hover:text-white transition">
            首頁
          </a>

          <a href="/news" className="hover:text-white transition">
            公告
          </a>

          <a
            href="https://x.com/chronoria_realm"
            className="hover:text-white transition"
          >
            官方推特
          </a>

          {/* ⭐ 只有 admin 才顯示 */}
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-1 border border-red-400/40 text-red-400 rounded hover:bg-red-500/10 transition"
            >
              登出
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
