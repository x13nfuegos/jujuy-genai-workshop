import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  Dices,
  ChevronRight,
  Copy,
  Check,
  FileText,
  Bot,
  MapPin,
  Film,
  Palette,
  User,
  Zap,
  Target,
  Shuffle,
  Building2,
  Award,
  Edit3,
  Mail,
  Users,
  Compass,
  CheckCircle2
} from 'lucide-react';
import {
  GroupProject,
  JujuyLocation,
  GenreItem,
  VisualStyleItem,
  CharacterItem,
  PlotHookItem,
  AIChallengeItem
} from '../types';
import {
  JUJUY_LOCATIONS,
  GENRES,
  VISUAL_STYLES,
  CHARACTERS,
  PLOT_HOOKS,
  AI_CHALLENGES,
  SURPRISE_TWISTS
} from '../data/jujuyData';
import {
  getRandomElement,
  fireCelebration,
  buildLocalAIBrief,
  generateCertificateCode,
  isGroupRegistrationComplete
} from '../utils/generator';
import { sounds } from '../utils/audio';

interface RouletteSpinnerProps {
  groups: GroupProject[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onUpdateGroup: (updatedGroup: GroupProject) => void;
  onOpenBriefModal: (group: GroupProject) => void;
  onOpenCertificate?: (group: GroupProject) => void;
  onOpenRoadmap?: (group: GroupProject) => void;
  onEditProducer?: (group: GroupProject) => void;
  onResetGroup?: (group: GroupProject) => void;
  onOpenIdeaGenerator?: (group: GroupProject) => void;
  includeSurpriseTwist: boolean;
}

export const RouletteSpinner: React.FC<RouletteSpinnerProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onUpdateGroup,
  onOpenBriefModal,
  onOpenCertificate,
  onOpenRoadmap,
  onEditProducer,
  onResetGroup,
  onOpenIdeaGenerator,
  includeSurpriseTwist
}) => {
  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const [isSpinning, setIsSpinning] = useState(false);

  // Locking state for individual categories
  const [locks, setLocks] = useState({
    location: false,
    genre: false,
    visualStyle: false,
    character: false,
    plotHook: false,
    challenge: false,
  });

  // Display values on reels (can cycle during animation)
  const [displayLocation, setDisplayLocation] = useState<JujuyLocation | undefined>(currentGroup?.location);
  const [displayGenre, setDisplayGenre] = useState<GenreItem | undefined>(currentGroup?.genre);
  const [displayStyle, setDisplayStyle] = useState<VisualStyleItem | undefined>(currentGroup?.visualStyle);
  const [displayCharacter, setDisplayCharacter] = useState<CharacterItem | undefined>(currentGroup?.character);
  const [displayPlot, setDisplayPlot] = useState<PlotHookItem | undefined>(currentGroup?.plotHook);
  const [displayChallenge, setDisplayChallenge] = useState<AIChallengeItem | undefined>(currentGroup?.aiChallenge);
  const [displayTwist, setDisplayTwist] = useState<string | undefined>(currentGroup?.surpriseTwist);

  // Keep display synchronized when currentGroup changes and not spinning
  useEffect(() => {
    if (!isSpinning && currentGroup) {
      setDisplayLocation(currentGroup.location);
      setDisplayGenre(currentGroup.genre);
      setDisplayStyle(currentGroup.visualStyle);
      setDisplayCharacter(currentGroup.character);
      setDisplayPlot(currentGroup.plotHook);
      setDisplayChallenge(currentGroup.aiChallenge);
      setDisplayTwist(currentGroup.surpriseTwist);
    }
  }, [currentGroup, isSpinning]);

  const spinTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleLock = (category: keyof typeof locks) => {
    sounds.playClick();
    setLocks(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSpin = () => {
    if (isSpinning || !currentGroup) return;

    // Strict validation: Must complete producer & members registration first
    const isRegistered = isGroupRegistrationComplete(currentGroup);
    if (!isRegistered) {
      sounds.playTick(0.6);
      if (onEditProducer) {
        onEditProducer(currentGroup);
      }
      return;
    }

    sounds.playClick();
    setIsSpinning(true);

    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds suspense
    let ticks = 0;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      ticks++;

      // Play tick sound with slightly varying pitch
      if (ticks % 2 === 0) {
        sounds.playTick(1 + Math.sin(ticks * 0.3) * 0.2);
      }

      // Randomize unlocked reels rapidly
      if (!locks.location) setDisplayLocation(getRandomElement(JUJUY_LOCATIONS));
      if (!locks.genre) setDisplayGenre(getRandomElement(GENRES));
      if (!locks.visualStyle) setDisplayStyle(getRandomElement(VISUAL_STYLES));
      if (!locks.character) setDisplayCharacter(getRandomElement(CHARACTERS));
      if (!locks.plotHook) setDisplayPlot(getRandomElement(PLOT_HOOKS));
      if (!locks.challenge) setDisplayChallenge(getRandomElement(AI_CHALLENGES));
      if (includeSurpriseTwist) setDisplayTwist(getRandomElement(SURPRISE_TWISTS));

      if (elapsed >= duration) {
        clearInterval(interval);

        // Final selections
        const finalLocation = locks.location && currentGroup.location ? currentGroup.location : getRandomElement(JUJUY_LOCATIONS);
        const finalGenre = locks.genre && currentGroup.genre ? currentGroup.genre : getRandomElement(GENRES);
        const finalStyle = locks.visualStyle && currentGroup.visualStyle ? currentGroup.visualStyle : getRandomElement(VISUAL_STYLES);
        const finalChar = locks.character && currentGroup.character ? currentGroup.character : getRandomElement(CHARACTERS);
        
        // Pick secondary character distinct from primary
        const secondary = getRandomElement(CHARACTERS.filter(c => c.id !== finalChar.id));
        const finalPlot = locks.plotHook && currentGroup.plotHook ? currentGroup.plotHook : getRandomElement(PLOT_HOOKS);
        const finalChallenge = locks.challenge && currentGroup.aiChallenge ? currentGroup.aiChallenge : getRandomElement(AI_CHALLENGES);
        const finalTwist = includeSurpriseTwist ? getRandomElement(SURPRISE_TWISTS) : undefined;

        setDisplayLocation(finalLocation);
        setDisplayGenre(finalGenre);
        setDisplayStyle(finalStyle);
        setDisplayCharacter(finalChar);
        setDisplayPlot(finalPlot);
        setDisplayChallenge(finalChallenge);
        setDisplayTwist(finalTwist);

        const certCode = currentGroup.certificateCode || generateCertificateCode(currentGroup.groupNumber);
        const certDate = currentGroup.certificateIssuedAt || new Date().toLocaleString('es-AR', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        const updatedGroup: GroupProject = {
          ...currentGroup,
          location: finalLocation,
          genre: finalGenre,
          visualStyle: finalStyle,
          character: finalChar,
          secondaryCharacter: secondary,
          plotHook: finalPlot,
          aiChallenge: finalChallenge,
          surpriseTwist: finalTwist,
          status: 'sorteado',
          certificateCode: certCode,
          certificateIssuedAt: certDate,
          isRegistered: true,
          assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        updatedGroup.aiBrief = buildLocalAIBrief(updatedGroup);

        onUpdateGroup(updatedGroup);
        setIsSpinning(false);

        sounds.playCelebration();
        fireCelebration();

        // Capture story roadmap immediately for the group
        if (onOpenRoadmap) {
          setTimeout(() => {
            onOpenRoadmap(updatedGroup);
          }, 1200);
        }
      }
    }, 70);

    spinTimerRef.current = interval;
  };

  const handleNextGroup = () => {
    sounds.playClick();
    const currentIndex = groups.findIndex(g => g.id === selectedGroupId);
    if (currentIndex !== -1 && currentIndex < groups.length - 1) {
      onSelectGroup(groups[currentIndex + 1].id);
    } else {
      // Loop back or pick first pending
      const pending = groups.find(g => g.status === 'pendiente');
      if (pending) {
        onSelectGroup(pending.id);
      } else {
        onSelectGroup(groups[0].id);
      }
    }
  };

  const isAssigned = currentGroup?.status !== 'pendiente';

  return (
    <div className="space-y-6">
      {/* Top Group Selector & Status Banner */}
      <div className="bg-[#121620] border border-[#1f2637] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-lime-400 text-stone-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-lime-400/20">
            #{currentGroup?.groupNumber}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <label htmlFor="group-selector" className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Grupo Seleccionado
              </label>
              {isAssigned ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  ✓ Asignado ({currentGroup.assignedAt})
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/30 font-semibold">
                  Pendiente de sorteo
                </span>
              )}
              {currentGroup?.certificateCode && (
                <span className="text-[9px] font-mono text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded border border-lime-400/20">
                  {currentGroup.certificateCode}
                </span>
              )}
              {onResetGroup && (
                <button
                  type="button"
                  onClick={() => onResetGroup(currentGroup)}
                  title="⚡ Resetear proyecto o productora"
                  className="opacity-25 hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all ml-1"
                  aria-label={`Resetear grupo ${currentGroup.groupNumber}`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>

            {(() => {
              // Solo mostrar grupos que ya registraron su equipo o tienen proyecto asignado
              const readyGroups = groups.filter(
                g => g.isRegistered || g.status !== 'pendiente'
              );
              // Siempre incluir el grupo actualmente seleccionado
              const selectorGroups = readyGroups.some(g => g.id === selectedGroupId)
                ? readyGroups
                : [currentGroup, ...readyGroups].filter(Boolean);

              if (selectorGroups.length === 0) {
                return (
                  <p className="mt-1 text-[11px] text-slate-500 italic py-1.5">
                    El desplegable se completará a medida que los grupos carguen su equipo.
                  </p>
                );
              }

              return (
                <select
                  id="group-selector"
                  value={selectedGroupId}
                  onChange={(e) => {
                    sounds.playClick();
                    onSelectGroup(e.target.value);
                  }}
                  className="mt-1 bg-[#090b0e] border border-[#262e42] text-white rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-lime-400 w-full sm:w-80 cursor-pointer"
                >
                  {selectorGroups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.isRegistered || g.status !== 'pendiente'
                        ? `${g.productionCompany || g.groupName} (#${g.groupNumber})`
                        : `Grupo #${g.groupNumber} (sin registrar)`
                      } {g.status !== 'pendiente' ? '✓' : '·'} {g.membersList && g.membersList.length > 0 ? `${g.membersList.length} pax` : `${g.membersCount} pax`}
                    </option>
                  ))}
                </select>
              );
            })()}

            {/* Productora & Team Preview */}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1 font-bold text-lime-400">
                <Building2 className="w-3.5 h-3.5 text-lime-400" />
                <span>{currentGroup?.productionCompany || `${currentGroup?.groupName} Producciones`}</span>
              </span>
              {currentGroup?.producerEmail && (
                <span className="text-[11px] text-slate-500">
                  • {currentGroup.producerEmail}
                </span>
              )}
              {currentGroup?.membersList && currentGroup.membersList.length > 0 && (
                <span className="text-[11px] text-slate-300">
                  • {currentGroup.membersList.join(', ')}
                </span>
              )}
            </div>

            {/* Registration Gate Callout */}
            {!isGroupRegistrationComplete(currentGroup) ? (
              <div className="mt-3 p-3 rounded-xl bg-lime-400/10 border border-lime-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-lime-300 flex items-center gap-1.5">
                      <span>Paso 1: Registra tu Equipo para Desbloquear la Misión</span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Carga el nombre de la productora y los integrantes para habilitar el sorteo narrativo.
                    </p>
                  </div>
                </div>
                {onEditProducer && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onEditProducer(currentGroup);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-stone-950 font-black text-xs shrink-0 self-start sm:self-auto transition-colors shadow-sm active:scale-95"
                  >
                    Cargar Equipo
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-2.5 p-2 rounded-xl bg-[#090b0e] border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 text-[11px] font-medium">
                    Productora <strong>{currentGroup.productionCompany || currentGroup.groupName}</strong> ({currentGroup.membersList?.length || currentGroup.membersCount} integrantes registrados). ¡Misión desbloqueada!
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenIdeaGenerator && !isAssigned && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenIdeaGenerator(currentGroup);
                      }}
                      className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-1 rounded-lg border border-amber-400/20 transition-colors font-semibold"
                      title="Explorar combinaciones narrativas de inspiración"
                    >
                      <Shuffle className="w-3 h-3" />
                      ¿Sin ideas?
                    </button>
                  )}
                  {onEditProducer && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onEditProducer(currentGroup);
                      }}
                      className="text-[10px] text-slate-400 hover:text-lime-400 underline"
                    >
                      Modificar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions for current group */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {isAssigned && onOpenRoadmap && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenRoadmap(currentGroup);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400/40 text-xs font-bold text-lime-300 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-lime-400" />
              <span>Hoja de Ruta</span>
            </button>
          )}

          {onEditProducer && (
            <button
              onClick={() => {
                sounds.playClick();
                onEditProducer(currentGroup);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-xs font-semibold text-lime-400 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-lime-400" />
              <span>{isGroupRegistrationComplete(currentGroup) ? 'Editar Productora' : 'Registrar Equipo'}</span>
            </button>
          )}

          {isAssigned && onOpenCertificate && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCertificate(currentGroup);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-lime-400" />
              <span>Certificado</span>
            </button>
          )}

          <button
            onClick={handleNextGroup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>Siguiente Grupo</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Roulette Grid Reels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Locación en Jujuy */}
        <div className={`relative bg-[#121620] border rounded-2xl p-4 transition-all ${
          locks.location ? 'border-lime-400/60 bg-lime-400/5' : 'border-[#1f2637] hover:border-[#2b354c]'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-lime-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Locación en Jujuy</span>
            </div>
            <button
              onClick={() => toggleLock('location')}
              className={`p-1.5 rounded-lg border transition-colors ${
                locks.location
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-[#171c28] text-slate-400 border-[#252c3f] hover:text-white'
              }`}
              title={locks.location ? 'Desbloquear locación' : 'Bloquear locación fija'}
            >
              {locks.location ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="min-h-[92px] flex flex-col justify-center">
            {displayLocation ? (
              <>
                <span className="text-[11px] font-bold text-lime-400/90 uppercase tracking-wide">
                  {displayLocation.region}
                </span>
                <h4 className="text-base font-bold text-white leading-snug mt-0.5">
                  {displayLocation.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {displayLocation.description}
                </p>
              </>
            ) : (
              <div className="text-slate-500 text-xs italic py-4">Presiona "Lanzar Misión" para asignar locación</div>
            )}
          </div>
        </div>

        {/* 2. Género Narrativo */}
        <div className={`relative bg-[#121620] border rounded-2xl p-4 transition-all ${
          locks.genre ? 'border-lime-400/60 bg-lime-400/5' : 'border-[#1f2637] hover:border-[#2b354c]'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              <Film className="w-4 h-4" />
              <span>Género Narrativo</span>
            </div>
            <button
              onClick={() => toggleLock('genre')}
              className={`p-1.5 rounded-lg border transition-colors ${
                locks.genre
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-[#171c28] text-slate-400 border-[#252c3f] hover:text-white'
              }`}
              title={locks.genre ? 'Desbloquear género' : 'Bloquear género'}
            >
              {locks.genre ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="min-h-[92px] flex flex-col justify-center">
            {displayGenre ? (
              <>
                <h4 className="text-base font-bold text-white leading-snug">
                  {displayGenre.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {displayGenre.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {displayGenre.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] bg-[#171c28] text-slate-300 px-2 py-0.5 rounded-md border border-[#252c3f]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-xs italic py-4">Presiona "Lanzar Misión" para asignar género</div>
            )}
          </div>
        </div>

        {/* 3. Estilo Visual / Estético */}
        <div className={`relative bg-[#121620] border rounded-2xl p-4 transition-all ${
          locks.visualStyle ? 'border-lime-400/60 bg-lime-400/5' : 'border-[#1f2637] hover:border-[#2b354c]'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-fuchsia-400 uppercase tracking-wider">
              <Palette className="w-4 h-4" />
              <span>Estilo Visual de Imagen</span>
            </div>
            <button
              onClick={() => toggleLock('visualStyle')}
              className={`p-1.5 rounded-lg border transition-colors ${
                locks.visualStyle
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-[#171c28] text-slate-400 border-[#252c3f] hover:text-white'
              }`}
              title={locks.visualStyle ? 'Desbloquear estilo visual' : 'Bloquear estilo'}
            >
              {locks.visualStyle ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="min-h-[92px] flex flex-col justify-center">
            {displayStyle ? (
              <>
                <h4 className="text-base font-bold text-white leading-snug">
                  {displayStyle.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {displayStyle.description}
                </p>
                <span className="text-[11px] text-fuchsia-300/90 mt-2 font-medium truncate block bg-[#090b0e] p-1.5 rounded border border-[#1f2637]">
                  Atmósfera: {displayStyle.name}
                </span>
              </>
            ) : (
              <div className="text-slate-500 text-xs italic py-4">Presiona "Lanzar Misión" para asignar estilo visual</div>
            )}
          </div>
        </div>

        {/* 4. Personaje Protagónico */}
        <div className={`relative bg-[#121620] border rounded-2xl p-4 transition-all ${
          locks.character ? 'border-lime-400/60 bg-lime-400/5' : 'border-[#1f2637] hover:border-[#2b354c]'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Personaje Protagónico</span>
            </div>
            <button
              onClick={() => toggleLock('character')}
              className={`p-1.5 rounded-lg border transition-colors ${
                locks.character
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-[#171c28] text-slate-400 border-[#252c3f] hover:text-white'
              }`}
              title={locks.character ? 'Desbloquear personaje' : 'Bloquear personaje'}
            >
              {locks.character ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="min-h-[92px] flex flex-col justify-center">
            {displayCharacter ? (
              <>
                <h4 className="text-base font-bold text-white leading-snug">
                  {displayCharacter.archetype}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {displayCharacter.description}
                </p>
                <span className="text-[11px] text-emerald-400/90 mt-1.5 italic block">
                  📍 {displayCharacter.jujuyContext}
                </span>
              </>
            ) : (
              <div className="text-slate-500 text-xs italic py-4">Presiona "Lanzar Misión" para asignar personaje</div>
            )}
          </div>
        </div>

        {/* 5. Detonante / Premisa */}
        <div className={`relative bg-[#121620] border rounded-2xl p-4 transition-all ${
          locks.plotHook ? 'border-lime-400/60 bg-lime-400/5' : 'border-[#1f2637] hover:border-[#2b354c]'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Detonante / Conflicto</span>
            </div>
            <button
              onClick={() => toggleLock('plotHook')}
              className={`p-1.5 rounded-lg border transition-colors ${
                locks.plotHook
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-[#171c28] text-slate-400 border-[#252c3f] hover:text-white'
              }`}
              title={locks.plotHook ? 'Desbloquear premisa' : 'Bloquear premisa'}
            >
              {locks.plotHook ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="min-h-[92px] flex flex-col justify-center">
            {displayPlot ? (
              <>
                <h4 className="text-base font-bold text-white leading-snug">
                  {displayPlot.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {displayPlot.premise}
                </p>
                <p className="text-xs text-amber-300/90 mt-1 line-clamp-1 italic">
                  ⚡ Conflicto: {displayPlot.conflict}
                </p>
              </>
            ) : (
              <div className="text-slate-500 text-xs italic py-4">Presiona "Lanzar Misión" para asignar conflicto</div>
            )}
          </div>
        </div>

        {/* 6. Desafío del Taller de IA */}
        <div className={`relative bg-[#121620] border rounded-2xl p-4 transition-all ${
          locks.challenge ? 'border-lime-400/60 bg-lime-400/5' : 'border-[#1f2637] hover:border-[#2b354c]'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-rose-400 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Desafío del Taller</span>
            </div>
            <button
              onClick={() => toggleLock('challenge')}
              className={`p-1.5 rounded-lg border transition-colors ${
                locks.challenge
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-[#171c28] text-slate-400 border-[#252c3f] hover:text-white'
              }`}
              title={locks.challenge ? 'Desbloquear desafío' : 'Bloquear desafío'}
            >
              {locks.challenge ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="min-h-[92px] flex flex-col justify-center">
            {displayChallenge ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white leading-snug">
                    {displayChallenge.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30">
                    {displayChallenge.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  Entregables: {displayChallenge.deliverables.join(' • ')}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                  <span className="text-slate-500">Herramientas sugeridas:</span>
                  <span className="text-slate-300">{displayChallenge.suggestedTools.join(', ')}</span>
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-xs italic py-4">Presiona "Lanzar Misión" para asignar desafío</div>
            )}
          </div>
        </div>
      </div>

      {/* Surprise Twist Banner if active */}
      {includeSurpriseTwist && displayTwist && (
        <div className="p-3.5 rounded-xl bg-[#121620] border border-lime-400/40 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-lime-400 shrink-0" />
          <p className="text-xs text-lime-200 font-medium">
            {displayTwist}
          </p>
        </div>
      )}

      {/* Main Action Bar */}
      <div className="bg-[#121620] border border-[#1f2637] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-base tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
              isSpinning
                ? 'bg-lime-500 text-stone-950 cursor-wait animate-pulse'
                : !isGroupRegistrationComplete(currentGroup)
                ? 'bg-lime-400/15 hover:bg-lime-400/25 text-lime-300 border border-lime-400/40 shadow-sm'
                : 'bg-lime-400 text-stone-950 hover:bg-lime-300 shadow-lime-400/20 hover:shadow-lime-400/35'
            }`}
          >
            <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning
                ? 'Lanzando Misión...'
                : !isGroupRegistrationComplete(currentGroup)
                ? '⚠️ Paso 1: Cargar Equipo para Desbloquear'
                : isAssigned
                ? '¡Volver a Lanzar Misión!'
                : '🎲 ¡Lanzar Misión Narrativa!'}
            </span>
          </button>
          
          <span className="hidden lg:inline text-xs text-slate-400">
            {Object.values(locks).filter(Boolean).length > 0 && (
              <span className="text-lime-400 font-semibold">
                ({Object.values(locks).filter(Boolean).length} bloqueado/s)
              </span>
            )}
          </span>
        </div>

        {/* Assigned Project Fast Actions */}
        {isAssigned && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Ver Hoja de Ruta Inicial */}
            {onOpenRoadmap && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenRoadmap(currentGroup);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-black transition-all shadow-md shadow-lime-400/20"
              >
                <Compass className="w-4 h-4 text-stone-950" />
                <span>Hoja de Ruta Inicial</span>
              </button>
            )}

            {/* Ver Certificado Oficial */}
            {onOpenCertificate && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenCertificate(currentGroup);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                <Award className="w-4 h-4 text-lime-400" />
                <span>Certificado</span>
              </button>
            )}

            {/* Ver Ficha Narrativa */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenBriefModal(currentGroup);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-xs font-semibold text-slate-200 hover:text-lime-400 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Ficha Narrativa</span>
            </button>
          </div>
        )}
      </div>

      {/* Workshop Methodology Card: EL MÉTODO matching reference image */}
      <div className="bg-[#121620] border border-[#1f2637] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-lime-400 block">
              EL MÉTODO
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              El prompt no se escribe, se corrige.
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-[#090b0e] px-2.5 py-1 rounded-lg border border-[#1f2637]">
            Regla de Oro del Taller
          </span>
        </div>

        {/* 5 Steps pills like in the image */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            { step: '1', title: 'Prompt base, corto', desc: 'Sintético y conciso' },
            { step: '2', title: 'Generar cuatro con seeds distintas', desc: 'Explorar variaciones' },
            { step: '3', title: 'Elegir la que más se acerca', desc: 'Filtrar la mejor base' },
            { step: '4', title: 'Cambiar UNA sola cosa', desc: 'Ajuste controlado' },
            { step: '5', title: 'Repetir', desc: 'Iteración metódica' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#0c0e14] border border-[#1e2436] rounded-xl p-3 flex flex-col items-center text-center gap-2 hover:border-lime-400/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-lime-400 text-stone-950 font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-lime-400/25">
                {item.step}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-snug">{item.title}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Box from Image */}
        <div className="bg-[#090b0e] border border-[#1e2436] rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
          <p className="text-lime-300 font-semibold">
            💡 Cambiar tres cosas a la vez y que mejore no te enseña nada, porque no sabés cuál fue.
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Un prompt que funcionó es un activo, igual que un preset de color. Se guarda con su seed y su modelo. Cada grupo arranca hoy su biblioteca de prompts, y en la clase 5 las comparamos.
          </p>
        </div>
      </div>
    </div>
  );
};
