import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { API } from '../context/AuthContext';

export default function ArticlePage() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/articles/${id}`).then(r => setArticle(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-cyber-border rounded w-3/4" />
      <div className="cyber-card p-6 space-y-3">
        {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-cyber-border rounded" />)}
      </div>
    </div>
  );

  if (!article) return (
    <div className="text-center py-20 text-cyber-muted">
      Article not found. <Link to="/learn" className="text-cyber-accent hover:underline">Go back</Link>
    </div>
  );

  const title = article.title?.[language] || article.title?.en;
  const content = article.content?.[language] || article.content?.en;
  const tips = article.tips?.map(tip => tip?.[language] || tip?.en);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/learn" className="inline-flex items-center gap-2 text-cyber-muted hover:text-cyber-accent text-sm font-mono-cyber tracking-wider transition-colors">
        ← {t('learn.back')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="cyber-card p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="text-6xl flex-shrink-0">{article.icon}</div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-blue">{article.category}</span>
                <span className="text-xs text-cyber-muted font-mono-cyber">{article.readTime} {t('learn.readTime')}</span>
              </div>
              <h1 className="font-cyber text-xl font-bold text-white leading-tight">{title}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {content?.split('\n\n').map((para, i) => (
              <p key={i} className="text-cyber-text/80 leading-relaxed mb-4 text-sm">{para}</p>
            ))}
          </div>
        </div>

        {/* Tips */}
        {tips && tips.length > 0 && (
          <div className="cyber-card p-6 mt-5">
            <h2 className="font-cyber text-cyber-accent text-sm tracking-widest mb-4">💡 {t('learn.tips')}</h2>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-cyber-accent/5 border border-cyber-accent/20 rounded-lg">
                  <span className="text-cyber-accent font-mono-cyber text-sm flex-shrink-0">0{i + 1}</span>
                  <p className="text-cyber-text text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex gap-3 mt-5">
          <Link to="/quiz" className="flex-1">
            <button className="w-full cyber-btn-primary py-3 rounded-lg text-sm">
              🎯 Test Your Knowledge
            </button>
          </Link>
          <Link to="/learn" className="flex-1">
            <button className="w-full cyber-btn py-3 rounded-lg text-sm">
              📚 More Articles
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
