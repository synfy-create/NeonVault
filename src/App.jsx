/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Terminal, 
  Search, 
  X, 
  Maximize2, 
  ChevronLeft,
  Flame,
  LayoutGrid
} from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#bc13fe33_0%,transparent_60%)]" />
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-cyber-black/80 backdrop-blur-md border-b border-neon-purple/20 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setSelectedGame(null)}
        >
          <div className="p-2 bg-neon-purple/10 rounded-lg group-hover:bg-neon-purple/20 transition-colors">
            <Gamepad2 className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tighter text-white">
              NEON<span className="text-neon-purple">VAULT</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono leading-none">
              v1.0.42_STABLE
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="SEARCH THE VAULT..."
              className="w-full bg-cyber-gray border border-slate-800 rounded-none px-10 py-2 text-sm font-mono focus:outline-none focus:border-neon-purple/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-neon-purple transition-colors">
            <Terminal className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto"
            >
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-all border ${
                      activeCategory === cat 
                        ? 'bg-neon-purple text-white border-neon-purple neon-border' 
                        : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedGame(game)}
                    >
                      <div className="bg-cyber-gray border border-slate-800 p-4 relative overflow-hidden group-hover:border-neon-purple/30 transition-all">
                        {/* Status bar */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                            ENTRY_{game.id.toUpperCase().replace('-', '_')}
                          </span>
                          <LayoutGrid className="w-3 h-3 text-slate-700" />
                        </div>

                        {/* Thumbnail Placeholder */}
                        <div className="aspect-video bg-black/40 mb-4 relative overflow-hidden group-hover:bg-black/60 transition-colors flex items-center justify-center">
                          <div 
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundColor: game.accent }}
                          />
                          <Gamepad2 className="w-8 h-8 text-slate-800 group-hover:text-neon-purple/20 transition-colors" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-slate-800">
                             <span className="text-[9px] font-mono uppercase text-slate-400">{game.category}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 font-mono tracking-tight group-hover:text-neon-purple transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 h-8">
                          {game.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                           <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-neon-pink" />
                              <span className="text-[10px] font-mono text-slate-500">POPULAR</span>
                           </div>
                           <button className="text-[10px] font-mono uppercase text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                             INITIALIZE <ChevronLeft className="w-3 h-3 rotate-180" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-500 font-mono uppercase tracking-widest">No entries found in archive matches that criteria</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="player"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 bg-cyber-black flex flex-col pt-16"
            >
              <div className="flex items-center justify-between px-6 py-3 border-b border-neon-purple/20 bg-cyber-black/90">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white font-mono text-xs uppercase"
                >
                  <ChevronLeft className="w-4 h-4" /> EXIT_SESSION
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono tracking-tighter text-white neon-text">
                    {selectedGame.title}
                  </span>
                  <span className="px-2 py-0.5 bg-neon-purple/10 border border-neon-purple/20 text-[10px] text-neon-purple font-mono uppercase">
                    ACTIVE_LINK
                  </span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="p-1.5 text-slate-500 hover:text-neon-pink transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                </div>
              </div>

              <div className="flex-1 bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                   <Terminal className="w-32 h-32 animate-pulse" />
                </div>
                <iframe 
                  src={selectedGame.url}
                  className="w-full h-full border-none relative z-10"
                  id={`iframe-${selectedGame.id}`}
                  title={selectedGame.title}
                  allow="autoplay; fullscreen; pointer-lock"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
             <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
             SERVER_ONLINE
           </div>
           <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden md:block">
             ENCRYPTION: AES-256-GCM
           </div>
        </div>
        <div className="text-[10px] font-mono text-slate-600 uppercase">
          &copy; 2026 NEON_VAULT_RESOURCES // ZERO_LOG_POLICY
        </div>
      </footer>
    </div>
  );
}
