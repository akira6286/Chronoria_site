"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type MemberForm = {
  name: string;
  desc: string;
  img: string;
  link: string;
  platform: "" | "twitter" | "twitch" | "youtube";
};

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState<MemberForm>({
    name: "",
    desc: "",
    img: "",
    link: "",
    platform: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/members/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        setForm({
          name: typeof data.name === "string" ? data.name : "",
          desc: typeof data.desc === "string" ? data.desc : "",
          img: typeof data.img === "string" ? data.img : "",
          link: typeof data.link === "string" ? data.link : "",
          platform:
            data.platform === "twitter" ||
            data.platform === "twitch" ||
            data.platform === "youtube"
              ? data.platform
              : "",
        });
      } catch (err) {
        console.error("fetch member error:", err);
        alert("讀取成員失敗");
        router.push("/admin/members");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("API error");

      alert("成員已更新");
      router.push("/admin/members");
    } catch (err) {
      console.error("update member error:", err);
      alert("更新失敗");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white px-6 py-10 max-w-3xl mx-auto">
        <div className="text-gray-400">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">編輯成員</h1>

      <div className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          placeholder="名稱"
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          onChange={handleChange}
        />
        <textarea
          name="desc"
          value={form.desc}
          placeholder="介紹"
          className="p-3 bg-black/40 border border-white/10 rounded-lg h-32"
          onChange={handleChange}
        />
        <input
          name="img"
          value={form.img}
          placeholder="圖片路徑"
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          onChange={handleChange}
        />
        <input
          name="link"
          value={form.link}
          placeholder="連結（可空）"
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          onChange={handleChange}
        />

        <select
          name="platform"
          value={form.platform}
          className="p-3 bg-black/40 border border-white/10 rounded-lg"
          onChange={handleChange}
        >
          <option value="">無平台</option>
          <option value="twitter">Twitter</option>
          <option value="twitch">Twitch</option>
          <option value="youtube">YouTube</option>
        </select>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30"
          >
            儲存
          </button>
          <button
            onClick={() => router.push("/admin/members")}
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
