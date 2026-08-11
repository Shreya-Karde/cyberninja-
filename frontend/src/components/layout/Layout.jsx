import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const navItems = [
  { path: '/dashboard', icon: '⚡', key: 'nav.dashboard' },
  { path: '/quiz',      icon: '🎯', key: 'nav.quiz' },
  { path: '/learn',     icon: '📚', key: 'nav.learn' },
  { path: '/simulations', icon: '🎮', key: 'nav.simulations' },
  { path: '/phishing-detector', icon: '🕵️', key: 'nav.phishingDetector' },
  { path: '/leaderboard', icon: '🏆', key: 'nav.leaderboard' },
];

function SidebarContent({ user, t, language, changeLanguage, handleLogout, closeMobile }) {
  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">

      {/* Logo */}
      <div className="mb-6 pt-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl flex-shrink-0">
          🥷
        </div>
        <div className="leading-none">
          <div className="font-cyber text-xs font-black text-cyber-accent tracking-widest">CYBER</div>
          <div className="font-cyber text-xs font-black text-white tracking-widest">NINJA</div>
        </div>
      </div>

      {/* User card */}
      <div className="cyber-card p-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{user?.username}</p>
            <p className="text-xs text-cyber-muted capitalize truncate">
              {user?.level} · {user?.totalScore ?? 0} pts
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobile}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            <span>{t(item.key)}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            onClick={closeMobile}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">🛠️</span>
            <span>{t('nav.admin')}</span>
          </NavLink>
        )}
      </nav>

      {/* Language switcher */}
      <div className="mt-4 mb-3">
        <p className="text-xs text-cyber-muted mb-2 font-mono-cyber tracking-widest">LANGUAGE</p>
        <div className="flex gap-1.5">
          {['en', 'hi', 'mr'].map(lang => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`flex-1 py-1 text-xs rounded border font-mono-cyber uppercase tracking-wider transition-all ${
                language === lang
                  ? 'border-cyber-accent text-cyber-accent bg-cyber-accent/10'
                  : 'border-cyber-border text-cyber-muted hover:border-cyber-accent/40 hover:text-cyber-text'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-2 text-xs text-cyber-muted hover:text-red-400 border border-cyber-border hover:border-red-500/50 rounded-lg transition-all font-mono-cyber tracking-widest uppercase"
      >
        ⏻ {t('nav.logout')}
      </button>
    </div>
  );
}

export default function Layout() {
  const { user, logout }                = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const navigate                        = useNavigate();
  const [mobileOpen, setMobileOpen]     = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const closeMobile  = () => setMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-bg bg-grid">
      <div className="scanline" />

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-30 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-cyber-card border-r border-cyber-border z-40 flex flex-col lg:hidden"
          >
            <SidebarContent
              user={user} t={t}
              language={language} changeLanguage={changeLanguage}
              handleLogout={handleLogout} closeMobile={closeMobile}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — single, always visible on lg+ */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-cyber-card border-r border-cyber-border">
        <SidebarContent
          user={user} t={t}
          language={language} changeLanguage={changeLanguage}
          handleLogout={handleLogout} closeMobile={closeMobile}
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-cyber-card border-b border-cyber-border flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-cyber-accent text-xl w-8 h-8 flex items-center justify-center rounded hover:bg-cyber-accent/10 transition-colors"
          >
            ☰
          </button>
          <span className="font-cyber text-sm tracking-widest">
            <span className="text-cyber-accent">CYBER</span>
            <span className="text-white">NINJA</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}