import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EXAMPLES = [
  'https://paypa1.com/login/verify',
  'http://sbi-banking-secure.xyz/account',
  'https://google.com',
  'https://192.168.1.1/admin/login',
  'https://paytm-free-win-lucky.tk/claim',
];

export default function PhishingDetectorPage() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!url.trim()) return toast.error('Please enter a URL');
    setLoading(true);
    try {
      const res = await API.post('/phishing/analyze', { url: url.trim() });
      setResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    SAFE: { color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/40', icon: '✅', label: t('phishing.safe') },
    SUSPICIOUS: { color: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow/40', icon: '⚠️', label: t('phishing.suspicious') },
    DANGEROUS: { color: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/40', icon: '🚨', label: t('phishing.dangerous') },
  };

  const config = result ? statusConfig[result.status] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-cyber text-2xl font-bold text-white">{t('phishing.title')}</h1>
        <p className="text-cyber-muted text-sm mt-1">{t('phishing.subtitle')}</p>
      </div>

      {/* Input */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex gap-3">
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder={t('phishing.placeholder')}
            className="cyber-input flex-1" />
          <motion.button onClick={analyze} disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="cyber-btn-primary px-5 rounded-lg whitespace-nowrap text-xs disabled:opacity-50">
            {loading ? '⟳' : '🔍'} {t('phishing.analyze')}
          </motion.button>
        </div>

        {/* Example URLs */}
        <div>
          <p className="text-xs font-mono-cyber text-cyber-muted mb-2 tracking-widest">TRY EXAMPLES:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setUrl(ex)}
                className="text-xs px-3 py-1 border border-cyber-border text-cyber-muted hover:border-cyber-accent/50 hover:text-cyber-accent rounded-full transition-all font-mono-cyber truncate max-w-48">
                {ex.length > 35 ? ex.substring(0, 35) + '...' : ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Status banner */}
            <div className={`p-5 rounded-xl border ${config.bg} ${config.border} mb-4`}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{config.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className={`font-cyber text-xl font-black ${config.color}`}>{config.label}</h2>
                    <span className={`badge ${result.status === 'SAFE' ? 'badge-green' : result.status === 'SUSPICIOUS' ? 'badge-yellow' : 'badge-red'}`}>
                      {t('phishing.riskScore')}: {result.riskScore}/100
                    </span>
                  </div>
                  <p className="text-sm text-cyber-text/80">{result.advice}</p>
                </div>
              </div>
              {/* Risk bar */}
              <div className="mt-4">
                <div className="progress-bar">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.riskScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: result.status === 'SAFE' ? '#30d158' : result.status === 'SUSPICIOUS' ? '#ffd60a' : '#ff2d55' }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono-cyber text-cyber-muted mt-1">
                  <span>0 — SAFE</span>
                  <span>100 — CRITICAL</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div className="cyber-card p-5">
                  <h3 className="font-cyber text-cyber-red text-xs tracking-widest mb-3">🚨 {t('phishing.warnings')} ({result.warnings.length})</h3>
                  <div className="space-y-2">
                    {result.warnings.map((w, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-sm text-cyber-text/80 flex items-start gap-2 p-2 bg-cyber-red/5 rounded">
                        <span className="flex-shrink-0 mt-0.5">{w.split(' ')[0]}</span>
                        <span>{w.split(' ').slice(1).join(' ')}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safe indicators */}
              {result.safe?.length > 0 && (
                <div className="cyber-card p-5">
                  <h3 className="font-cyber text-cyber-green text-xs tracking-widest mb-3">✅ {t('phishing.safeIndicators')} ({result.safe.length})</h3>
                  <div className="space-y-2">
                    {result.safe.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-sm text-cyber-text/80 flex items-start gap-2 p-2 bg-cyber-green/5 rounded">
                        <span>{s}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Analyzed URL */}
            <div className="cyber-card p-4 mt-4">
              <p className="text-xs font-mono-cyber text-cyber-muted mb-1">ANALYZED URL</p>
              <p className="font-mono-cyber text-cyber-accent text-sm break-all">{result.url}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🔍', title: 'URL Analysis', desc: 'Checks length, characters, and structure' },
          { icon: '🌐', title: 'Domain Check', desc: 'Detects suspicious TLDs and impersonation' },
          { icon: '🔐', title: 'HTTPS Verify', desc: 'Validates encryption and security signals' },
        ].map((card, i) => (
          <div key={i} className="cyber-card p-4 text-center">
            <div className="text-2xl mb-2">{card.icon}</div>
            <h3 className="font-cyber text-cyber-accent text-xs tracking-wider mb-1">{card.title}</h3>
            <p className="text-cyber-muted text-xs">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
