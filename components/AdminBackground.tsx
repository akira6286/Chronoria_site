"use client";

export default function AdminBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">

      {/* 很淡的光（比前台弱很多） */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,150,255,0.08),transparent_40%),radial-gradient(circle_at_bottom,rgba(0,220,255,0.05),transparent_50%)]" />

      {/* 超淡網格 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03]" />

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </div>
  );
}
