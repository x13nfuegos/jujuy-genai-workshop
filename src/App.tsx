import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RouletteSpinner } from './components/RouletteSpinner';
import { GroupGrid } from './components/GroupGrid';
import { ProjectBriefModal } from './components/ProjectBriefModal';
import { WorkshopSettingsModal } from './components/WorkshopSettingsModal';
import { DataBankModal } from './components/DataBankModal';
import { ProjectCertificateModal } from './components/ProjectCertificateModal';
import { ProducerEditModal } from './components/ProducerEditModal';
import { StoryRoadmapModal } from './components/StoryRoadmapModal';
import { GroupResetModal } from './components/GroupResetModal';
import { IdeaGeneratorModal } from './components/IdeaGeneratorModal';
import type { IdeaCombination } from './components/IdeaGeneratorModal';
import { GroupProject, WorkshopConfig } from './types';
import {
  generateInitialGroups,
  assignProjectToGroup,
  assignProjectsToAllGroups,
  resetGroupProject,
  resetGroupProducer,
  resetGroupCompletely,
  exportGroupsToCSV,
  exportGroupsToMarkdown,
  fireCelebration,
  buildLocalAIBrief,
  generateCertificateCode,
} from './utils/generator';
import { sounds } from './utils/audio';
import { Sparkles, Check, Info } from 'lucide-react';

const STORAGE_GROUPS_KEY = 'jujuy_workshop_groups_v1';
const STORAGE_CONFIG_KEY = 'jujuy_workshop_config_v1';

const DEFAULT_CONFIG: WorkshopConfig = {
  workshopTitle: 'Taller de IA Generativa - Jujuy 2026',
  totalParticipants: 80,
  groupSize: 5,
  totalGroups: 16,
  includeSurpriseTwist: true,
  aiChallengeDifficulty: 'Todos',
};

export default function App() {
  // Load config from localStorage
  const [config, setConfig] = useState<WorkshopConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });

  // Load groups from localStorage or generate defaults (80 pax, 5 per group = 16 groups)
  const [groups, setGroups] = useState<GroupProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GROUPS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return generateInitialGroups(DEFAULT_CONFIG.totalParticipants, DEFAULT_CONFIG.groupSize);
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    return groups[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<'ruleta' | 'grupos'>('ruleta');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Modals state
  const [briefModalGroup, setBriefModalGroup] = useState<GroupProject | null>(null);
  const [certificateModalGroup, setCertificateModalGroup] = useState<GroupProject | null>(null);
  const [producerEditModalGroup, setProducerEditModalGroup] = useState<GroupProject | null>(null);
  const [roadmapModalGroup, setRoadmapModalGroup] = useState<GroupProject | null>(null);
  const [resetModalGroup, setResetModalGroup] = useState<GroupProject | null>(null);
  const [ideaGeneratorGroup, setIdeaGeneratorGroup] = useState<GroupProject | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDataBankOpen, setIsDataBankOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(groups));
    } catch {}
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  // Keep selected group valid
  useEffect(() => {
    if (!groups.find(g => g.id === selectedGroupId) && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Toggle audio
  const toggleMute = () => {
    sounds.isMuted = !sounds.isMuted;
    setIsMuted(sounds.isMuted);
    if (!sounds.isMuted) {
      sounds.playClick();
    }
  };

  // Update a single group
  const handleUpdateGroup = (updatedGroup: GroupProject) => {
    setGroups(prev => prev.map(g => (g.id === updatedGroup.id ? updatedGroup : g)));
    // If brief modal is open for this group, update it as well
    if (briefModalGroup && briefModalGroup.id === updatedGroup.id) {
      setBriefModalGroup(updatedGroup);
    }
  };

  // Spin a specific group from grid
  const handleSpinGroupFromGrid = (targetGroup: GroupProject) => {
    setSelectedGroupId(targetGroup.id);
    setActiveTab('ruleta');
  };

  // Bulk spin for all pending groups
  const handleSpinAllPending = () => {
    const updated = assignProjectsToAllGroups(groups, {
      includeTwist: config.includeSurpriseTwist,
      difficulty: config.aiChallengeDifficulty,
    });
    setGroups(updated);
    sounds.playCelebration();
    fireCelebration();
    showToast('¡Todos los grupos pendientes han sido sorteados con éxito!');
  };

  // Reset all groups to pending
  const handleResetAll = () => {
    setGroups(prev =>
      prev.map(g => ({
        ...g,
        status: 'pendiente',
        genre: undefined,
        visualStyle: undefined,
        location: undefined,
        character: undefined,
        secondaryCharacter: undefined,
        plotHook: undefined,
        aiChallenge: undefined,
        surpriseTwist: undefined,
        aiBrief: undefined,
        assignedAt: undefined,
      }))
    );
    showToast('Se restablecieron todos los grupos a estado pendiente.');
  };

  // Reset individual group actions (Secret Zap button)
  const handleOpenResetModal = (group: GroupProject) => {
    sounds.playClick();
    setResetModalGroup(group);
  };

  const handleResetGroupProject = (group: GroupProject) => {
    const updated = resetGroupProject(group);
    handleUpdateGroup(updated);
    sounds.playClick();
    showToast(`Proyecto del Grupo #${group.groupNumber} restablecido a pendiente.`);
  };

  const handleResetGroupProducer = (group: GroupProject) => {
    const updated = resetGroupProducer(group);
    handleUpdateGroup(updated);
    sounds.playClick();
    showToast(`Ficha de productora del Grupo #${group.groupNumber} restablecida.`);
  };

  const handleResetGroupCompletely = (group: GroupProject) => {
    const updated = resetGroupCompletely(group);
    handleUpdateGroup(updated);
    sounds.playClick();
    showToast(`Grupo #${group.groupNumber} restablecido por completo.`);
  };

  // Idea Generator handlers
  const handleOpenIdeaGenerator = (group: GroupProject) => {
    sounds.playClick();
    setIdeaGeneratorGroup(group);
  };

  const handleUseGeneratedIdea = (group: GroupProject, idea: IdeaCombination) => {
    const certificateCode = group.certificateCode || generateCertificateCode(group.groupNumber);
    const updated: GroupProject = {
      ...group,
      genre: idea.genre,
      location: idea.location,
      character: idea.character,
      plotHook: idea.plotHook,
      status: 'sorteado',
      certificateCode,
      certificateIssuedAt: group.certificateIssuedAt || new Date().toLocaleString('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    updated.aiBrief = buildLocalAIBrief(updated);
    handleUpdateGroup(updated);
    fireCelebration();
    showToast(`¡Idea asignada al Grupo #${group.groupNumber}! 🎉`);
    setIdeaGeneratorGroup(null);
  };

  // Rebuild groups from settings
  const handleRegenerateGroups = (participants: number, groupSize: number) => {
    const newGroups = generateInitialGroups(participants, groupSize);
    setGroups(newGroups);
    setSelectedGroupId(newGroups[0]?.id || '');
    showToast(`Se crearon ${newGroups.length} grupos para ${participants} personas.`);
  };

  // Export handlers
  const handleExportMarkdown = () => {
    const md = exportGroupsToMarkdown(groups);
    navigator.clipboard.writeText(md);
    sounds.playClick();
    showToast('¡Resumen de todos los grupos copiado al portapapeles!');
  };

  const handleExportCSV = () => {
    const csvContent = exportGroupsToCSV(groups);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `taller-jujuy-grupos-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sounds.playClick();
    showToast('Archivo CSV descargado.');
  };

  const handleOpenCertificate = (group: GroupProject) => {
    sounds.playClick();
    setCertificateModalGroup(group);
  };

  const handleOpenRoadmap = (group: GroupProject) => {
    sounds.playClick();
    setRoadmapModalGroup(group);
  };

  const handleSaveRoadmapNotes = (group: GroupProject, notes: string) => {
    const updated = { ...group, roadmapNotes: notes };
    handleUpdateGroup(updated);
    if (roadmapModalGroup && roadmapModalGroup.id === group.id) {
      setRoadmapModalGroup(updated);
    }
    showToast('Notas de la hoja de ruta guardadas.');
  };

  const handleOpenProducerEdit = (group: GroupProject) => {
    sounds.playClick();
    setProducerEditModalGroup(group);
  };

  const handleSaveProducer = (updatedGroup: GroupProject) => {
    handleUpdateGroup(updatedGroup);
    showToast(`Productora "${updatedGroup.productionCompany || updatedGroup.groupName}" guardada.`);
  };

  const handleSaveAndLaunchMission = (registeredGroup: GroupProject) => {
    sounds.playCelebration();
    const assigned = assignProjectToGroup(registeredGroup, {
      includeTwist: config.includeSurpriseTwist,
      difficulty: config.aiChallengeDifficulty,
    });
    handleUpdateGroup(assigned);
    setSelectedGroupId(assigned.id);
    setActiveTab('ruleta');
    fireCelebration();
    showToast(`¡Misión narrativa lanzada para ${assigned.productionCompany || assigned.groupName}!`);
    setTimeout(() => {
      setRoadmapModalGroup(assigned);
    }, 1100);
  };

  const assignedCount = groups.filter(g => g.status !== 'pendiente').length;

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-stone-950">
      {/* Top Header */}
      <Header
        totalParticipants={config.totalParticipants}
        totalGroups={groups.length}
        assignedCount={assignedCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => { sounds.playClick(); setIsSettingsOpen(true); }}
        onOpenDataBank={() => { sounds.playClick(); setIsDataBankOpen(true); }}
        onExportMarkdown={handleExportMarkdown}
        onExportCSV={handleExportCSV}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'ruleta' ? (
          <RouletteSpinner
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={setSelectedGroupId}
            onUpdateGroup={handleUpdateGroup}
            onOpenBriefModal={(group) => {
              sounds.playClick();
              setBriefModalGroup(group);
            }}
            onOpenCertificate={handleOpenCertificate}
            onOpenRoadmap={handleOpenRoadmap}
            onEditProducer={handleOpenProducerEdit}
            onResetGroup={handleOpenResetModal}
            onOpenIdeaGenerator={handleOpenIdeaGenerator}
            includeSurpriseTwist={config.includeSurpriseTwist}
          />
        ) : (
          <GroupGrid
            groups={groups}
            onSpinGroup={handleSpinGroupFromGrid}
            onSpinAllPending={handleSpinAllPending}
            onResetAll={handleResetAll}
            onOpenBrief={(group) => {
              sounds.playClick();
              setBriefModalGroup(group);
            }}
            onOpenCertificate={handleOpenCertificate}
            onOpenRoadmap={handleOpenRoadmap}
            onEditProducer={handleOpenProducerEdit}
            onResetGroup={handleOpenResetModal}
            onOpenIdeaGenerator={handleOpenIdeaGenerator}
          />
        )}
      </main>

      {/* Brief / Details Modal */}
      <ProjectBriefModal
        group={briefModalGroup}
        isOpen={Boolean(briefModalGroup)}
        onClose={() => setBriefModalGroup(null)}
        onOpenCertificate={handleOpenCertificate}
        onOpenRoadmap={handleOpenRoadmap}
      />

      {/* Official Project Certificate Modal */}
      <ProjectCertificateModal
        group={certificateModalGroup}
        isOpen={Boolean(certificateModalGroup)}
        onClose={() => setCertificateModalGroup(null)}
        onEditProducer={handleOpenProducerEdit}
      />

      {/* Story Roadmap (Hoja de Ruta Inicial de la Historia) Modal */}
      <StoryRoadmapModal
        group={roadmapModalGroup}
        isOpen={Boolean(roadmapModalGroup)}
        onClose={() => setRoadmapModalGroup(null)}
        onOpenCertificate={handleOpenCertificate}
        onOpenBrief={(group) => {
          sounds.playClick();
          setBriefModalGroup(group);
        }}
        onSaveNotes={handleSaveRoadmapNotes}
      />

      {/* Producer & Members Edit Modal */}
      <ProducerEditModal
        group={producerEditModalGroup}
        isOpen={Boolean(producerEditModalGroup)}
        onClose={() => setProducerEditModalGroup(null)}
        onSave={handleSaveProducer}
        onSaveAndLaunchMission={handleSaveAndLaunchMission}
        onOpenCertificate={handleOpenCertificate}
        onOpenResetModal={handleOpenResetModal}
      />

      {/* Secret Zap Quick Reset Modal */}
      <GroupResetModal
        group={resetModalGroup}
        isOpen={Boolean(resetModalGroup)}
        onClose={() => setResetModalGroup(null)}
        onResetProject={handleResetGroupProject}
        onResetProducer={handleResetGroupProducer}
        onResetAll={handleResetGroupCompletely}
      />

      {/* Idea Generator / Inspiration Modal */}
      <IdeaGeneratorModal
        group={ideaGeneratorGroup}
        isOpen={Boolean(ideaGeneratorGroup)}
        onClose={() => setIdeaGeneratorGroup(null)}
        onUseIdea={handleUseGeneratedIdea}
      />

      {/* Workshop Settings Modal */}
      <WorkshopSettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveConfig={(newConfig) => {
          setConfig(newConfig);
          showToast('Configuración guardada.');
        }}
        onRegenerateGroups={handleRegenerateGroups}
      />

      {/* Data Bank Explorer Modal */}
      <DataBankModal
        isOpen={isDataBankOpen}
        onClose={() => setIsDataBankOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#121620] border border-lime-400/50 text-white px-4 py-2.5 rounded-xl shadow-2xl animate-bounce text-xs font-semibold shadow-lime-400/10">
          <Sparkles className="w-4 h-4 text-lime-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-[#1f2637] bg-[#0c0e14] py-4 text-center text-xs text-slate-400">
        <p>
          Taller de IA Generativa en Jujuy • Diseñado para dinámicas grupales con 80 personas • Quebrada, Puna, Yungas y Valles
        </p>
      </footer>
    </div>
  );
}
