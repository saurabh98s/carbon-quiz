import { motion } from 'framer-motion';

interface VectorBackdropProps {
  variant?: 'welcome' | 'quiz' | 'results' | 'loading';
}

const VectorBackdrop = ({ variant = 'welcome' }: VectorBackdropProps) => {
  const colors = {
    welcome: ['#22c55e33', '#3b82f633', '#ec489933'],
    quiz: ['#22c55e29', '#a78bfa29', '#06b6d429'],
    results: ['#22c55e40', '#22c55e20', '#22c55e10'],
    loading: ['#22c55e20', '#3b82f620', '#a78bfa20']
  }[variant];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`grad-${variant}-1`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
          <linearGradient id={`grad-${variant}-2`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2]} />
          </linearGradient>
        </defs>

        <motion.path
          d="M 0 600 C 200 500 300 700 500 620 C 700 540 900 660 1200 560 L 1200 800 L 0 800 Z"
          fill={`url(#grad-${variant}-1)`}
          initial={{ translateY: 20 }}
          animate={{ translateY: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.path
          d="M 0 200 C 180 260 360 160 560 220 C 760 280 940 180 1200 240 L 1200 0 L 0 0 Z"
          fill={`url(#grad-${variant}-2)`}
          initial={{ translateY: -10 }}
          animate={{ translateY: [-6, 6, -6] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.circle
          cx="200"
          cy="620"
          r="120"
          fill={colors[0]}
          initial={{ scale: 0.95 }}
          animate={{ scale: [0.95, 1.03, 0.95] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.circle
          cx="1000"
          cy="140"
          r="90"
          fill={colors[1]}
          initial={{ scale: 1.05 }}
          animate={{ scale: [1.05, 0.97, 1.05] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

export default VectorBackdrop;


