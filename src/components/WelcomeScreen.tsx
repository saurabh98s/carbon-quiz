import { motion } from 'framer-motion';
import type { UserInfo } from '../types/quiz';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.webp';

interface WelcomeScreenProps { onStart: (info: UserInfo) => void; }

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [form, setForm] = useState<UserInfo>({ name: '', email: '', company: '', role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.company.trim()) e.company = 'Required';
    if (!form.role.trim()) e.role = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const start = () => { if (validate()) onStart(form); };
  const handleArrowClick = () => {
    setShowForm(true);
  };

  return (
    <div className="welcome-wrap">
      {/* Animated scenic background: mountains + seasons + emissions */}
      <motion.div className="welcome-bg" aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <svg viewBox="0 0 1440 720" className="welcome-bg-svg">
          {/* Seasons changing sky */}
          <motion.rect x="0" y="0" width="1440" height="720"
            animate={{ fill: [
              'linear-gradient(0, #0f2a21, #103026)',
              'linear-gradient(0, #0c241d, #194a3c)',
              'linear-gradient(0, #0f2a21, #103026)'
            ] }}
          />

          {/* Back mountains */}
          <motion.path
            d="M0 520 C 240 480 360 560 600 520 C 840 480 960 560 1200 520 C 1320 500 1380 510 1440 520 L1440 720 L0 720 Z"
            fill="#0a2019"
            animate={{ x: [-40, 40, -40] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
          />

          {/* Front mountains */}
          <motion.g animate={{ x: [60, -60, 60] }} transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut' }}>
            <path d="M0 560 C 200 520 320 600 520 560 C 760 510 980 650 1440 600 L1440 720 L0 720 Z" fill="#081a15" />
            {/* Snowcaps */}
            <motion.path d="M240 540 L300 470 L360 540 Z" fill="#e6f7f0" opacity="0.85"
              animate={{ opacity: [0.25, 0.85, 0.25] }} transition={{ duration: 16, repeat: Infinity }} />
            <motion.path d="M700 540 L760 480 L820 540 Z" fill="#e6f7f0" opacity="0.85"
              animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 18, repeat: Infinity }} />
            <motion.path d="M1080 560 L1130 500 L1180 560 Z" fill="#e6f7f0" opacity="0.85"
              animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 20, repeat: Infinity }} />
          </motion.g>

          {/* Carbon emissions in distance */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle key={i}
              cx={200 + i * 150}
              cy={560 + (i % 3) * 10}
              r={6}
              fill="rgba(180, 220, 205, .28)"
              animate={{ cy: [560 + (i % 3) * 10, 500, 540], opacity: [0.2, 0.6, 0] }}
              transition={{ duration: 8 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}
        </svg>
      </motion.div>

      <motion.div
        className="welcome-stack"
        animate={{ y: showForm ? '-100vh' : '0vh' }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <section className="welcome-hero landing-section">
          <div className="welcome-inner welcome-xl">
            <div className="welcome-left">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="welcome-badge">quiz</div>
                <h1 className="welcome-title lg">Welcome to the C9 Central Carbon Quiz</h1>
                <p className="welcome-sub">Ready to turn curiosity into carbon clarity? Let’s see how sustainable your operations really are.</p>
                <div className="welcome-arrow-wrap">
                  <button className="welcome-arrow" onClick={handleArrowClick} aria-label="Continue to details">
                    <span>Start here</span>
                    <span className="welcome-arrow-icon">➜</span>
                  </button>
                </div>
              </motion.div>
            </div>
            <div className="welcome-right">
              <motion.div
                className="landing-logo-wrap"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src={logo} alt="C9 Central logo" className="landing-logo" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="welcome-hero form-section">
          <div className="welcome-inner welcome-xl">
            <div className="welcome-left">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="welcome-badge">quiz</div>
                <h2 className="welcome-title lg">Carbon Readiness Assessment</h2>
                <p className="welcome-sub">It takes 8-10 minutes to complete the quiz and get your results.</p>
                <div className="rs-intake-card">
                <div className="rs-grid-2">
                  <div>
                    <label className="rs-label">Full name</label>
                    <input className={`rs-input ${errors.name ? 'rs-input-error' : ''}`} placeholder="Jane Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <div className="rs-error">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="rs-label">Work email</label>
                    <input className={`rs-input ${errors.email ? 'rs-input-error' : ''}`} placeholder="jane@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <div className="rs-error">{errors.email}</div>}
                  </div>
                  <div>
                    <label className="rs-label">Company</label>
                    <input className={`rs-input ${errors.company ? 'rs-input-error' : ''}`} placeholder="Acme Inc." value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                    {errors.company && <div className="rs-error">{errors.company}</div>}
                  </div>
                  <div>
                    <label className="rs-label">Role</label>
                    <input className={`rs-input ${errors.role ? 'rs-input-error' : ''}`} placeholder="Operations Manager" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                    {errors.role && <div className="rs-error">{errors.role}</div>}
                  </div>
                </div>
                <div className="rs-intake-actions">
                  <button onClick={start} className="rs-btn rs-btn-active">Start assessment</button>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="welcome-right">
            <svg viewBox="0 0 600 420" className="welcome-illustration big" aria-hidden>
              <defs>
                <linearGradient id="w-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00b36b" />
                  <stop offset="100%" stopColor="#00975c" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 260 C 160 220 220 300 360 260 C 460 230 540 260 600 240 L600 420 L0 420 Z"
                fill="#07150f"
                animate={{ d: [
                  'M0 260 C 160 220 220 300 360 260 C 460 230 540 260 600 240 L600 420 L0 420 Z',
                  'M0 265 C 160 235 220 295 360 270 C 460 240 540 255 600 245 L600 420 L0 420 Z',
                  'M0 260 C 160 220 220 300 360 260 C 460 230 540 260 600 240 L600 420 L0 420 Z'
                ]}}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="460"
                cy="140"
                r="70"
                fill="url(#w-grad)"
                animate={{ y: [0, -14, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </div>
        </section>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
