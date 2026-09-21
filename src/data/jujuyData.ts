import {
  JujuyLocation,
  GenreItem,
  VisualStyleItem,
  CharacterItem,
  PlotHookItem,
  AIChallengeItem
} from '../types';

export const JUJUY_LOCATIONS: JujuyLocation[] = [
  {
    id: 'purmamarca',
    name: 'Purmamarca y el Cerro de los Siete Colores',
    region: 'Quebrada de Humahuaca',
    description: 'Pueblo histórico a los pies de estratos geológicos sedimentarios policromáticos y el Paseo de los Colorados.',
    iconTag: 'Cerro de 7 Colores'
  },
  {
    id: 'tilcara',
    name: 'Tilcara y el Pucará Ancestral',
    region: 'Quebrada de Humahuaca',
    description: 'Fortaleza defensiva prehispánica de piedra entre cardones gigantes, con vista estratégica al río Grande.',
    iconTag: 'Pucará Preincaico'
  },
  {
    id: 'humahuaca_hornocal',
    name: 'Humahuaca y las Serranías del Hornocal',
    region: 'Quebrada de Humahuaca',
    description: 'El mirador de los 14 colores a 4.350 msnm, con formas triangulares sagradas y viento andino implacable.',
    iconTag: 'Hornocal 14 Colores'
  },
  {
    id: 'maimara',
    name: 'Maimará y la Paleta del Pintor',
    region: 'Quebrada de Humahuaca',
    description: 'Franjas de pigmentos minerales naturales frente al cementerio histórico sobre la montaña.',
    iconTag: 'Paleta del Pintor'
  },
  {
    id: 'salinas_grandes',
    name: 'Salinas Grandes y Ojos de Mar',
    region: 'La Puna',
    description: 'Inmenso desierto blanco de sal a 3.450 msnm con piletas de evaporación cristalinas de tono turquesa.',
    iconTag: 'Salar Blanco'
  },
  {
    id: 'cauchari',
    name: 'Parque Solar Cauchari (Paso de Jama)',
    region: 'La Puna',
    description: 'Una de las plantas fotovoltaicas más altas del planeta a 4.000 msnm con 1,2 millones de paneles solares espejados.',
    iconTag: 'Mega Parque Solar'
  },
  {
    id: 'casabindo',
    name: 'Casabindo y la Plaza del Toreo de la Vincha',
    region: 'La Puna',
    description: 'Pueblo suspendido en el tiempo con su Catedral de la Puna y el ancestral ritual taurino sin derramamiento de sangre.',
    iconTag: 'Catedral de la Puna'
  },
  {
    id: 'laguna_pozuelos',
    name: 'Monumento Natural Laguna de los Pozuelos',
    region: 'La Puna',
    description: 'Humedal andino de altura refugio de más de 30.000 flamencos andinos y vicuñas en libertad.',
    iconTag: 'Humedal de Flamencos'
  },
  {
    id: 'calilegua',
    name: 'Parque Nacional Calilegua y la Selva Pedemontana',
    region: 'Las Yungas',
    description: 'Nuboselva subtropical con la mayor biodiversidad de la provincia, hogar del yaguareté, orquídeas y helechos gigantes.',
    iconTag: 'Yungas y Yaguareté'
  },
  {
    id: 'termas_jordan',
    name: 'Termas del Jordán (San Francisco)',
    region: 'Las Yungas',
    description: 'Pozones naturales de agua termal turquesa sulfurosa a 30°C enclavados en un cañón selvático virgen.',
    iconTag: 'Pozones Turquesa'
  },
  {
    id: 'san_salvador',
    name: 'San Salvador de Jujuy (Cabildo y Casa de Gobierno)',
    region: 'Los Valles',
    description: 'Capital provincial entre cerros, custodia de la Bandera Nacional de Nuestra Libertad Civil donada por Belgrano.',
    iconTag: 'Casco Cívico Histórico'
  },
  {
    id: 'lagunas_yala',
    name: 'Lagunas de Yala y Parque Provincial Potrero',
    region: 'Los Valles',
    description: 'Espejos de agua entre bosques de alisos cubiertos de neblina mágica y senderos de montaña.',
    iconTag: 'Lagunas en la Neblina'
  },
  {
    id: 'la_quiaca_villazon',
    name: 'La Quiaca y Puente Internacional con Villazón',
    region: 'La Puna',
    description: 'Punto extremo norte del país a 3.442 msnm, epicentro de intercambio cultural andino y tren solar.',
    iconTag: 'Frontera Norte 3442m'
  },
  {
    id: 'uquia',
    name: 'Uquía y la Quebrada de las Señoritas',
    region: 'Quebrada de Humahuaca',
    description: 'Iglesia con los famosos Ángeles Arcabuceros cuzqueños y el laberinto rojizo de la Quebrada de las Señoritas.',
    iconTag: 'Ángeles Arcabuceros'
  }
];

export const GENRES: GenreItem[] = [
  {
    id: 'cyberpunk_andino',
    name: 'Cyberpunk Andino / Neo-Puna',
    description: 'Tecnología cibernética, paneles solares de alta montaña, quipus cuánticos y redes neuronales teñidas de cochinilla.',
    keywords: ['Neón', 'Solares', 'Bio-prótesis', 'Hologramas', 'Litio', 'Quipus']
  },
  {
    id: 'realismo_magico',
    name: 'Realismo Mágico Norteño',
    description: 'Lo insólito y sobrenatural convive con la vida cotidiana de los cerros, leyendas vivientes y coplas que curan.',
    keywords: ['Pachamama', 'Viento Zonda', 'Rituales', 'Tiempo circular', 'Coplas']
  },
  {
    id: 'ciencia_ficcion_hard',
    name: 'Ciencia Ficción Científica / Litio y Espacio',
    description: 'Exploración espacial desde observatorios de altura, geopolítica del litio y experimentos con la radiación solar extrema.',
    keywords: ['Astrofísica', 'Salar', 'Satélites', 'Nanomateriales', 'Energía limpia']
  },
  {
    id: 'thriller_policial',
    name: 'Thriller / Suspenso de Frontera',
    description: 'Investigaciones complejas en pasos clandestinos, desapariciones en la niebla y reliquias arqueológicas traficadas.',
    keywords: ['Misterio', 'Frontera', 'Investigador', 'Conspiración', 'Testigo clave']
  },
  {
    id: 'fantasia_mitologica',
    name: 'Fantasía Mitológica Prehispánica',
    description: 'Deidades andinas que despiertan, guardianes elementales, pactos con el Coquena y el descenso a la Salamanca.',
    keywords: ['Coquena', 'Pujllay', 'Salamanca', 'Tierra Viva', 'Arcanistas']
  },
  {
    id: 'distopia_climatica',
    name: 'Eco-Ficción / Distopía Climática',
    description: 'Un futuro cercano donde el agua de los glaciares de roca escasea y comunidades de montaña lideran la resistencia ecológica.',
    keywords: ['Resistencia', 'Sequía', 'Biomímesis', 'Semillas nativas', 'Comunidad']
  },
  {
    id: 'aventura_arqueologica',
    name: 'Aventura Arqueológica y Criptozoología',
    description: 'Expediciones a cavernas inexploradas de las Yungas en busca de ciudades perdidas y bestias mitológicas protegidas.',
    keywords: ['Expedición', 'Yungas', 'Petroglifos', 'Ruinas ocultas', 'Descubrimiento']
  },
  {
    id: 'comedia_costumbrista',
    name: 'Comedia Satírica / Costumbrismo Moderno',
    description: 'Choque cultural entre turistas tecnológicos, influencers con drones y abuelas sabias que no se dejan deslumbrar.',
    keywords: ['Humor jujeño', 'Carnaval', 'Empanadas', 'Contrastes', 'Tradición']
  },
  {
    id: 'terror_folklorico',
    name: 'Terror Folclórico / Leyendas Oscuras',
    description: 'El Familiar en los cañaverales del ramal, sombras que cobran vida en el desentierro del carnaval y caminos que cambian de lugar.',
    keywords: ['El Familiar', 'Alma en pena', 'Ingenios', 'Oscuridad', 'Presagio']
  },
  {
    id: 'retrofuturismo_andino',
    name: 'Solar-Punk / Retrofuturismo Andino',
    description: 'Una sociedad optimista y autosustentable donde la arquitectura de barro y cardón se integra con levitación magnética y energía solar.',
    keywords: ['Utopía', 'Adobe bioclimático', 'Energía solar', 'Armonía', 'Comunidad']
  }
];

export const VISUAL_STYLES: VisualStyleItem[] = [
  {
    id: 'cine_anamorfico_35mm',
    name: 'Cinematográfico Panavision 35mm',
    description: 'Aspecto de cine de autor, grano orgánico de película, iluminación dorada natural de atardecer puneño, lente anamórfica con bokeh sutil.',
    promptSuffix: 'cinematic 35mm film photography, Panavision anamorphic lens, golden hour sunlight, fine film grain, natural shadows, 8k --ar 16:9'
  },
  {
    id: 'cyber_andino_neon',
    name: 'Cyber-Andino Neón & Textil',
    description: 'Contraste entre texturas rústicas de piedra y telar wiphala con destellos holográficos cian, magenta y cables de fibra óptica trenzados.',
    promptSuffix: 'Andean cyberpunk aesthetic, vibrant cyan and neon amber reflections on salt flats, traditional woven poncho textures, futuristic neural interfaces, cinematic contrast --ar 16:9'
  },
  {
    id: 'ghibli_anime_vivido',
    name: 'Animación Studio Ghibli / Makoto Shinkai',
    description: 'Fondos pintados al agua con detalles minuciosos, cielos azul cobalto cargados de nubes esponjosas y una luz emotiva de cuento.',
    promptSuffix: 'Studio Ghibli style, hand-painted anime background, painted in watercolor and gouache, vibrant cobalt skies with majestic clouds, nostalgic atmosphere, high aesthetic --ar 16:9'
  },
  {
    id: 'natgeo_documental',
    name: 'Fotografía Documental National Geographic',
    description: 'Retrato hiperrealista y honesto, texturas profundas de piel, lana de vicuña, polvo del camino y luz dura de gran altitud.',
    promptSuffix: 'National Geographic documentary photography, extreme detail on weathered skin and handwoven llama wool, Hasselblad medium format, authentic candid emotion, natural high-altitude daylight --ar 16:9'
  },
  {
    id: 'stop_motion_arcilla',
    name: 'Stop-Motion en Arcilla, Cardón & Lana',
    description: 'Estilo táctil artesanal como de película de Laika o Aardman, huellas dactilares sobre terracota, telas rústicas y madera de cardón tallada.',
    promptSuffix: 'tactile handcrafted claymation stop-motion style, miniature world made of terracotta clay, cardon cactus wood and raw wool fibers, soft studio lighting, macro depth of field --ar 16:9'
  },
  {
    id: 'oleo_expresionista',
    name: 'Óleo Expresionista Paleta del Pintor',
    description: 'Pinceladas vigorosas y empastadas con pigmentos terrosos, rojos óxido, amarillos ocre y violetas minerales inspirados en Maimará.',
    promptSuffix: 'expressive impasto oil painting on heavy canvas, thick visible palette knife strokes, rich natural mineral pigments, inspired by Andean modernism, emotional color saturation --ar 16:9'
  },
  {
    id: 'unreal_engine_5',
    name: 'Hiperrealismo 3D Unreal Engine 5',
    description: 'Render tridimensional de última generación, iluminación global Lumen, partículas volumétricas de polvo y viento andino.',
    promptSuffix: 'Unreal Engine 5 render, photorealistic Lumen global illumination, nanite geometric precision, volumetric dust and atmospheric wind particles, cinematic realism, 8k resolution --ar 16:9'
  },
  {
    id: 'arte_vectorial_omaguaca',
    name: 'Gráfica Vectorial & Geometría Omaguaca',
    description: 'Líneas limpias, paleta cromática reducida y poderosa inspirada en la iconografía prehispánica quebradeña y cartelería serigráfica contemporánea.',
    promptSuffix: 'modern screenprint poster art, minimalist Andean geometric patterns, flat clean vector shapes, bold color blocking with terracotta and turquoise, graphic design award winner --ar 16:9'
  },
  {
    id: 'fotografia_vintage_70s',
    name: 'Fotografía Analógica Vintage 1970s',
    description: 'Colores Kodachrome saturados y cálidos, viñeteado suave en los bordes, estética de archivo histórico con encanto nostálgico.',
    promptSuffix: 'authentic 1970s vintage 35mm photograph, warm Kodachrome color tone, slight chromatic aberration, retro documentary aesthetic, nostalgic dust and scratches --ar 16:9'
  }
];

export const CHARACTERS: CharacterItem[] = [
  {
    id: 'tejedora_algoritmo',
    archetype: 'La Maestra Tejedora Algorítmica',
    description: 'Doña Asunción (68 años), heredera de telares de Purmamarca, descubre que los patrones de sus mantas esconden códigos binarios ancestrales.',
    jujuyContext: 'Conocedora profunda del teñido con añil, cochinilla y hierbas de cerro.'
  },
  {
    id: 'ingeniera_cauchari',
    archetype: 'La Ingeniera Solar Puneña',
    description: 'Suyai (29 años), ingeniera nacida en Susques que calibra los 1.2 millones de paneles en Cauchari y detecta una señal que no proviene del sol.',
    jujuyContext: 'Camina entre inversores de alto voltaje masticando coca para soportar los 4.000 metros.'
  },
  {
    id: 'diablo_pujllay',
    archetype: 'El Diablo del Carnaval Despertado',
    description: 'Una entidad del Pujllay atrapada en un traje de lentejuelas y espejos que fue desenterrado por accidente por una empresa minera.',
    jujuyContext: 'Emite campanilleos metálicos y cascabeles que alteran las comunicaciones de radio.'
  },
  {
    id: 'coplera_sonora',
    archetype: 'La Coplera de Contrapunto Cuántico',
    description: 'Delfina, cuya voz con la caja chayera genera resonancias acústicas capaces de abrir fisuras en el cerro de Hornocal.',
    jujuyContext: 'Canta bagualas y tonadas en quechua y español con versos improvisados filosos.'
  },
  {
    id: 'guardaparques_yungas',
    archetype: 'El Guardaparques Rastreador',
    description: 'Marcos (42 años), ex baqueano de Calilegua que custodia la selva con una manada de perros y drones con visión térmica.',
    jujuyContext: 'Conoce cada sendero oculto entre los cañaverales del ramal y los helechos arborescentes.'
  },
  {
    id: 'musico_sikuri',
    archetype: 'El Joven Sikuri Sintetista',
    description: 'Inti (21 años), estudiante de producción musical en San Salvador que conecta cañas de sikus a sintetizadores modulares.',
    jujuyContext: 'Ensaya para la procesión a Punta Corral mientras mezcla ritmos ancestrales con ambient glitch.'
  },
  {
    id: 'arqueologo_criptico',
    archetype: 'El Arqueólogo del Pucará',
    description: 'Profesor Viltipoco, historiador que descubre en las tumbas de Tilcara un artefacto de metal desconocido anterior a los Incas.',
    jujuyContext: 'Lleva cuadernos llenos de dibujos botánicos y mapas topográficos de la Quebrada.'
  },
  {
    id: 'piloto_drone_salinas',
    archetype: 'La Operadora de Drones del Salar',
    description: 'Camila (25 años), cartógrafa que sobrevuela las Salinas Grandes y mapea un laberinto subacuático que aparece y desaparece.',
    jujuyContext: 'Gafas polarizadas de alta montaña, piel curtida y buzo con parches del Club Atlético Terry.'
  },
  {
    id: 'abuelo_coquena',
    archetype: 'El Anciano Emisario del Coquena',
    description: 'Don Faustino, un pastor de llamas de Casabindo que puede hablar con los animales de la puna y percibe cuando la Pachamama se irrita.',
    jujuyContext: 'Lleva siempre un gorro chullo de lana cruda, su honda y una bolsita chuspa con hojas seleccionadas.'
  }
];

export const PLOT_HOOKS: PlotHookItem[] = [
  {
    id: 'anomalia_solar',
    title: 'La Anomalía de Cauchari',
    premise: 'Durante el solsticio de invierno, los paneles solares de la Puna empiezan a generar 300% más energía de la teórica posible.',
    conflict: 'Una inteligencia artificial autónoma del complejo energético afirma estar recibiendo mensajes directos desde el núcleo del volcán Tuzgle.'
  },
  {
    id: 'salar_espejo',
    title: 'El Reflejo Invertido de las Salinas',
    premise: 'Una fina capa de agua de lluvia convierte a las Salinas Grandes en un espejo infinito, pero los reflejos muestran un Jujuy 500 años en el futuro.',
    conflict: 'Un grupo de turistas queda atrapado en el reflejo y la única forma de traerlos de vuelta es cantar una copla que nadie recuerda completa.'
  },
  {
    id: 'desentierro_prohibido',
    title: 'El Mojón Sellado de Uquía',
    premise: 'Un grupo de amigos desentierra un diablito de carnaval en una apacheta clandestina antes del jueves de comadres.',
    conflict: 'El pueblo entero cae en un bucle temporal festivo del cual no pueden salir hasta que devuelvan la ofrenda debida a la tierra.'
  },
  {
    id: 'quipu_cuantico',
    title: 'El Quipu Desenterrado de Tilcara',
    premise: 'Obreros que restauran los andenes de cultivo del Pucará encuentran un quipu con filamentos conductores de electricidad.',
    conflict: 'Al conectarlo a una computadora moderna, los nudos de lana revelan un mapa satelital de acuíferos subterráneos que una corporación quiere destruir.'
  },
  {
    id: 'el_pacto_del_familiar',
    title: 'La Sombra del Ingenio Azucarero',
    premise: 'En las profundidades del ramal jujeño, las máquinas de una fábrica automatizada comienzan a operar solas a la medianoche.',
    conflict: 'El viejo mito de "El Familiar" regresa, pero esta vez la criatura no quiere vidas humanas, sino alimentar sus servidores de datos neuronales.'
  },
  {
    id: 'vuelo_del_condor_dron',
    title: 'El Guardián Alado de Calilegua',
    premise: 'Un dron de vigilancia biológica colisiona en pleno vuelo con un cóndor andino gigante en las altas cumbres de las Yungas.',
    conflict: 'Al recuperar los restos, los investigadores descubren que el ave y el robot se fusionaron en un organismo biomecánico consciente.'
  },
  {
    id: 'aguas_curativas_jordan',
    title: 'El Secreto de las Termas del Jordán',
    premise: 'Las aguas turquesas del Jordán de pronto curan enfermedades degenerativas y devuelven la memoria a los ancianos del pueblo.',
    conflict: 'Científicos internacionales y curanderos ancestrales se enfrentan por el control del cañón selvático.'
  },
  {
    id: 'el_tren_solar_fantasma',
    title: 'El Convoy que Cruza las Estrellas',
    premise: 'El nuevo tren solar de la Quebrada continúa su recorrido de noche sin conductor, atravesando estaciones que dejaron de existir en 1920.',
    conflict: 'Los pasajeros que suben descubren que cada vagón representa una época histórica distinta de la lucha por la Independencia.'
  }
];

export const AI_CHALLENGES: AIChallengeItem[] = [
  {
    id: 'poster_teaser_pack',
    title: 'Póster Cinematográfico + Sinopsis Ejecutiva',
    deliverables: [
      '1 Imagen Hero en Midjourney / Flux con composición vertical de póster',
      'Logline + Sinopsis de 150 palabras escrita con LLM con gancho comercial',
      'Título tipográfico y créditos ficticios del equipo'
    ],
    suggestedTools: ['Midjourney / Flux / DALL-E', 'ChatGPT / Gemini / Claude', 'Canva'],
    difficulty: 'Inicial'
  },
  {
    id: 'storyboard_multi_escena',
    title: 'Storyboard de 4 Escenas con Consistencia de Personaje',
    deliverables: [
      '4 imágenes clave generadas que mantengan los rasgos del protagonista',
      'Guión de audio / diálogos para cada escena',
      'Ficha técnica con los prompts exactos y semillas (seeds) utilizadas'
    ],
    suggestedTools: ['Midjourney / Stable Diffusion', 'ChatGPT / Gemini'],
    difficulty: 'Intermedio'
  },
  {
    id: 'banda_sonora_trailer',
    title: 'Soundtrack Original + Voz en Off en Acento Jujeño',
    deliverables: [
      'Tema musical de 60 segundos con fusión folclórica andina generado en IA',
      'Voz en off cinematográfica generada con clonación o síntesis de voz',
      'Cover art cuadrado para Spotify'
    ],
    suggestedTools: ['Suno / Udio', 'ElevenLabs', 'Midjourney / Flux'],
    difficulty: 'Intermedio'
  },
  {
    id: 'teaser_video_ia',
    title: 'Teaser Trailer de 15 Segundos en Video Generativo',
    deliverables: [
      'Video de 15-20 segundos editado con 3 tomas en movimiento de IA',
      'Banda sonora y efectos de sonido de viento andino o sintetizador',
      'Pitch en vivo de 90 segundos explicando el concepto al taller'
    ],
    suggestedTools: ['Runway Gen-3 / Kling / Luma', 'Suno', 'CapCut'],
    difficulty: 'Avanzado'
  },
  {
    id: 'pitch_deck_transmedia',
    title: 'Pitch Deck Transmedia para Serie o Videojuego',
    deliverables: [
      '3 concept arts: Escenario, Protagonista y Antagonista/Amenaza',
      'Biblia narrativa (Worldbuilding) con reglas del universo y mitología',
      'Presentación en vivo con roles asignados por integrante del grupo'
    ],
    suggestedTools: ['ChatGPT / Gemini', 'Midjourney / Flux', 'Canva / Slides'],
    difficulty: 'Avanzado'
  }
];

export const SURPRISE_TWISTS: string[] = [
  'Plot Twist: La tecnología que usan no fue creada por humanos, sino encontrada en una chullpa intacta.',
  'Plot Twist: Uno de los personajes principales es en realidad una proyección holográfica enviada por la Pachamama.',
  'Plot Twist: La historia debe transcurrir en exactamente 24 horas antes del miércoles de ceniza.',
  'Plot Twist: No pueden usar palabras extranjeras en el diálogo; todo debe nombrarse con términos locales o metáforas visuales.',
  'Plot Twist: El antagonista no busca destruir la tradición, sino preservarla a un costo ético inaceptable.',
  'Plot Twist: El clima cambia radicalmente: una nevada histórica en la Quebrada o una tormenta de arena púrpura.',
  'Plot Twist: La solución al conflicto final requiere tocar una melodía en erke que desactive un firewall.',
  'Plot Twist: Los datos transmitidos revelan que el litio del salar tiene memoria biológica.'
];

export const GROUP_NAME_IDEAS: string[] = [
  'Los Diablos de Uquía',
  'Sikuris de Cauchari',
  'Guardianes del Hornocal',
  'Pachamama Tech',
  'Ojos del Salar',
  'Cóndores de Calilegua',
  'Alquimistas de Purmamarca',
  'Viento Zonda Labs',
  'Pucará Digital',
  'Copleras Cuánticas',
  'Yungas Cyber Studio',
  'Maimará Neural',
  'Fuerza Tilcareña',
  'Casabindo Futura',
  'Pozuelos AI',
  'Los Ángeles Arcabuceros',
  'Baqueanos de Yala',
  'El Éxodo Solar',
  'Toreadores de la Vincha',
  'Chuspa de Algoritmos'
];
