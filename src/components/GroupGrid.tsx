import React, { useState } from 'react';
import {
  Search,
  Filter,
  Dices,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { GroupProject } from '../types';
import { GroupCard } from './GroupCard';
import { sounds } from '../utils/audio';

interface GroupGridProps {
  groups: GroupProject[];
  onSpinGroup: (group: GroupProject) => void;
  onSpinAllPending: () => void;
  onResetAll: () => void;
  onOpenBrief: (group: GroupProject) => void;
  onOpenCertificate: (group: GroupProject) => void;
  onOpenRoadmap?: (group: GroupProject) => void;
  onEditProducer: (group: GroupProject) => void;
  onResetGroup?: (group: GroupProject) => void;
  onOpenIdeaGenerator?: (group: GroupProject) => void;
}

export const GroupGrid: React.FC<GroupGridProps> = ({
  groups,
  onSpinGroup,
  onSpinAllPending,
  onResetAll,
  onOpenBrief,
  onOpenCertificate,
  onOpenRoadmap,
  onEditProducer,
  onResetGroup,
  onOpenIdeaGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendiente' | 'sorteado'>('todos');

  const pendingCount = groups.filter(g => g.status === 'pendiente').length;
  const assignedCount = groups.filter(g => g.status !== 'pendiente').length;

  const filteredGroups = groups.filter(g => {
    const matchesStatus = filterStatus === 'todos' ? true : g.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesQuery =
      g.groupName.toLowerCase().includes(query) ||
      g.groupNumber.toString().includes(query) ||
      (g.location?.name.toLowerCase().includes(query) ?? false) ||
      (g.genre?.name.toLowerCase().includes(query) ?? false) ||
      (g.character?.archetype.toLowerCase().includes(query) ?? false);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Control Bar: Filters, Search & Bulk Operations */}
      <div className="bg-[#121620] border border-[#1f2637] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por grupo, locación, género..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0c0e14] border border-[#1f2637] text-slate-200 text-xs rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0c0e14] p-1 rounded-xl border border-[#1f2637] self-start md:self-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setFilterStatus('todos');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'todos'
                ? 'bg-lime-400 text-stone-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({groups.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilterStatus('sorteado');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterStatus === 'sorteado'
                ? 'bg-lime-400 text-stone-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sorteados ({assignedCount})</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setFilterStatus('pendiente');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterStatus === 'pendiente'
                ? 'bg-[#171c28] text-lime-400 border border-lime-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pendientes ({pendingCount})</span>
          </button>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {pendingCount > 0 && (
            <button
              onClick={() => {
                sounds.playClick();
                onSpinAllPending();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 font-black text-xs transition-all shadow-md shadow-lime-400/20 active:scale-95"
            >
              <Dices className="w-4 h-4" />
              <span>Sortear Todos ({pendingCount})</span>
            </button>
          )}

          {assignedCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar los sorteos de todos los grupos a estado pendiente?')) {
                  sounds.playClick();
                  onResetAll();
                }
              }}
              title="Restablecer todos los sorteos"
              className="p-2 rounded-xl bg-[#171c28] hover:bg-rose-950/40 border border-[#252c3f] hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Groups */}
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onSpinThisGroup={onSpinGroup}
              onOpenBrief={onOpenBrief}
              onOpenCertificate={onOpenCertificate}
              onOpenRoadmap={onOpenRoadmap}
              onEditProducer={onEditProducer}
              onResetGroup={onResetGroup}
              onOpenIdeaGenerator={onOpenIdeaGenerator}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#121620] border border-[#1f2637] rounded-2xl p-8">
          <p className="text-slate-400 text-sm">
            No se encontraron grupos que coincidan con la búsqueda "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-xs text-lime-400 hover:underline font-semibold"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>
      )}
    </div>
  );
};
