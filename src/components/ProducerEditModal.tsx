import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Mail,
  Users,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Award,
  FileText,
  Zap,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { GroupProject, ProjectLink } from '../types';
import { sounds } from '../utils/audio';

interface ProducerEditModalProps {
  group: GroupProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGroup: GroupProject) => void;
  onSaveAndLaunchMission?: (updatedGroup: GroupProject) => void;
  onOpenCertificate?: (group: GroupProject) => void;
  onOpenResetModal?: (group: GroupProject) => void;
}

const SAMPLE_NAMES = [
  'Valentina Choque',
  'Facundo Vilca',
  'Lucía Mamani',
  'Mateo Cazón',
  'Camila Quispe',
  'Joaquín Lamas',
  'Sofía Alancay',
  'Ramiro Apaza'
];

export const ProducerEditModal: React.FC<ProducerEditModalProps> = ({
  group,
  isOpen,
  onClose,
  onSave,
  onSaveAndLaunchMission,
  onOpenCertificate,
  onOpenResetModal,
}) => {
  const [productionCompany, setProductionCompany] = useState('');
  const [producerEmail, setProducerEmail] = useState('');
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    if (group) {
      setProductionCompany(group.productionCompany || `${group.groupName} Producciones`);
      setProducerEmail(group.producerEmail || '');
      setGroupName(group.groupName);
      setValidationError(null);
      setProjectLinks(group.projectLinks || []);
      setNewLinkLabel('');
      setNewLinkUrl('');
      
      if (group.membersList && group.membersList.length > 0) {
        setMembers(group.membersList);
      } else {
        // Initialize with empty or 3-4 prompt slots so user inputs real names
        setMembers([]);
      }
    }
  }, [group, isOpen]);

  if (!isOpen || !group) return null;

  const handleAddMember = () => {
    const trimmed = newMemberName.trim();
    if (!trimmed) return;
    sounds.playClick();
    setMembers([...members, trimmed]);
    setNewMemberName('');
    setValidationError(null);
  };

  const handleRemoveMember = (index: number) => {
    sounds.playClick();
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index] = val;
    setMembers(updated);
    setValidationError(null);
  };

  const handleApplyBulk = () => {
    sounds.playClick();
    const parsed = bulkText
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (parsed.length > 0) {
      setMembers(parsed);
      setShowBulkPaste(false);
      setBulkText('');
      setValidationError(null);
    }
  };

  const handleFillSample = () => {
    sounds.playClick();
    const count = Math.max(members.length || 4, group.membersCount || 4);
    const sample = SAMPLE_NAMES.slice(0, count);
    setMembers(sample);
    setValidationError(null);
  };

  const handleAddLink = () => {
    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();
    if (!label || !url) return;
    sounds.playClick();
    setProjectLinks(prev => [...prev, { label, url }]);
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (index: number) => {
    sounds.playClick();
    setProjectLinks(prev => prev.filter((_, i) => i !== index));
  };

  const cleanLinks = () => projectLinks.filter(l => l.label.trim() && l.url.trim());

  const getCleanGroupData = (): GroupProject | null => {
    const cleanMembers = members.map(m => m.trim()).filter(Boolean);
    const trimmedCompany = productionCompany.trim();

    if (!trimmedCompany) {
      setValidationError('Por favor ingresa el nombre de la productora o equipo.');
      return null;
    }

    if (cleanMembers.length === 0) {
      setValidationError('Por favor ingresa al menos un integrante del equipo.');
      return null;
    }

    return {
      ...group,
      groupName: groupName.trim() || group.groupName,
      productionCompany: trimmedCompany,
      producerEmail: producerEmail.trim(),
      membersList: cleanMembers,
      membersCount: cleanMembers.length > 0 ? cleanMembers.length : group.membersCount,
      isRegistered: true,
      projectLinks: cleanLinks(),
    };
  };

  const handleSaveOnly = () => {
    sounds.playClick();
    const cleanMembers = members.map(m => m.trim()).filter(Boolean);
    const updated: GroupProject = {
      ...group,
      groupName: groupName.trim() || group.groupName,
      productionCompany: productionCompany.trim() || `${group.groupName} Producciones`,
      producerEmail: producerEmail.trim(),
      membersList: cleanMembers,
      membersCount: cleanMembers.length > 0 ? cleanMembers.length : group.membersCount,
      isRegistered: cleanMembers.length > 0 && productionCompany.trim().length > 0,
      projectLinks: cleanLinks(),
    };
    onSave(updated);
    onClose();
  };


  const handleSaveAndLaunch = () => {
    const updated = getCleanGroupData();
    if (!updated) {
      sounds.playTick(0.6);
      return;
    }
    sounds.playClick();
    onSave(updated);
    onClose();
    if (onSaveAndLaunchMission) {
      onSaveAndLaunchMission(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121620] border border-[#1f2637] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2637] bg-[#0c0e14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">
                  {group.status === 'pendiente' ? 'Paso 1: Registro de Productora' : 'Ficha de Productora'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171c28] text-slate-300 border border-[#252c3f]">
                  Grupo #{group.groupNumber}
                </span>
                {group.status === 'pendiente' && (
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
                    Requerido para Misión
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {group.status === 'pendiente'
                  ? 'Ingresa el nombre de la productora y los integrantes para habilitar el sorteo narrativo.'
                  : 'Carga y actualización de productora, contacto e integrantes del equipo.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenResetModal && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onOpenResetModal(group);
                }}
                title="⚡ Menú de reinicio rápido de proyecto o productora"
                className="opacity-25 hover:opacity-100 p-1.5 rounded-lg bg-[#171c28] hover:bg-amber-400/20 text-slate-400 hover:text-amber-400 transition-all border border-[#252c3f]"
              >
                <Zap className="w-4 h-4 fill-current" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#171c28] hover:bg-[#202738] text-slate-400 hover:text-white transition-colors border border-[#252c3f]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="px-5 py-2.5 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Nombre de Productora */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Nombre de la Productora Audiovisual</span>
            </label>
            <input
              type="text"
              value={productionCompany}
              onChange={(e) => setProductionCompany(e.target.value)}
              placeholder="Ej: Puna Films, Pucará Studios, Tilcara Cine"
              className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-lime-400 placeholder:text-slate-600"
            />
          </div>

          {/* Nombre del Grupo / Alias de Mesa */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              Nombre de Mesa / Identificador
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Correo Electrónico de Contacto */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Correo Electrónico de la Productora</span>
            </label>
            <input
              type="email"
              value={producerEmail}
              onChange={(e) => setProducerEmail(e.target.value)}
              placeholder="contacto@productora.com"
              className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-lime-400 placeholder:text-slate-600"
            />
            <p className="text-[10px] text-slate-500">
              Se incluirá en el certificado oficial de asignación de proyecto.
            </p>
          </div>

          {/* Integrantes del Equipo */}
          <div className="pt-2 border-t border-[#1f2637] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-lime-400" />
                <span>Integrantes del Equipo ({members.length})</span>
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="text-[10px] text-lime-400 hover:text-lime-300 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Cargar nombres ejemplo</span>
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setShowBulkPaste(!showBulkPaste)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 hover:underline"
                >
                  {showBulkPaste ? 'Cerrar pegado' : 'Pegar lista'}
                </button>
              </div>
            </div>

            {/* Bulk Paste Box */}
            {showBulkPaste && (
              <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#1f2637] space-y-2">
                <p className="text-[11px] text-slate-400">
                  Pega los nombres de los integrantes (uno por línea o separados por coma):
                </p>
                <textarea
                  rows={3}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Juan Perez, María Gómez, Carlos Díaz..."
                  className="w-full bg-[#171c28] border border-[#252c3f] rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-lime-400"
                />
                <button
                  type="button"
                  onClick={handleApplyBulk}
                  className="px-3 py-1 bg-lime-400 text-stone-950 font-black rounded-lg text-[11px] shadow-sm"
                >
                  Aplicar Lista
                </button>
              </div>
            )}

            {/* Members List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 w-4 text-right">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={`Nombre del integrante ${index + 1}`}
                    className="flex-1 bg-[#0c0e14] border border-[#1f2637] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    title="Eliminar integrante"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-[#171c28] rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add member input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
                placeholder="Agregar nuevo integrante..."
                className="flex-1 bg-[#0c0e14] border border-[#1f2637] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#171c28] hover:bg-[#202738] text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-[#252c3f]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* ─── Links de Entregables ─── */}
          <div className="pt-2 border-t border-[#1f2637] space-y-2.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Links del Proyecto ({projectLinks.length})</span>
              <span className="text-[10px] text-slate-500 font-normal ml-1">opcional</span>
            </label>
            <p className="text-[10px] text-slate-500 leading-relaxed -mt-1">
              Cargá los links de los entregables: póster en Midjourney, video en Drive, audio en Suno, pitch en Canva, etc.
            </p>

            {/* Links list */}
            {projectLinks.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {projectLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#0c0e14] border border-[#1f2637] rounded-lg px-2.5 py-1.5">
                    <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white truncate">{link.label}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline truncate block"
                        onClick={e => e.stopPropagation()}
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(i)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-[#171c28] rounded transition-colors shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add link form */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={newLinkLabel}
                onChange={e => setNewLinkLabel(e.target.value)}
                placeholder="Etiqueta (ej: Póster en Midjourney)"
                className="w-full bg-[#0c0e14] border border-[#1f2637] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
                  placeholder="https://..."
                  className="flex-1 bg-[#0c0e14] border border-[#1f2637] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#171c28] hover:bg-[#202738] text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-[#252c3f] disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="p-4 border-t border-[#1f2637] bg-[#0c0e14] flex flex-wrap items-center justify-between gap-2">
          {group.status !== 'pendiente' && onOpenCertificate && (
            <button
              type="button"
              onClick={() => {
                handleSaveOnly();
                onOpenCertificate(group);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400/40 text-lime-300 text-xs font-semibold transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-lime-400" />
              <span>Ver Certificado</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] text-slate-300 text-xs font-semibold transition-colors border border-[#252c3f]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveOnly}
              className="px-3.5 py-2 rounded-xl bg-[#171c28] hover:bg-[#202738] border border-[#252c3f] text-slate-200 text-xs font-semibold transition-colors"
            >
              Guardar Datos
            </button>

            {onSaveAndLaunchMission && group.status === 'pendiente' && (
              <button
                type="button"
                onClick={handleSaveAndLaunch}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-black transition-all shadow-lg shadow-lime-400/20 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guardar y Lanzar Misión 🎲</span>
              </button>
            )}

            {group.status !== 'pendiente' && (
              <button
                type="button"
                onClick={handleSaveOnly}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-bold transition-colors shadow-md shadow-lime-400/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
