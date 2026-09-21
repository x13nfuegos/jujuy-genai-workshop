import React from 'react';
import {
  Sparkles,
  Users,
  Settings,
  Tv,
  Download,
  Volume2,
  VolumeX,
  BookOpen,
  Dices
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  totalParticipants: number;
  totalGroups: number;
  assignedCount: number;
  activeTab: 'ruleta' | 'grupos';
  setActiveTab: (tab: 'ruleta' | 'grupos') => void;
  onOpenSettings: () => void;
  onOpenDataBank: () => void;
  onExportMarkdown: () => void;
  onExportCSV: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalParticipants,
  totalGroups,
  assignedCount,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenDataBank,
  onExportMarkdown,
  onExportCSV,
  isFullscreen,
  onToggleFullscreen,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="border-b border-[#1e2330] bg-[#0c0e14]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Workshop Info */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg shadow-lime-400/20 text-stone-950 font-black">
              <Sparkles className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 block">
                  TALLER JUJUY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white font-sans">
                  Jujuy GenAI Workshop
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/30">
                  Edición 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Randomizador de Historias y Misiones de Creación
              </p>
            </div>
          </div>

          {/* Quick Stats on Mobile */}
          <div className="md:hidden flex items-center gap-2 text-xs bg-[#151924] px-2.5 py-1 rounded-lg border border-[#212738]">
            <Users className="w-3.5 h-3.5 text-lime-400" />
            <span className="font-semibold text-slate-200">{assignedCount}/{totalGroups}</span>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center bg-[#07090d] p-1 rounded-xl border border-[#1e2330] shadow-inner">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('ruleta');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ruleta'
                ? 'bg-lime-400 text-stone-950 shadow-md shadow-lime-400/20'
                : 'text-slate-400 hover:text-white hover:bg-[#121620]'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Mesa de Sorteo</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('grupos');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'grupos'
                ? 'bg-lime-400 text-stone-950 shadow-md shadow-lime-400/20'
                : 'text-slate-400 hover:text-white hover:bg-[#121620]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Todos los Grupos ({totalGroups})</span>
          </button>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Progress Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-[#131722] border border-[#1f2637] px-3 py-1.5 rounded-lg text-slate-300">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>{totalParticipants} Participantes</span>
            <span className="text-slate-600">•</span>
            <span className="text-lime-400 font-bold">{assignedCount} de {totalGroups} asignados</span>
          </div>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2 rounded-lg bg-[#141824] hover:bg-[#1c2233] border border-[#22283a] text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Banco de Datos Jujuy */}
          <button
            onClick={onOpenDataBank}
            title="Explorar banco cultural de Jujuy"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1c2233] border border-[#22283a] text-xs font-semibold text-slate-300 hover:text-lime-400 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Elementos Jujuy</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center border border-[#22283a] rounded-lg overflow-hidden bg-[#141824]">
            <button
              onClick={onExportMarkdown}
              title="Copiar resumen del taller para WhatsApp / Notion"
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-[#1c2233] hover:text-white transition-colors border-r border-[#22283a] flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Copiar Fichas</span>
            </button>
            <button
              onClick={onExportCSV}
              title="Descargar tabla CSV"
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-[#1c2233] hover:text-white transition-colors"
            >
              CSV
            </button>
          </div>

          {/* Workshop Settings */}
          <button
            onClick={onOpenSettings}
            title="Configurar participantes y grupos"
            className="p-2 rounded-lg bg-[#141824] hover:bg-[#1c2233] border border-[#22283a] text-slate-300 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen / Projector Mode */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Modo Proyector Pantalla Completa'}
            className={`p-2 rounded-lg border transition-colors ${
              isFullscreen
                ? 'bg-lime-400 text-stone-950 border-lime-400 font-bold'
                : 'bg-[#141824] hover:bg-[#1c2233] border-[#22283a] text-slate-300 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
