import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Compass,
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
  Award,
  FileText,
  Clock,
  CheckCircle2,
  Save,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { GroupProject } from '../types';
import { sounds } from '../utils/audio';

interface StoryRoadmapModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGroup?: (updatedGroup: GroupProject) => void;
  onSaveNotes?: (group: GroupProject, notes: string) => void;
  onOpenCertificate?: (group: GroupProject) => void;
  onOpenBrief?: (group: GroupProject) => void;
}

interface RoadmapStage {
  stepNumber: number;
  timeEstimate: string;
  title: string;
  goal: string;
  tasks: string[];
  recommendedTool: string;
}

export const StoryRoadmapModal: React.FC<StoryRoadmapModalProps> = ({
  group,
  isOpen,
  onClose,
  onUpdateGroup,
  onSaveNotes,
  onOpenCertificate,
  onOpenBrief,
}) => {
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedFeedback, setNotesSavedFeedback] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (group) {
      setNotes(group.roadmapNotes || group.notes || '');
    }
  }, [group, isOpen]);

  if (!isOpen || !group) return null;

  const producerName = group.productionCompany || `${group.groupName} Producciones`;
  const email = group.producerEmail || 'Sin registrar';
  const members = group.membersList && group.membersList.length > 0
    ? group.membersList
    : Array.from({ length: group.membersCount }, (_, i) => `Participante ${i + 1}`);
  const code = group.certificateCode || `ROADMAP-JUJ-${String(group.groupNumber).padStart(2, '0')}-2026`;
  const issuedDate = group.certificateIssuedAt || new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const projectTitle = group.aiBrief?.tituloProyecto || `${group.genre?.name || 'Historia'} en ${group.location?.name || 'Jujuy'}`;
  const projectLogline = group.aiBrief?.logline || group.plotHook?.premise || 'Proyecto cinematográfico generado con herramientas de IA en el paisaje jujeño.';

  const roadmapStages: RoadmapStage[] = [
    {
      stepNumber: 1,
      timeEstimate: '0:00 - 1:00 h',
      title: 'Biblia de Mundo & Territorio Jujeño',
      goal: `Anclar la trama en ${group.location?.name || 'Jujuy'} (${group.location?.region || 'Región Andina'}) y definir la relación del protagonista (${group.character?.archetype || 'Protagonista'}) con el entorno.`,
      tasks: [
        `Explorar la geografía de ${group.location?.name || 'la locación'} y rasgos culturales locales.`,
        `Definir la motivación dramática frente al conflicto: "${group.plotHook?.title || 'Detonante'}".`,
        'Asignar roles de equipo: Dirección de Prompts, Guión, Paisaje Sonoro y Montaje.'
      ],
      recommendedTool: 'Gemini / Claude / ChatGPT para Worldbuilding'
    },
    {
      stepNumber: 2,
      timeEstimate: '1:00 - 2:30 h',
      title: 'Visual Concept Art & Estética de IA',
      goal: `Materializar el estilo visual "${group.visualStyle?.name || 'Estilo Visual'}" y diseñar el aspecto consistente del protagonista.`,
      tasks: [
        'Ejecutar el Prompt Semilla Maestro en el generador de imágenes.',
        'Generar 4 fotogramas clave de escenografía y primer plano del protagonista.',
        'Mantener consistencia de iluminación, textura y paleta de color andina.'
      ],
      recommendedTool: 'Midjourney / Flux.1 / Leonardo AI'
    },
    {
      stepNumber: 3,
      timeEstimate: '2:30 - 4:00 h',
      title: 'Escaleta Narrativa & Guión de Escena Clave',
      goal: `Desarrollar la estructura en tres actos que culmine en el detonante "${group.plotHook?.title || 'Conflicto'}".`,
      tasks: [
        'Escribir la sinopsis escena por escena (Escaleta de 5 a 8 secuencias).',
        'Redactar el diálogo o monólogo interior de la escena cúlmine.',
        'Diseñar el Storyboard con referencias de los planos generados en Fase 2.'
      ],
      recommendedTool: 'Gemini Story Assistant / Highland'
    },
    {
      stepNumber: 4,
      timeEstimate: '4:00 - 5:30 h',
      title: 'Paisaje Sonoro & Animación de Cuadros',
      goal: 'Generar la atmósfera sonora de Jujuy (viento, acústica mineral, texturas sonoras) y animar planos estáticos.',
      tasks: [
        `Generar música incidental afín al género ${group.genre?.name || 'del proyecto'}.`,
        'Sintetizar la voz en off del protagonista con modulación dramática.',
        'Dar movimiento cinemático a los planos heroicos con modelos de video generativo.'
      ],
      recommendedTool: 'Suno / Udio / ElevenLabs / Runway / Kling'
    },
    {
      stepNumber: 5,
      timeEstimate: '5:30 - 7:00 h',
      title: 'Cumplimiento del Desafío IA & Pitch Final',
      goal: `Garantizar la entrega del desafío "${group.aiChallenge?.title || 'Desafío IA'}" y ensayar la defensa ante el taller.`,
      tasks: [
        `Verificar entregables: ${group.aiChallenge?.deliverables?.join(' • ') || 'Teaser + Ficha Técnica'}.`,
        'Ensamblar la maqueta final en video o presentación ejecutiva.',
        'Preparar el pitch de 3 minutos destacando el uso de IA y el arraigo en Jujuy.'
      ],
      recommendedTool: 'CapCut / Premiere / Canva'
    }
  ];

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleDownloadPNG = async () => {
    if (!roadmapRef.current) return;
    try {
      setIsExportingPng(true);
      sounds.playClick();

      const canvas = await html2canvas(roadmapRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0c0a09',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanName = producerName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.download = `hoja-de-ruta-${cleanName}-${code}.png`;
      link.href = image;
      link.click();
      sounds.playCelebration();
    } catch (err) {
      console.error('Error generating roadmap image:', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleCopyRoadmap = () => {
    sounds.playClick();
    const summary = `🗺️ HOJA DE RUTA INICIAL DE LA HISTORIA
TALLER DE INTELIGENCIA ARTIFICIAL GENERATIVA • JUJUY 2026
Código de Misión: ${code} | Fecha: ${issuedDate}

🎬 PRODUCTORA: ${producerName} (Mesa #${group.groupNumber})
✉️ CONTACTO: ${email}
👥 INTEGRANTES DEL EQUIPO:
${members.map((m, i) => `  ${i + 1}. ${m}`).join('\n')}

========================================
📌 PROYECTO: ${projectTitle}
📖 LOGLINE: ${projectLogline}
========================================

🎯 VARIABLES NARRATIVAS DE JUJUY:
• Locación: ${group.location?.name} (${group.location?.region})
• Género: ${group.genre?.name}
• Estilo Visual: ${group.visualStyle?.name}
• Protagonista: ${group.character?.archetype} (${group.character?.jujuyContext})
• Detonante: ${group.plotHook?.title} - ${group.plotHook?.premise}
• Desafío IA: ${group.aiChallenge?.title} (Dificultad: ${group.aiChallenge?.difficulty})
${group.surpriseTwist ? `• Giro Inesperado: ${group.surpriseTwist}\n` : ''}

📅 FASES DE PRODUCCIÓN:
${roadmapStages.map(s => `[${s.timeEstimate}] ${s.stepNumber}. ${s.title}
Meta: ${s.goal}
Tareas:
${s.tasks.map(t => `  - ${t}`).join('\n')}
Herramientas: ${s.recommendedTool}
`).join('\n')}

📝 ACUERDOS DEL EQUIPO:
${notes || 'Sin notas registradas'}
`;
    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSaveNotes = () => {
    sounds.playClick();
    setIsSavingNotes(true);
    if (onSaveNotes) {
      onSaveNotes(group, notes);
    } else if (onUpdateGroup) {
      const updated: GroupProject = {
        ...group,
        roadmapNotes: notes,
        notes: notes,
      };
      onUpdateGroup(updated);
    }
    setTimeout(() => {
      setIsSavingNotes(false);
      setNotesSavedFeedback(true);
      setTimeout(() => setNotesSavedFeedback(false), 2000);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]">
        {/* Top Controls Bar */}
        <div className="p-4 border-b border-[#1f2637] bg-[#0c0e14] flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center text-stone-950 font-black shadow-md shadow-lime-400/20">
              <Compass className="w-4 h-4 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white">
                  Hoja de Ruta Inicial de la Historia
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30">
                  {code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Guía de producción creativa capturada tras el lanzamiento de la misión narrativa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenCertificate && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenCertificate(group);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-[#252c3f]"
              >
                <Award className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">Ver Certificado</span>
              </button>
            )}

            {onOpenBrief && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenBrief(group);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-[#252c3f]"
              >
                <FileText className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">Ver Ficha</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyRoadmap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-[#252c3f]"
              title="Copiar texto completo de la hoja de ruta"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copiada' : 'Copiar'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 hover:text-white transition-colors border border-[#252c3f]"
              title="Imprimir o Exportar PDF"
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
              <span>{isExportingPng ? 'Generando...' : 'Descargar PNG'}</span>
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

        {/* Scrollable Document Area */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-[#090b0e]">
          <div
            ref={roadmapRef}
            className="certificate-print-area max-w-4xl mx-auto bg-[#121620] border border-lime-400/30 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6 text-slate-100"
            style={{
              backgroundImage: 'radial-gradient(ellipse at top, rgba(163, 230, 53, 0.05), transparent 70%), radial-gradient(ellipse at bottom, rgba(163, 230, 53, 0.03), transparent 70%)'
            }}
          >
            {/* Header: Institution & Document Title */}
            <div className="text-center space-y-2 border-b border-[#1f2637] pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Taller de Inteligencia Artificial Generativa • Jujuy 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-200 via-lime-400 to-emerald-300 uppercase tracking-tight">
                Hoja de Ruta Inicial de la Historia
              </h1>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                Plan de desarrollo audiovisual generado a partir de la misión narrativa asignada al equipo.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>Misión: <strong className="text-lime-400">{code}</strong></span>
                <span>•</span>
                <span>Fecha: <strong className="text-slate-300">{issuedDate}</strong></span>
              </div>
            </div>

            {/* Block 1: Productora & Integrantes */}
            <div className="bg-[#0c0e14] border border-[#1f2637] rounded-xl p-4.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2637] pb-3">
                <div>
                  <span className="text-[10px] text-lime-400 font-semibold uppercase tracking-wider block">
                    Productora Responsable
                  </span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-lime-400" />
                    <h2 className="text-lg font-bold text-white">
                      {producerName}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-[#171c28] border border-[#252c3f] px-2.5 py-1 rounded-md text-slate-300">
                    Mesa #{group.groupNumber}
                  </span>
                  {group.producerEmail && (
                    <span className="flex items-center gap-1 text-lime-400 bg-lime-400/10 border border-lime-400/30 px-2.5 py-1 rounded-md text-[11px]">
                      <Mail className="w-3 h-3" />
                      <span>{group.producerEmail}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Integrantes List */}
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-lime-400" />
                  <span>Integrantes del Equipo ({members.length}):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {members.map((member, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#171c28] border border-[#252c3f] text-slate-200 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-lime-400" />
                      <span>{member}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 2: Premisa & Logline de la Historia */}
            <div className="bg-gradient-to-r from-lime-950/20 via-[#0c0e14] to-[#0c0e14] border border-lime-400/20 rounded-xl p-4.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-lime-400" />
                  <span>Proyecto Asignado</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-[#171c28] px-2 py-0.5 rounded border border-[#252c3f]">
                  Género: {group.genre?.name}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {projectTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{projectLogline}"
              </p>
            </div>

            {/* Block 3: Matriz de Variables de Jujuy (Capturadas) */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                <span>Variables Narrativas & Técnicas Sorteadas</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {/* Locación */}
                <div className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-lime-400 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Locación en Jujuy</span>
                  </div>
                  <p className="font-bold text-white">{group.location?.name}</p>
                  <p className="text-[11px] text-lime-400/90 font-medium">{group.location?.region}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{group.location?.description}</p>
                </div>

                {/* Género */}
                <div className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-cyan-400 font-semibold mb-1">
                    <Film className="w-3.5 h-3.5 shrink-0" />
                    <span>Género Narrativo</span>
                  </div>
                  <p className="font-bold text-white">{group.genre?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{group.genre?.description}</p>
                </div>

                {/* Estilo Visual */}
                <div className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-fuchsia-400 font-semibold mb-1">
                    <Palette className="w-3.5 h-3.5 shrink-0" />
                    <span>Estilo Visual / IA</span>
                  </div>
                  <p className="font-bold text-white">{group.visualStyle?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{group.visualStyle?.description}</p>
                </div>

                {/* Protagonista */}
                <div className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>Protagonista</span>
                  </div>
                  <p className="font-bold text-white">{group.character?.archetype}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{group.character?.jujuyContext}</p>
                </div>

                {/* Detonante */}
                <div className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl sm:col-span-2">
                  <div className="flex items-center gap-1 text-lime-400 font-semibold mb-1">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>Detonante / Conflicto Dramático</span>
                  </div>
                  <p className="font-bold text-white">{group.plotHook?.title}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{group.plotHook?.premise}</p>
                </div>

                {/* Desafío de IA */}
                <div className="bg-[#0c0e14] border border-[#1f2637] p-3 rounded-xl sm:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between text-rose-400 font-semibold mb-1">
                    <div className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 shrink-0" />
                      <span>Desafío de IA del Taller</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      Nivel: {group.aiChallenge?.difficulty}
                    </span>
                  </div>
                  <p className="font-bold text-white">{group.aiChallenge?.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {group.aiChallenge?.deliverables.map((d, i) => (
                      <span key={i} className="bg-[#171c28] border border-[#252c3f] px-2 py-0.5 rounded text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-lime-400" />
                        <span>{d}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Giro Sorpresa */}
                {group.surpriseTwist && (
                  <div className="bg-lime-400/10 border border-lime-400/30 p-3 rounded-xl sm:col-span-2 lg:col-span-3">
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

            {/* Block 4: Fases de la Hoja de Ruta (Roadmap del Taller) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-lime-400" />
                  <span>Fases de Producción Recomendadas (Roadmap)</span>
                </h4>
                <span className="text-[10px] text-slate-400">Jornada Intensiva de Creación</span>
              </div>

              <div className="space-y-2.5">
                {roadmapStages.map((stage) => (
                  <div
                    key={stage.stepNumber}
                    className="bg-[#0c0e14] border border-[#1f2637] rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row gap-3 items-start"
                  >
                    {/* Step indicator */}
                    <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1 shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-lime-400/15 border border-lime-400/40 text-lime-400 font-black flex items-center justify-center text-xs">
                        0{stage.stepNumber}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {stage.timeEstimate}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{stage.title}</span>
                        </h5>
                        <span className="text-[10px] text-slate-400 bg-[#171c28] px-2 py-0.5 rounded border border-[#252c3f]">
                          Herramientas: {stage.recommendedTool}
                        </span>
                      </div>

                      <p className="text-[11px] text-lime-300/90 font-medium">
                        Meta: {stage.goal}
                      </p>

                      <ul className="space-y-1 text-[11px] text-slate-300 pl-1">
                        {stage.tasks.map((task, tidx) => (
                          <li key={tidx} className="flex items-start gap-1.5">
                            <span className="text-lime-400 font-bold">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block 5: Acuerdos y Notas del Equipo */}
            <div className="bg-[#0c0e14] border border-[#1f2637] rounded-xl p-4 space-y-2 no-print">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-lime-400" />
                  <span>Notas y Acuerdos de la Productora (Persistente)</span>
                </span>
                {notesSavedFeedback && (
                  <span className="text-[10px] text-lime-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Guardado</span>
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anoten aquí los acuerdos iniciales del grupo, división de roles, idea de desenlace..."
                className="w-full bg-[#171c28] border border-[#252c3f] rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-lime-400"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="flex items-center gap-1.5 px-3 py-1 bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-black rounded-lg transition-colors shadow-sm"
                >
                  <Save className="w-3 h-3" />
                  <span>{isSavingNotes ? 'Guardando...' : 'Guardar Notas en Hoja de Ruta'}</span>
                </button>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-4 border-t border-lime-400/20 grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="h-9 flex items-end justify-center border-b border-[#252c3f] pb-1">
                  <span className="font-serif italic text-xs text-lime-300">
                    {members[0] || producerName}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-300">Responsable de Productora</p>
                <p className="text-[9px] text-slate-500">{producerName}</p>
              </div>

              <div className="space-y-1">
                <div className="h-9 flex items-end justify-center border-b border-[#252c3f] pb-1">
                  <span className="font-serif italic text-xs text-lime-300">Facilitación y Tutoría IA</span>
                </div>
                <p className="text-[10px] font-bold text-slate-300">Dirección Académica</p>
                <p className="text-[9px] text-slate-500">Taller Jujuy 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#1f2637] bg-[#0c0e14] flex items-center justify-between text-xs text-slate-400 no-print">
          <span>Esta hoja de ruta guía el flujo de trabajo de tu equipo durante el taller.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-200 text-xs font-semibold transition-colors border border-[#252c3f]"
          >
            Cerrar Hoja de Ruta
          </button>
        </div>
      </div>
    </div>
  );
};
