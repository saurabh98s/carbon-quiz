import { useEffect, useMemo, useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';

type AdminOverview = {
  totalSignups: number;
  totalResults: number;
  averagePercentage: number;
  answerDistribution: Record<string, number>;
  sectionAverages: { id: string; average: number }[];
  recentResults: {
    id: number;
    email: string;
    name: string;
    company: string;
    role: string;
    percentage: number;
    tier_name: string;
    submitted_at: string;
  }[];
};

type ResultDetail = {
  id: number;
  email: string;
  name: string;
  company: string;
  role: string;
  percentage: number;
  tier_name: string;
  submitted_at: string;
  section_scores: Record<string, { sectionName: string; percentage: number }>;
  recommendations: string[];
  answers: { questionId: number; score: number; timestamp: string }[];
};

const ADMIN_PASS_KEY = 'admin_password';

const AdminScreen = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem(ADMIN_PASS_KEY) || '');
  const [input, setInput] = useState(password);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [data, setData] = useState<AdminOverview | null>(null);
  const [detail, setDetail] = useState<ResultDetail | null>(null);
  const [detailStatus, setDetailStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const authHeader = useMemo(() => {
    if (!password) return '';
    const token = btoa(`admin:${password}`);
    return `Basic ${token}`;
  }, [password]);

  const loadOverview = async () => {
    if (!authHeader) return;
    setStatus('loading');
    try {
      const response = await fetch('/api/admin/overview', {
        headers: { Authorization: authHeader }
      });
      if (!response.ok) throw new Error('Unauthorized');
      const json = await response.json();
      setData(json);
      setStatus('idle');
    } catch {
      setStatus('error');
      setData(null);
    }
  };

  useEffect(() => {
    if (authHeader) {
      loadOverview();
    }
  }, [authHeader]);

  const handleLogin = () => {
    sessionStorage.setItem(ADMIN_PASS_KEY, input);
    setPassword(input);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_PASS_KEY);
    setPassword('');
    setInput('');
    setData(null);
  };

  const handleExport = async () => {
    if (!authHeader) return;
    const response = await fetch('/api/admin/export', {
      headers: { Authorization: authHeader }
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz-results.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportFull = async () => {
    if (!authHeader) return;
    const response = await fetch('/api/admin/export?full=1', {
      headers: { Authorization: authHeader }
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz-results-full.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const loadDetail = async (id: number) => {
    if (!authHeader) return;
    setDetailStatus('loading');
    try {
      const response = await fetch(`/api/admin/result/${id}`, {
        headers: { Authorization: authHeader }
      });
      if (!response.ok) throw new Error('Failed');
      const json = await response.json();
      setDetail(json);
      setDetailStatus('idle');
    } catch {
      setDetailStatus('error');
    }
  };

  const distributionEntries = Object.entries(data?.answerDistribution ?? {});
  const maxCount = distributionEntries.length
    ? Math.max(...distributionEntries.map(([, value]) => value))
    : 0;

  return (
    <div className="min-h-screen randstad-screen admin-screen">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <div className="admin-pill">Admin Dashboard</div>
            <div className="admin-title">Carbon Quiz Insights</div>
            <div className="admin-subtitle">Live user behaviour and results metrics</div>
          </div>
          {password && (
            <div className="admin-actions">
              <button className="admin-btn secondary" onClick={handleExport}>Export CSV</button>
              <button className="admin-btn secondary" onClick={handleExportFull}>Export Full</button>
              <button className="admin-btn" onClick={loadOverview}>Refresh</button>
              <button className="admin-btn secondary" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>

        {!password && (
          <div className="admin-card">
            <div className="admin-card-title">Enter admin password</div>
            <div className="admin-form">
              <input
                className="admin-input"
                type="password"
                placeholder="Admin password"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button className="admin-btn" onClick={handleLogin}>Sign in</button>
            </div>
            {status === 'error' && <div className="admin-error">Authentication failed.</div>}
          </div>
        )}

        {password && (
          <>
            <div className={`admin-status ${status === 'error' ? 'error' : ''}`}>
              {status === 'loading' && 'Loading metrics...'}
              {status === 'idle' && data && 'Updated just now.'}
              {status === 'error' && 'Failed to load metrics.'}
            </div>

            <div className="admin-grid">
              <div className="admin-card">
                <div className="admin-card-title">Total signups</div>
                <div className="admin-card-value">{data?.totalSignups ?? 0}</div>
              </div>
              <div className="admin-card">
                <div className="admin-card-title">Quiz completions</div>
                <div className="admin-card-value">{data?.totalResults ?? 0}</div>
              </div>
              <div className="admin-card">
                <div className="admin-card-title">Avg score</div>
                <div className="admin-card-value">{data?.averagePercentage ?? 0}%</div>
              </div>
            </div>

            <div className="admin-section">
              <h3>Answer Distribution</h3>
              <div className="admin-grid">
                {distributionEntries.map(([score, count]) => (
                  <div className="admin-card" key={score}>
                    <div className="admin-card-title">Score {score}</div>
                    <div className="admin-card-value">{count}</div>
                    <div className="admin-bar">
                      <span style={{ width: maxCount ? `${(count / maxCount) * 100}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-section">
              <h3>Section Averages</h3>
              <div className="admin-grid">
                {(data?.sectionAverages ?? []).map(section => (
                  <div className="admin-card" key={section.id}>
                    <div className="admin-card-title">{section.id}</div>
                    <div className="admin-card-value">{section.average}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-section">
              <h3>Recent Results</h3>
              <div className="admin-card admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Company</th>
                      <th>Score</th>
                      <th>Tier</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recentResults ?? []).map(row => (
                      <tr key={row.id} className="admin-row-click" onClick={() => loadDetail(row.id)}>
                        <td>{row.name || row.email || '-'}</td>
                        <td>{row.company || '-'}</td>
                        <td>{Math.round(row.percentage || 0)}%</td>
                        <td><span className="admin-badge">{row.tier_name || '-'}</span></td>
                        <td>{new Date(row.submitted_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-detail">
                <div className="admin-detail-header">
                  <h4>Answer Details</h4>
                  {detail && <div className="admin-detail-meta">{detail.name || detail.email} • {Math.round(detail.percentage || 0)}%</div>}
                </div>
                {detailStatus === 'loading' && <div className="admin-status">Loading answers...</div>}
                {detailStatus === 'error' && <div className="admin-status error">Failed to load answers.</div>}
                {!detail && detailStatus === 'idle' && <div className="admin-status">Select a user row to view answers.</div>}
                {detail && (
                  <div className="admin-detail-grid">
                    {detail.answers.map(answer => {
                      const question = QUIZ_QUESTIONS.find(q => q.id === answer.questionId);
                      return (
                        <div className="admin-card" key={`${detail.id}-${answer.questionId}`}>
                          <div className="admin-card-title">{question?.section.name || 'Section'} • Q{answer.questionId}</div>
                          <div className="admin-detail-question">{question?.statement || 'Question not found'}</div>
                          <div className="admin-detail-score">Score: {answer.score}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;

