"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "얼굴을 감지하고 있어요...",
  "27개 랜드마크를 분석 중...",
  "황금비율을 계산하고 있어요...",
  "닮은 셀럽을 찾고 있어요...",
  "얼굴형을 분류하고 있어요...",
  "거의 다 됐어요!",
];

export default function AnalyzingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8"
      >
        {/* 펄스 원 애니메이션 */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute h-24 w-24 rounded-full bg-primary/20"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute h-24 w-24 rounded-full bg-accent/20"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="relative z-10 h-16 w-16 rounded-full border-3 border-primary/30 border-t-primary"
          />
        </div>

        {/* 단계별 메시지 */}
        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-center text-base font-medium text-foreground/70"
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "easeInOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </motion.div>
    </div>
  );
}
