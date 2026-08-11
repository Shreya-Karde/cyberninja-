import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'all',                label:'🌐 All Categories' },
  { value:'phishing',           label:'🎣 Phishing & Email Scams' },
  { value:'password',           label:'🔐 Password Security' },
  { value:'social-engineering', label:'🧠 Social Engineering' },
  { value:'network',            label:'📶 Network Security' },
  { value:'malware',            label:'🦠 Malware & Ransomware' },
  { value:'browsing',           label:'🌐 Safe Browsing' },
  { value:'mobile',             label:'📱 Mobile Security' },
  { value:'privacy',            label:'🔒 Data Privacy' },
  { value:'payments',           label:'💳 Digital Payments' },
  { value:'cyber-laws',         label:'⚖️ Cyber Laws' },
];

const SWIPE_MAP  = { right:0, left:1, up:2, down:3 };
const TIMER_SECS = 15;

const UI = {
  en: {
    title:'CYBER QUIZ', configure:'CONFIGURE YOUR SESSION',
    selectCategory:'SELECT CATEGORY', difficulty:'DIFFICULTY LEVEL',
    quizMode:'QUIZ MODE', practice:'PRACTICE', practiceDesc:'No timer · Learn freely',
    challenge:'CHALLENGE', challengeDesc:'15 sec/question',
    swipeControls:'SWIPE CONTROLS', startQuiz:'START QUIZ', loading:'LOADING...',
    question:'Question', of:'of', timed:'TIMED',
    swipeHint:'SWIPE ← → ↑ ↓ or TAP to answer',
    correct:'CORRECT!', incorrect:'INCORRECT!', timesUp:"TIME'S UP!",
    next:'NEXT', finish:'FINISH QUIZ',
    results:'QUIZ RESULTS', score:'Score', correctAns:'Correct',
    grade:'Grade', feedback:'FEEDBACK', topicPerf:'TOPIC PERFORMANCE',
    suggestions:'SUGGESTIONS', retake:'RETAKE', dashboard:'Dashboard',
    categoryLabel:'Category', levelLabel:'Difficulty', modeLabel:'Mode',
    timeLabel:'Time Taken',
    s90:'Outstanding! Try Expert difficulty next.',
    s70:'Good job! Review explanations for wrong answers and retry.',
    s50:'Read the Learning section for this topic, then retry.',
    s0:'Study the articles thoroughly before attempting again.',
    beginner:'Beginner', intermediate:'Intermediate', expert:'Expert',
    practice2:'Practice', challenge2:'Challenge',
  },
  hi: {
    title:'साइबर क्विज़', configure:'सत्र कॉन्फ़िगर करें',
    selectCategory:'श्रेणी चुनें', difficulty:'कठिनाई स्तर',
    quizMode:'क्विज़ मोड', practice:'अभ्यास', practiceDesc:'कोई टाइमर नहीं · स्वतंत्र रूप से सीखें',
    challenge:'चुनौती', challengeDesc:'15 सेकंड/प्रश्न',
    swipeControls:'स्वाइप नियंत्रण', startQuiz:'क्विज़ शुरू करें', loading:'लोड हो रहा है...',
    question:'प्रश्न', of:'में से', timed:'समयबद्ध',
    swipeHint:'← → ↑ ↓ स्वाइप करें या टैप करें',
    correct:'सही!', incorrect:'गलत!', timesUp:'समय समाप्त!',
    next:'अगला', finish:'क्विज़ समाप्त करें',
    results:'क्विज़ परिणाम', score:'स्कोर', correctAns:'सही',
    grade:'ग्रेड', feedback:'प्रतिक्रिया', topicPerf:'विषय प्रदर्शन',
    suggestions:'सुझाव', retake:'फिर से दें', dashboard:'डैशबोर्ड',
    categoryLabel:'श्रेणी', levelLabel:'कठिनाई', modeLabel:'मोड',
    timeLabel:'समय लिया',
    s90:'शानदार! अब एक्सपर्ट स्तर आज़माएं।',
    s70:'अच्छा काम! गलत उत्तरों की व्याख्या देखें और पुनः प्रयास करें।',
    s50:'इस विषय के लर्निंग अनुभाग को पढ़ें, फिर क्विज़ दोबारा दें।',
    s0:'दोबारा क्विज़ देने से पहले लेख अच्छी तरह पढ़ें।',
    beginner:'शुरुआती', intermediate:'मध्यवर्ती', expert:'विशेषज्ञ',
    practice2:'अभ्यास', challenge2:'चुनौती',
  },
  mr: {
    title:'सायबर प्रश्नमंजुषा', configure:'सत्र कॉन्फिगर करा',
    selectCategory:'श्रेणी निवडा', difficulty:'अडचण पातळी',
    quizMode:'प्रश्नमंजुषा मोड', practice:'सराव', practiceDesc:'कोणताही टाइमर नाही · मुक्तपणे शिका',
    challenge:'आव्हान', challengeDesc:'15 सेकंद/प्रश्न',
    swipeControls:'स्वाइप नियंत्रणे', startQuiz:'प्रश्नमंजुषा सुरू करा', loading:'लोड होत आहे...',
    question:'प्रश्न', of:'पैकी', timed:'वेळबद्ध',
    swipeHint:'← → ↑ ↓ स्वाइप करा किंवा टॅप करा',
    correct:'बरोबर!', incorrect:'चुकीचे!', timesUp:'वेळ संपला!',
    next:'पुढे', finish:'प्रश्नमंजुषा संपवा',
    results:'प्रश्नमंजुषा निकाल', score:'गुण', correctAns:'बरोबर',
    grade:'श्रेणी', feedback:'अभिप्राय', topicPerf:'विषय कामगिरी',
    suggestions:'सूचना', retake:'पुन्हा द्या', dashboard:'डॅशबोर्ड',
    categoryLabel:'श्रेणी', levelLabel:'अडचण', modeLabel:'मोड',
    timeLabel:'लागलेला वेळ',
    s90:'अप्रतिम! आता तज्ञ पातळी वापरून पहा.',
    s70:'चांगले काम! चुकीच्या उत्तरांचे स्पष्टीकरण पहा आणि पुन्हा प्रयत्न करा.',
    s50:'या विषयाचा शिकण्याचा विभाग वाचा, नंतर पुन्हा प्रयत्न करा.',
    s0:'पुन्हा प्रयत्न करण्यापूर्वी लेख नीट वाचा.',
    beginner:'नवशिक्या', intermediate:'मध्यवर्ती', expert:'तज्ञ',
    practice2:'सराव', challenge2:'आव्हान',
  },
};

// ── useUI: returns UI labels for the active language ──────────────────────────
function useUI() {
  const { language } = useLanguage();
  return UI[language] || UI.en;
}

// ── FIX: getLangText — resolves multilingual field to a string ────────────────
// Handles: plain string, { en, hi, mr } object, or missing/null
function getLangText(field, lang) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field[lang] || field['en'] || Object.values(field).find(v => v) || '';
  }
  return String(field);
}

// ── FIX: getOptions — resolves options array for the active language ──────────
// Handles: array of { en, hi, mr } objects (DB format) or array of strings
function getOptions(options, lang) {
  if (!options || !Array.isArray(options)) return [];
  return options.map(opt => getLangText(opt, lang));
}

// ── TimerRing ─────────────────────────────────────────────────────────────────
function TimerRing({ seconds, total }) {
  const r    = 20;
  const circ = 2 * Math.PI * r;
  const off  = circ - (seconds / total) * circ;
  const color = seconds > 8 ? '#00f5d4' : seconds > 4 ? '#ffd60a' : '#ff2d55';
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#1a2744" strokeWidth="4"/>
        <motion.circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circ}
          animate={{ strokeDashoffset: off }}
          transition={{ duration:0.9, ease:'linear' }}/>
      </svg>
      <span className="font-cyber text-sm font-bold" style={{ color }}>{seconds}</span>
    </div>
  );
}

// ── CircularAccuracy ───────────────────────────────────────────────────────────
function CircularAccuracy({ accuracy }) {
  const r    = 54;
  const circ = 2 * Math.PI * r;
  const off  = circ - (accuracy / 100) * circ;
  const col  = accuracy >= 70 ? '#30d158' : accuracy >= 50 ? '#ffd60a' : '#ff2d55';
  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#1a2744" strokeWidth="10"/>
        <motion.circle cx="72" cy="72" r={r} fill="none" stroke={col} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration:1.5, ease:'easeOut' }}/>
      </svg>
      <div className="text-center">
        <span className="font-cyber text-3xl font-black" style={{ color:col }}>{accuracy}%</span>
        <p className="text-xs text-cyber-muted font-mono-cyber">ACCURACY</p>
      </div>
    </div>
  );
}

function fmtTime(ms) {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function getCatLabel(val) {
  return CATEGORIES.find(c => c.value === val)?.label || val;
}

// ── SetupScreen ───────────────────────────────────────────────────────────────
function SetupScreen({ category, setCategory, level, setLevel, mode, setMode, startQuiz, loading }) {
  const u = useUI();
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="font-cyber text-2xl font-bold text-white">{u.title}</h1>
        <p className="text-cyber-muted font-mono-cyber text-xs tracking-widest mt-1">{u.configure}</p>
      </div>
      <div className="cyber-card p-6 space-y-5">

        {/* Category */}
        <div>
          <label className="block text-xs font-mono-cyber text-cyber-muted mb-2 tracking-widest">
            {u.selectCategory}
          </label>
          <select className="cyber-input" value={category}
            onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-mono-cyber text-cyber-muted mb-2 tracking-widest">
            {u.difficulty}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v:'beginner',     icon:'🌱', pts:'10 pts' },
              { v:'intermediate', icon:'⚡', pts:'20 pts' },
              { v:'expert',       icon:'🔥', pts:'30 pts' },
            ].map(l => (
              <button key={l.v} onClick={() => setLevel(l.v)}
                className={`py-3 rounded-lg border text-sm font-mono-cyber uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                  level === l.v
                    ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent'
                    : 'border-cyber-border text-cyber-muted hover:border-cyber-accent/50'
                }`}>
                <span className="text-xl">{l.icon}</span>
                <span>{u[l.v] || l.v}</span>
                <span className="text-xs opacity-60">{l.pts}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <label className="block text-xs font-mono-cyber text-cyber-muted mb-2 tracking-widest">
            {u.quizMode}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMode('practice')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                mode === 'practice'
                  ? 'border-cyber-green bg-cyber-green/10 text-cyber-green'
                  : 'border-cyber-border text-cyber-muted hover:border-cyber-green/40'
              }`}>
              <span className="text-2xl">📖</span>
              <span className="font-mono-cyber text-sm">{u.practice}</span>
              <span className="text-xs opacity-60">{u.practiceDesc}</span>
            </button>
            <button onClick={() => setMode('challenge')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                mode === 'challenge'
                  ? 'border-cyber-red bg-cyber-red/10 text-cyber-red'
                  : 'border-cyber-border text-cyber-muted hover:border-cyber-red/40'
              }`}>
              <span className="text-2xl">⏱️</span>
              <span className="font-mono-cyber text-sm">{u.challenge}</span>
              <span className="text-xs opacity-60">{u.challengeDesc}</span>
            </button>
          </div>
        </div>

        {/* Swipe guide */}
        <div className="p-4 bg-cyber-accent/5 border border-cyber-accent/20 rounded-lg">
          <p className="text-xs text-cyber-accent font-mono-cyber mb-2 tracking-widest">
            🕹️ {u.swipeControls}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-cyber">
            {[
              { dir:'→ RIGHT', opt:'Option A' },
              { dir:'← LEFT',  opt:'Option B' },
              { dir:'↑ UP',    opt:'Option C' },
              { dir:'↓ DOWN',  opt:'Option D' },
            ].map(s => (
              <div key={s.dir} className="flex items-center gap-2 p-1.5 bg-cyber-border/20 rounded">
                <span className="font-bold text-cyber-accent">{s.dir}</span>
                <span className="text-cyber-muted">→ {s.opt}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button onClick={startQuiz} disabled={loading}
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          className="w-full cyber-btn-primary py-4 rounded-lg disabled:opacity-50 text-base font-cyber">
          {loading ? `⟳ ${u.loading}` : `🎯 ${u.startQuiz}`}
        </motion.button>
      </div>
    </div>
  );
}

// ── ResultScreen ──────────────────────────────────────────────────────────────
function ResultScreen({ results, questions, playedCategory, playedLevel, playedMode, onRetake, onDashboard }) {
  const u = useUI();
  if (!results) return null;

  const { accuracy, score, correct, total, feedback, timeTaken } = results;
  const grade      = accuracy >= 90 ? 'A+' : accuracy >= 70 ? 'B' : accuracy >= 50 ? 'C' : 'F';
  const gradeColor = accuracy >= 70 ? 'text-cyber-green' : accuracy >= 50 ? 'text-cyber-yellow' : 'text-cyber-red';

  const topicStats = {};
  questions.forEach(q => {
    if (!topicStats[q.category]) topicStats[q.category] = { correct:0, total:0 };
    topicStats[q.category].total++;
  });
  results.result?.answers?.forEach(a => {
    const q = questions.find(x => x._id === a.questionId);
    if (q && a.isCorrect) topicStats[q.category].correct++;
  });

  const suggestion = accuracy >= 90 ? u.s90 : accuracy >= 70 ? u.s70 : accuracy >= 50 ? u.s50 : u.s0;
  const levelLabel = { beginner:u.beginner, intermediate:u.intermediate, expert:u.expert };
  const modeLabel  = { practice:u.practice2, challenge:u.challenge2 };

  return (
    <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
      className="max-w-xl mx-auto space-y-5">

      <h1 className="font-cyber text-2xl font-bold text-white">{u.results}</h1>

      <div className="cyber-card p-8">
        <div className="mb-6"><CircularAccuracy accuracy={accuracy} /></div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { label:u.categoryLabel, value:getCatLabel(playedCategory) },
            { label:u.levelLabel,    value:levelLabel[playedLevel] || playedLevel },
            { label:u.modeLabel,     value:modeLabel[playedMode]   || playedMode  },
            { label:u.timeLabel,     value:fmtTime(timeTaken || 0) },
          ].map((m, i) => (
            <div key={i} className="p-2.5 bg-cyber-border/20 rounded-lg">
              <p className="text-xs text-cyber-muted font-mono-cyber">{m.label}</p>
              <p className="text-sm text-white font-semibold capitalize mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label:u.score,      value:`+${score}`, color:'text-cyber-accent' },
            { label:u.correctAns, value:`${correct}/${total}`, color:'text-cyber-green' },
            { label:u.grade,      value:grade, color:gradeColor },
          ].map((s, i) => (
            <div key={i} className="p-3 bg-cyber-border/20 rounded-lg text-center">
              <p className={`font-cyber text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-cyber-muted font-mono-cyber mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {feedback && (
          <div className="p-4 bg-cyber-accent/5 border border-cyber-accent/20 rounded-lg mb-5">
            <p className="text-xs font-mono-cyber text-cyber-accent mb-1">💬 {u.feedback}</p>
            <p className="text-sm text-cyber-text">{feedback}</p>
          </div>
        )}

        {Object.keys(topicStats).length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-mono-cyber text-cyber-muted tracking-widest mb-3">
              📊 {u.topicPerf}
            </p>
            <div className="space-y-2">
              {Object.entries(topicStats).map(([cat, s]) => {
                const pct  = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                const bCol = pct >= 70 ? '#30d158' : pct >= 50 ? '#ffd60a' : '#ff2d55';
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cyber-text capitalize">{cat.replace(/-/g,' ')}</span>
                      <span className="font-mono-cyber" style={{ color:bCol }}>{s.correct}/{s.total}</span>
                    </div>
                    <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background:bCol }}
                        initial={{ width:0 }}
                        animate={{ width:`${pct}%` }}
                        transition={{ duration:0.8, delay:0.1 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 bg-cyber-border/20 rounded-lg mb-5">
          <p className="text-xs font-mono-cyber text-cyber-muted tracking-widest mb-2">
            💡 {u.suggestions}
          </p>
          <p className="text-sm text-cyber-text">{suggestion}</p>
        </div>

        <div className="flex gap-3">
          <motion.button onClick={onRetake}
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            className="flex-1 cyber-btn py-3 rounded-lg text-sm">
            🔄 {u.retake}
          </motion.button>
          <motion.button onClick={onDashboard}
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
            className="flex-1 cyber-btn-primary py-3 rounded-lg text-sm">
            ⚡ {u.dashboard}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main QuizPage ─────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { language }         = useLanguage();
  const { user, updateUser } = useAuth();
  const navigate             = useNavigate();
  const [searchParams]       = useSearchParams();
  const u                    = useUI();

  const [phase,    setPhase]    = useState('setup');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [level,    setLevel]    = useState('beginner');
  const [mode,     setMode]     = useState('practice');

  const [playedCategory, setPlayedCategory] = useState('all');
  const [playedLevel,    setPlayedLevel]    = useState('beginner');
  const [playedMode,     setPlayedMode]     = useState('practice');

  const [questions,       setQuestions]       = useState([]);
  const [currentIdx,      setCurrentIdx]      = useState(0);
  const [selected,        setSelected]        = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers,         setAnswers]         = useState([]);
  const [swipeDir,        setSwipeDir]        = useState(null);
  const [results,         setResults]         = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [timeLeft,        setTimeLeft]        = useState(TIMER_SECS);

  const timerRef  = useRef(null);
  const startTime = useRef(Date.now());
  const quizStart = useRef(Date.now());

  const currentQ = questions[currentIdx];

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(TIMER_SECS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          handleAnswer(99);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]); // eslint-disable-line

  useEffect(() => {
    if (phase === 'quiz' && mode === 'challenge' && selected === null) startTimer();
    return clearTimer;
  }, [currentIdx, phase, mode, selected]); // eslint-disable-line

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/questions?category=${category}&level=${level}&limit=10`);
      if (res.data.length === 0) {
        toast.error('No questions found. Run: cd backend && npm run seed');
        return;
      }
      setQuestions(res.data);
      setCurrentIdx(0);
      setAnswers([]);
      setSelected(null);
      setShowExplanation(false);
      setSwipeDir(null);
      setResults(null);
      setPlayedCategory(category);
      setPlayedLevel(level);
      setPlayedMode(mode);
      startTime.current = Date.now();
      quizStart.current = Date.now();
      setPhase('quiz');
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback((optIndex) => {
    setSelected(prev => {
      if (prev !== null) return prev;
      clearTimer();
      setShowExplanation(true);
      const q = questions[currentIdx];
      if (!q) return prev;
      const isCorrect = optIndex === q.correctAnswer;
      setAnswers(old => [...old, {
        questionId:     q._id,
        selectedAnswer: optIndex,
        optionMap:      q._optionMap || [],
        isCorrect,
        timeTaken:      Date.now() - startTime.current,
      }]);
      return optIndex;
    });
  }, [questions, currentIdx, clearTimer]);

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => { if (selected === null) { setSwipeDir('right'); handleAnswer(SWIPE_MAP.right); } },
    onSwipedLeft:  () => { if (selected === null) { setSwipeDir('left');  handleAnswer(SWIPE_MAP.left);  } },
    onSwipedUp:    () => { if (selected === null) { setSwipeDir('up');    handleAnswer(SWIPE_MAP.up);    } },
    onSwipedDown:  () => { if (selected === null) { setSwipeDir('down');  handleAnswer(SWIPE_MAP.down);  } },
    preventScrollOnSwipe: true, trackMouse: true, delta: 50,
  });

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) { submitQuiz(); return; }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowExplanation(false);
    setSwipeDir(null);
    startTime.current = Date.now();
  };

  const submitQuiz = async () => {
    clearTimer();
    setLoading(true);
    try {
      const res = await API.post('/quiz/submit', {
        category: playedCategory,
        level:    playedLevel,
        mode:     playedMode,
        answers,
        timeTaken: Date.now() - quizStart.current,
      });
      setResults(res.data);
      const meRes = await API.get('/auth/me');
      updateUser(meRes.data);
      setPhase('result');
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (phase === 'setup') return (
    <SetupScreen
      category={category} setCategory={setCategory}
      level={level}       setLevel={setLevel}
      mode={mode}         setMode={setMode}
      startQuiz={startQuiz} loading={loading}
    />
  );

  if (phase === 'result') return (
    <ResultScreen
      results={results}
      questions={questions}
      playedCategory={playedCategory}
      playedLevel={playedLevel}
      playedMode={playedMode}
      onRetake={() => { clearTimer(); setPhase('setup'); setResults(null); }}
      onDashboard={() => { clearTimer(); navigate('/dashboard'); }}
    />
  );

  if (!currentQ) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyber-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="font-mono-cyber text-cyber-muted text-sm">{u.loading}</p>
      </div>
    </div>
  );

  const progress      = ((currentIdx + 1) / questions.length) * 100;
  const lang          = language; // live value — updates instantly on language change
  const optionLabels  = ['A', 'B', 'C', 'D'];
  const swipeDirs     = ['→', '←', '↑', '↓'];

  // FIX: Resolve all language-dependent fields here using live `lang`
  // Both helpers fall back to .en if selected language field is empty,
  // so questions with only English text still display correctly.
  const questionText    = getLangText(currentQ.question,    lang);
  const optionsArr      = getOptions(currentQ.options,      lang);
  const explanationText = getLangText(currentQ.explanation, lang);

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cyber text-cyber-accent text-sm tracking-widest">{u.title}</h2>
          <p className="text-cyber-muted text-xs font-mono-cyber capitalize mt-0.5">
            {getCatLabel(playedCategory)} · {playedLevel} · {playedMode}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono-cyber text-cyber-muted text-sm">
            {u.question} {currentIdx + 1} {u.of} {questions.length}
          </span>
          {mode === 'challenge' && selected === null && (
            <TimerRing seconds={timeLeft} total={TIMER_SECS} />
          )}
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-1.5">
        <div className="progress-bar">
          <motion.div className="progress-fill" animate={{ width:`${progress}%` }}/>
        </div>
        {mode === 'challenge' && (
          <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full transition-all duration-1000"
              animate={{ width:`${(timeLeft / TIMER_SECS) * 100}%` }}
              style={{ background: timeLeft > 8 ? '#00f5d4' : timeLeft > 4 ? '#ffd60a' : '#ff2d55' }}/>
          </div>
        )}
      </div>

        

      {/* FIX: Question card key includes `lang` so AnimatePresence
          remounts the card instantly on language change,
          triggering re-resolution of questionText / optionsArr / explanationText */}
      <AnimatePresence mode="wait">
        <motion.div key={`${currentIdx}-${lang}`}
          initial={{ opacity:0, x:60 }}
          animate={{ opacity:1, x:0 }}
          exit={{
            opacity:0,
            x:      swipeDir === 'right' ?  280 : swipeDir === 'left' ? -280 : 0,
            y:      swipeDir === 'up'    ? -180 : swipeDir === 'down' ?  180 : 0,
            rotate: swipeDir === 'right' ?    8 : swipeDir === 'left' ?   -8 : 0,
          }}
          transition={{ type:'spring', stiffness:300, damping:28 }}
          {...swipeHandlers}
          className="cyber-card p-6 swipe-card cursor-grab active:cursor-grabbing">

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`badge ${
              currentQ.level === 'beginner'     ? 'badge-green'  :
              currentQ.level === 'intermediate' ? 'badge-yellow' : 'badge-red'
            }`}>{currentQ.level?.toUpperCase()}</span>
            <span className="badge badge-blue">{currentQ.points} PTS</span>
            {mode === 'challenge' && (
              <span className="badge badge-red ml-auto">⏱ {u.timed}</span>
            )}
          </div>

          {/* Question text — updates instantly when lang changes */}
          <p className="text-base font-semibold text-cyber-text leading-relaxed mb-5">
            {questionText}
          </p>

          {/* Optional image */}
          {currentQ.image && (
            <div className="mb-4 rounded-lg overflow-hidden border border-cyber-border">
              <img src={currentQ.image} alt="Question" className="w-full h-44 object-cover"/>
            </div>
          )}

          {/* Options — resolved for active language, updates instantly */}
          <div className="space-y-2.5">
            {optionsArr.slice(0, 4).map((optText, i) => {
              let state = 'idle';
              if (selected !== null) {
                if (i === currentQ.correctAnswer) state = 'correct';
                else if (i === selected)          state = 'wrong';
                else                              state = 'dim';
              }
              return (
                <motion.button key={i} onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  whileHover={selected === null ? { x:3 } : {}}
                  whileTap={selected === null ? { scale:0.98 } : {}}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all text-sm flex items-center gap-3 ${
                    state === 'correct'
                      ? 'bg-cyber-green/15 border-cyber-green text-cyber-green'
                      : state === 'wrong'
                      ? 'bg-cyber-red/15 border-cyber-red text-cyber-red'
                      : state === 'dim'
                      ? 'border-cyber-border text-cyber-muted opacity-40'
                      : 'border-cyber-border text-cyber-text hover:border-cyber-accent/50 hover:bg-cyber-accent/5 cursor-pointer'
                  }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono-cyber font-bold flex-shrink-0 border ${
                    state === 'correct'
                      ? 'bg-cyber-green border-cyber-green text-black'
                      : state === 'wrong'
                      ? 'bg-cyber-red border-cyber-red text-white'
                      : state === 'dim'
                      ? 'border-cyber-border text-cyber-muted'
                      : 'border-cyber-accent/40 text-cyber-accent'
                  }`}>
                    {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : optionLabels[i]}
                  </span>
                  <span className="flex-1">{optText}</span>
                  {selected === null && (
                    <span className="text-xs font-mono-cyber flex-shrink-0 opacity-30 text-cyber-muted">
                      {swipeDirs[i]}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation — updates instantly when lang changes */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity:0, height:0 }}
                animate={{ opacity:1, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                className="mt-4 overflow-hidden">
                <div className={`p-4 rounded-lg border ${
                  selected === currentQ.correctAnswer
                    ? 'bg-cyber-green/10 border-cyber-green/30'
                    : 'bg-cyber-red/10 border-cyber-red/30'
                }`}>
                  <p className={`font-cyber text-xs tracking-widest mb-2 ${
                    selected === currentQ.correctAnswer ? 'text-cyber-green' : 'text-cyber-red'
                  }`}>
                    {selected === currentQ.correctAnswer
                      ? `✓ ${u.correct}`
                      : selected === 99 ? `⏱ ${u.timesUp}` : `✗ ${u.incorrect}`}
                  </p>
                  <p className="text-sm text-cyber-text/80 leading-relaxed">
                    💡 {explanationText}
                  </p>
                </div>
                <motion.button onClick={nextQuestion}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="w-full mt-3 cyber-btn-primary py-3 rounded-lg text-sm font-cyber">
                  {currentIdx + 1 >= questions.length ? `🏁 ${u.finish}` : `→ ${u.next}`}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-cyber-muted font-mono-cyber opacity-40">
        {u.swipeHint}
      </p>
    </div>
  );
}