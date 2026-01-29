import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuizAnswer, QuizResult, UserInfo } from '../types/quiz';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, Target, RefreshCw, Download, Share2 } from 'lucide-react';
import VectorBackdrop from './VectorBackdrop';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultsScreenProps {
  result: QuizResult;
  userInfo: UserInfo | null;
  answers: QuizAnswer[];
  onRestart: () => void;
}

const ResultsScreen = ({ result, userInfo, answers, onRestart }: ResultsScreenProps) => {
  const sectionData = Object.values(result.sectionScores).map(section => ({
    name: section.sectionName.split(' ')[0], // Shorten names for chart
    fullName: section.sectionName,
    score: Math.round(section.percentage),
    color: section.tier.color
  }));

  const radarData = Object.values(result.sectionScores).map(section => ({
    subject: section.sectionName.split(' ')[0],
    score: Math.round(section.percentage),
    fullMark: 100
  }));

  // Build slides of 4 sections each for the breakdown slider
  const slides = useMemo(() => {
    const sections = Object.values(result.sectionScores);
    const chunks: typeof sections[] = [];
    for (let i = 0; i < sections.length; i += 4) chunks.push(sections.slice(i, i + 4));
    return chunks;
  }, [result.sectionScores]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const exportRef = useRef<HTMLDivElement>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';

  useEffect(() => {
    if (!userInfo || saveState !== 'idle') return;

    const submitResults = async () => {
      setSaveState('saving');
      try {
        const payload = {
          user: userInfo,
          result: {
            ...result,
            timestamp: result.timestamp.toISOString(),
            sectionScores: result.sectionScores,
            recommendations: result.recommendations
          },
          answers: answers.map(answer => ({
            ...answer,
            timestamp: answer.timestamp.toISOString()
          }))
        };

        const response = await fetch(`${apiBase}/api/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to save results');
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    };

    submitResults();
  }, [userInfo, result, answers, apiBase, saveState]);

  const handleDownloadPDF = async () => {
    const el = exportRef.current;
    if (!el) return;

    // Normalize layout for export (remove negative offsets, etc.)
    document.body.classList.add('pdf-export');
    await new Promise(requestAnimationFrame);

    // Capture results with background and watermark
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0b1f17',
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 8; // mm
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin; // first page top-left with margin

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= (pdfHeight - margin * 2);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin; // move up to show next slice
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= (pdfHeight - margin * 2);
    }

    pdf.save('C9-Central-Results.pdf');

    document.body.classList.remove('pdf-export');
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden randstad-screen">
      <VectorBackdrop variant="results" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="results-wrap relative"
        ref={exportRef}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 results-header"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {result.tier.emoji}
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-2">
            You're a {result.tier.name}!
          </h1>

          <p className="text-xl text-gray-300 mb-4">
            {result.tier.description}
          </p>

          <div className="tier-badge mb-6" style={{ borderColor: result.tier.color }}>
            <span className="text-2xl">{result.tier.emoji}</span>
            <div>
              <div className="font-bold text-white">{result.tier.name}</div>
              <div className="text-sm text-gray-300">{result.tier.range}</div>
            </div>
          </div>

          <div className="text-6xl font-bold text-green-400 mb-2">
            {Math.round(result.percentage)}%
          </div>
          <p className="text-gray-400">
            Overall Sustainability Score
          </p>
          {saveState !== 'idle' && (
            <p className={`text-sm mt-2 ${saveState === 'error' ? 'text-red-300' : 'text-gray-400'}`}>
              {saveState === 'saving' && 'Saving your results...'}
              {saveState === 'saved' && 'Results saved for your follow-up.'}
              {saveState === 'error' && 'Unable to save results right now.'}
            </p>
          )}
        </motion.div>

        {/* Top metrics */}
        <div className="metric-cards mb-6">
          <div className="metric-card">
            <div className="metric-title">Total points</div>
            <div className="metric-value">{result.totalScore} / {result.maxScore}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Overall label</div>
            <div className="metric-value">{result.tier.name}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Sections</div>
            <div className="metric-value">{Object.keys(result.sectionScores).length}</div>
          </div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="results-grid mb-8"
        >
          {/* Bar Chart */}
          <div className="result-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-green-400" />
              Section Performance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, _name, props) => [
                    `${value}%`,
                    props.payload.fullName
                  ]}
                />
                <Bar dataKey="score" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="result-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Sustainability Radar
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#22C55E"
                  fill="#22C55E"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Section Details Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <div className="rs-slider-nav">
            <h3 className="text-2xl font-bold text-white">Detailed Breakdown</h3>
            <div className="flex gap-2">
              <button className="rs-nav-btn" disabled={currentSlide === 0} onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}>Prev</button>
              <button className="rs-nav-btn" disabled={currentSlide >= slides.length - 1} onClick={() => setCurrentSlide(s => Math.min(slides.length - 1, s + 1))}>Next</button>
            </div>
          </div>
          <div className="rs-slider">
            <div className="rs-slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((group, gIdx) => (
                <div key={gIdx} className="rs-slide">
                  <div className="rs-slide-grid">
                    {group.map((section, index) => (
                      <motion.div
                        key={section.sectionId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 * index }}
                        className="result-card"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{section.tier.emoji}</span>
                            <div>
                              <h4 className="font-semibold text-white">{section.sectionName}</h4>
                              <p className="text-sm text-gray-400">{section.tier.name} Level</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{Math.round(section.percentage)}%</div>
                            <div className="text-sm text-gray-400">{section.score}/{section.maxScore} points</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div className="bg-green-400 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${section.percentage}%` }} transition={{ duration: 0.8 }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-green-400" />
            Your Next Steps
          </h3>
          <ul className="recommendations-list">
            {result.recommendations.map((recommendation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                className="text-gray-300"
              >
                {recommendation}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onRestart}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Take Assessment Again
          </button>

          <button className="btn-secondary flex items-center justify-center gap-2" onClick={handleDownloadPDF}>
            <Download className="w-5 h-5" />
            Download Report
          </button>

          <button className="btn-secondary flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center mt-8 pt-8 border-t border-gray-600"
        >
          <p className="text-gray-400 text-sm">
            Ready to take the next step in your sustainability journey?
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Contact <a href="mailto:admin@c9central.com" className="text-green-400">admin@c9central.com</a> for personalized decarbonization solutions
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultsScreen;
