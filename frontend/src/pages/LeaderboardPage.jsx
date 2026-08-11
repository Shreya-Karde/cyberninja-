import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, API } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/leaderboard').then(r => setLeaders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-cyber text-2xl font-bold text-white">{t('leaderboard.title')}</h1>
        <p className="text-cyber-muted text-sm mt-1">{t('leaderboard.subtitle')}</p>
      </div>

      {/* Top 3 podium */}
      {!loading && leaders.length >= 3 && (
        <div className="cyber-card p-6">
          <div className="flex items-end justify-center gap-4 mb-4">
            {[leaders[1], leaders[0], leaders[2]].map((leader, i) => {
              const heights = ['h-24', 'h-32', 'h-20'];
              const rank = [2, 1, 3][i];
              if (!leader) return null;
              return (
                <motion.div key={leader._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }} className="flex flex-col items-center flex-1">
                  <div className="text-3xl mb-2">{medals[rank - 1]}</div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xl mb-2 border-2 border-cyber-accent/30">
                    {leader.username?.[0]?.toUpperCase()}
                  </div>
                  <p className="text-xs font-semibold text-white text-center truncate w-full">{leader.username}</p>
                  <div className={`w-full ${heights[i]} rounded-t-lg mt-2 flex items-center justify-center ${
                    rank === 1 ? 'bg-yellow-400/20 border border-yellow-400/40' :
                    rank === 2 ? 'bg-gray-400/20 border border-gray-400/40' :
                    'bg-orange-400/20 border border-orange-400/40'
                  }`}>
                    <span className="font-cyber text-sm font-bold text-white">{leader.totalScore}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="cyber-card overflow-hidden">
        <div className="px-5 py-3 border-b border-cyber-border grid grid-cols-12 gap-2">
          {['#', 'Ninja', 'Score', 'Acc%', 'Quizzes'].map((h, i) => (
            <div key={i} className={`text-xs font-mono-cyber text-cyber-muted tracking-widest ${
              i === 0 ? 'col-span-1' : i === 1 ? 'col-span-4' : 'col-span-2 text-right'
            }`}>{h}</div>
          ))}
          <div className="col-span-3 text-xs font-mono-cyber text-cyber-muted tracking-widest text-right">BADGES</div>
        </div>

        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="px-5 py-4 border-b border-cyber-border/50 animate-pulse">
              <div className="h-4 bg-cyber-border rounded w-full" />
            </div>
          ))
        ) : leaders.length === 0 ? (
          <div className="py-16 text-center text-cyber-muted">
            <p className="text-3xl mb-2">🏆</p>
            <p>No rankings yet. Complete quizzes to appear here!</p>
          </div>
        ) : (
          leaders.map((leader, i) => (
            <motion.div key={leader._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`px-5 py-3.5 border-b border-cyber-border/50 grid grid-cols-12 gap-2 items-center transition-all hover:bg-cyber-accent/5 ${
                leader._id === user?._id || leader.username === user?.username ? 'bg-cyber-accent/5 border-l-2 border-l-cyber-accent' : ''
              }`}>
              <div className="col-span-1 text-sm">
                {i < 3 ? medals[i] : <span className="font-mono-cyber text-cyber-muted text-xs">#{i + 1}</span>}
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {leader.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className={`text-sm font-medium truncate ${leader.username === user?.username ? 'text-cyber-accent' : 'text-white'}`}>
                    {leader.username}
                  </p>
                  <p className="text-xs text-cyber-muted capitalize">{leader.level}</p>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-cyber text-cyber-accent text-sm">{leader.totalScore}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className={`text-sm font-mono-cyber ${leader.accuracy >= 70 ? 'text-cyber-green' : leader.accuracy >= 50 ? 'text-cyber-yellow' : 'text-cyber-red'}`}>
                  {leader.accuracy}%
                </span>
              </div>
              <div className="col-span-2 text-right text-sm text-cyber-muted font-mono-cyber">
                {leader.quizzesTaken}
              </div>
              <div className="col-span-1 text-right text-xs text-cyber-yellow">
                {leader.badges?.length > 0 ? `🏅${leader.badges.length}` : '-'}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
