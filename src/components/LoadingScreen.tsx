import { motion } from 'framer-motion';
import VectorBackdrop from './VectorBackdrop';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Calculating your results..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <VectorBackdrop variant="loading" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-6xl mb-6"
        >
          🌱
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-4"
        >
          Analyzing Your Responses
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-6"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.6, duration: 2, ease: "easeInOut" }}
          className="progress-bar mx-auto max-w-xs"
        >
          <div className="progress-fill"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
