import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound } from 'lucide-react';
import type { GroupProject } from '../types';

interface PinPromptModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (pin: string) => void;
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({
  group,
  isOpen,
  error,
  onClose,
  onSubmit,
}) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (isOpen) setPin('');
  }, [isOpen, group?.id]);

  if (!isOpen || !group) return null;

  const enviar = () => {
    const limpio = pin.trim();
    if (limpio.length < 4) return;
    onSubmit(limpio);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl border border-[#1f2637] bg-[#0c0e14] p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-400/10 p-2">
              <Lock className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {group.productionCompany || group.groupName}
              </h2>
              <p className="text-[11px] text-slate-400">
                Grupo #{group.groupNumber} · protegido con PIN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-xs leading-relaxed text-slate-400">
          Este equipo reservó su ficha con un PIN. Ingresalo para guardar los
          cambios, o usá el PIN maestro del taller.
        </p>

        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar()}
          placeholder="PIN del equipo"
          className="w-full rounded-xl border border-[#1f2637] bg-[#121620] px-3.5 py-2.5 text-sm tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-slate-600 focus:border-lime-400/60 focus:outline-none"
        />

        {error && (
          <p className="mt-2 text-[11px] font-semibold text-red-400">{error}</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#1f2637] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            onClick={enviar}
            disabled={pin.trim().length < 4}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold text-stone-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Desbloquear
          </button>
        </div>
      </div>
    </div>
  );
};
