import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { API } from '../context/AuthContext';

export default function LearnPage() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/articles').then(r => setArticles(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(articles.map(a => a.category))];
  const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cyber text-2xl font-bold text-white">{t('learn.title')}</h1>
        <p className="text-cyber-muted text-sm mt-1">{t('learn.subtitle')}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono-cyber uppercase tracking-wider border transition-all ${
              filter === cat ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent' : 'border-cyber-border text-cyber-muted hover:border-cyber-accent/40'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="cyber-card p-6 animate-pulse">
              <div className="h-4 bg-cyber-border rounded w-3/4 mb-3" />
              <div className="h-3 bg-cyber-border rounded w-full mb-2" />
              <div className="h-3 bg-cyber-border rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-cyber-muted">
          <p className="text-4xl mb-3">📚</p>
          <p>No articles available. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((article, i) => (
            <motion.div key={article._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: 'rgba(0,245,212,0.3)' }}
              className="cyber-card p-6 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{article.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-blue">{article.category}</span>
                    <span className="text-xs text-cyber-muted font-mono-cyber">{article.readTime} {t('learn.readTime')}</span>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2 leading-tight">
                    {article.title?.[language] || article.title?.en}
                  </h3>
                  <p className="text-cyber-muted text-sm leading-relaxed line-clamp-3">
                    {(article.content?.[language] || article.content?.en)?.substring(0, 120)}...
                  </p>
                  <Link to={`/learn/${article._id}`}>
                    <button className="mt-3 text-cyber-accent text-xs font-mono-cyber hover:underline tracking-wider">
                      {t('learn.readMore')} →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
