import React, { useState, useRef } from 'react';
import {
  X,
  Award,
  Download,
  Printer,
  Copy,
  Check,
  Building2,
  Mail,
  Users,
  MapPin,
  Film,
  Palette,
  User,
  Zap,
  Target,
  Sparkles,
  ShieldCheck,
  Edit3,
  Share2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { GroupProject } from '../types';
import { sounds } from '../utils/audio';

interface ProjectCertificateModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  onClose: () => void;
  onEditProducer?: (group: GroupProject) => void;
}

export const ProjectCertificateModal: React.FC<ProjectCertificateModalProps> = ({
  group,
  isOpen,
  onClose,
  onEditProducer,
}) => {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !group) return null;

  const certCode = group.certificateCode || `CERT-JUJ-${String(group.groupNumber).padStart(2, '0')}-2026`;
  const issuedDate = group.certificateIssuedAt || new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const producerName = group.productionCompany || `${group.groupName} Producciones`;
  const email = group.producerEmail || 'Sin registrar';
  const members = group.membersList && group.membersList.length > 0
    ? group.membersList
    : Array.from({ length: group.membersCount }, (_, i) => `Participante ${i + 1}`);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    try {
      setIsExportingPng(true);
      sounds.playClick();

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0c0a09',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanName = (group.productionCompany || `grupo-${group.groupNumber}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      link.download = `certificado-${cleanName}-${certCode}.png`;
      link.href = image;
      link.click();
      sounds.playCelebration();
    } catch (err) {
      console.error('Error generating certificate image:', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleCopySummary = () => {
    sounds.playClick();
    const summary = `🏆 CERTIFICADO OFICIAL DE ASIGNACIÓN DE PROYECTO
TALLER DE INTELIGENCIA ARTIFICIAL GENERATIVA • JUJUY 2026
Código: ${certCode} | Fecha: ${issuedDate}

🎬 PRODUCTORA: ${producerName}
🏷️ GRUPO: ${group.groupName} (Mesa #${group.groupNumber})
✉️ CONTACTO: ${email}
👥 INTEGRANTES:
${members.map((m, i) => `  ${i + 1}. ${m}`).join('\n')}

---
📌 PROYECTO: ${group.aiBrief?.tituloProyecto || group.groupName}
📖 LOGLINE: ${group.aiBrief?.logline || 'Sin logline'}

VARIABLES SORTEADAS:
📍 Locación en Jujuy: ${group.location?.name} (${group.location?.region})
🎥 Género: ${group.genre?.name}
🎨 Estilo Visual: ${group.visualStyle?.name}
👤 Protagonista: ${group.character?.archetype}
⚡ Detonante / Trama: ${group.plotHook?.title} - ${group.plotHook?.premise}
🎯 Desafío IA: ${group.aiChallenge?.title} (${group.aiChallenge?.difficulty})
${group.surpriseTwist ? `🌪️ Giro Sorpresa: ${group.surpriseTwist}\n` : ''}
🖼️ Prompt Hero:
${group.aiBrief?.promptsListos?.imagenHero || ''}
`;
    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Modal Controls */}
        <div className="p-4 border-b border-stone-800 bg-stone-950/80 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Certificado de Proyecto de Productora
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {certCode}
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Constancia oficial con todas las variables narrativas y técnicas asignadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditProducer && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onEditProducer(group);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Editar Productora</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-[#252c3f]"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copiado' : 'Copiar Acta'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white transition-colors border border-[#252c3f]"
              title="Imprimir o Guardar en PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isExportingPng}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 font-black text-xs transition-all shadow-md shadow-lime-400/20 active:scale-95 disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${isExportingPng ? 'animate-bounce' : ''}`} />
              <span>{isExportingPng ? 'Generando PNG...' : 'Descargar PNG'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors border border-[#252c3f]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#090b0e]">
          {/* THE CERTIFICATE DOCUMENT (Captured for PNG and Print) */}
          <div
            ref={certificateRef}
            className="certificate-print-area max-w-3xl mx-auto bg-[#121620] border-2 border-lime-400/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100 selection:bg-lime-400 selection:text-stone-950"
            style={{
              backgroundImage: 'radial-gradient(ellipse at top right, rgba(163, 230, 53, 0.08), transparent 60%), radial-gradient(ellipse at bottom left, rgba(163, 230, 53, 0.04), transparent 60%)'
            }}
          >
            {/* Ornamental Frame Borders */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-lime-400/20 rounded-xl pointer-events-none" />
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-lime-400/80" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-lime-400/80" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-lime-400/80" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-lime-400/80" />

            {/* Header: Institution & Certificate Title */}
            <div className="text-center relative z-10 space-y-2 border-b border-lime-400/30 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Taller de Inteligencia Artificial Generativa • Jujuy 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 uppercase">
                Certificado de Asignación de Proyecto
              </h1>
              <p className="text-xs text-stone-400 max-w-xl mx-auto">
                Acta oficial de asignación de consignas creativas, territorio andino, arquetipos y desafíos técnicos para desarrollo con herramientas de IA Generativa.
              </p>
              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1 font-mono">
                <span>N° Registro: <strong className="text-amber-400">{certCode}</strong></span>
                <span>•</span>
                <span>Fecha: <strong className="text-stone-200">{issuedDate}</strong></span>
              </div>
            </div>

            {/* Section 1: Productora & Equipo */}
            <div className="my-5 bg-stone-950/80 border border-amber-500/30 rounded-xl p-4.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                <div>
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                    Productora Audiovisual Asignada
                  </span>
                  <h2 className="text-lg font-black text-amber-200 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>{producerName}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-stone-400 bg-stone-900 px-2 py-1 rounded-md border border-stone-800">
                    Mesa #{group.groupNumber} ({group.groupName})
                  </span>
                  {group.producerEmail && (
                    <span className="text-cyan-400 flex items-center gap-1 bg-cyan-950/40 px-2 py-1 rounded-md border border-cyan-500/30 text-[11px]">
                      <Mail className="w-3 h-3" />
                      <span>{group.producerEmail}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Integrantes */}
              <div>
                <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>Equipo Creativo ({members.length} Integrantes):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {members.map((member, i) => (
                    <span
                      key={i}
                      className="text-xs bg-stone-900 border border-stone-700/80 text-stone-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{member}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: El Proyecto & Logline */}
            <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-stone-950/60 to-stone-950/80 border border-stone-800">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Proyecto Asignado
              </span>
              <h3 className="text-base font-bold text-stone-100 mt-0.5">
                {group.aiBrief?.tituloProyecto || group.groupName}
              </h3>
              <p className="text-xs text-stone-300 italic mt-1 leading-relaxed">
                "{group.aiBrief?.logline || 'Proyecto de narrativa audiovisual generativa con identidad cultural jujeña.'}"
              </p>
            </div>

            {/* Section 3: Grilla de Variables Sorteadas */}
            <div className="my-5 space-y-2">
              <h4 className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Variables Creativas & Técnicas Sorteadas</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Locación Jujuy */}
                <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Locación en Jujuy</span>
                  </div>
                  <p className="font-bold text-stone-100 text-xs">
                    {group.location?.name || 'Por sortear'}
                  </p>
                  <p className="text-[11px] text-amber-300/80">
                    Región: {group.location?.region}
                  </p>
                </div>

                {/* Género */}
                <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold mb-1">
                    <Film className="w-3.5 h-3.5 shrink-0" />
                    <span>Género Narrativo</span>
                  </div>
                  <p className="font-bold text-stone-100 text-xs">
                    {group.genre?.name || 'Por sortear'}
                  </p>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    {group.genre?.description}
                  </p>
                </div>

                {/* Estilo Visual */}
                <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-fuchsia-400 text-xs font-semibold mb-1">
                    <Palette className="w-3.5 h-3.5 shrink-0" />
                    <span>Estilo Visual / Estética IA</span>
                  </div>
                  <p className="font-bold text-stone-100 text-xs">
                    {group.visualStyle?.name || 'Por sortear'}
                  </p>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    {group.visualStyle?.description}
                  </p>
                </div>

                {/* Protagonista */}
                <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>Arquetipo Protagonista</span>
                  </div>
                  <p className="font-bold text-stone-100 text-xs">
                    {group.character?.archetype || 'Por sortear'}
                  </p>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    {group.character?.jujuyContext}
                  </p>
                </div>

                {/* Detonante */}
                <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl sm:col-span-2">
                  <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold mb-1">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>Detonante / Conflicto Dramático</span>
                  </div>
                  <p className="font-bold text-stone-100 text-xs">
                    {group.plotHook?.title || 'Por sortear'}
                  </p>
                  <p className="text-[11px] text-stone-300">
                    {group.plotHook?.premise}
                  </p>
                </div>

                {/* Desafío de IA */}
                <div className="bg-stone-950/90 border border-stone-800 p-3 rounded-xl sm:col-span-2">
                  <div className="flex items-center justify-between gap-1 text-rose-400 text-xs font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 shrink-0" />
                      <span>Desafío de IA & Entregables</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      Nivel: {group.aiChallenge?.difficulty || 'General'}
                    </span>
                  </div>
                  <p className="font-bold text-stone-100 text-xs">
                    {group.aiChallenge?.title || 'Por sortear'}
                  </p>
                  <ul className="mt-1.5 space-y-0.5 text-[11px] text-stone-300">
                    {group.aiChallenge?.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Giro Inesperado si existe */}
                {group.surpriseTwist && (
                  <div className="bg-lime-400/10 border border-lime-400/30 p-3 rounded-xl sm:col-span-2">
                    <span className="text-[10px] font-bold text-lime-300 uppercase tracking-wider block mb-0.5">
                      🌪️ Giro Inesperado / Restricción de Taller
                    </span>
                    <p className="text-xs text-lime-100">
                      {group.surpriseTwist}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div className="mt-8 pt-6 border-t border-lime-400/30 grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center border-b border-[#262e42] pb-1">
                  <span className="font-serif italic text-xs text-lime-300/80">Dirección Académica IA</span>
                </div>
                <p className="text-[10px] font-bold text-slate-300">Facilitación y Tutoría</p>
                <p className="text-[9px] text-slate-500">Taller IA Jujuy 2026</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-lime-400/40 bg-lime-400/10 flex flex-col items-center justify-center text-lime-400 p-1">
                  <Award className="w-5 h-5" />
                  <span className="text-[7px] font-bold uppercase tracking-tighter mt-0.5">VÁLIDO</span>
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-1">OFICIAL 2026</span>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center border-b border-[#262e42] pb-1">
                  <span className="font-serif italic text-xs text-slate-300">
                    {members[0] || producerName}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-300">Representante de Productora</p>
                <p className="text-[9px] text-slate-500">{producerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-[#1f2637] bg-[#0c0e14] flex items-center justify-between text-xs text-slate-400 no-print">
          <span>Este certificado certifica la autenticidad de los parámetros otorgados por el algoritmo de sorteo.</span>
          <button
            type="button"
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
