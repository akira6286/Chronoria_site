"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMemberPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    desc: "",
    img: "",
    link: "",
    platform: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${window.location.origin}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      alert("新增成功！");
      router.push("/admin/members");
    } catch {
      alert("新增失敗");
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">新增成員</h1>

      <div className="flex flex-col gap-4">
        <input name="name" placeholder="名稱" className="p-3 bg-black/40 border border-white/10 rounded-lg" onChange={handleChange} />
        <textarea name="desc" placeholder="介紹" className="p-3 bg-black/40 border border-white/10 rounded-lg h-32" onChange={handleChange} />
        <input name="img" placeholder="圖片路徑" className="p-3 bg-black/40 border border-white/10 rounded-lg" onChange={handleChange} />
        <input name="link" placeholder="連結（可空）" className="p-3 bg-black/40 border border-white/10 rounded-lg" onChange={handleChange} />

        <select name="platform" className="p-3 bg-black/40 border border-white/10 rounded-lg" onChange={handleChange}>
          <option value="">無平台</option>
          <option value="twitter">Twitter</option>
          <option value="twitch">Twitch</option>
          <option value="youtube">YouTube</option>
        </select>

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30"
        >
          新增
        </button>
      </div>
    </div>
  );
}
