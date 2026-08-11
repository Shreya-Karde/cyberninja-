import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { API } from '../context/AuthContext';

const SIM_META = {
  'phishing':           { icon: '🎣', color: '#ff2d55', badge: 'PHISHING',     bg: 'from-red-900/30' },
  'scam-call':          { icon: '📞', color: '#ffd60a', badge: 'VISHING',       bg: 'from-yellow-900/30' },
  'social-engineering': { icon: '🧠', color: '#7b2fff', badge: 'SOCIAL ENG.',   bg: 'from-purple-900/30' },
  'password-breach':    { icon: '🔓', color: '#ff9500', badge: 'PASSWORD',      bg: 'from-orange-900/30' },
  default:              { icon: '🛡️', color: '#00f5d4', badge: 'SIMULATION',    bg: 'from-cyan-900/30' },
};

function FakeEmailUI({ content }) {
  const lines = content.split('\n').filter(Boolean);
  const fromLine    = lines.find(l => l.startsWith('From:'));
  const subjectLine = lines.find(l => l.startsWith('Subject:'));
  const body        = lines.filter(l =>
    !l.startsWith('From:') && !l.startsWith('Subject:') &&
    !l.startsWith('📧') && l.trim() !== ''
  ).join('\n');

  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2a4e] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d1f] border-b border-[#2a2a4e]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"/>
          <div className="w-3 h-3 rounded-full bg-green-500/70"/>
        </div>
        <span className="text-[#555] text-xs font-mono-cyber ml-2">📧 Gmail — Inbox</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
          <span className="text-red-400 text-xs font-mono-cyber">UNREAD</span>
        </div>
      </div>
      <div className="px-4 py-3 bg-[#0f0f23] border-b border-[#2a2a4e] space-y-1.5">
        {fromLine && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-[#555] w-16 flex-shrink-0 font-mono-cyber mt-0.5">FROM</span>
            <span className="text-xs text-red-400 font-mono-cyber break-all">{fromLine.replace('From: ', '')}</span>
          </div>
        )}
        {subjectLine && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-[#555] w-16 flex-shrink-0 font-mono-cyber mt-0.5">SUBJECT</span>
            <span className="text-xs text-yellow-300 font-semibold">{subjectLine.replace('Subject: ', '')}</span>
          </div>
        )}
      </div>
      <div className="px-4 py-4 bg-[#0a0a1c]">
        <p className="text-sm text-[#ccc] leading-relaxed whitespace-pre-line font-body">{body}</p>
      </div>
    </div>
  );
}

function PhoneCallUI({ content }) {
  const lines = content.split('\n').filter(Boolean);
  const callLine = lines[0];
  const dialogue = lines.slice(1).join('\n');
  return (
    <div className="rounded-xl overflow-hidden border border-yellow-500/30 shadow-2xl">
      <div className="bg-[#0d0d1f] px-4 py-3 flex items-center justify-between border-b border-yellow-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 flex items-center justify-center text-xl">
            📞
          </div>
          <div>
            <p className="text-yellow-300 text-sm font-semibold font-mono-cyber">
              {callLine?.replace('📱 ', '').replace('INCOMING CALL', '').trim() || 'Incoming Call'}
            </p>
            <p className="text-[#888] text-xs font-mono-cyber">+91-9876-543210 · Unknown</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"/>
          <span className="text-yellow-400 text-xs font-mono-cyber">LIVE</span>
        </div>
      </div>
      <div className="bg-[#0a0a1c] px-4 py-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-sm flex-shrink-0">
            🎭
          </div>
          <div className="flex-1 bg-[#1a1a2e] rounded-xl rounded-tl-none p-3 border border-[#2a2a4e]">
            <p className="text-xs text-red-400 font-mono-cyber mb-2">FRAUDSTER (Rajesh / Bank Agent)</p>
            <p className="text-sm text-[#ddd] leading-relaxed whitespace-pre-line">{dialogue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericUI({ content, color }) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ background: `${color}08`, borderColor: `${color}30` }}
    >
      <p className="text-sm text-[#ddd] leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}

function StepUI({ content, simType, color }) {
  if (simType === 'phishing' && content.includes('From:')) {
    return <FakeEmailUI content={content} />;
  }
  if (simType === 'scam-call' || content.includes('INCOMING CALL')) {
    return <PhoneCallUI content={content} />;
  }
  return <GenericUI content={content} color={color} />;
}

function FeedbackPanel({ chosenSafe, step, lang, color }) {
  const choseCorrectly = chosenSafe;
  const resultText  = step.result?.[lang] || step.result?.en || '';
  const hintText    = step.hint?.[lang]   || step.hint?.en   || '';
  const safeLabel   = step.safeAction?.[lang] || step.safeAction?.en
    || hintText.split('.')[0]
    || 'Stop and verify before acting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-3"
    >
      {/* Verdict banner */}
      <div className={`rounded-xl p-4 border flex items-center gap-3 ${
        choseCorrectly
          ? 'bg-green-500/10 border-green-500/40'
          : 'bg-red-500/10 border-red-500/40'
      }`}>
        <span className="text-3xl">{choseCorrectly ? '✅' : '❌'}</span>
        <div>
          <p className={`font-cyber text-sm tracking-widest ${choseCorrectly ? 'text-green-400' : 'text-red-400'}`}>
            {choseCorrectly ? 'CORRECT — Safe Choice!' : 'WRONG — That was Risky!'}
          </p>
          <p className="text-xs text-[#888] font-mono-cyber mt-0.5">
            {choseCorrectly ? 'You made the right call.' : "Here's what you should have done instead:"}
          </p>
        </div>
      </div>

      {/* Correct answer reveal (only when wrong) */}
      {!choseCorrectly && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-4 border border-green-500/30 bg-green-500/5"
        >
          <p className="text-xs font-mono-cyber text-green-400 tracking-widest mb-2">✓ CORRECT ACTION WAS:</p>
          <p className="text-sm text-[#ddd]">🛡️ {safeLabel}</p>
        </motion.div>
      )}

      {/* Explanation */}
      {resultText && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: choseCorrectly ? 0.1 : 0.25 }}
          className="rounded-xl p-4 border border-[#2a2a4e] bg-[#0d0d1f]"
        >
          <p className="text-xs font-mono-cyber text-[#555] tracking-widest mb-2">📖 EXPLANATION</p>
          <p className="text-sm text-[#ccc] leading-relaxed whitespace-pre-line">{resultText}</p>
        </motion.div>
      )}

      {/* Hint */}
      {hintText && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: choseCorrectly ? 0.2 : 0.35 }}
          className="rounded-xl p-3 bg-cyan-500/5 border border-cyan-500/20"
        >
          <p className="text-xs text-cyan-400 leading-relaxed">💡 {hintText}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function SimulationRunner({ sim, onClose, language: lang }) {
  const [stepIdx,      setStepIdx]      = useState(0);
  const [chosenAction, setChosenAction] = useState(null); // null | 'safe' | 'risky'
  const [score,        setScore]        = useState(0);
  const [complete,     setComplete]     = useState(false);

  const meta     = SIM_META[sim.type] || SIM_META.default;
  const steps    = sim.steps || [];
  const step     = steps[stepIdx];
  const isLast   = stepIdx >= steps.length - 1;
  const answered = chosenAction !== null;
  const progress = ((stepIdx + (answered ? 1 : 0)) / steps.length) * 100;

  const handleChoice = (choseSafe) => {
    if (answered) return;
    setChosenAction(choseSafe ? 'safe' : 'risky');
    if (choseSafe) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (isLast) { setComplete(true); return; }
    setStepIdx(i => i + 1);
    setChosenAction(null);
  };

  if (complete) {
    const total = steps.length;
    const pct   = Math.round((score / total) * 100);
    const grade = pct === 100 ? '🏆 Perfect!' : pct >= 70 ? '✅ Good job!' : pct >= 40 ? '⚠️ Keep practising' : '🚨 Review needed';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card p-8 text-center max-w-xl mx-auto"
      >
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="font-cyber text-lg tracking-widest mb-1" style={{ color: meta.color }}>
          SIMULATION COMPLETE!
        </h2>
        <p className="text-[#888] text-xs font-mono-cyber mb-5">
          {sim.title?.[lang] || sim.title?.en}
        </p>
        <div className="rounded-xl p-4 border mb-5" style={{ background: `${meta.color}08`, borderColor: `${meta.color}30` }}>
          <p className="font-cyber text-3xl mb-1" style={{ color: meta.color }}>{score}/{total}</p>
          <p className="text-xs font-mono-cyber text-[#888]">correct decisions · {pct}% accuracy</p>
          <p className="text-sm mt-2 text-[#ccc]">{grade}</p>
        </div>
        <div className="rounded-xl p-5 border mb-6 text-left" style={{ background: `${meta.color}05`, borderColor: `${meta.color}20` }}>
          <p className="font-cyber text-xs tracking-widest mb-3" style={{ color: meta.color }}>🧠 KEY LESSON</p>
          <p className="text-sm text-[#ddd] leading-relaxed">{sim.lesson?.[lang] || sim.lesson?.en}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setStepIdx(0); setChosenAction(null); setScore(0); setComplete(false); }}
            className="flex-1 cyber-btn py-2.5 text-xs rounded-lg"
          >
            🔄 RESTART
          </button>
          <button onClick={onClose} className="flex-1 cyber-btn-primary py-2.5 text-xs rounded-lg">
            ← BACK
          </button>
        </div>
      </motion.div>
    );
  }

  if (!step) return null;

  const content = step.content?.[lang] || step.content?.en || '';
  const choseSafe = chosenAction === 'safe';

  const safeButtonLabel  = step.safeLabel?.[lang] || step.safeLabel?.en || 'Stop and verify before acting';
  const riskyButtonLabel = step.action?.includes('?')
    ? step.action.replace('?', '').trim() + ' — Yes, do it'
    : `Proceed with: ${step.action || 'Continue without caution'}`;

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-[#555] hover:text-cyber-accent text-sm font-mono-cyber transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-cyber text-[#555]">
            Score: <span className="text-cyber-accent">{score}/{stepIdx + (answered ? 1 : 0)}</span>
          </span>
          <span className="badge" style={{ background: `${meta.color}20`, borderColor: `${meta.color}50`, color: meta.color }}>
            {meta.badge}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono-cyber text-[#555]">
          <span>Step {stepIdx + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="h-full rounded-full"
            style={{ background: meta.color }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="space-y-4"
        >
          <StepUI content={content} simType={sim.type} color={meta.color} />

          {/* BEFORE answer — neutral identical buttons */}
          {!answered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs font-mono-cyber text-[#888] tracking-widest text-center">
                ── WHAT DO YOU DO? ──
              </p>

              <motion.button
                onClick={() => handleChoice(false)}
                whileHover={{ borderColor: '#ffffff25', backgroundColor: '#ffffff08' }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 rounded-xl border border-[#2a2a4e] bg-[#0d0d1f] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#555] text-xs font-mono-cyber mt-1 w-6 flex-shrink-0">A</span>
                  <p className="text-sm text-[#ccc]">{riskyButtonLabel}</p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleChoice(true)}
                whileHover={{ borderColor: '#ffffff25', backgroundColor: '#ffffff08' }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 rounded-xl border border-[#2a2a4e] bg-[#0d0d1f] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#555] text-xs font-mono-cyber mt-1 w-6 flex-shrink-0">B</span>
                  <p className="text-sm text-[#ccc]">{safeButtonLabel}</p>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* AFTER answer — locked + feedback */}
          {answered && (
            <div className="space-y-3">

              {/* Locked buttons — neutral, only chosen is highlighted */}
              <div className="space-y-2">
                <div className={`w-full text-left p-4 rounded-xl border transition-all ${
                  chosenAction === 'risky'
                    ? 'border-[#ffffff30] bg-[#ffffff0a]'
                    : 'border-[#1a1a2e] bg-[#0d0d1f] opacity-40'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-[#555] text-xs font-mono-cyber mt-1 w-6 flex-shrink-0">A</span>
                    <div className="flex-1">
                      <p className="text-sm text-[#ccc]">{riskyButtonLabel}</p>
                      {chosenAction === 'risky' && (
                        <p className="text-xs font-mono-cyber text-[#666] mt-1">← YOUR CHOICE</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`w-full text-left p-4 rounded-xl border transition-all ${
                  chosenAction === 'safe'
                    ? 'border-[#ffffff30] bg-[#ffffff0a]'
                    : 'border-[#1a1a2e] bg-[#0d0d1f] opacity-40'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-[#555] text-xs font-mono-cyber mt-1 w-6 flex-shrink-0">B</span>
                    <div className="flex-1">
                      <p className="text-sm text-[#ccc]">{safeButtonLabel}</p>
                      {chosenAction === 'safe' && (
                        <p className="text-xs font-mono-cyber text-[#666] mt-1">← YOUR CHOICE</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <FeedbackPanel
                chosenSafe={choseSafe}
                step={step}
                lang={lang}
                color={meta.color}
              />

              <motion.button
                onClick={handleNext}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cyber-btn-primary py-3 rounded-xl text-xs"
              >
                {isLast ? '🎓 See Results' : '→ Next Step'}
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SimCard({ sim, onStart, lang }) {
  const meta = SIM_META[sim.type] || SIM_META.default;
  const diffColor = {
    beginner:     'badge-green',
    intermediate: 'badge-yellow',
    expert:       'badge-red',
  }[sim.difficulty] || 'badge-blue';

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: `${meta.color}50` }}
      transition={{ duration: 0.2 }}
      className={`cyber-card overflow-hidden bg-gradient-to-br ${meta.bg} to-cyber-card`}
    >
      <div className="h-1 w-full" style={{ background: meta.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`badge ${diffColor}`}>{sim.difficulty?.toUpperCase()}</span>
          <span
            className="badge text-xs"
            style={{ background: `${meta.color}20`, borderColor: `${meta.color}50`, color: meta.color }}
          >
            {meta.badge}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">
              {sim.title?.[lang] || sim.title?.en}
            </h3>
            <p className="text-xs text-[#888] mt-0.5">
              {sim.steps?.length || 0} interactive steps
            </p>
          </div>
        </div>
        <p className="text-sm text-[#999] mb-4 leading-relaxed">
          {sim.description?.[lang] || sim.description?.en}
        </p>
        <div className="flex items-center gap-1.5 mb-4">
          {(sim.steps || []).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: `${meta.color}30` }}
            />
          ))}
        </div>
        <motion.button
          onClick={() => onStart(sim)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-xl text-xs font-cyber tracking-wider border transition-all"
          style={{
            background: `${meta.color}15`,
            borderColor: `${meta.color}50`,
            color: meta.color,
          }}
        >
          ▶ START SIMULATION
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SimulationPage() {
  const { t, language } = useLanguage();
  const [simulations, setSimulations] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [active,      setActive]      = useState(null);

  useEffect(() => {
    API.get('/simulations')
      .then(r => setSimulations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (active) {
    return (
      <SimulationRunner
        sim={active}
        language={language}
        onClose={() => setActive(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cyber text-2xl font-bold text-white">{t('simulation.title')}</h1>
        <p className="text-[#888] text-sm mt-1">{t('simulation.subtitle')}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Simulations', value: simulations.length,                                              icon: '🎮' },
          { label: 'Categories',  value: new Set(simulations.map(s => s.type)).size,                      icon: '🗂️' },
          { label: 'Total Steps', value: simulations.reduce((a, s) => a + (s.steps?.length || 0), 0),    icon: '📋' },
        ].map((s, i) => (
          <div key={i} className="cyber-card p-3 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="font-cyber text-cyber-accent text-lg font-bold">{s.value}</p>
            <p className="text-xs text-[#888] font-mono-cyber">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="cyber-card h-64 animate-pulse" />
          ))}
        </div>
      ) : simulations.length === 0 ? (
        <div className="text-center py-20 text-[#888]">
          <p className="text-4xl mb-3">🎮</p>
          <p className="font-cyber text-sm tracking-widest mb-2">NO SIMULATIONS FOUND</p>
          <p className="text-xs">Run <code className="text-cyber-accent">npm run seed</code> in the backend folder</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {simulations.map((sim, i) => (
            <motion.div
              key={sim._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <SimCard sim={sim} onStart={setActive} lang={language} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}