export interface JujuyLocation {
  id: string;
  name: string;
  region: 'Quebrada de Humahuaca' | 'La Puna' | 'Las Yungas' | 'Los Valles';
  description: string;
  iconTag: string;
}

export interface GenreItem {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface VisualStyleItem {
  id: string;
  name: string;
  description: string;
  promptSuffix: string;
}

export interface CharacterItem {
  id: string;
  archetype: string;
  description: string;
  jujuyContext: string;
}

export interface PlotHookItem {
  id: string;
  title: string;
  premise: string;
  conflict: string;
}

export interface AIChallengeItem {
  id: string;
  title: string;
  deliverables: string[];
  suggestedTools: string[];
  difficulty: 'Inicial' | 'Intermedio' | 'Avanzado';
}

export interface ProjectBriefAI {
  tituloProyecto: string;
  logline: string;
  sinopsisNarrativa: string;
  vinculoJujuy: string;
  personajesDetalle: Array<{
    nombre: string;
    rol: string;
    descripcion: string;
    visualPromptCue: string;
  }>;
  promptsListos: {
    imagenHero: string;
    guionHistoria: string;
    audioBandaSonora: string;
  };
  misionDelGrupo: string[];
}

export interface GroupProject {
  id: string;
  groupNumber: number;
  groupName: string;
  productionCompany?: string; // Nombre de la productora
  producerEmail?: string; // Correo de contacto
  membersCount: number;
  membersList?: string[]; // Nombres de los integrantes
  status: 'pendiente' | 'sorteado' | 'en_proceso' | 'completado';
  assignedAt?: string;
  certificateCode?: string; // Código único de certificado (ej. JUJ-AI-01-A9F)
  certificateIssuedAt?: string;
  isRegistered?: boolean; // Ha completado la carga de productora e integrantes
  roadmapNotes?: string; // Acuerdos y notas de la hoja de ruta inicial
  
  // Randomly selected attributes
  genre?: GenreItem;
  visualStyle?: VisualStyleItem;
  location?: JujuyLocation;
  character?: CharacterItem;
  secondaryCharacter?: CharacterItem;
  plotHook?: PlotHookItem;
  aiChallenge?: AIChallengeItem;
  surpriseTwist?: string;

  // AI Expanded Brief
  aiBrief?: ProjectBriefAI;
  isExpanding?: boolean;
  notes?: string;
  projectLinks?: ProjectLink[]; // Links de entregables cargados por el grupo
}

export interface ProjectLink {
  label: string; // Ej: "Poster en Midjourney", "Video en Drive"
  url: string;
}

export interface WorkshopConfig {
  workshopTitle: string;
  totalParticipants: number;
  groupSize: number;
  totalGroups: number;
  includeSurpriseTwist: boolean;
  aiChallengeDifficulty: 'Todos' | 'Inicial' | 'Intermedio' | 'Avanzado';
}
