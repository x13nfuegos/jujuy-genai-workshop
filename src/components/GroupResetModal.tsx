import React from 'react';
import {
  Zap,
  X,
  RotateCcw,
  Building2,
  Trash2,
  AlertTriangle,
  Film,
  Users
} from 'lucide-react';
import { GroupProject } from '../types';
import { sounds } from '../utils/audio';

interface GroupResetModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  onClose: () => void;
  onResetProject: (group: GroupProject) => void;
  onResetProducer: (group: GroupProject) => void;
  onResetAll: (group: GroupProject) => void;
}

export const GroupResetModal: React.FC<GroupResetModalProps> = ({
  group,
  isOpen,
  onClose,
  onResetProject,
  onResetProducer,
  onResetAll,
}) => {
  if (!isOpen || !group) return null;

  const isAssigned = group.status !== 'pendiente';
  const hasProducerInfo = Boolean(
    (group.productionCompany && !group.productionCompany.includes('Producciones') && group.productionCompany.trim()) ||
    (group.membersList && group.membersList.length > 0) ||
    group.isRegistered
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2637] bg-[#0c0e14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-400/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Reinicio Rápido
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171c28] text-lime-400 border border-[#252c3f]">
                  Grupo #{group.groupNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Selecciona qué deseas restablecer para este grupo
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors border border-[#252c3f]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="p-4 bg-[#090b0e] border-b border-[#1f2637] text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Estado actual del Grupo #{group.groupNumber}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div className="bg-[#121620] p-2.5 rounded-xl border border-[#1f2637]">
              <span className="text-[10px] text-slate-500 block">Productora & Equipo:</span>
              <p className="font-semibold text-white truncate">{group.productionCompany || 'Sin productora'}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {group.membersList && group.membersList.length > 0
                  ? `${group.membersList.length} integrantes registrados`
                  : 'Sin integrantes cargados'}
              </p>
            </div>
            <div className="bg-[#121620] p-2.5 rounded-xl border border-[#1f2637]">
              <span className="text-[10px] text-slate-500 block">Misión Narrativa:</span>
              {isAssigned ? (
                <>
                  <p className="font-semibold text-lime-400 truncate">{group.genre?.name} en {group.location?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sorteado ({group.assignedAt || 'Hoy'})</p>
                </>
              ) : (
                <p className="font-semibold text-slate-400">Pendiente de sorteo</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions List */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {/* Option 1: Reset Narrative Project Only */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1f2637] hover:border-amber-400/40 transition-all space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    1. Resetear Solo Proyecto / Sorteo
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Conserva productora e integrantes
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onResetProject(group);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetear Proyecto</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-9">
              Borra la historia sorteada (locación, género, personajes, hoja de ruta y certificado). El grupo vuelve a estado <strong className="text-slate-200">Pendiente</strong> para volver a lanzar los dados sin tener que reingresar los datos del equipo.
            </p>
          </div>

          {/* Option 2: Reset Producer & Members Only */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1f2637] hover:border-cyan-400/40 transition-all space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    2. Resetear Solo Productora y Equipo
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    Limpia nombres y registro
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onResetProducer(group);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/50 text-cyan-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Resetear Equipo</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-9">
              Limpia el nombre de la productora y la lista de integrantes del equipo. Volverá a requerir el registro previo antes de poder sortear.
            </p>
          </div>

          {/* Option 3: Complete Reset */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-rose-500/20 hover:border-rose-500/40 transition-all space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-rose-200">
                    3. Reinicio Total (Todo en Blanco)
                  </h3>
                  <span className="text-[10px] text-rose-400 font-semibold">
                    Restablece proyecto + productora a valores iniciales
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onResetAll(group);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Reinicio Total</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-9">
              Restaura por completo este grupo como si acabara de iniciarse el taller: borra tanto la misión narrativa como los integrantes y la productora.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2637] bg-[#0c0e14] flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            ⚡ Acceso rápido para administradores del taller
          </p>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-slate-300 text-xs font-semibold transition-colors"
          >
            Cerrar sin cambios
          </button>
        </div>
      </div>
    </div>
  );
};
