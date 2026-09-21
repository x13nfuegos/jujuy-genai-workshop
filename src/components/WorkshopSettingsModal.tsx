import React, { useState } from 'react';
import {
  X,
  Users,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { WorkshopConfig } from '../types';
import { sounds } from '../utils/audio';

interface WorkshopSettingsModalProps {
  config: WorkshopConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: WorkshopConfig) => void;
  onRegenerateGroups: (totalParticipants: number, groupSize: number) => void;
}

export const WorkshopSettingsModal: React.FC<WorkshopSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  onRegenerateGroups,
}) => {
  const [title, setTitle] = useState(config.workshopTitle);
  const [participants, setParticipants] = useState(config.totalParticipants);
  const [groupSize, setGroupSize] = useState(config.groupSize);
  const [includeTwist, setIncludeTwist] = useState(config.includeSurpriseTwist);
  const [difficulty, setDifficulty] = useState(config.aiChallengeDifficulty);

  if (!isOpen) return null;

  const calculatedGroups = Math.max(1, Math.ceil(participants / groupSize));

  const handleSave = () => {
    sounds.playClick();
    onSaveConfig({
      workshopTitle: title,
      totalParticipants: participants,
      groupSize,
      totalGroups: calculatedGroups,
      includeSurpriseTwist: includeTwist,
      aiChallengeDifficulty: difficulty,
    });
    onClose();
  };

  const handleRebuild = () => {
    if (window.confirm(`Esto regenerará la lista a ${calculatedGroups} grupos para ${participants} personas. ¿Deseas continuar?`)) {
      sounds.playClick();
      onRegenerateGroups(participants, groupSize);
      onSaveConfig({
        workshopTitle: title,
        totalParticipants: participants,
        groupSize,
        totalGroups: calculatedGroups,
        includeSurpriseTwist: includeTwist,
        aiChallengeDifficulty: difficulty,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2637] bg-[#0c0e14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Configuración del Taller
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste de participantes y dinámica de grupos
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Título del taller */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              Nombre del Taller o Evento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Participantes y Tamaño de grupo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">
                Total Participantes
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={participants}
                onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-lime-400"
              />
              <span className="text-[10px] text-slate-500">Ej: 80 personas</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">
                Integrantes por Grupo
              </label>
              <input
                type="number"
                min={2}
                max={15}
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-lime-400"
              />
              <span className="text-[10px] text-slate-500">Recomendado: 4 a 6</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-lime-400/10 border border-lime-400/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-lime-400" />
              <span className="text-slate-300 font-medium">Estructura resultante:</span>
            </div>
            <span className="text-sm font-bold text-lime-400">
              {calculatedGroups} Grupos (~{groupSize} pax)
            </span>
          </div>

          {/* Plot Twist Toggle */}
          <div className="pt-2 border-t border-[#1f2637] flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-semibold block">
                Incluir Giros Inesperados (Plot Twists)
              </span>
              <span className="text-[11px] text-slate-400">
                Añade restricciones o giros creativos sorpresa a las historias.
              </span>
            </div>
            <input
              type="checkbox"
              checked={includeTwist}
              onChange={(e) => setIncludeTwist(e.target.checked)}
              className="w-4 h-4 accent-lime-400 cursor-pointer"
            />
          </div>

          {/* AI Challenge Difficulty */}
          <div className="space-y-1.5 pt-2 border-t border-[#1f2637]">
            <label className="text-slate-300 font-semibold block">
              Filtro de Dificultad para Desafíos IA
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-[#0c0e14] p-1 rounded-xl border border-[#1f2637]">
              {(['Todos', 'Inicial', 'Intermedio', 'Avanzado'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    difficulty === diff
                      ? 'bg-lime-400 text-stone-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1f2637] bg-[#0c0e14] flex items-center justify-between gap-2">
          <button
            onClick={handleRebuild}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171c28] hover:bg-rose-950/40 border border-[#252c3f] hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerar Grupos</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 text-xs font-semibold transition-colors border border-[#252c3f]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-bold transition-colors shadow-md shadow-lime-400/20"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
