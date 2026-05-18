"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isDirty = title.trim() !== "" || content.trim() !== "";
  const [original, setOriginal] = useState({
  title: "",
  content: "",
  });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/announcements/${id}`)
      .then((res) => res.json())
      .then((data) => {
  setTitle(data.title);
  setContent(data.content);

  setOriginal({
    title: data.title,
    content: data.content,
  });
})
      .catch(console.error);
  }, [id]);

  const handleSubmit = async () => {
    const res = await fetch(`/api/announcements/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      alert("更新失敗");
      return;
    }

    router.push("/admin/announcement");
  };

  return (
    <div className="relative z-10 min-h-screen text-white px-6 py-16">

      {/* 標題 */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-widest mb-4">
          編輯公告
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      {/* 卡片 */}
      <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_40px_rgba(0,200,255,0.08)]">

        <div className="flex flex-col gap-6">

          {/* 標題 */}
          <input
            className="p-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-cyan-400 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="標題"
          />

          {/* 內容 */}
          <textarea
            className="p-3 bg-white/5 border border-white/10 rounded h-40 focus:outline-none focus:border-cyan-400 transition"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="內容"
          />

          {/* 按鈕 */}
          <div className="flex gap-4">

  {/* 儲存 */}
  <button
    onClick={handleSubmit}
    className="flex-1 bg-cyan-500 hover:bg-cyan-400 transition p-3 rounded font-medium"
  >
    儲存變更
  </button>

  {/* ⭐ 取消 */}
  <button
  onClick={() => {
    if (!isDirty) {
      router.push("/admin/announcement");
      return;
    }

    if (confirm("確定要取消嗎？未儲存的內容會消失")) {
      router.push("/admin/announcement");
    }
  }}
  className="flex-1 border border-white/20 hover:bg-white/10 transition p-3 rounded"
>
  取消
</button>

</div>

        </div>
      </div>
    </div>
  );
}
