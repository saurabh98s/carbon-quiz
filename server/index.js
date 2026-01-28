import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';

const app = express();
const port = process.env.PORT || 80;
const adminPassword = process.env.ADMIN_PASSWORD;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const dbPromise = initDb();

const requireAdminAuth = (req, res, next) => {
  if (!adminPassword) {
    return res.status(500).send('Admin password not configured.');
  }

  const header = req.headers.authorization || '';
  const [type, value] = header.split(' ');
  if (type !== 'Basic' || !value) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
    return res.status(401).send('Authentication required.');
  }

  const decoded = Buffer.from(value, 'base64').toString('utf8');
  const [, password] = decoded.split(':');
  if (password !== adminPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
    return res.status(401).send('Invalid credentials.');
  }

  return next();
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/results', async (req, res) => {
  const { user, result, answers } = req.body ?? {};

  if (!user?.email || !result || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const db = await dbPromise;
    const timestamp = new Date().toISOString();

    await db.run(
      `INSERT INTO newsletter_signups (email, name, company, role, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user.email,
        user.name ?? null,
        user.company ?? null,
        user.role ?? null,
        timestamp
      ]
    );

    await db.run(
      `INSERT INTO quiz_results (
        email, name, company, role, total_score, max_score, percentage,
        tier_name, tier_range, tier_color, tier_emoji,
        section_scores_json, recommendations_json, answers_json, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.email,
        user.name ?? null,
        user.company ?? null,
        user.role ?? null,
        result.totalScore ?? null,
        result.maxScore ?? null,
        result.percentage ?? null,
        result.tier?.name ?? null,
        result.tier?.range ?? null,
        result.tier?.color ?? null,
        result.tier?.emoji ?? null,
        JSON.stringify(result.sectionScores ?? {}),
        JSON.stringify(result.recommendations ?? []),
        JSON.stringify(answers ?? []),
        timestamp
      ]
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save results' });
  }
});

app.get('/api/admin/overview', requireAdminAuth, async (_req, res) => {
  try {
    const db = await dbPromise;
    const totalSignupsRow = await db.get('SELECT COUNT(*) as count FROM newsletter_signups');
    const totalResultsRow = await db.get('SELECT COUNT(*) as count, AVG(percentage) as avgPct FROM quiz_results');
    const answerRows = await db.all('SELECT answers_json FROM quiz_results');
    const recentResults = await db.all(`
      SELECT id, email, name, company, role, percentage, tier_name, submitted_at, section_scores_json
      FROM quiz_results
      ORDER BY submitted_at DESC
      LIMIT 50
    `);

    const answerDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    const sectionTotals = new Map();
    const sectionCounts = new Map();

    answerRows.forEach(row => {
      try {
        const answers = JSON.parse(row.answers_json || '[]');
        answers.forEach(answer => {
          const key = String(answer.score ?? '');
          if (answerDistribution[key] !== undefined) {
            answerDistribution[key] += 1;
          }
        });
      } catch {
        // ignore malformed rows
      }
    });

    recentResults.forEach(row => {
      try {
        const sections = JSON.parse(row.section_scores_json || '{}');
        Object.values(sections).forEach(section => {
          const id = section.sectionId || section.sectionName;
          if (!id) return;
          const currentTotal = sectionTotals.get(id) ?? 0;
          const currentCount = sectionCounts.get(id) ?? 0;
          sectionTotals.set(id, currentTotal + (section.percentage ?? 0));
          sectionCounts.set(id, currentCount + 1);
        });
      } catch {
        // ignore malformed rows
      }
    });

    const sectionAverages = Array.from(sectionTotals.entries()).map(([id, total]) => ({
      id,
      average: Math.round((total / (sectionCounts.get(id) || 1)) * 10) / 10
    }));

    return res.json({
      totalSignups: totalSignupsRow?.count ?? 0,
      totalResults: totalResultsRow?.count ?? 0,
      averagePercentage: totalResultsRow?.avgPct ? Math.round(totalResultsRow.avgPct * 10) / 10 : 0,
      answerDistribution,
      sectionAverages,
      recentResults
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

app.get('/api/admin/result/:id', requireAdminAuth, async (req, res) => {
  try {
    const db = await dbPromise;
    const row = await db.get(
      `SELECT id, email, name, company, role, percentage, tier_name, submitted_at,
        section_scores_json, recommendations_json, answers_json
       FROM quiz_results
       WHERE id = ?`,
      [req.params.id]
    );

    if (!row) {
      return res.status(404).json({ error: 'Result not found' });
    }

    return res.json({
      ...row,
      section_scores: JSON.parse(row.section_scores_json || '{}'),
      recommendations: JSON.parse(row.recommendations_json || '[]'),
      answers: JSON.parse(row.answers_json || '[]')
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load result' });
  }
});

app.get('/api/admin/export', requireAdminAuth, async (_req, res) => {
  try {
    const db = await dbPromise;
    const includeFull = String(_req.query.full || '') === '1';
    const rows = await db.all(`
      SELECT email, name, company, role, total_score, max_score, percentage, tier_name, submitted_at,
        section_scores_json, recommendations_json, answers_json
      FROM quiz_results
      ORDER BY submitted_at DESC
    `);

    const header = [
      'email',
      'name',
      'company',
      'role',
      'total_score',
      'max_score',
      'percentage',
      'tier_name',
      'submitted_at'
    ];
    if (includeFull) {
      header.push('section_scores_json', 'recommendations_json', 'answers_json');
    }
    const lines = [header.join(',')];
    rows.forEach(row => {
      const values = header.map(key => {
        const value = row[key] ?? '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      lines.push(values.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="quiz-results${includeFull ? '-full' : ''}.csv"`);
    return res.send(lines.join('\n'));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to export data' });
  }
});

app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});

