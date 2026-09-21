import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Film,
  Palette,
  User,
  Target,
  Award,
  Building2,
  Mail,
  Users,
  Compass,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { GroupProject } from '../types';
import { sounds } from '../utils/audio';

interface ProjectBriefModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate?: (group: GroupProject) => void;
  onOpenRoadmap?: (group: GroupProject) => void;
}

export const ProjectBriefModal: React.FC<ProjectBriefModalProps> = ({
  group,
  isOpen,
  onClose,
  onOpenCertificate,
  onOpenRoadmap,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen || !group) return null;

  const brief = group.aiBrief;

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    if (!brief) return;
    const fullText = `*FICHA DE PROYECTO: ${brief.tituloProyecto}*
*Productora:* ${group.productionCompany || group.groupName} (#${group.groupNumber})
*Integrantes:* ${group.membersList?.join(', ') || `${group.membersCount} integrantes`}
*Locación:* ${group.location?.name} (${group.location?.region})
*Género:* ${group.genre?.name}
*Estilo:* ${group.visualStyle?.name}
*Protagonista:* ${group.character?.archetype}
*Detonante:* ${group.plotHook?.title}

*Logline:* 
${brief.logline}

*Sinopsis:*
${brief.sinopsisNarrativa}

*Vínculo Territorial con Jujuy:*
${brief.vinculoJujuy}

*ENTREGABLES:*
${brief.misionDelGrupo.map((m, i) => `${i + 1}. ${m}`).join('\n')}
`;
    navigator.clipboard.writeText(fullText);
    sounds.playClick();
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1f2637] bg-[#0c0e14] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-lime-400/20 text-lime-400 border border-lime-400/30">
                Grupo #{group.groupNumber}
              </span>
              <span className="text-xs text-slate-400">
                {group.membersCount} participantes
              </span>
              {group.surpriseTwist && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-300 font-semibold border border-lime-400/30">
                  Giro Activo
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {brief?.tituloProyecto || group.groupName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 italic">
              {brief?.logline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Productora & Integrantes Box */}
          <div className="bg-[#0c0e14] p-3.5 rounded-xl border border-[#1f2637] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span className="text-xs font-bold text-white">
                  {group.productionCompany || `${group.groupName} Producciones`}
                </span>
                {group.certificateCode && (
                  <span className="text-[10px] font-mono text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/30">
                    {group.certificateCode}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                {group.producerEmail && (
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Mail className="w-3 h-3" />
                    <span>{group.producerEmail}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>
                    {group.membersList && group.membersList.length > 0
                      ? `Integrantes: ${group.membersList.join(', ')}`
                      : `${group.membersCount} integrantes`}
                  </span>
                </span>
              </div>
            </div>

            {onOpenCertificate && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenCertificate(group);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400/40 text-lime-300 text-xs font-semibold transition-colors shrink-0"
              >
                <Award className="w-3.5 h-3.5 text-lime-400" />
                <span>Ver Certificado Oficial</span>
              </button>
            )}
          </div>

          {/* Metadata Badges Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#0c0e14] p-3 rounded-xl border border-[#1f2637]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Locación Jujuy</span>
              <span className="text-xs font-bold text-lime-300 block truncate">{group.location?.name}</span>
              <span className="text-[10px] text-slate-400">{group.location?.region}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Género</span>
              <span className="text-xs font-bold text-cyan-300 block truncate">{group.genre?.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Estilo Visual</span>
              <span className="text-xs font-bold text-fuchsia-300 block truncate">{group.visualStyle?.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Protagonista</span>
              <span className="text-xs font-bold text-emerald-300 block truncate">{group.character?.archetype}</span>
            </div>
          </div>

          {/* Sinopsis Narrativa & Raíces Jujeñas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              <span>Sinopsis & Premisa de la Historia</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0c0e14] p-3.5 rounded-xl border border-[#1f2637]">
              {brief?.sinopsisNarrativa}
            </p>

            {brief?.vinculoJujuy && (
              <div className="p-3 bg-lime-400/5 border border-lime-400/20 rounded-xl text-xs text-lime-200/90 leading-relaxed">
                <span className="font-bold text-lime-400">Vínculo Territorial e Identidad Jujeña: </span>
                {brief.vinculoJujuy}
              </div>
            )}
          </div>

          {/* Personajes Clave */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Personajes y Arquetipos</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {brief?.personajesDetalle.map((p, idx) => (
                <div key={idx} className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.nombre}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#171c28] text-slate-400 font-medium">
                      {p.rol}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {p.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Entregables del Taller */}
          <div className="bg-[#0c0e14] border border-[#1f2637] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Entregables para este Grupo ({group.aiChallenge?.title})</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {brief?.misionDelGrupo.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-1.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links de Entregables cargados */}
          {group.projectLinks && group.projectLinks.length > 0 && (
            <div className="bg-[#0c0e14] border border-cyan-400/20 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-4 h-4" />
                <span>Links Entregados por el Grupo</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20 ml-auto">
                  {group.projectLinks.length} link{group.projectLinks.length !== 1 ? 's' : ''}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.projectLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/25 text-cyan-300 text-xs font-medium transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="max-w-[180px] truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#1f2637] bg-[#0c0e14] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-200 text-xs font-semibold transition-colors border border-[#252c3f]"
            >
              {copiedSection === 'all' ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSection === 'all' ? '¡Todo Copiado!' : 'Copiar Ficha Completa'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRoadmap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRoadmap(group);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-bold transition-colors shadow-sm"
                title="Ver Hoja de Ruta Inicial de la Historia"
              >
                <Compass className="w-3.5 h-3.5 text-stone-950" />
                <span>Hoja de Ruta</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white text-xs transition-colors border border-[#252c3f]"
              title="Imprimir ficha para la mesa del grupo"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-200 text-xs font-semibold transition-colors border border-[#252c3f]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
