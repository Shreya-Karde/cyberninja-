import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATS = [
  'phishing','password','social-engineering','network','malware',
  'browsing','mobile','privacy','payments','cyber-laws',
];
const LEVELS = ['beginner','intermediate','expert'];

const EMPTY_Q = {
  category:    'phishing',
  level:       'beginner',
  question:    { en:'', hi:'', mr:'' },
  options: [
    { en:'', hi:'', mr:'' },
    { en:'', hi:'', mr:'' },
    { en:'', hi:'', mr:'' },
    { en:'', hi:'', mr:'' },
  ],
  correctAnswer: 0,
  explanation: { en:'', hi:'', mr:'' },
  image:  '',
  points: 10,
};

// ── Question Form ──────────────────────────────────────────────────────────────
function QuestionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_Q);
  const [tab,  setTab]  = useState('en');
  const langs     = ['en','hi','mr'];
  const langNames = { en:'English', hi:'हिंदी', mr:'मराठी' };

  const setQ   = (lang, val)    => setForm(f => ({ ...f, question:    { ...f.question,    [lang]: val } }));
  const setExp = (lang, val)    => setForm(f => ({ ...f, explanation: { ...f.explanation, [lang]: val } }));
  const setOpt = (i, lang, val) => setForm(f => {
    const opts = f.options.map((o, j) => j === i ? { ...o, [lang]: val } : o);
    return { ...f, options: opts };
  });

  const handleLevel = v => setForm(f => ({
    ...f,
    level:  v,
    points: v === 'beginner' ? 10 : v === 'intermediate' ? 20 : 30,
  }));

  const valid =
    form.question.en.trim() &&
    form.options.every(o => o.en.trim()) &&
    form.explanation.en.trim();

  return (
    <div className="cyber-card p-5 border-cyber-accent/30 space-y-4">
      <h3 className="font-cyber text-cyber-accent text-xs tracking-widest">
        {initial ? 'EDIT QUESTION' : 'ADD NEW QUESTION'}
      </h3>

      {/* Category + Level + Correct Answer */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-mono-cyber text-cyber-muted mb-1">CATEGORY</label>
          <select className="cyber-input text-sm" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono-cyber text-cyber-muted mb-1">DIFFICULTY</label>
          <select className="cyber-input text-sm" value={form.level}
            onChange={e => handleLevel(e.target.value)}>
            {LEVELS.map(l => (
              <option key={l} value={l}>
                {l} ({l==='beginner' ? 10 : l==='intermediate' ? 20 : 30}pts)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono-cyber text-cyber-muted mb-1">CORRECT OPTION</label>
          <select className="cyber-input text-sm" value={form.correctAnswer}
            onChange={e => setForm(f => ({ ...f, correctAnswer: +e.target.value }))}>
            {['A (Option 0)','B (Option 1)','C (Option 2)','D (Option 3)'].map((l, i) => (
              <option key={i} value={i}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex gap-2 border-b border-cyber-border pb-2">
        {langs.map(l => (
          <button key={l} onClick={() => setTab(l)}
            className={`px-3 py-1 text-xs font-mono-cyber rounded transition-all ${
              tab === l
                ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/50'
                : 'text-cyber-muted hover:text-cyber-text'
            }`}>
            {langNames[l]}
          </button>
        ))}
        <span className="ml-auto text-xs text-cyber-muted self-center">
          * English required. Hindi/Marathi optional.
        </span>
      </div>

      {/* Question text */}
      <div>
        <label className="block text-xs font-mono-cyber text-cyber-muted mb-1">
          QUESTION TEXT ({tab.toUpperCase()}) {tab==='en' && <span className="text-cyber-red">*</span>}
        </label>
        <textarea
          className="cyber-input text-sm h-20 resize-none"
          placeholder={`Question in ${langNames[tab]}`}
          value={form.question[tab]}
          onChange={e => setQ(tab, e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="block text-xs font-mono-cyber text-cyber-muted">
          OPTIONS ({tab.toUpperCase()}) — option marked as CORRECT above will be the answer
        </label>
        {form.options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono-cyber font-bold flex-shrink-0 border ${
              form.correctAnswer === i
                ? 'bg-cyber-green/20 border-cyber-green text-cyber-green'
                : 'border-cyber-border text-cyber-muted'
            }`}>
              {String.fromCharCode(65 + i)}
            </div>
            <input
              className="cyber-input text-sm flex-1"
              placeholder={`Option ${String.fromCharCode(65 + i)} in ${langNames[tab]}`}
              value={opt[tab]}
              onChange={e => setOpt(i, tab, e.target.value)}
            />
            {form.correctAnswer === i && (
              <span className="text-xs text-cyber-green font-mono-cyber flex-shrink-0">✓ CORRECT</span>
            )}
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-xs font-mono-cyber text-cyber-muted mb-1">
          EXPLANATION ({tab.toUpperCase()}) {tab==='en' && <span className="text-cyber-red">*</span>}
        </label>
        <textarea
          className="cyber-input text-sm h-16 resize-none"
          placeholder={`Explanation shown after answer in ${langNames[tab]}`}
          value={form.explanation[tab]}
          onChange={e => setExp(tab, e.target.value)}
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-mono-cyber text-cyber-muted mb-1">
          IMAGE URL (optional)
        </label>
        <input
          className="cyber-input text-sm"
          placeholder="https://example.com/screenshot.png"
          value={form.image}
          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
        />
        {form.image && (
          <img
            src={form.image} alt="Preview"
            className="mt-2 rounded-lg max-h-32 object-cover border border-cyber-border"
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* Points display */}
      <div className="p-3 bg-cyber-border/20 rounded-lg flex items-center gap-3">
        <span className="font-cyber text-cyber-accent text-lg">{form.points}</span>
        <span className="text-xs text-cyber-muted font-mono-cyber">
          POINTS PER CORRECT ANSWER (auto-set by difficulty)
        </span>
      </div>

      {!valid && (
        <p className="text-xs text-cyber-red font-mono-cyber">
          ⚠️ Please fill in question text, all 4 options, and explanation in English minimum.
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          className="cyber-btn-primary px-5 py-2 rounded-lg text-xs disabled:opacity-40">
          💾 SAVE QUESTION
        </button>
        <button onClick={onCancel} className="cyber-btn px-5 py-2 rounded-lg text-xs">
          CANCEL
        </button>
      </div>
    </div>
  );
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────
const TABS = ['stats','questions','articles','users'];

export default function AdminPage() {
  const { t }                       = useLanguage();
  const [tab,       setTab]         = useState('stats');
  const [stats,     setStats]       = useState(null);
  const [questions, setQuestions]   = useState([]);
  const [articles,  setArticles]    = useState([]);
  const [users,     setUsers]       = useState([]);
  const [loading,   setLoading]     = useState(false);
  const [showForm,  setShowForm]    = useState(false);
  const [editQ,     setEditQ]       = useState(null);
  const [filterCat, setFilterCat]   = useState('all');
  const [filterLvl, setFilterLvl]   = useState('all');

  // FIX: Load stats once on mount
  useEffect(() => { loadStats(); }, []);

  // FIX: Always reload when switching tabs — removed .length===0 guard
  // that caused stale cache (newly added questions never appeared)
  useEffect(() => {
    if (tab === 'questions') loadQuestions();
    if (tab === 'articles')  loadArticles();
    if (tab === 'users')     loadUsers();
  }, [tab]); // eslint-disable-line

  const loadStats = () =>
    API.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => {});

  // FIX: Return the promise so saveQuestion can await it
  const loadQuestions = () => {
    setLoading(true);
    return API.get('/admin/questions')
      .then(r => setQuestions(r.data))
      .catch(() => toast.error('Failed to load questions'))
      .finally(() => setLoading(false));
  };

  const loadArticles = () => {
    setLoading(true);
    return API.get('/admin/articles')
      .then(r => setArticles(r.data))
      .finally(() => setLoading(false));
  };

  const loadUsers = () => {
    setLoading(true);
    return API.get('/admin/users')
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false));
  };

  // FIX: await loadQuestions so list refreshes immediately after save
  const saveQuestion = async (form) => {
    try {
      if (editQ) {
        await API.put(`/admin/questions/${editQ._id}`, form);
        toast.success('Question updated! ✅');
      } else {
        await API.post('/admin/questions', form);
        toast.success('Question added! ✅ It will now appear in the quiz.');
      }
      setShowForm(false);
      setEditQ(null);
      await loadQuestions(); // FIX: await so spinner shows until list is fresh
      loadStats();           // refresh question count in stats tab
    } catch {
      toast.error('Failed to save question');
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await API.delete(`/admin/questions/${id}`);
      setQuestions(q => q.filter(x => x._id !== id));
      toast.success('Question deleted');
      loadStats();
    } catch {
      toast.error('Failed to delete question');
    }
  };

  const deleteArticle = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      await API.delete(`/admin/articles/${id}`);
      setArticles(a => a.filter(x => x._id !== id));
      toast.success('Article deleted');
    } catch {
      toast.error('Failed to delete article');
    }
  };

  const filteredQ = questions.filter(q =>
    (filterCat === 'all' || q.category === filterCat) &&
    (filterLvl === 'all' || q.level    === filterLvl)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cyber text-2xl font-bold text-white">ADMIN PANEL</h1>
        <p className="text-cyber-muted font-mono-cyber text-xs tracking-widest mt-1">
          🛡️ ADMINISTRATOR ACCESS ONLY
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t2 => (
          <button key={t2} onClick={() => setTab(t2)}
            className={`px-5 py-2 rounded-lg text-xs font-mono-cyber uppercase tracking-widest border transition-all ${
              tab === t2
                ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent'
                : 'border-cyber-border text-cyber-muted hover:border-cyber-accent/40'
            }`}>
            {t2}
          </button>
        ))}
      </div>

      {/* ── STATS ── */}
      {tab === 'stats' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats ? [
            { label:'Users',        value:stats.users,       icon:'👤', color:'text-blue-400'      },
            { label:'Questions',    value:stats.questions,   icon:'❓', color:'text-cyber-accent'  },
            { label:'Articles',     value:stats.articles,    icon:'📄', color:'text-cyber-green'   },
            { label:'Quiz Results', value:stats.quizResults, icon:'📊', color:'text-cyber-yellow'  },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card p-5 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className={`font-cyber text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-cyber-muted text-xs font-mono-cyber mt-1">{s.label}</p>
            </motion.div>
          )) : [...Array(4)].map((_, i) => (
            <div key={i} className="cyber-card p-5 h-28 animate-pulse"/>
          ))}
        </div>
      )}

      {/* ── QUESTIONS ── */}
      {tab === 'questions' && (
        <div className="space-y-4">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <select className="cyber-input text-sm w-40" value={filterCat}
              onChange={e => setFilterCat(e.target.value)}>
              <option value="all">All Categories</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="cyber-input text-sm w-36" value={filterLvl}
              onChange={e => setFilterLvl(e.target.value)}>
              <option value="all">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <span className="text-cyber-muted text-xs font-mono-cyber ml-auto">
              {filteredQ.length} / {questions.length} questions
            </span>

            {/* FIX: Manual refresh button */}
            <button
              onClick={loadQuestions}
              disabled={loading}
              className="cyber-btn px-4 py-2 rounded-lg text-xs disabled:opacity-40">
              🔄 REFRESH
            </button>

            <button
              onClick={() => { setShowForm(!showForm); setEditQ(null); }}
              className="cyber-btn-primary px-4 py-2 rounded-lg text-xs">
              {showForm ? '✕ CANCEL' : '+ ADD QUESTION'}
            </button>
          </div>

          {/* Add form */}
          {showForm && !editQ && (
            <QuestionForm
              onSave={saveQuestion}
              onCancel={() => { setShowForm(false); setEditQ(null); }}
            />
          )}

          {/* Questions list */}
          {loading ? (
            <div className="text-center py-10 text-cyber-muted font-mono-cyber">
              LOADING...
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredQ.map((q, i) => (
                <motion.div key={q._id}
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay: i * 0.01 }}
                  className="cyber-card p-4">
                  {editQ?._id === q._id ? (
                    <QuestionForm
                      initial={editQ}
                      onSave={saveQuestion}
                      onCancel={() => setEditQ(null)}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 flex-wrap mb-1.5">
                          <span className="badge badge-blue">{q.category}</span>
                          <span className={`badge ${
                            q.level === 'beginner'     ? 'badge-green'  :
                            q.level === 'intermediate' ? 'badge-yellow' : 'badge-red'
                          }`}>
                            {q.level}
                          </span>
                          <span className="badge badge-purple">{q.points}pts</span>
                          <span className="text-xs text-cyber-accent font-mono-cyber self-center">
                            ✓ {['A','B','C','D'][q.correctAnswer]}
                          </span>
                        </div>
                        <p className="text-sm text-cyber-text line-clamp-2">
                          {q.question?.en}
                        </p>
                        {q.image && (
                          <p className="text-xs text-cyber-muted mt-1">📷 Has image</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => { setEditQ(q); setShowForm(false); }}
                          className="text-cyber-accent hover:bg-cyber-accent/10 p-1.5 rounded transition-colors text-xs">
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteQuestion(q._id)}
                          className="text-cyber-red hover:bg-cyber-red/10 p-1.5 rounded transition-colors text-xs">
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {filteredQ.length === 0 && !loading && (
                <div className="text-center py-8 text-cyber-muted font-mono-cyber text-sm">
                  No questions found for selected filters.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── ARTICLES ── */}
      {tab === 'articles' && (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-cyber-muted">Loading...</div>
          ) : (
            articles.map((a, i) => (
              <motion.div key={a._id}
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ delay: i * 0.05 }}
                className="cyber-card p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="text-sm text-white">{a.title?.en}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="badge badge-blue">{a.category}</span>
                      <span className="text-xs text-cyber-muted font-mono-cyber">
                        {a.readTime} min
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteArticle(a._id)}
                  className="text-cyber-red hover:bg-cyber-red/10 p-1.5 rounded transition-colors text-xs">
                  🗑️
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-10 text-cyber-muted">Loading...</div>
          ) : (
            users.map((u2, i) => (
              <motion.div key={u2._id}
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ delay: i * 0.03 }}
                className="cyber-card p-4 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {u2.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white">{u2.username}</p>
                    <p className="text-xs text-cyber-muted">{u2.email}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`badge ${u2.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>
                    {u2.role}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-cyber-muted font-mono-cyber capitalize">
                  {u2.level}
                </div>
                <div className="col-span-1 font-cyber text-cyber-accent text-sm">
                  {u2.totalScore}
                </div>
                <div className="col-span-2 text-xs text-cyber-muted">
                  {u2.quizzesTaken} quizzes
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}