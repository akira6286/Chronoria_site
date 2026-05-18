"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AnnouncementAdmin() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
      })
      .catch((err) => {
        console.error("取得公告失敗:", err);
      });
  }, []);

  return (
    <div className="relative z-10 min-h-screen text-white p-10">
      <h1 className="text-2xl mb-6">公告管理</h1>

      <Link
        href="/admin/announcement/new"
        className="inline-block mb-6 px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-400 transition"
      >
        + 新增公告
      </Link>

      {list.length === 0 ? (
        <p>目前沒有公告</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_0_30px_rgba(0,200,255,0.06)]">
          <table className="w-full overflow-hidden">
            <thead className="bg-white/5 text-gray-300 text-sm">
              <tr>
                <th className="text-left px-4 py-3">日期 / 時間</th>
                <th className="text-left px-4 py-3">標題</th>
                <th className="text-left px-4 py-3">內容</th>
                <th className="text-center px-4 py-3">操作</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {list.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 font-medium text-white">
                    {item.title}
                  </td>

                  <td className="px-4 py-3 text-gray-400 max-w-[300px] truncate">
                    {item.content}
                  </td>

                  <td className="px-4 py-3 text-center space-x-4">
                    <Link
                      href={`/admin/announcement/edit/${item.id}`}
                      className="text-cyan-300 hover:text-cyan-200"
                    >
                      編輯
                    </Link>

                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();

                        if (!confirm("確定刪除這則公告？")) return;

                        try {
                          const res = await fetch(
                            `/api/announcements/${item.id}`,
                            {
                              method: "DELETE",
                            }
                          );

                          if (!res.ok) {
                            alert("刪除失敗");
                            return;
                          }

                          const reload = await fetch("/api/announcements");
                          const data = await reload.json();
                          setList(data);
                        } catch (err) {
                          console.error("刪除錯誤:", err);
                          alert("發生錯誤");
                        }
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
