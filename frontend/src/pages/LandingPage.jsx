import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const features = [
  { icon: '🎯', title: 'Swipe Quiz',        desc: 'Tinder-style swipe quiz with 10 cybersecurity categories' },
  { icon: '🎮', title: 'Simulations',        desc: 'Experience real phishing, scam calls & social engineering' },
  { icon: '🕵️', title: 'Phishing Detector', desc: 'Analyze any URL for malicious indicators instantly' },
  { icon: '📚', title: 'Knowledge Base',     desc: 'Easy articles on phishing, UPI safety, and more' },
  { icon: '🌐', title: 'Multilingual',       desc: 'Full support for English, Hindi & Marathi' },
  { icon: '🏆', title: 'Leaderboard',        desc: 'Compete with other ninjas and earn badges' },
];

const stats = [
  { value: '50+', label: 'Questions'   },
  { value: '10',   label: 'Categories'  },
  { value: '3',    label: 'Languages'   },
  { value: '3+',   label: 'Simulations' },
];

const categories = [
  { icon: '🎣', name: 'Phishing'          },
  { icon: '🔐', name: 'Password Security'  },
  { icon: '🧠', name: 'Social Engineering' },
  { icon: '📶', name: 'Network Security'   },
  { icon: '🦠', name: 'Malware'           },
  { icon: '🌐', name: 'Safe Browsing'     },
  { icon: '📱', name: 'Mobile Security'   },
  { icon: '🔒', name: 'Data Privacy'      },
  { icon: '💳', name: 'UPI Safety'        },
  { icon: '⚖️', name: 'Cyber Laws'        },
];

// Generate stable random positions once (not on every render)
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top:  `${(i * 53 + 7)  % 100}%`,
  duration: 2 + (i % 3),
  delay:    (i * 0.3)  % 2,
}));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cyber-bg bg-grid overflow-x-hidden">
      <div className="scanline" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,102,255,0.12) 0%, transparent 70%)' }} />

        {/* Floating particles — stable positions, no Math.random() in render */}
        {particles.map(p => (
          <motion.div key={p.id}
            className="absolute w-1 h-1 bg-cyber-accent rounded-full opacity-30 pointer-events-none"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} className="relative z-10">

          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 border border-cyber-accent/30 rounded-full bg-cyber-accent/5">
            <span className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse" />
            <span className="font-mono-cyber text-cyber-accent text-xs tracking-widest">
              SYSTEM ONLINE • SECURE CONNECTION
            </span>
          </div>

          {/* Logo */}
          <div className="mb-4 text-7xl select-none">🥷</div>

          <h1 className="font-cyber text-4xl md:text-6xl lg:text-7xl font-black mb-2 leading-tight">
            <span className="text-cyber-accent glow-text">CYBER</span>
            <span className="text-white">NINJA</span>
          </h1>

          <p className="font-cyber text-cyber-muted text-sm md:text-base tracking-[0.3em] mb-4">
            TRAIN • DETECT • DEFEND
          </p>

          <p className="text-cyber-text/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            The most engaging cybersecurity awareness system. Master phishing detection,
            password security, UPI safety and more through interactive swipe quizzes and
            real-world simulations.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="cyber-btn-primary px-8 py-4 text-base rounded-lg font-cyber">
                🚀 START TRAINING
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="cyber-btn px-8 py-4 text-base rounded-lg">
                ⚡ LOGIN
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-16 grid grid-cols-4 gap-6 md:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-cyber text-2xl md:text-3xl font-black text-cyber-accent">{s.value}</p>
              <p className="text-cyber-muted text-xs font-mono-cyber tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-cyber text-3xl font-bold text-white mb-3">
            WHY <span className="text-cyber-accent">CYBERNINJA?</span>
          </h2>
          <p className="text-cyber-muted">Everything you need to become a cybersecurity expert</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: 'rgba(0,245,212,0.4)' }}
              className="cyber-card p-6 cursor-default transition-all duration-300">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-cyber text-cyber-accent text-sm tracking-wider mb-2">{f.title}</h3>
              <p className="text-cyber-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="px-4 py-16 bg-cyber-card/30 border-y border-cyber-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cyber text-2xl font-bold text-center text-white mb-10">
            10 <span className="text-cyber-accent">CATEGORIES</span> TO MASTER
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-cyber-border rounded-full text-sm text-cyber-text hover:border-cyber-accent hover:text-cyber-accent transition-all cursor-default">
                <span>{cat.icon}</span>
                {cat.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}>
          <h2 className="font-cyber text-3xl md:text-4xl font-black text-white mb-4">
            READY TO BECOME A <span className="text-cyber-accent">CYBER NINJA?</span>
          </h2>
          <p className="text-cyber-muted mb-8 max-w-md mx-auto">
            Enhance your cybersecurity knowledge through interactive quizzes, simulations, and multilingual learning.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,245,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="cyber-btn-primary px-12 py-4 text-base rounded-lg font-cyber">
              🥷 CREATE ACCOUNT
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-cyber-border px-4 py-8 text-center text-cyber-muted text-sm font-mono-cyber">
        <p>🛡️ CyberNinja</p>
        <p className="mt-1 text-xs opacity-50">© 2026 CyberNinja. All rights reserved.</p>
      </footer>
    </div>
  );
}