import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '../types/quiz';

interface QuizScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  onAnswer: (score: number) => void;
  celebrate?: boolean;
  sectionProgress?: { sectionId: string; answered: number; total: number };
}

const QuizScreen = ({ question, questionNumber, progress, onAnswer, celebrate = false, sectionProgress }: QuizScreenProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const baseFlagY = 185;
  const flagStep = 45;
  const flagY = selected ? baseFlagY - (selected - 1) * flagStep : baseFlagY;
  const isTopChoice = selected !== null && selected >= 4;
  const progressRounded = Math.round(progress);
  const encouragement = progressRounded >= 90
    ? "Final stretch — finish strong."
    : progressRounded >= 60
      ? "Over halfway — keep the momentum."
      : progressRounded >= 30
        ? "Great start — you're building steady progress."
        : "Nice start — every answer moves you forward.";
  const flagPath = "M176 18 L232 40 L176 62 Z";
  const flagWavePath = "M176 18 L226 42 L176 62 Z";
  const flagWavePath2 = "M176 18 L236 38 L176 62 Z";

  const handleAnswerClick = (score: number) => {
    setSelected(score);
    // Auto-advance after a brief visual feedback delay
    setTimeout(() => {
      onAnswer(score);
    }, 350);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 randstad-screen">
      <div className="randstad-container center grid-quiz">
        <div className="section-sidebar">
          <div className="sidebar-title">Sections</div>
          <ul className="sidebar-sections">
            {Array.from(new Set([question.section.id])).map(() => null)}
          </ul>
          {sectionProgress && (
            <div className="sidebar-progress">
              <div className="sidebar-progress-label">{question.section.name}</div>
              <div className="progress-rail sm"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${Math.round((sectionProgress.answered / sectionProgress.total) * 100)}%` }} /></div>
              <div className="sidebar-progress-meta">{sectionProgress.answered}/{sectionProgress.total}</div>
            </div>
          )}
        </div>

        <div className="randstad-header center-col">
          <div className="randstad-step">
            <span className="randstad-step-num">{questionNumber}</span>
            <div>
              <div className="randstad-title">{question.statement}</div>
              <div className="randstad-motivation">{encouragement} ({progressRounded}% done)</div>
            </div>
          </div>
          <div className="randstad-progress">
            <div className="progress-rail">
              <motion.div
                key={selected ?? 'idle'}
                className="progress-fill"
                initial={{ width: 0, boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
                animate={{
                  width: `${Math.round(progress)}%`,
                  boxShadow: selected
                    ? ['0 0 0 0 rgba(34,197,94,0.0)', '0 0 0 6px rgba(34,197,94,0.35)', '0 0 0 0 rgba(34,197,94,0.0)']
                    : '0 0 0 0 rgba(0,0,0,0)'
                }}
                transition={{ duration: 0.4, boxShadow: { duration: 0.9 } }}
              />
            </div>
            {/* Progress indicator only - auto-advance on answer click */}
            <div className="randstad-cta">
              <span className="text-sm text-gray-400">{questionNumber} of 45</span>
            </div>
          </div>
        </div>

        <div className="randstad-body center center-col">
          <div className="mountain-wrap">
            <svg viewBox="0 0 320 280" className="mountain-svg" aria-hidden>
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <path d="M20 260 L160 60 L300 260 Z" fill="#07150f" />
                <path d="M160 60 L210 120 L110 120 Z" fill="#ffffff" />
              </motion.g>
              <motion.g initial={{ y: baseFlagY }} animate={{ y: flagY }} transition={{ type: 'spring', stiffness: 140, damping: 18 }}>
                <rect x="170" y="0" width="6" height="140" fill="#00b36b" rx="3" />
                <motion.path
                  d={flagPath}
                  fill="#00b36b"
                  animate={isTopChoice ? { d: [flagPath, flagWavePath, flagWavePath2, flagPath] } : { d: flagPath }}
                  transition={isTopChoice ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                />
              </motion.g>
              <motion.path d="M0 270 L320 270" stroke="#06102b" strokeWidth="8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
            </svg>
          </div>

          <div className="answers">
            <AnimatePresence initial={false}>
              {[5,4,3,2,1].map((score, idx) => (
                <motion.button
                  key={score}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.05 * idx, duration: 0.25 }}
                  className={`answer ${selected === score ? 'answer-active' : ''}`}
                  onClick={() => handleAnswerClick(score)}
                >
                  {score === 5 && 'Always or almost always'}
                  {score === 4 && 'Often'}
                  {score === 3 && 'Sometimes'}
                  {score === 2 && 'Rarely'}
                  {score === 1 && 'Never or almost never'}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Section celebration */}
        {celebrate && (
          <motion.div className="celebrate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span key={i} className="spark"
                initial={{ x: 0, y: 0, scale: 0.6, opacity: 0.8 }}
                animate={{
                  x: (Math.cos((i / 18) * Math.PI * 2) * 120),
                  y: (Math.sin((i / 18) * Math.PI * 2) * 80) - 20,
                  scale: [0.6, 1.1, 0.8],
                  opacity: [0.9, 1, 0]
                }}
                transition={{ duration: 1.2 }}
              >✨</motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
