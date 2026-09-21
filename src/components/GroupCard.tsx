import React from 'react';
import {
  Sparkles,
  MapPin,
  Film,
  Palette,
  User,
  Target,
  FileText,
  Dices,
  Building2,
  Award,
  Edit3,
  Compass,
  Zap,
  Lightbulb,
  Link2,
} from 'lucide-react';
import { GroupProject } from '../types';
import { isGroupRegistrationComplete } from '../utils/generator';

interface GroupCardProps {
  group: GroupProject;
  onSpinThisGroup: (group: GroupProject) => void;
  onOpenBrief: (group: GroupProject) => void;
  onOpenCertificate: (group: GroupProject) => void;
  onOpenRoadmap?: (group: GroupProject) => void;
  onEditProducer: (group: GroupProject) => void;
  onResetGroup?: (group: GroupProject) => void;
  onOpenIdeaGenerator?: (group: GroupProject) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onSpinThisGroup,
  onOpenBrief,
  onOpenCertificate,
  onOpenRoadmap,
  onEditProducer,
  onResetGroup,
  onOpenIdeaGenerator,
}) => {
  const isAssigned = group.status !== 'pendiente';
  const producerName = group.productionCompany || `${group.groupName} Producciones`;

  return (
    <div className={`rounded-2xl border transition-all flex flex-col justify-between ${
      isAssigned
        ? 'bg-[#121620] border-[#1f2637] hover:border-lime-400/50 shadow-lg'
        : 'bg-[#0f131c]/60 border-dashed border-[#1f2637] hover:border-lime-400/40'
    }`}>
      {/* Card Header */}
      <div className="p-4 border-b border-[#1f2637]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#171c28] text-lime-400 border border-[#252c3f]">
                #{group.groupNumber}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {group.membersList && group.membersList.length > 0 ? `${group.membersList.length} miembros` : `${group.membersCount} pax`}
              </span>
              {group.certificateCode && (
                <span className="text-[9px] font-mono text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded border border-lime-400/20">
                  {group.certificateCode}
                </span>
              )}
            </div>

            {/* Productora Name */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <h3 className="text-xs font-bold text-white truncate" title={producerName}>
                {producerName}
              </h3>
              <button
                type="button"
                onClick={() => onEditProducer(group)}
                title="Editar datos de productora e integrantes"
                className="p-1 rounded text-slate-400 hover:text-lime-400 hover:bg-[#171c28] transition-colors ml-auto"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            {/* Sub-info: Group Identifier & Email */}
            <p className="text-[10px] text-slate-400 truncate pl-5">
              {group.groupName}
              {group.producerEmail ? ` • ${group.producerEmail}` : ''}
            </p>
          </div>

          {/* Status badge & icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Links indicator */}
            {group.projectLinks && group.projectLinks.length > 0 && (
              <span
                title={`${group.projectLinks.length} link${group.projectLinks.length !== 1 ? 's' : ''} cargado${group.projectLinks.length !== 1 ? 's' : ''}`}
                className="flex items-center gap-0.5 text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20"
              >
                <Link2 className="w-2.5 h-2.5" />
                {group.projectLinks.length}
              </span>
            )}

            {isAssigned ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Asignado
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-400 border border-lime-400/30">
                Pendiente
              </span>
            )}

            {onResetGroup && (
              <button
                type="button"
                onClick={() => onResetGroup(group)}
                title="⚡ Resetear proyecto o productora"
                className="opacity-20 hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                aria-label={`Resetear grupo ${group.groupNumber}`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 text-xs flex-1">
        {/* Integrantes list preview if present */}
        {group.membersList && group.membersList.length > 0 && (
          <div className="bg-[#090b0e] p-2 rounded-lg border border-[#1f2637] text-[11px] text-slate-300">
            <span className="text-[9px] text-slate-500 uppercase font-semibold block mb-0.5">Equipo:</span>
            <p className="line-clamp-1 text-slate-300">
              {group.membersList.join(', ')}
            </p>
          </div>
        )}

        {isAssigned ? (
          <>
            {/* Locación Jujuy */}
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Locación:</span>
                <p className="font-semibold text-white line-clamp-1">{group.location?.name}</p>
                <span className="text-[10px] text-lime-400/90 font-medium">{group.location?.region}</span>
              </div>
            </div>

            {/* Género & Estilo */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1f2637]">
              <div className="flex items-start gap-1.5">
                <Film className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-slate-500 text-[10px] block">Género</span>
                  <span className="font-medium text-slate-200 text-[11px] truncate block">
                    {group.genre?.name}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Palette className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-slate-500 text-[10px] block">Estilo</span>
                  <span className="font-medium text-slate-200 text-[11px] truncate block">
                    {group.visualStyle?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Personaje */}
            <div className="flex items-start gap-2 pt-1 border-t border-[#1f2637]">
              <User className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 text-[10px] block">Protagonista</span>
                <span className="font-medium text-slate-200 line-clamp-1">
                  {group.character?.archetype}
                </span>
              </div>
            </div>

            {/* Desafío IA */}
            <div className="flex items-start gap-2 pt-1 border-t border-[#1f2637]">
              <Target className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 text-[10px] block">Desafío Taller</span>
                <span className="font-medium text-slate-200 line-clamp-1">
                  {group.aiChallenge?.title}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-5 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#171c28] flex items-center justify-center text-lime-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              Sin proyecto asignado aún.<br />
              <span className="text-slate-500">Girá la ruleta o explorá ideas.</span>
            </p>
            <div className="flex flex-col items-center gap-1.5 mt-1 w-full px-2">
              <button
                type="button"
                onClick={() => onSpinThisGroup(group)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 text-stone-950 text-xs font-black hover:bg-lime-300 transition-all shadow-sm"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Girar la Ruleta</span>
              </button>
              <div className="flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => onEditProducer(group)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] text-slate-300 text-xs font-medium transition-colors border border-[#252c3f]"
                >
                  <Building2 className="w-3 h-3" />
                  <span>Cargar Equipo</span>
                </button>
                {onOpenIdeaGenerator && (
                  <button
                    type="button"
                    onClick={() => onOpenIdeaGenerator(group)}
                    title="Explorar combinaciones de ideas narrativas"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/25 text-amber-300 text-xs font-medium transition-colors"
                  >
                    <Lightbulb className="w-3 h-3" />
                    <span>Sin ideas?</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-2.5 bg-[#0c0e14] border-t border-[#1f2637] rounded-b-2xl flex items-center justify-between gap-1.5">
        {isAssigned ? (
          <>
            {onOpenRoadmap && (
              <button
                type="button"
                onClick={() => onOpenRoadmap(group)}
                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-black transition-colors"
                title="Ver Hoja de Ruta Inicial de la Historia"
              >
                <Compass className="w-3.5 h-3.5 text-stone-950" />
                <span>Ruta</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenCertificate(group)}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-slate-200 hover:text-white text-xs font-semibold transition-colors"
              title="Ver y descargar certificado oficial"
            >
              <Award className="w-3.5 h-3.5 text-lime-400" />
              <span>Certificado</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenBrief(group)}
              className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-slate-200 text-xs font-medium transition-colors"
              title="Ver ficha narrativa"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Ficha</span>
            </button>

            <button
              type="button"
              onClick={() => onSpinThisGroup(group)}
              title="Lanzar o volver a sortear para este grupo"
              className="p-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-lime-400 transition-colors border border-[#252c3f]"
            >
              <Dices className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              {!isGroupRegistrationComplete(group) ? (
                <span className="text-lime-400 font-semibold">⚠️ Requiere registro</span>
              ) : (
                'Listo para misión'
              )}
            </span>
            <button
              type="button"
              onClick={() => onEditProducer(group)}
              className="text-lime-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Edit3 className="w-3 h-3" />
              <span>{!isGroupRegistrationComplete(group) ? 'Cargar Integrantes' : 'Ver Equipo'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
