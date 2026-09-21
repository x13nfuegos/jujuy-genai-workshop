import confetti from 'canvas-confetti';
import {
  GroupProject,
  ProjectBriefAI,
  GenreItem,
  VisualStyleItem,
  JujuyLocation,
  CharacterItem,
  PlotHookItem,
  AIChallengeItem
} from '../types';
import {
  JUJUY_LOCATIONS,
  GENRES,
  VISUAL_STYLES,
  CHARACTERS,
  PLOT_HOOKS,
  AI_CHALLENGES,
  SURPRISE_TWISTS,
  GROUP_NAME_IDEAS
} from '../data/jujuyData';

export function getRandomElement<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateCertificateCode(groupNumber: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CERT-JUJ-${String(groupNumber).padStart(2, '0')}-${rand}`;
}

export function isGroupRegistrationComplete(group?: GroupProject | null): boolean {
  if (!group) return false;
  if (group.isRegistered) return true;
  const hasCompany = Boolean(group.productionCompany && group.productionCompany.trim().length > 0);
  const hasRealMembers = Boolean(
    group.membersList &&
    group.membersList.length > 0 &&
    group.membersList.some(m => m.trim().length > 0 && !m.toLowerCase().startsWith('integrante '))
  );
  return hasCompany && hasRealMembers;
}

export function generateInitialGroups(totalParticipants = 80, groupSize = 5): GroupProject[] {
  const numGroups = Math.max(1, Math.ceil(totalParticipants / groupSize));
  const groups: GroupProject[] = [];

  for (let i = 0; i < numGroups; i++) {
    const groupNumber = i + 1;
    const remainingParticipants = totalParticipants - (i * groupSize);
    const members = i === numGroups - 1 ? (remainingParticipants > 0 ? remainingParticipants : groupSize) : groupSize;

    groups.push({
      id: `grupo-${groupNumber}-${Date.now().toString(36)}`,
      groupNumber,
      groupName: `Grupo ${groupNumber}`,
      productionCompany: undefined,
      producerEmail: undefined,
      membersCount: members,
      membersList: [],
      status: 'pendiente',
    });
  }

  return groups;
}

export function generateProjectAttributes(options?: {
  includeTwist?: boolean;
  difficulty?: 'Todos' | 'Inicial' | 'Intermedio' | 'Avanzado';
  excludeLocationIds?: string[];
  excludeGenreIds?: string[];
}): {
  genre: GenreItem;
  visualStyle: VisualStyleItem;
  location: JujuyLocation;
  character: CharacterItem;
  secondaryCharacter: CharacterItem;
  plotHook: PlotHookItem;
  aiChallenge: AIChallengeItem;
  surpriseTwist?: string;
} {
  const availableLocations = options?.excludeLocationIds && options.excludeLocationIds.length < JUJUY_LOCATIONS.length
    ? JUJUY_LOCATIONS.filter(l => !options.excludeLocationIds!.includes(l.id))
    : JUJUY_LOCATIONS;

  const availableGenres = options?.excludeGenreIds && options.excludeGenreIds.length < GENRES.length
    ? GENRES.filter(g => !options.excludeGenreIds!.includes(g.id))
    : GENRES;

  const location = getRandomElement(availableLocations);
  const genre = getRandomElement(availableGenres);
  const visualStyle = getRandomElement(VISUAL_STYLES);

  // Pick primary character and a different secondary character
  const shuffledChars = shuffleArray(CHARACTERS);
  const character = shuffledChars[0];
  const secondaryCharacter = shuffledChars[1];

  const plotHook = getRandomElement(PLOT_HOOKS);

  // Filter challenges by difficulty if requested
  const filteredChallenges = options?.difficulty && options.difficulty !== 'Todos'
    ? AI_CHALLENGES.filter(c => c.difficulty === options.difficulty)
    : AI_CHALLENGES;
  const aiChallenge = getRandomElement(filteredChallenges.length > 0 ? filteredChallenges : AI_CHALLENGES);

  const surpriseTwist = options?.includeTwist !== false ? getRandomElement(SURPRISE_TWISTS) : undefined;

  return {
    genre,
    visualStyle,
    location,
    character,
    secondaryCharacter,
    plotHook,
    aiChallenge,
    surpriseTwist
  };
}

export function assignProjectToGroup(
  group: GroupProject,
  options?: {
    includeTwist?: boolean;
    difficulty?: 'Todos' | 'Inicial' | 'Intermedio' | 'Avanzado';
  }
): GroupProject {
  const attributes = generateProjectAttributes(options);
  const certificateCode = group.certificateCode || generateCertificateCode(group.groupNumber);
  const certificateIssuedAt = group.certificateIssuedAt || new Date().toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const updatedGroup: GroupProject = {
    ...group,
    ...attributes,
    status: 'sorteado',
    certificateCode,
    certificateIssuedAt,
    assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Build local instant brief
  updatedGroup.aiBrief = buildLocalAIBrief(updatedGroup);

  return updatedGroup;
}

export function resetGroupProject(group: GroupProject): GroupProject {
  return {
    ...group,
    genre: undefined,
    visualStyle: undefined,
    location: undefined,
    character: undefined,
    secondaryCharacter: undefined,
    plotHook: undefined,
    aiChallenge: undefined,
    surpriseTwist: undefined,
    aiBrief: undefined,
    roadmapNotes: undefined,
    certificateCode: undefined,
    certificateIssuedAt: undefined,
    assignedAt: undefined,
    status: 'pendiente',
  };
}

export function resetGroupProducer(group: GroupProject): GroupProject {
  const defaultName = GROUP_NAME_IDEAS[(group.groupNumber - 1) % GROUP_NAME_IDEAS.length] || `Equipo ${group.groupNumber}`;
  return {
    ...group,
    groupName: `Grupo ${group.groupNumber}: ${defaultName}`,
    productionCompany: `${defaultName} Producciones`,
    producerEmail: `grupo${group.groupNumber}@tallerjujuy.ai`,
    membersList: [],
    isRegistered: false,
  };
}

export function resetGroupCompletely(group: GroupProject): GroupProject {
  const defaultName = GROUP_NAME_IDEAS[(group.groupNumber - 1) % GROUP_NAME_IDEAS.length] || `Equipo ${group.groupNumber}`;
  return {
    ...group,
    groupName: `Grupo ${group.groupNumber}: ${defaultName}`,
    productionCompany: `${defaultName} Producciones`,
    producerEmail: `grupo${group.groupNumber}@tallerjujuy.ai`,
    membersList: [],
    isRegistered: false,
    genre: undefined,
    visualStyle: undefined,
    location: undefined,
    character: undefined,
    secondaryCharacter: undefined,
    plotHook: undefined,
    aiChallenge: undefined,
    surpriseTwist: undefined,
    aiBrief: undefined,
    roadmapNotes: undefined,
    certificateCode: undefined,
    certificateIssuedAt: undefined,
    assignedAt: undefined,
    status: 'pendiente',
  };
}

export function assignProjectsToAllGroups(
  groups: GroupProject[],
  options?: {
    includeTwist?: boolean;
    difficulty?: 'Todos' | 'Inicial' | 'Intermedio' | 'Avanzado';
  }
): GroupProject[] {
  const usedLocationIds: string[] = [];
  const usedGenreIds: string[] = [];

  return groups.map((g) => {
    const attributes = generateProjectAttributes({
      includeTwist: options?.includeTwist,
      difficulty: options?.difficulty,
      excludeLocationIds: usedLocationIds,
      excludeGenreIds: usedGenreIds
    });

    usedLocationIds.push(attributes.location.id);
    usedGenreIds.push(attributes.genre.id);

    const updated: GroupProject = {
      ...g,
      ...attributes,
      status: 'sorteado',
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updated.aiBrief = buildLocalAIBrief(updated);
    return updated;
  });
}

export function buildLocalAIBrief(project: GroupProject): ProjectBriefAI {
  const gName = project.genre?.name || 'Ficción Andina';
  const loc = project.location?.name || 'Quebrada de Humahuaca';
  const char1 = project.character?.archetype || 'El protagonista';
  const plot = project.plotHook?.premise || 'Un suceso inesperado sacude la calma de los cerros.';
  const visual = project.visualStyle?.name || 'Cinematográfico';

  return {
    tituloProyecto: `El Secreto de ${project.location?.name.split(' y ')[0] || 'Jujuy'}`,
    logline: `En medio de ${loc}, ${char1.toLowerCase()} descubre una verdad que entrelaza la memoria ancestral con la tecnología más avanzada.`,
    sinopsisNarrativa: `La historia se sitúa en ${loc}. Todo comienza cuando ${plot} ${char1} se ve forzado a tomar una decisión crucial ante las fuerzas que pugnan por el control del territorio. A medida que la tensión escala, las tradiciones locales demuestran tener un poder inimaginable para resolver el dilema moderno.`,
    vinculoJujuy: `El escenario de ${loc} aporta la atmósfera visual y el trasfondo cultural único donde la espiritualidad y el paisaje jujeño dictan las reglas del conflicto.`,
    personajesDetalle: [
      {
        nombre: project.character?.archetype || 'Protagonista',
        rol: 'Personaje Principal',
        descripcion: project.character?.description || 'Guía central de la narrativa.',
        visualPromptCue: `${project.character?.archetype}, authentic high-altitude Andean facial features, traditional clothing mixed with functional gear, expressive gaze`
      },
      {
        nombre: project.secondaryCharacter?.archetype || 'Aliado / Antagonista',
        rol: 'Contrapunto Dramático',
        descripcion: project.secondaryCharacter?.description || 'Personaje secundario que desafía la visión del protagonista.',
        visualPromptCue: `${project.secondaryCharacter?.archetype}, weathered look, distinct silhouetted presence against mountainous backdrop`
      }
    ],
    promptsListos: {
      imagenHero: `Cinematic movie scene set in ${project.location?.name}, Jujuy Argentina. Featuring ${project.character?.archetype}, ${project.visualStyle?.promptSuffix || 'golden hour light, highly detailed'}`,
      guionHistoria: `Actúa como guionista profesional de cine para una historia del género "${gName}". Escribe la escena de apertura de 2 minutos donde ${project.character?.archetype} enfrenta la siguiente situación en ${loc}: "${project.plotHook?.conflict}". Incluye acotaciones de sonido andino, viento de la Puna y diálogos con modismos jujeños auténticos y respetuosos.`,
      audioBandaSonora: `Instrumental cinematic score blending traditional Andean folklore with modern synthesizer textures. Instruments: charango, deep bombo legüero, sikus wind flutes, analog ambient drone, dramatic crescendo, 90 bpm, evocative and mystical mood.`
    },
    misionDelGrupo: project.aiChallenge?.deliverables || [
      'Generar imagen conceptual clave en Midjourney o Flux',
      'Desarrollar el guión con ChatGPT o Claude',
      'Presentar el pitch final de 2 minutos'
    ]
  };
}

export function fireCelebration() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#e11d48']
    });
  } catch {
    // Canvas confetti not available
  }
}

export function exportGroupsToCSV(groups: GroupProject[]): string {
  const headers = [
    'Grupo #',
    'Nombre del Grupo',
    'Productora',
    'Email Contacto',
    'Cantidad Integrantes',
    'Nombres de Integrantes',
    'Estado',
    'Certificado #',
    'Género',
    'Estilo Visual',
    'Locación en Jujuy',
    'Personaje Principal',
    'Personaje Secundario',
    'Detonante / Trama',
    'Desafío IA',
    'Giro Inesperado',
    'Links de Entregables'
  ];

  const rows = groups.map(g => [
    `"${g.groupNumber}"`,
    `"${g.groupName.replace(/"/g, '""')}"`,
    `"${(g.productionCompany || '').replace(/"/g, '""')}"`,
    `"${(g.producerEmail || '').replace(/"/g, '""')}"`,
    `"${g.membersCount}"`,
    `"${(g.membersList && g.membersList.length > 0 ? g.membersList.join(', ') : '').replace(/"/g, '""')}"`,
    `"${g.status}"`,
    `"${g.certificateCode || 'Sin emitir'}"`,
    `"${g.genre?.name || 'Sin asignar'}"`,
    `"${g.visualStyle?.name || 'Sin asignar'}"`,
    `"${g.location?.name || 'Sin asignar'}"`,
    `"${g.character?.archetype || 'Sin asignar'}"`,
    `"${g.secondaryCharacter?.archetype || 'Sin asignar'}"`,
    `"${(g.plotHook?.title || 'Sin asignar').replace(/"/g, '""')}"`,
    `"${(g.aiChallenge?.title || 'Sin asignar').replace(/"/g, '""')}"`,
    `"${(g.surpriseTwist || 'Ninguno').replace(/"/g, '""')}"`,
    `"${(g.projectLinks && g.projectLinks.length > 0 ? g.projectLinks.map(l => `${l.label}: ${l.url}`).join(' | ') : '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportGroupsToMarkdown(groups: GroupProject[]): string {
  let md = `# Taller de IA Generativa Jujuy - Proyectos y Productoras Asignadas\n\n`;
  md += `Fecha: ${new Date().toLocaleDateString('es-AR')}\n`;
  md += `Total Grupos: ${groups.length} | Participantes: ${groups.reduce((acc, g) => acc + g.membersCount, 0)}\n\n`;
  md += `---\n\n`;

  groups.forEach(g => {
    md += `### 🎬 ${g.productionCompany || g.groupName} (Grupo #${g.groupNumber})\n`;
    md += `- **Productora**: ${g.productionCompany || 'Sin definir'}\n`;
    md += `- **Contacto Email**: ${g.producerEmail || 'Sin email'}\n`;
    if (g.membersList && g.membersList.length > 0) {
      md += `- **Integrantes**: ${g.membersList.join(', ')}\n`;
    } else {
      md += `- **Participantes**: ${g.membersCount} integrantes\n`;
    }
    if (g.certificateCode) {
      md += `- **Certificado Oficial**: \`${g.certificateCode}\`\n`;
    }

    if (g.status === 'pendiente') {
      md += `*Estado: Pendiente de sorteo*\n\n`;
      return;
    }

    md += `- **Género**: ${g.genre?.name}\n`;
    md += `- **Estilo Visual**: ${g.visualStyle?.name}\n`;
    md += `- **Locación Jujuy**: ${g.location?.name} (${g.location?.region})\n`;
    md += `- **Personaje Principal**: ${g.character?.archetype}\n`;
    if (g.secondaryCharacter) {
      md += `- **Personaje Secundario**: ${g.secondaryCharacter.archetype}\n`;
    }
    md += `- **Detonante de la Historia**: ${g.plotHook?.title} - *${g.plotHook?.premise}*\n`;
    md += `- **Desafío de IA**: ${g.aiChallenge?.title}\n`;
    if (g.surpriseTwist) {
      md += `- **Giro / Restricción**: ${g.surpriseTwist}\n`;
    }

    if (g.aiBrief?.promptsListos) {
      md += `\n**Prompt Imagen (Midjourney/Flux):**\n\`\`\`\n${g.aiBrief.promptsListos.imagenHero}\n\`\`\`\n`;
    }
    if (g.projectLinks && g.projectLinks.length > 0) {
      md += `\n**🔗 Links Entregados por el Grupo:**\n`;
      g.projectLinks.forEach(l => {
        md += `- [${l.label}](${l.url})\n`;
      });
    }
    md += `\n---\n\n`;
  });

  return md;
}
