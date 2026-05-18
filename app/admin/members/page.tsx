"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  id: number;
  name: string;
  desc: string;
  img: string;
  link?: string | null;
  platform?: "twitch" | "youtube" | "twitter" | null;
};

export default function AdminMembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${window.location.origin}/api/members`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch members error:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這個成員嗎？")) return;

    try {
      await fetch(`${window.location.origin}/api/members/${id}`, {
        method: "DELETE",
      });

      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">成員管理</h1>

      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/members/new")}
          className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 transition"
        >
          ＋ 新增成員
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">載入中...</div>
      ) : members.length === 0 ? (
        <div className="text-gray-500">目前沒有成員</div>
      ) : (
        <div className="grid gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={m.img}
                  className="w-16 h-16 object-cover rounded-lg border border-white/10"
                />

                <div>
                  <div className="text-lg font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-400 line-clamp-2 max-w-md">
                    {m.desc}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {m.platform ?? "無平台"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                className="px-3 py-1 text-sm rounded-lg border border-red-400/30 text-red-400 hover:bg-red-500/10 transition"
              >
                刪除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
