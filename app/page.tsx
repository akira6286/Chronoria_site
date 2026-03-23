"use client";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Member = {
  name: string;
  desc: string;
  img: string;
  link?: string;
  platform?: "twitch" | "youtube" | "twitter";
};

type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
};

export default function Home() {
  /* ===== 成員 ===== */
  const members: Member[] = [
    {
      name: "時乃流綺",
      desc: `時乃流綺，來自時之塔的時之精靈 ⏳✨
      理論上應該很擅長掌控時間， 但每次開台時...
      跑馬燈、標題、畫面設定， 總會有一兩個東西忘了更新。
      這些小小的開台pon， 久而久之也成了流綺的日常。`,
      img: "/images/67.jpg",
      link: "https://x.com/TokinoRuki",
      platform: "twitter",
    },
    {
      name: "木村遙",
      desc: `技術型大佬，是娚孩子
      寫過 DC 機器人 LeetCord，也設計過 AIVTuber「凜奈」
      據說還有3個專案正在產出中✨ (聽說這個網站也是他寫的喔)
      最喜歡的事情，是下班後悠閒地去海邊握著釣竿看水 🎣
      在放假的時候，爆肝寫專案，專注到忘我 🖥️
      打造虛擬世界，也享受平凡的樂趣。`,
      img: "/images/haruka.jpg",
      link: "https://x.com/haruka21523",
      platform: "twitter",
    },
    {
      name: "星雪鶴羽",
      desc: `鶴羽，13貓家的二哥，白色妖狐一隻 ❄️🦊
      雖然外表高冷，家中的么妹（流綺）對他的白狐狸大衣虎視眈眈👀
      平日神秘莫測，偶爾又帶著些許調皮
      總是讓家裡氣氛多了幾分趣味。`,
      img: "/images/heyu.jpg",
      link: "https://www.twitch.tv/xingxueheyu",
      platform: "twitch",
    },
    {
      name: "梓夜",
      desc: `來自異世界的少女，身為無聲系 Vtuber 的梓夜 🖤
      雖然不開麥，但打起遊戲十分兇狠 🎮
      鍵盤從不饒過敵人 ⌨️。
      她曾在公司 KPI 📊 與宅家玩遊戲 🎮 的意志間矛盾……
      最終另闢蹊徑，靠宅家直播打遊戲，一箭雙鵰。`,
      img: "/images/hinye.jpg",
      link: "https://www.twitch.tv/xnln129967",
      platform: "twitch",
    },
    {
      name: "洛恩",
      desc: `洛恩，自喵星來的吸血貓貓
      為了尋找命定的蕃茄，她踏上了成為 V 的日常
      在上班與尋找蕃茄之間兩點一線。
      直播時悠閒探索世界，偶爾偷偷嗅聞蕃茄蹤跡
      有時也會小小耍耍手段，確保自己的番茄供應無虞`,
      img: "/images/lorne.jpg",
      link: "https://x.com/EvansLorne66",
      platform: "twitter",
    },
    {
      name: "栗香米果",
      desc: `阿果，全名栗香米果
      一隻可愛的小熊 雖然名字裡有米
      大家常會誤以為是粟… 其實是栗喔
      曾經有位精靈把名字寫錯，被阿果抓到，還被罰抄正確版本一百遍
      永遠帶著俏皮的微笑阿果
      在時序之境裡，是讓人心情暖起來的小小存在`,
      img: "/images/miguo.jpg",
      link: "https://x.com/miguo_miraiouo",
      platform: "twitter",
    },
    {
      name: "新汐",
      desc: `一隻從不知名海域漂流而來的水母。
      有時聰明得讓人驚訝，但更多時候有點呆呆的 🪼
      不太適應陸地氣候，三不五時就會過敏打噴嚏 🤧
       平時個性溫和，和大家相處得很好。
       但只要進入競技遊戲——
       聊天室就會聽見水母版的髒話連珠炮 ⚡`,
      img: "/images/新汐.png",
      link: "https://www.twitch.tv/sinsi8787",
      platform: "twitch",
    },
    {
      name: "亣覞",
      desc: `亣覞，圖奇實況主。
      出現時間相當隨緣
      但聊天室有件事幾乎不會變——
      不管你說什麼， 最後都會得到一句回覆。
      「加油。」  「我要去洗澡了。」 「洗澡加油。」
      久而久之， 大家發現了一件事： 亣覞其實是聊天室的祝福 NPC。`,
      img: "/images/亣覞.jpg",
    },
    {
      name: "???",
      desc: "來自未知時間線的存在…… 沒有任何紀錄， 沒有任何過去， 甚至——不確定是否真正存在。 「他」正在被觀測， 但同時也在觀測我們。",
      img: "/images/黑黑剪影.png",
    },
    {
      name: "巧莓",
      desc: `白天睡覺的甜點精靈
       凌晨總會準時出現在直播間，陪伴晚歸的觀測者們 📷📷
       她大多時候都在遊戲裡帶領大家， 穩穩地給予安全感
       像夜晚裡的一盞小燈，默默照亮每一段時序 📷`,
      img: "/images/巧梅.jpg",
    },
  ];

  const [active, setActive] = useState<number>(0);
  const total = members.length;
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const prevMember = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActive((prev) => (prev - 1 + total) % total);
    window.setTimeout(() => {
      setIsAnimating(false);
    }, 420);
  };

  const nextMember = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActive((prev) => (prev + 1) % total);
    window.setTimeout(() => {
      setIsAnimating(false);
    }, 420);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -50 || info.velocity.x < -500) {
      nextMember();
    } else if (info.offset.x > 50 || info.velocity.x > 500) {
      prevMember();
    }
  };

  /* ===== 世界觀 ===== */
  const worldText =
    "在時間交錯的縫隙之中，誕生了無數的意識與存在。時序之境，是所有時間的交會點。\n" +
    "原本穩定流動的時間，近來開始出現異常——裂隙，在不同的世界悄然展開。\n\n" +
    "那些裂隙吞噬了片段的時間，扭曲了記憶，也改變了既定的命運。\n" +
    "而在時之塔中——負責觀測與修復時間的精靈們，察覺到了這些異變。\n\n" +
    "她，是剛成為實習生的時間精靈。能力尚未成熟，卻被賦予了一項任務：\n\n" +
    "修復那些逐漸崩壞的時間線。\n\n" +
    "然而她很快發現...單靠自己，無法支撐整個時序的穩定。\n" +
    "於是...她做了一個「不被允許」的決定。\n\n" +
    "她開始介入裂隙，\n" +
    "將那些被影響、被改變，甚至本該消失的存在...帶離原本的時間。\n" +
    "他們，被引導至時之塔。在這裡來自不同世界、不同時間的存在，開始交會。\n\n" +
    "有人失去了過去，有人無法回到原本的未來，也有人，開始懷疑自己是否仍屬於原本的世界。\n\n" +
    "而她，仍在學習如何修復這一切。\n" +
    "只是，她還不知道——這些被帶來的人，或許並不只是「被拯救的存在」。\n" +
    "而是——改變時間的關鍵。";

  const [displayText, setDisplayText] = useState<string>("");
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const [typingEnergy, setTypingEnergy] = useState<number>(0);
  const worldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTyping(true);
        }
      },
      { threshold: 0.5 }
    );
    const currentWorldRef = worldRef.current;
    if (currentWorldRef) {
      observer.observe(currentWorldRef);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!startTyping) return;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const getDelay = (char: string) => {
      if (char === "。") return 260;
      if (char === "，") return 140;
      if (char === "！" || char === "？") return 260;
      if (char === "\n") return 320;
      if (char === "…") return 200;
      return 14 + Math.random() * 12;
    };
    const type = (index: number) => {
      setDisplayText(worldText.slice(0, index));
      setTypingEnergy(1);
      if (index < worldText.length) {
        const char = worldText[index] || "";
        const delay = getDelay(char);
        timeoutId = setTimeout(() => {
          setTypingEnergy(0);
          type(index + 1);
        }, delay);
      }
    };
    type(0);
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [startTyping, worldText]);

  /* ===== 粒子背景 ===== */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];

    const createParticles = (width: number, height: number) => {
      const amount = Math.min(
        155,
        Math.max(80, Math.floor((width * height) / 17000))
      );
      const newParticles: Particle[] = [];
      for (let i = 0; i < amount; i += 1) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.4,
          alpha: Math.random() * 0.42 + 0.14,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
        });
      }
      return newParticles;
    };

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(width, height);
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -24) particle.x = width + 24;
        if (particle.x > width + 24) particle.x = -24;
        if (particle.y < -24) particle.y = height + 24;
        if (particle.y > height + 24) particle.y = -24;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const energyBoost = typingEnergy * 0.6;
        context.fillStyle = `rgba(180, 230, 255, ${particle.alpha + energyBoost})`;
        context.shadowBlur = 14 + typingEnergy * 20;
        context.shadowColor = "rgba(120, 220, 255, 0.65)";
        context.fill();
      }

      context.shadowBlur = 0;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const linkDistance = 115 + typingEnergy * 40;

          if (distance < linkDistance) {
            const opacity = (1 - distance / linkDistance) * 0.11;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.strokeStyle = `rgba(120, 220, 255, ${opacity})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }
      animationFrameId = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ===== 空間感 / 視差 ===== */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSmooth = useSpring(mouseX, {
    stiffness: 45,
    damping: 18,
    mass: 0.8,
  });
  const mouseYSmooth = useSpring(mouseY, {
    stiffness: 45,
    damping: 18,
    mass: 0.8,
  });

  const backgroundTranslateX = useTransform(mouseXSmooth, [-1, 1], [-26, 26]);
  const backgroundTranslateY = useTransform(mouseYSmooth, [-1, 1], [-26, 26]);
  const heroTranslateX = useTransform(mouseXSmooth, [-2, 2], [-20, 20]);
  const heroTranslateY = useTransform(mouseYSmooth, [-2, 2], [-20, 20]);
  const membersTranslateX = useTransform(mouseXSmooth, [-1, 1], [-20, 20]);
  const membersTranslateY = useTransform(mouseYSmooth, [-1, 1], [-20, 20]);
  const desktopCardRotateY = useTransform(mouseXSmooth, [-1, 1], [-6, 6]);
  const desktopCardRotateX = useTransform(mouseYSmooth, [-1, 1], [5, -5]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const normalizedX = event.clientX / window.innerWidth;
      const normalizedY = event.clientY / window.innerHeight;
      mouseX.set((normalizedX - 0.5) * 4);
      mouseY.set((normalizedY - 0.5) * 4);
    };
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* ===== 背景層 ===== */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <motion.div
          style={{ x: backgroundTranslateX, y: backgroundTranslateY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(70,130,255,0.18),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(0,220,255,0.14),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(140,0,255,0.14),transparent_32%)]" />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.05, 1, 1.05], opacity: [0.14, 0.3, 0.14] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-[140px]"
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.24, 0.1] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10rem] left-[20%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/20 blur-[140px]"
          />
        </motion.div>
        <motion.div
          style={{
            x: useTransform(mouseXSmooth, [-1, 1], [-10, 10]),
            y: useTransform(mouseYSmooth, [-1, 1], [-10, 10]),
          }}
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_48%)]" />
        <canvas
        ref={canvasRef}
        className="fixed inset-0 z-30 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75 z-[1]" />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="font-bold text-lg tracking-wide">Chronoria</span>
          <div className="flex gap-6 text-sm text-gray-300">
            <a href="#world" className="hover:text-white transition">
              世界觀
            </a>
            <a href="#members" className="hover:text-white transition">
              成員
            </a>
          </div>
        </div>
      </div>

      <main className="pt-16 bg-transparent text-white relative z-20">
        {/* Hero */}
        <section className="h-screen snap-start flex flex-col items-center justify-center relative overflow-hidden px-4">

  {/* ⭐ 背景層（動最大） */}
  <motion.div
    style={{ x: heroTranslateX, y: heroTranslateY }}
    className="absolute inset-0 pointer-events-none"
  >
    <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
    <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
    <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
  </motion.div>

  {/* ⭐ 主內容 */}
  <div className="relative z-10 flex flex-col items-center">

    {/* ⭐ LOGO（中層 → 動較小） */}
    <motion.img
      src="/images/時序之境_B_單色_光暈.png"
      style={{
        x: useTransform(heroTranslateX, (v) => v * 0.5),
        y: useTransform(heroTranslateY, (v) => v * 0.5),
      }}
      animate={{
        scale: [1, 1.08, 1],
        filter: [
          "drop-shadow(0 0 20px rgba(0,200,255,0.3))",
          "drop-shadow(0 0 40px rgba(0,200,255,0.6))",
          "drop-shadow(0 0 20px rgba(0,200,255,0.3))",
        ],
        y: [0, -8, 0],
      }}
      transition={{
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        filter: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      className="w-[400px] md:w-[600px] relative z-10"
      alt="時序之境 Logo"
    />

    {/* ⭐ 文字（不動 → 最前層） */}
    <h1 className="text-5xl md:text-7xl font-bold mt-6 tracking-[0.2em] text-center">
      時序之境
    </h1>

    <p className="mt-4 text-gray-400 text-sm md:text-base tracking-[0.3em] uppercase text-center">
      Chronoria
    </p>

    {/* ⭐ 呼吸線 */}
    <motion.div
      animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.06, 1] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      className="mt-8 h-px w-36 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
    />

  </div>
</section>

        {/* 世界觀 */}
        <section
          id="world"
          className="min-h-screen snap-start flex items-center justify-center px-4 md:px-10 py-16 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_60px_rgba(0,180,255,0.08)] px-6 md:px-10 py-10 md:py-14 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,220,255,0.08),transparent_38%)] pointer-events-none" />
              <div className="absolute -top-16 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />

              <motion.div
                ref={worldRef}
                animate={{ x: [0, -1, 1, 0], y: [0, 1, -1, 0] }}
                transition={{
                  duration: 0.25,
                  repeat: typingEnergy > 0 ? Infinity : 0,
                  ease: "linear",
                }}
                className="max-w-3xl text-center px-2 mx-auto relative z-10"
              >
                <h2 className="text-3xl mb-6">關於這個世界</h2>
                <p className="text-gray-300 whitespace-pre-line leading-8 text-left">
                  <>
                    {displayText.split("\n").map((line, lineIndex) => {
                      if (line.trim() === "") {
                        return <div key={lineIndex} className="h-6"></div>;
                      }
                      return (
                        <div key={lineIndex} className="w-full">
                          {line.split("").map((char, index) => {
                            const glitchChars = [
                              "時",
                              "間",
                              "裂",
                              "隙",
                              "存",
                              "在",
                              "命",
                              "運",
                            ];
                            const isGlitch = glitchChars.includes(char);
                            return (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: "blur(6px)" }}
                                animate={{
                                  opacity: 1,
                                  filter: "blur(0px)",
                                  textShadow: [
                                    "0 0 0px rgba(0,200,255,0)",
                                    "0 0 10px rgba(0,200,255,0.6)",
                                    "0 0 0px rgba(0,200,255,0)",
                                  ],
                                }}
                                transition={{
                                  duration: 0.4,
                                  delay: lineIndex * 0.05 + index * 0.003,
                                }}
                                className="inline"
                              >
                                {isGlitch ? (
                                  <span className="relative">
                                    {char}
                                    <span className="absolute left-0 top-0 text-cyan-300 opacity-70 glitch-layer">
                                      {char}
                                    </span>
                                    <span className="absolute left-0 top-0 text-fuchsia-400 opacity-50 glitch-layer2">
                                      {char}
                                    </span>
                                  </span>
                                ) : (
                                  char
                                )}
                              </motion.span>
                            );
                          })}
                        </div>
                      );
                    })}
                    <span className="ml-1 text-cyan-300 animate-[blink_1s_steps(1)_infinite]">
                      {" "}
                      |{" "}
                    </span>
                  </>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 成員 */}
        <section
          id="members"
          className="min-h-screen snap-start flex items-center justify-center px-4 md:px-10 py-10 md:py-0 relative overflow-hidden"
        >
          <motion.div
            style={{ x: membersTranslateX, y: membersTranslateY }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-[14%] left-[8%] h-28 w-28 rounded-full border border-cyan-300/10" />
            <div className="absolute bottom-[16%] right-[10%] h-40 w-40 rounded-full border border-fuchsia-300/10" />
            <div className="absolute top-[50%] left-[50%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.03] blur-[120px]" />
            <div className="absolute top-[26%] right-[22%] h-24 w-24 rounded-full bg-blue-400/[0.04] blur-[60px]" />
          </motion.div>

          <div className="absolute text-[120px] md:text-[200px] font-bold opacity-5 select-none pointer-events-none tracking-widest">
            CHRONORIA
          </div>

          {/* 👉 手機版（完全獨立） */}
          <div className="md:hidden w-full max-w-md mx-auto z-10 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              {members[active].name}
            </h2>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-5 shadow-[0_0_40px_rgba(0,180,255,0.08)]">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed text-base text-center px-2">
                {members[active].desc}
              </p>
            </div>
            <div
              className="w-full flex justify-center items-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl py-6 shadow-[0_0_50px_rgba(0,180,255,0.08)]"
              style={{ touchAction: "pan-y" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={members[active].img}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.22}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  className="w-full flex justify-center cursor-grab active:cursor-grabbing select-none"
                  initial={{ opacity: 0, scale: 0.96, x: 60 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -60 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <img
                    src={members[active].img}
                    alt={members[active].name}
                    draggable={false}
                    className="max-h-[45vh] w-full object-contain drop-shadow-[0_0_40px_rgba(0,200,255,0.3)] pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-300">
                {active + 1} / {total}
              </div>
              <div className="text-xs text-gray-500">左右滑動切換角色</div>
            </div>
          </div>

          {/* 👉 桌機版（完全維持你原本的） */}
          <div className="hidden md:grid grid-cols-2 gap-10 items-center w-full max-w-6xl z-10 [perspective:1600px]">
            {/* 左：文字 */}
            <motion.div
              style={{
                rotateY: desktopCardRotateY,
                rotateX: desktopCardRotateX,
                transformStyle: "preserve-3d",
              }}
              className="flex flex-col justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${active}`}
                  initial={{ opacity: 0, x: -28, rotateX: 6 }}
                  animate={{ opacity: 1, x: 0, rotateX: 0 }}
                  exit={{ opacity: 0, x: 28, rotateX: -6 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                  className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl px-8 py-10 shadow-[0_0_50px_rgba(0,180,255,0.08)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,220,255,0.08),transparent_34%)] pointer-events-none" />
                  {members[active].link && (
                    <a
                      href={members[active].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`absolute right-8 top-8 z-20 h-16 w-16 rounded-full flex items-center justify-center backdrop-blur-md border transition duration-300 ${
                        members[active].platform === "twitch" &&
                        "bg-purple-500/10 border-purple-400/20 hover:bg-purple-500/20 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
                      } ${
                        members[active].platform === "youtube" &&
                        "bg-red-500/10 border-red-400/20 hover:bg-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]"
                      } ${
                        members[active].platform === "twitter" &&
                        "bg-white/10 border-white/20 hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                      }`}
                    >
                      {members[active].platform === "twitch" && (
                        <img src="/images/twitchlogo.svg" className="w-8 h-8" />
                      )}
                      {members[active].platform === "youtube" && (
                        <img src="/images/ytlogo.svg" className="w-8 h-8" />
                      )}
                      {members[active].platform === "twitter" && (
                        <img src="/images/Xlogo.svg" className="w-7 h-7" />
                      )}
                    </a>
                  )}
                  <h2 className="text-5xl font-bold mb-4 relative z-10">
                    {members[active].name}
                  </h2>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed text-lg relative z-10">
                    {members[active].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={prevMember}
                  className="px-5 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition"
                  aria-label="上一位成員"
                >
                  ← 上一位
                </button>
                <div className="text-sm text-gray-300 min-w-[72px] text-center">
                  {active + 1} / {total}
                </div>
                <button
                  onClick={nextMember}
                  className="px-5 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition"
                  aria-label="下一位成員"
                >
                  下一位 →
                </button>
              </div>
            </motion.div>

            {/* 右：圖片 */}
            <motion.div
              style={{
                rotateY: useTransform(mouseXSmooth, [-1, 1], [8, -8]),
                rotateX: useTransform(mouseYSmooth, [-1, 1], [-6, 6]),
                transformStyle: "preserve-3d",
              }}
              className="flex justify-center items-center"
            >
              <div className="relative w-full flex justify-center items-center rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl py-10 shadow-[0_0_60px_rgba(0,180,255,0.08)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,220,255,0.12),transparent_45%)] pointer-events-none" />
                <div className="absolute inset-x-12 bottom-6 h-10 rounded-full bg-cyan-300/10 blur-2xl pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.img
                    key={members[active].img}
                    src={members[active].img}
                    alt={members[active].name}
                    initial={{ opacity: 0, x: 80, scale: 0.97, rotateY: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      rotateY: 0,
                      y: [0, -6, 0],
                    }}
                    exit={{ opacity: 0, x: -80, scale: 0.97, rotateY: 10 }}
                    transition={{
                      opacity: { duration: 0.4 },
                      x: { duration: 0.4, ease: "easeOut" },
                      scale: { duration: 0.4, ease: "easeOut" },
                      rotateY: { duration: 0.4, ease: "easeOut" },
                      y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="max-h-[80vh] w-full object-contain drop-shadow-[0_0_40px_rgba(0,200,255,0.3)] relative z-10"
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
