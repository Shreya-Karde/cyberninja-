import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(t('auth.welcome'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid flex items-center justify-center p-4">
      <div className="scanline" />
      <div className="absolute inset-0 bg-cyber-glow pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🥷</div>
          <h1 className="font-cyber text-2xl font-black">
            <span className="text-cyber-accent">CYBER</span><span className="text-white">NINJA</span>
          </h1>
          <p className="text-cyber-muted text-sm font-mono-cyber tracking-widest mt-1">SECURE ACCESS PORTAL</p>
        </div>

        <div className="cyber-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse" />
            <h2 className="font-cyber text-cyber-accent text-sm tracking-widest">{t('auth.login').toUpperCase()}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-cyber text-cyber-muted mb-1 tracking-widest">EMAIL</label>
              <input type="email" required placeholder="agent@cyberninja.com"
                className="cyber-input" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-mono-cyber text-cyber-muted mb-1 tracking-widest">PASSWORD</label>
              <input type="password" required placeholder="••••••••"
                className="cyber-input" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full cyber-btn-primary py-3 rounded-lg mt-2 disabled:opacity-50">
              {loading ? '⟳ AUTHENTICATING...' : `⚡ ${t('auth.loginBtn')}`}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-cyber-muted">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-cyber-accent hover:underline font-semibold">
              {t('auth.signUp')}
            </Link>
          </div>

          {/* Demo credentials */}
          {/* <div className="mt-4 p-3 border border-cyber-border rounded-lg bg-cyber-accent/5">
            <p className="text-xs font-mono-cyber text-cyber-muted mb-1">DEMO CREDENTIALS</p>
            <p className="text-xs text-cyber-text">User: demo@cyberninja.com / Demo@123</p>
            <p className="text-xs text-cyber-text">Admin: admin@cyberninja.com / Admin@123</p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}
