import React, { useState, useCallback } from 'react';
import {
  X,
  Shuffle,
  Sparkles,
  MapPin,
  Film,
  User,
  Zap,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  Check,
} from 'lucide-react';
import { GroupProject, GenreItem, JujuyLocation, CharacterItem, PlotHookItem } from '../types';
import { GENRES, JUJUY_LOCATIONS, CHARACTERS, PLOT_HOOKS } from '../data/jujuyData';
import { getRandomElement } from '../utils/generator';
import { sounds } from '../utils/audio';

interface IdeaGeneratorModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  onClose: () => void;
  onUseIdea: (group: GroupProject, idea: IdeaCombination) => void;
}

export interface IdeaCombination {
  genre: GenreItem;
  location: JujuyLocation;
  character: CharacterItem;
  plotHook: PlotHookItem;
}

function randomIdea(): IdeaCombination {
  const chars = [...CHARACTERS];
  const char = getRandomElement(chars);
  return {
    genre: getRandomElement(GENRES),
    location: getRandomElement(JUJUY_LOCATIONS),
    character: char,
    plotHook: getRandomElement(PLOT_HOOKS),
  };
}

export const IdeaGeneratorModal: React.FC<IdeaGeneratorModalProps> = ({
  group,
  isOpen,
  onClose,
  onUseIdea,
}) => {
  const [idea, setIdea] = useState<IdeaCombination>(() => randomIdea());
  const [spinning, setSpinning] = useState<Partial<Record<keyof IdeaCombination, boolean>>>({});
  const [used, setUsed] = useState(false);

  // Regenerar idea cada vez que se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      setIdea(randomIdea());
      setUsed(false);
      setSpinning({});
    }
  }, [isOpen]);

  const regenerateAll = useCallback(() => {
    sounds.playClick();
    setIdea(randomIdea());
    setUsed(false);
  }, []);

  const regenerateField = useCallback((field: keyof IdeaCombination) => {
    sounds.playClick();
    setSpinning(s => ({ ...s, [field]: true }));
    setTimeout(() => {
      setIdea(prev => {
        switch (field) {
          case 'genre':
            return { ...prev, genre: getRandomElement(GENRES) };
          case 'location':
            return { ...prev, location: getRandomElement(JUJUY_LOCATIONS) };
          case 'character': {
            const newChar = getRandomElement(CHARACTERS);
            return { ...prev, character: newChar };
          }
          case 'plotHook':
            return { ...prev, plotHook: getRandomElement(PLOT_HOOKS) };
          default:
            return prev;
        }
      });
      setSpinning(s => ({ ...s, [field]: false }));
      setUsed(false);
    }, 300);
  }, []);

  const handleUseIdea = () => {
    if (!group) return;
    sounds.playCelebration();
    setUsed(true);
    onUseIdea(group, idea);
  };

  if (!isOpen) return null;

  const isSpinningAny = Object.values(spinning).some(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2637] bg-[#0c0e14] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-white">¿Sin ideas? ¡Inspirate!</h2>
                {group && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-lime-400/20 text-lime-400 border border-lime-400/30">
                    Grupo #{group.groupNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Explorá combinaciones narrativas. Podés regenerar cada elemento o usarla directamente.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {/* Regenerar todo */}
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400 font-medium">Combinación actual:</p>
            <button
              onClick={regenerateAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mezclar todo</span>
            </button>
          </div>

          {/* Cards de cada elemento */}
          <IdeaCard
            icon={<Film className="w-4 h-4 text-cyan-400" />}
            label="Género"
            title={idea.genre.name}
            description={idea.genre.description}
            tags={idea.genre.keywords.slice(0, 3)}
            tagColor="text-cyan-300 bg-cyan-400/10 border-cyan-400/20"
            isSpinning={!!spinning.genre}
            onRegenerate={() => regenerateField('genre')}
          />

          <IdeaCard
            icon={<MapPin className="w-4 h-4 text-lime-400" />}
            label="Locación en Jujuy"
            title={idea.location.name}
            description={idea.location.description}
            tags={[idea.location.region, idea.location.iconTag]}
            tagColor="text-lime-300 bg-lime-400/10 border-lime-400/20"
            isSpinning={!!spinning.location}
            onRegenerate={() => regenerateField('location')}
          />

          <IdeaCard
            icon={<User className="w-4 h-4 text-emerald-400" />}
            label="Personaje Principal"
            title={idea.character.archetype}
            description={idea.character.description}
            tags={[idea.character.jujuyContext.split(',')[0]]}
            tagColor="text-emerald-300 bg-emerald-400/10 border-emerald-400/20"
            isSpinning={!!spinning.character}
            onRegenerate={() => regenerateField('character')}
          />

          <IdeaCard
            icon={<Zap className="w-4 h-4 text-rose-400" />}
            label="Detonante de la Historia"
            title={idea.plotHook.title}
            description={idea.plotHook.premise}
            tags={[idea.plotHook.conflict.slice(0, 50) + '…']}
            tagColor="text-rose-300 bg-rose-400/10 border-rose-400/20"
            isSpinning={!!spinning.plotHook}
            onRegenerate={() => regenerateField('plotHook')}
          />

          {/* Sinopsis rápida generada */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3.5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Vista previa rápida
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              En{' '}
              <span className="text-lime-300 font-semibold">{idea.location.name}</span>,{' '}
              <span className="text-emerald-300 font-semibold">
                {idea.character.archetype.toLowerCase()}
              </span>{' '}
              enfrenta una aventura de género{' '}
              <span className="text-cyan-300 font-semibold">{idea.genre.name.toLowerCase()}</span>.{' '}
              {idea.plotHook.premise}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2637] bg-[#0c0e14] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 text-xs font-semibold transition-colors border border-[#252c3f]"
          >
            Solo explorar · Cerrar
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={regenerateAll}
              title="Generar otra combinación"
              className="p-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors border border-[#252c3f]"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {group && (
              <button
                onClick={handleUseIdea}
                disabled={isSpinningAny || used}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md ${
                  used
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default'
                    : 'bg-lime-400 hover:bg-lime-300 text-stone-950 shadow-lime-400/20 hover:shadow-lime-400/30'
                }`}
              >
                {used ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Idea asignada!</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span>Usar esta idea para el Grupo #{group.groupNumber}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-component: IdeaCard ─── */
interface IdeaCardProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  tags?: string[];
  tagColor: string;
  isSpinning: boolean;
  onRegenerate: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  icon,
  label,
  title,
  description,
  tags = [],
  tagColor,
  isSpinning,
  onRegenerate,
}) => (
  <div
    className={`bg-[#0c0e14] border border-[#1f2637] rounded-xl p-3.5 flex items-start gap-3 transition-opacity ${
      isSpinning ? 'opacity-50' : 'opacity-100'
    }`}
  >
    <div className="w-8 h-8 rounded-lg bg-[#171c28] flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-white leading-snug">{title}</p>
      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {tags.map(tag => (
            <span
              key={tag}
              className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${tagColor}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
    <button
      onClick={onRegenerate}
      disabled={isSpinning}
      title={`Cambiar ${label}`}
      className="p-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors border border-[#1f2637] shrink-0"
    >
      <Shuffle className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
    </button>
  </div>
);
