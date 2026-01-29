import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QUIZ_QUESTIONS } from './data/quizData';
import { QUIZ_SECTIONS } from './types/quiz';
import type { QuizAnswer, QuizResult, SectionScore, QuizTier, UserInfo } from './types/quiz';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingScreen from './components/LoadingScreen';
import SectionDialog from './components/SectionDialog';
import AdminScreen from './components/AdminScreen';
import './App.css';

type AppState = 'welcome' | 'quiz' | 'loading' | 'results';

const STORAGE_KEY = 'c9_quiz_progress';

interface SavedProgress {
  userInfo: UserInfo;
  currentQuestionIndex: number;
  answers: { questionId: number; score: number; timestamp: string }[];
  savedAt: string;
}

const saveProgress = (userInfo: UserInfo, questionIndex: number, answers: QuizAnswer[]) => {
  const data: SavedProgress = {
    userInfo,
    currentQuestionIndex: questionIndex,
    answers: answers.map(a => ({ ...a, timestamp: a.timestamp.toISOString() })),
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadProgress = (): SavedProgress | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};

function QuizFlow() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sectionDialog, setSectionDialog] = useState<{ open: boolean; sectionName: string; percentage: number; message: string } | null>(null);
  const [pendingAdvanceIndex, setPendingAdvanceIndex] = useState<number | null>(null);
  const [resumePrompt, setResumePrompt] = useState<SavedProgress | null>(null);

  // Check for saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.answers.length > 0 && saved.currentQuestionIndex < QUIZ_QUESTIONS.length) {
      setResumePrompt(saved);
    }
  }, []);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
  const currentSectionId = currentQuestion.section.id;
  const sectionQuestions = QUIZ_QUESTIONS.filter(q => q.section.id === currentSectionId);
  const answeredInSection = answers.filter(a => sectionQuestions.some(q => q.id === a.questionId)).length;
  const sectionProgress = {
    sectionId: currentSectionId,
    answered: answeredInSection,
    total: sectionQuestions.length
  };

  const handleStartQuiz = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentState('quiz');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizResult(null);
  };

  const handleResume = () => {
    if (!resumePrompt) return;
    setUserInfo(resumePrompt.userInfo);
    setAnswers(resumePrompt.answers.map(a => ({ ...a, timestamp: new Date(a.timestamp) })));
    setCurrentQuestionIndex(resumePrompt.currentQuestionIndex);
    setCurrentState('quiz');
    setResumePrompt(null);
  };

  const handleStartFresh = () => {
    clearProgress();
    setResumePrompt(null);
  };

  const handleAnswer = (score: number) => {
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      score,
      timestamp: new Date()
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // Save progress to localStorage
    if (userInfo) {
      saveProgress(userInfo, currentQuestionIndex + 1, newAnswers);
    }

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      const currentSection = currentQuestion.section.id;
      const nextSection = QUIZ_QUESTIONS[currentQuestionIndex + 1].section.id;
      if (currentSection !== nextSection) {
        // Section finished – compute section percentage and show dialog
        const sectionQs = QUIZ_QUESTIONS.filter(q => q.section.id === currentSection);
        const sectionAns = newAnswers.filter(a => sectionQs.some(q => q.id === a.questionId));
        const sectionScore = sectionAns.reduce((s, a) => s + a.score, 0);
        const sectionMax = sectionQs.length * 5;
        const sectionPct = sectionMax > 0 ? (sectionScore / sectionMax) * 100 : 0;

        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);

        const sectionName = currentQuestion.section.name;
        const message = generateSectionCompletionMessage(sectionName, sectionPct);
        setSectionDialog({ open: true, sectionName, percentage: sectionPct, message });
        setPendingAdvanceIndex(currentQuestionIndex + 1);
        return; // wait for dialog confirmation to advance
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Show loading screen before results
      setCurrentState('loading');

      // Simulate processing time for better UX
      setTimeout(() => {
        const result = calculateQuizResult(newAnswers);
        setQuizResult(result);
        setCurrentState('results');
        clearProgress(); // Clear saved progress on completion
      }, 2000);
    }
  };

  const handleCloseSectionDialog = () => {
    setSectionDialog(null);
    if (pendingAdvanceIndex !== null) {
      setCurrentQuestionIndex(pendingAdvanceIndex);
      setPendingAdvanceIndex(null);
    }
  };

  const generateSectionCompletionMessage = (sectionName: string, percentage: number): string => {
    const p = Math.round(percentage);
    if (p >= 86) return `${sectionName}: Outstanding progress so far — you're leading the pack here.`;
    if (p >= 61) return `${sectionName}: Strong performance — a few optimizations will push you into leader territory.`;
    if (p >= 31) return `${sectionName}: Solid start — focus on consistent practices to lift your score.`;
    return `${sectionName}: Plenty of quick wins ahead — let's tackle the basics in the next section.`;
  };

  const handleRestart = () => {
    clearProgress();
    setCurrentState('welcome');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizResult(null);
    setUserInfo(null);
  };

  const calculateQuizResult = (answers: QuizAnswer[]): QuizResult => {
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = QUIZ_QUESTIONS.length * 5; // 5 is max score per question
    const percentage = (totalScore / maxScore) * 100;

    // Calculate section scores
    const sectionScores: Record<string, SectionScore> = {};
    QUIZ_SECTIONS.forEach(section => {
      const sectionQuestions = QUIZ_QUESTIONS.filter(q => q.section.id === section.id);
      const sectionAnswers = answers.filter(a =>
        sectionQuestions.some(q => q.id === a.questionId)
      );
      const sectionScore = sectionAnswers.reduce((sum, a) => sum + a.score, 0);
      const sectionMaxScore = sectionQuestions.length * 5;
      const sectionPercentage = (sectionScore / sectionMaxScore) * 100;

      sectionScores[section.id] = {
        sectionId: section.id,
        sectionName: section.name,
        score: sectionScore,
        maxScore: sectionMaxScore,
        percentage: sectionPercentage,
        tier: getTierFromPercentage(sectionPercentage)
      };
    });

    return {
      totalScore,
      maxScore,
      percentage,
      tier: getTierFromPercentage(percentage),
      sectionScores,
      recommendations: generateRecommendations(percentage, sectionScores),
      timestamp: new Date()
    };
  };

  const getTierFromPercentage = (percentage: number): QuizTier => {
    if (percentage >= 86) return { name: "Leader", emoji: "🌳", description: "Green trailblazer. Ready for certification.", range: "86–100%", color: "#22c55e" };
    if (percentage >= 61) return { name: "Achiever", emoji: "🌲", description: "Mature practices. Close to audit-ready.", range: "61–85%", color: "#3b82f6" };
    if (percentage >= 31) return { name: "Builder", emoji: "🌿", description: "Taking steps toward sustainability. Good foundation.", range: "31–60%", color: "#f59e0b" };
    return { name: "Explorer", emoji: "🌱", description: "Just getting started. Room for major impact.", range: "0–30%", color: "#ef4444" };
  };

  const generateRecommendations = (totalPercentage: number, sectionScores: Record<string, SectionScore>): string[] => {
    const recommendations: string[] = [];

    // General recommendations based on overall score
    if (totalPercentage < 30) {
      recommendations.push("Start with a comprehensive sustainability audit to understand your current baseline.");
      recommendations.push("Implement basic energy tracking systems and water monitoring.");
    } else if (totalPercentage < 60) {
      recommendations.push("Focus on building sustainability infrastructure and policies.");
      recommendations.push("Consider certification programs like ISO 14001 or B Corp.");
    } else if (totalPercentage < 85) {
      recommendations.push("Optimize existing practices and explore advanced technologies.");
      recommendations.push("Develop a comprehensive carbon reduction strategy.");
    } else {
      recommendations.push("Lead industry sustainability initiatives and mentor other organizations.");
      recommendations.push("Explore innovative technologies and breakthrough solutions.");
    }

    // Section-specific recommendations
    Object.values(sectionScores).forEach(section => {
      if (section.percentage < 50) {
        switch (section.sectionId) {
          case 'energy-emissions':
            recommendations.push("Prioritize energy efficiency upgrades and renewable energy adoption.");
            break;
          case 'water-treatment':
            recommendations.push("Implement water monitoring systems and conservation measures.");
            break;
          case 'waste-circularity':
            recommendations.push("Develop a waste management strategy focusing on reduction and recycling.");
            break;
          case 'sustainable-procurement':
            recommendations.push("Evaluate supply chain sustainability and local sourcing options.");
            break;
          case 'nature-community':
            recommendations.push("Assess environmental impact and develop community engagement programs.");
            break;
        }
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Resume prompt modal */}
      {resumePrompt && currentState === 'welcome' && (
        <div className="rs-modal-backdrop">
          <div className="rs-modal">
            <div className="rs-modal-header">
              <span className="rs-modal-badge">Resume</span>
              <span className="rs-modal-title">Continue your quiz?</span>
            </div>
            <p className="rs-modal-message">
              Welcome back, {resumePrompt.userInfo.name}! You completed {resumePrompt.answers.length} of {QUIZ_QUESTIONS.length} questions.
            </p>
            <div className="rs-modal-actions" style={{ gap: '0.75rem' }}>
              <button className="rs-btn" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }} onClick={handleStartFresh}>Start Fresh</button>
              <button className="rs-btn rs-btn-active" onClick={handleResume}>Continue</button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentState === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStartQuiz} />
        )}

        {currentState === 'quiz' && currentQuestion && (
          <QuizScreen
            key="quiz"
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={QUIZ_QUESTIONS.length}
            progress={progress}
            onAnswer={handleAnswer}
            celebrate={celebrate}
            sectionProgress={sectionProgress}
          />
        )}

        {/* Section completion dialog overlay while in quiz */}
        {currentState === 'quiz' && sectionDialog && (
          <SectionDialog
            open={sectionDialog.open}
            sectionName={sectionDialog.sectionName}
            percentage={sectionDialog.percentage}
            message={sectionDialog.message}
            onClose={handleCloseSectionDialog}
          />
        )}

        {currentState === 'loading' && (
          <LoadingScreen key="loading" />
        )}

        {currentState === 'results' && quizResult && (
          <ResultsScreen
            key="results"
            result={quizResult}
            userInfo={userInfo}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizFlow />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
