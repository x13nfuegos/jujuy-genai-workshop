import React, { useState } from 'react';
import {
  X,
  MapPin,
  Film,
  Palette,
  User,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';
import {
  JUJUY_LOCATIONS,
  GENRES,
  VISUAL_STYLES,
  CHARACTERS,
  PLOT_HOOKS,
  AI_CHALLENGES
} from '../data/jujuyData';
import { sounds } from '../utils/audio';

interface DataBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBankModal: React.FC<DataBankModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'locaciones' | 'generos' | 'estilos' | 'personajes' | 'tramas' | 'desafios'>('locaciones');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2637] bg-[#0c0e14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Banco Creativo & Cultural de Jujuy
              </h2>
              <p className="text-xs text-slate-400">
                Catálogo de elementos locales, mitología y estilos para IA generativa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors border border-[#252c3f]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1 p-3 border-b border-[#1f2637] bg-[#0c0e14]/60 overflow-x-auto text-xs">
          <button
            onClick={() => { sounds.playClick(); setActiveCategory('locaciones'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'locaciones' ? 'bg-lime-400 text-stone-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locaciones Jujuy ({JUJUY_LOCATIONS.length})</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveCategory('generos'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'generos' ? 'bg-lime-400 text-stone-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Géneros ({GENRES.length})</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveCategory('estilos'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'estilos' ? 'bg-lime-400 text-stone-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Estilos Visuales ({VISUAL_STYLES.length})</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveCategory('personajes'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'personajes' ? 'bg-lime-400 text-stone-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personajes ({CHARACTERS.length})</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveCategory('tramas'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'tramas' ? 'bg-lime-400 text-stone-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Detonantes ({PLOT_HOOKS.length})</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveCategory('desafios'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'desafios' ? 'bg-lime-400 text-stone-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Desafíos IA ({AI_CHALLENGES.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
          {activeCategory === 'locaciones' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {JUJUY_LOCATIONS.map(loc => (
                <div key={loc.id} className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-lime-400 font-semibold uppercase">{loc.region}</span>
                    <span className="text-[10px] bg-[#171c28] text-slate-300 px-2 py-0.5 rounded border border-[#252c3f]">
                      {loc.iconTag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{loc.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{loc.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeCategory === 'generos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GENRES.map(gen => (
                <div key={gen.id} className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <h4 className="text-xs font-bold text-cyan-300">{gen.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{gen.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {gen.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-[#171c28] text-slate-300 px-1.5 py-0.5 rounded border border-[#252c3f]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCategory === 'estilos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VISUAL_STYLES.map(st => (
                <div key={st.id} className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <h4 className="text-xs font-bold text-fuchsia-300">{st.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{st.description}</p>
                  <span className="text-[10px] text-fuchsia-300 font-mono mt-2 block bg-[#171c28] p-1.5 rounded border border-[#252c3f]">
                    Prompt cue: {st.promptSuffix}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeCategory === 'personajes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTERS.map(ch => (
                <div key={ch.id} className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <h4 className="text-xs font-bold text-lime-300">{ch.archetype}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{ch.description}</p>
                  <span className="text-[10px] text-lime-400/90 mt-1.5 block italic">
                    📍 {ch.jujuyContext}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeCategory === 'tramas' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLOT_HOOKS.map(hook => (
                <div key={hook.id} className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-300">{hook.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{hook.premise}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 italic">
                    ⚡ {hook.conflict}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeCategory === 'desafios' && (
            <div className="space-y-3">
              {AI_CHALLENGES.map(ch => (
                <div key={ch.id} className="bg-[#0c0e14] border border-[#1f2637] p-3.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-rose-300">{ch.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                      {ch.difficulty}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {ch.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-[10px] text-slate-400">
                    Herramientas sugeridas: <span className="text-slate-200">{ch.suggestedTools.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#1f2637] bg-[#0c0e14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-200 text-xs font-semibold transition-colors border border-[#252c3f]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
