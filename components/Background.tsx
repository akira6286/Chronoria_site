"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
};

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];

    const createParticles = (width: number, height: number) => {
      const amount = Math.min(
        120,
        Math.max(60, Math.floor((width * height) / 20000))
      );

      const arr: Particle[] = [];
      for (let i = 0; i < amount; i++) {
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
        });
      }
      return arr;
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * ratio;
      canvas.height = h * ratio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(w, h);
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // 粒子
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,230,255,${p.alpha})`;
        ctx.fill();
      }

      // 連線
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120,220,255,${opacity})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">

      {/* 漸層背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(70,130,255,0.18),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(0,220,255,0.14),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(140,0,255,0.14),transparent_32%)]" />

      {/* 光球 */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-[120px]"
      />

      {/* 網格 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.05]" />

      {/* ⭐ 粒子 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
      />

      {/* 漸層遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75 z-[11]" />
    </div>
  );
}
