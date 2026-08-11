import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

// ── Eye icons ─────────────────────────────────────────────────────────────────
function EyeOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
           -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
           a9.97 9.97 0 012.163-3.592m3.06-2.733A9.965 9.965 0 0112 5
           c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.423 5.276
           M9.88 9.88a3 3 0 104.24 4.24" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </svg>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { t }        = useLanguage();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({
    username: '',
    email:    '',
    password: '',
    language: 'en',
    level:    'beginner',   // kept in state for backend, just hidden from UI
  });
  const [loading,     setLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to CyberNinja! 🥷');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid flex items-center justify-center p-4">
      <div className="scanline" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,102,255,0.12) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 select-none">🥷</div>
          <h1 className="font-cyber text-2xl font-black">
            <span className="text-cyber-accent">CYBER</span>
            <span className="text-white">NINJA</span>
          </h1>
          <p className="text-cyber-muted text-sm font-mono-cyber tracking-widest mt-1">
            CREATE NEW AGENT PROFILE
          </p>
        </div>

        <div className="cyber-card p-8">

          {/* Card header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
            <h2 className="font-cyber text-cyber-accent text-sm tracking-widest">
              {t('auth.register').toUpperCase()}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-mono-cyber text-cyber-muted mb-1 tracking-widest">
                USERNAME
              </label>
              <input
                type="text"
                required
                placeholder="ninja_agent_007"
                className="cyber-input"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono-cyber text-cyber-muted mb-1 tracking-widest">
                EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="agent@email.com"
                className="cyber-input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password with eye toggle */}
            <div>
              <label className="block text-xs font-mono-cyber text-cyber-muted mb-1 tracking-widest">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  className="cyber-input pr-11"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-accent transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>

              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(bar => (
                      <div key={bar} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            form.password.length >= bar * 4
                              ? bar === 1 ? '#ff2d55'
                              : bar === 2 ? '#ffd60a'
                              : '#30d158'
                              : '#1a2744'
                        }} />
                    ))}
                  </div>
                  <span className="text-xs font-mono-cyber"
                    style={{
                      color: form.password.length < 4  ? '#ff2d55'
                           : form.password.length < 8  ? '#ffd60a'
                           : '#30d158'
                    }}>
                    {form.password.length < 4  ? 'WEAK'
                     : form.password.length < 8 ? 'FAIR'
                     : 'STRONG'}
                  </span>
                </div>
              )}
            </div>

            {/* Language — full width now that level is removed */}
            <div>
              <label className="block text-xs font-mono-cyber text-cyber-muted mb-1 tracking-widest">
                LANGUAGE
              </label>
              <select
                className="cyber-input"
                value={form.language}
                onChange={e => setForm({ ...form, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full cyber-btn-primary py-3 rounded-lg mt-2 disabled:opacity-50"
            >
              {loading ? '⟳ CREATING...' : `🥷 ${t('auth.registerBtn')}`}
            </motion.button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center text-sm text-cyber-muted">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-cyber-accent hover:underline font-semibold">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}