import { motion, AnimatePresence } from 'framer-motion';

interface SectionDialogProps {
  open: boolean;
  sectionName: string;
  percentage: number;
  message: string;
  onClose: () => void;
}

const SectionDialog = ({ open, sectionName, percentage, message, onClose }: SectionDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="rs-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rs-modal"
            role="dialog"
            aria-modal="true"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div className="rs-modal-header">
              <div className="rs-modal-badge">Section complete</div>
              <h3 className="rs-modal-title">{sectionName}</h3>
              <div className="rs-modal-score">
                {Math.round(percentage)}%
              </div>
            </div>
            <p className="rs-modal-message">{message}</p>

            <div className="rs-modal-actions">
              <button className="rs-btn rs-btn-active" onClick={onClose}>Continue</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionDialog;


