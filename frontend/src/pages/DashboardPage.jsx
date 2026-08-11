import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { useAuth, API } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const categoryLabels = {
  phishing: '🎣 Phishing', password: '🔐 Password',
  'social-engineering': '🧠 Social Eng.', network: '📶 Network',
  malware: '🦠 Malware', browsing: '🌐 Browsing',
  mobile: '📱 Mobile', privacy: '🔒 Privacy',
  payments: '💳 Payments', 'cyber-laws': '⚖️ Cyber Laws',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [history,     setHistory]     = useState([]);
  const [histLoading, setHistLoading] = useState(true);

  // Fetch quiz history. Called on mount AND whenever the user object changes
  // (which happens immediately after quiz submission via updateUser in QuizPage).
  const fetchHistory = useCallback(() => {
    setHistLoading(true);
    API.get('/quiz/history')
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setHistLoading(false));
  }, []);

  // Re-fetch history whenever user stats change (quizzesTaken is the signal)
  useEffect(() => {
    fetchHistory();
  }, [user?.quizzesTaken, fetchHistory]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const recentResults = history.slice(0, 5);

  // Accuracy trend — show last 5 quizzes in chronological order
  const chartData = [...recentResults].reverse().map((r, i) => ({
    name:     `Q${i + 1}`,
    accuracy: r.accuracy,
    score:    r.score,
  }));

  // Category radar — from live user.categoryStats (updated by backend on submit)
  const radarData = Object.entries(user?.categoryStats || {}).map(([k, v]) => ({
    subject: categoryLabels[k]?.replace(/^[^\s]+\s/, '') || k.substring(0, 6),
    value:   v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
  }));

  const statCards = [
    {
      label: t('dashboard.totalScore'),
      value: user?.totalScore ?? 0,
      icon: '⚡', color: 'text-cyber-accent', bg: 'bg-cyber-accent/10',
      unit: t('common.points'),
    },
    {
      label: t('dashboard.accuracy'),
      value: `${user?.accuracy ?? 0}%`,
      icon: '🎯', color: 'text-cyber-green', bg: 'bg-cyber-green/10',
      unit: '',
    },
    {
      label: t('dashboard.quizzesTaken'),
      value: user?.quizzesTaken ?? 0,
      icon: '📋', color: 'text-blue-400', bg: 'bg-blue-400/10',
      unit: '',
    },
    {
      label: 'Badges',
      value: user?.badges?.length ?? 0,
      icon: '🏅', color: 'text-yellow-400', bg: 'bg-yellow-400/10',
      unit: '',
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-cyber text-2xl font-bold text-white">
              {t('dashboard.title')}
            </h1>
            <p className="text-cyber-muted font-mono-cyber text-xs tracking-widest mt-1">
              AGENT: {user?.username?.toUpperCase()} • LEVEL: {user?.level?.toUpperCase()}
            </p>
          </div>
          <Link to="/quiz">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="cyber-btn-primary px-6 py-2.5 rounded-lg text-sm">
              🎯 {t('dashboard.startQuiz')}
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="cyber-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-cyber-muted text-xs font-mono-cyber tracking-wider">{card.label}</p>
                <p className={`font-cyber text-2xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                  <span className="text-xs ml-1 opacity-70">{card.unit}</span>
                </p>
              </div>
              <div className={`${card.bg} p-2 rounded-lg text-xl`}>{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Accuracy trend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="cyber-card p-5">
          <h3 className="font-cyber text-sm text-cyber-accent tracking-widest mb-4">ACCURACY TREND</h3>
          {histLoading ? (
            <div className="flex items-center justify-center h-44">
              <div className="w-8 h-8 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00f5d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f5d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize:11, fontFamily:'Share Tech Mono' }}/>
                <YAxis stroke="#64748b" tick={{ fontSize:11, fontFamily:'Share Tech Mono' }} domain={[0,100]}/>
                <Tooltip contentStyle={{ background:'#0f1629', border:'1px solid #1a2744', borderRadius:8, fontFamily:'Rajdhani' }}/>
                <Area type="monotone" dataKey="accuracy" stroke="#00f5d4" fill="url(#accGrad)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-44 text-cyber-muted text-sm">
              No quiz data yet.{' '}
              <Link to="/quiz" className="text-cyber-accent ml-2 hover:underline">Take a quiz!</Link>
            </div>
          )}
        </motion.div>

       {/* Category performance */}
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
  className="cyber-card p-5">
  <h3 className="font-cyber text-sm text-cyber-accent tracking-widest mb-4">CATEGORY PERFORMANCE</h3>
  {user?.categoryStats && Object.keys(user.categoryStats).length > 0 ? (
    <ResponsiveContainer width="100%" height={180}>
      <RadarChart data={Object.entries(user.categoryStats).map(([k, v]) => ({
        subject: categoryLabels[k]?.split(' ')[1] || k.substring(0, 6),
        value: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0
      }))}>
        <PolarGrid stroke="#1a2744" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'Share Tech Mono' }} />
        <Radar name="Accuracy" dataKey="value" stroke="#00f5d4" fill="#00f5d4" fillOpacity={0.2} />
      </RadarChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex items-center justify-center h-44 text-cyber-muted text-sm text-center">
      Complete quizzes to see<br />your category performance
    </div>
  )}
</motion.div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weak areas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="cyber-card p-5">
          <h3 className="font-cyber text-sm text-cyber-red tracking-widest mb-4">
            ⚠️ {t('dashboard.improvement')}
          </h3>
          {user?.weakCategories?.length > 0 ? (
            <div className="space-y-2">
              {user.weakCategories.map(cat => (
                <div key={cat}
                  className="flex items-center justify-between p-3 bg-cyber-red/5 border border-cyber-red/20 rounded-lg">
                  <span className="text-sm text-cyber-text">{categoryLabels[cat] || cat}</span>
                  <Link to={`/quiz?category=${cat}`}>
                    <button className="text-xs cyber-btn py-1 px-3 border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-white">
                      PRACTICE
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-cyber-green/5 border border-cyber-green/20 rounded-lg">
              <span className="text-2xl">🎉</span>
              <p className="text-cyber-green text-sm">{t('dashboard.noWeakAreas')}</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="cyber-card p-5">
          <h3 className="font-cyber text-sm text-cyber-accent tracking-widest mb-4">
            📋 {t('dashboard.recentActivity')}
          </h3>
          {histLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="w-6 h-6 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : recentResults.length > 0 ? (
            <div className="space-y-2">
              {recentResults.map((r, i) => (
                <div key={i}
                  className="flex items-center justify-between p-3 bg-cyber-border/30 rounded-lg">
                  <div>
                    <p className="text-sm text-cyber-text capitalize">
                      {categoryLabels[r.category] || r.category}
                    </p>
                    <p className="text-xs text-cyber-muted">
                      {new Date(r.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${
                      r.accuracy >= 70 ? 'badge-green' :
                      r.accuracy >= 50 ? 'badge-yellow' : 'badge-red'
                    }`}>
                      {r.accuracy}%
                    </span>
                    <p className="text-xs text-cyber-muted mt-1">+{r.score} pts</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-cyber-muted">
              <p className="text-3xl mb-2">🎮</p>
              <p className="text-sm">No activity yet. Start your first quiz!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Badges ── */}
      {user?.badges?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="cyber-card p-5">
          <h3 className="font-cyber text-sm text-cyber-yellow tracking-widest mb-4">🏅 EARNED BADGES</h3>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((badge, i) => (
              <div key={i} className="badge badge-yellow text-sm py-2 px-4">
                🏅 {badge.name}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}