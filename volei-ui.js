/**
 * VÔLEI PRO ARENA • PWA DINÂMICO
 * Times de 3 ou de 4 (Flexível) • Jogos Criados na Hora (Vai Ganhando / Vai Perdendo)
 * Placar na Hora Auditável (Sem Desfeita)
 */

const STORAGE_KEY = 'volei_pro_arena_dynamic_v4';

const TEAM_COLORS = [
  '#38bdf8', // Sky Cyan
  '#facc15', // Cyber Gold
  '#10b981', // Emerald Neon
  '#f43f5e', // Coral Rose
  '#a855f7', // Electric Violet
  '#fb923c', // Sunset Orange
  '#2dd4bf', // Aqua Mint
  '#ec4899'  // Hot Pink
];

// Full catalog of user-provided SVGs for Team Crests & Watermarks
const UI_SVGS = {
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  soundOn: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  soundOff: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
  whistleOn: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  whistleOff: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  courtWhistle: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
};

const TEAM_SVGS = [
  { id: 'motion', src: './volleyball-player-motion-svgrepo-com.svg', label: 'Craque em Movimento', mono: true },
  { id: 'spike', src: './volleyball-silhouette-svgrepo-com.svg', label: 'Cortada / Ataque', mono: true },
  { id: 'dive', src: './volleyball-svgrepo-com (6).svg', label: 'Defesa / Peixinho', mono: true },
  { id: 'block', src: './man-playing-volleyball-svgrepo-com.svg', label: 'Bloqueio / Paredão', mono: true },
  { id: 'set', src: './volleyball-game-svgrepo-com.svg', label: 'Levantamento / Toque', mono: true },
  { id: 'bump', src: './volleyball-svgrepo-com (7).svg', label: 'Manchete / Recepção', mono: true },
  { id: 'rally', src: './volleyball-motion-svgrepo-com.svg', label: 'Rally / Velocidade', mono: true },
  { id: 'net', src: './volleyball-svgrepo-com (1).svg', label: 'Bola na Rede', mono: true },
  { id: 'ball_pro', src: './volleyball-svgrepo-com (5).svg', label: 'Bola Oficial Ouro/Azul', mono: false },
  { id: 'ball_green', src: './volleyball-svgrepo-com (2).svg', label: 'Bola Esmeralda', mono: false },
  { id: 'beach', src: './beach-volleyball-svgrepo-com.svg', label: 'Arena Vôlei de Praia', mono: false },
  { id: 'ball_classic', src: './volleyball-svgrepo-com.svg', label: 'Bola Clássica', mono: true }
];

const ROLE_SVGS = {
  Levantador: './volleyball-game-svgrepo-com.svg',
  Atacante: './volleyball-silhouette-svgrepo-com.svg',
  Bloqueador: './man-playing-volleyball-svgrepo-com.svg',
  Defensor: './volleyball-svgrepo-com (6).svg',
  Geral: './volleyball-svgrepo-com (7).svg'
};

function getRoleSvg(role) {
  return ROLE_SVGS[role] || './volleyball-player-motion-svgrepo-com.svg';
}

function getSvgMeta(src) {
  return TEAM_SVGS.find((s) => s.src === src) || TEAM_SVGS[0];
}

function createDefaultTeams(count = 4) {
  const defaults = [
    { id: 't1', name: 'Time 01', color: '#38bdf8', icon: './volleyball-player-motion-svgrepo-com.svg', players: [] },
    { id: 't2', name: 'Time 02', color: '#facc15', icon: './volleyball-silhouette-svgrepo-com.svg', players: [] },
    { id: 't3', name: 'Time 03', color: '#10b981', icon: './volleyball-svgrepo-com (6).svg', players: [] },
    { id: 't4', name: 'Time 04', color: '#f43f5e', icon: './man-playing-volleyball-svgrepo-com.svg', players: [] }
  ];
  return defaults.slice(0, count);
}

function createMatchObject(id, teamAId, teamBId, stageLabel = 'Partida Oficial', extra = {}) {
  return {
    id,
    stageLabel,
    teamAId,
    teamBId,
    scoreA: 0,
    scoreB: 0,
    winnerId: null,
    loserId: null,
    status: 'pending', // 'pending' | 'live' | 'done'
    serving: 'A',
    history: [],
    createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    finishedAt: null,
    ...extra
  };
}

/**
 * Cria o bloco padrão de 4 jogos de cada Mini Torneio seguindo exatamente a lógica da planilha:
 * - Os 2 primeiros jogos são os confrontos de abertura do Mini Torneio (seguindo a rotação da tabela:
 *   1º: T01×T02 e T03×T04 | 2º: T01×T03 e T02×T04 | 3º: T01×T04 e T02×T03 |
 *   4º: T02×T04 e T01×T03 | 5º: T02×T03 e T01×T04 | 6º: T03×T04 e T01×T02)
 * - 3º jogo do Mini Torneio: Vencedor J1 × Vencedor J2 (vencedores dos dois primeiros jogos)
 * - 4º jogo do Mini Torneio: Perdedor J1 × Perdedor J2 (perdedores dos dois primeiros jogos)
 */
function createMiniTorneioBlock(miniIndex = 1, startId = 1, teams = []) {
  const t1 = teams[0]?.id || 't1';
  const t2 = teams[1]?.id || 't2';
  const t3 = teams[2]?.id || t1;
  const t4 = teams[3]?.id || t2;

  const pairingsCycle = [
    [t1, t2, t3, t4], // 1º Mini Torneio: Time 01 x Time 02 | Time 03 x Time 04
    [t1, t3, t2, t4], // 2º Mini Torneio: Time 01 x Time 03 | Time 02 x Time 04
    [t1, t4, t2, t3], // 3º Mini Torneio: Time 01 x Time 04 | Time 02 x Time 03
    [t2, t4, t1, t3], // 4º Mini Torneio: Time 02 x Time 04 | Time 01 x Time 03
    [t2, t3, t1, t4], // 5º Mini Torneio: Time 02 x Time 03 | Time 01 x Time 04
    [t3, t4, t1, t2]  // 6º Mini Torneio: Time 03 x Time 04 | Time 01 x Time 02
  ];

  const [openA1, openB1, openA2, openB2] =
    teams.length >= 4
      ? pairingsCycle[(miniIndex - 1) % pairingsCycle.length]
      : [t1, t2, t3, t1];

  const j1Id = startId;
  const j2Id = startId + 1;
  const j3Id = startId + 2;
  const j4Id = startId + 3;

  return [
    createMatchObject(j1Id, openA1, openB1, `${miniIndex}º Mini Torneio • Jogo ${j1Id}`, {
      miniIndex,
      slotInMini: 1
    }),
    createMatchObject(j2Id, openA2, openB2, `${miniIndex}º Mini Torneio • Jogo ${j2Id}`, {
      miniIndex,
      slotInMini: 2
    }),
    createMatchObject(j3Id, null, null, `${miniIndex}º Mini Torneio • Vencedor J1 × Vencedor J2`, {
      miniIndex,
      slotInMini: 3,
      sourceJ1: j1Id,
      sourceJ2: j2Id,
      placeholderA: `Vencedor J1`,
      placeholderB: `Vencedor J2`
    }),
    createMatchObject(j4Id, null, null, `${miniIndex}º Mini Torneio • Perdedor J1 × Perdedor J2`, {
      miniIndex,
      slotInMini: 4,
      sourceJ1: j1Id,
      sourceJ2: j2Id,
      placeholderA: `Perdedor J1`,
      placeholderB: `Perdedor J2`
    })
  ];
}

const SAVED_SESSIONS_KEY = 'volei_saved_sessions_v1';
const MASTER_ROSTER_KEY = 'volei_master_roster_v1';

const DEFAULT_MASTER_ROSTER = [
  { id: 'mr_1', name: 'Lucas', role: 'Levantador', skill: 5 },
  { id: 'mr_2', name: 'Rafael', role: 'Atacante', skill: 5 },
  { id: 'mr_3', name: 'Bruno', role: 'Atacante', skill: 5 },
  { id: 'mr_4', name: 'Gabriel', role: 'Levantador', skill: 4 },
  { id: 'mr_5', name: 'Mariana', role: 'Levantador', skill: 4 },
  { id: 'mr_6', name: 'Pedro', role: 'Levantador', skill: 4 },
  { id: 'mr_7', name: 'Thiago', role: 'Atacante', skill: 4 },
  { id: 'mr_8', name: 'Diego', role: 'Atacante', skill: 4 },
  { id: 'mr_9', name: 'Amanda', role: 'Bloqueador', skill: 4 },
  { id: 'mr_10', name: 'Camila', role: 'Bloqueador', skill: 4 },
  { id: 'mr_11', name: 'Juliana', role: 'Defensor', skill: 4 },
  { id: 'mr_12', name: 'Matheus', role: 'Geral', skill: 3 }
];

function loadMasterRoster() {
  try {
    const raw = localStorage.getItem(MASTER_ROSTER_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_MASTER_ROSTER));
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return JSON.parse(JSON.stringify(DEFAULT_MASTER_ROSTER));
  } catch (_) {
    return JSON.parse(JSON.stringify(DEFAULT_MASTER_ROSTER));
  }
}

function saveMasterRoster() {
  try {
    if (state && Array.isArray(state.masterRoster)) {
      localStorage.setItem(MASTER_ROSTER_KEY, JSON.stringify(state.masterRoster));
    }
  } catch (_) {}
}

function normalizePlayerKey(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getTodayDateIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateBr(isoStr) {
  if (!isoStr || typeof isoStr !== 'string') return 'Hoje';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function createDefaultState(customName = 'VÔLEI INTERNO', customDate = null) {
  const savedTheme = localStorage.getItem('volei_theme_pref') || 'dark';
  const teams = createDefaultTeams(4);
  return {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    tournamentName: customName || 'VÔLEI INTERNO',
    tournamentDate: customDate || getTodayDateIso(),
    sessionSetupConfirmed: false,
    theme: savedTheme,
    roomCode: 'VOLEI1',
    soundEnabled: true,
    whistlesEnabled: false, // Apitos automáticos nos pontos desativados por padrão (ativáveis com 1 clique)
    voiceEnabled: true,
    lastSavedAt: new Date().toLocaleTimeString('pt-BR'),
    updatedAtMs: Date.now(),
    activeTab: 'placar',
    rotationMode: 'winners_losers', // Default: Mini Torneio (J1, J2, J3 Vencedores, J4 Perdedores)
    drawFormat: 'size_3', // 'size_3' | 'size_4' | 'count_3' | 'count_4'
    targetPoints: 15,
    winByTwo: true,
    swappedSides: false,
    scoringMode: 'wins_count',
    lastDrawStamp: null,
    sessionStartTime: Date.now(),
    teams,
    waitingQueue: ['t3', 't4'],
    courtStreakTeamId: null,
    courtStreakCount: 0,
    masterRoster: loadMasterRoster(),
    playerPool: [],
    matches: createMiniTorneioBlock(1, 1, teams),
    liveMatchId: 1
  };
}

function getTeamCardGradient(teamColor) {
  const isLight = state && state.theme === 'light';
  return isLight
    ? `linear-gradient(160deg, ${teamColor}28 0%, rgba(255, 255, 255, 0.96) 72%)`
    : `linear-gradient(160deg, ${teamColor}26 0%, rgba(15, 23, 42, 0.88) 68%)`;
}

let state = loadState();
let quickScoreMatchId = null;
let deferredPwaPrompt = null;
let syncPushTimeout = null;
let pahoMqttClient = null;
let pahoMqttConnected = false;
let pahoMqttConnecting = false;
let pahoMqttTopic = null;
let pahoReconnectTimer = null;
let localPollInterval = null;
const myTabId = 'tab_' + Math.random().toString(36).substring(2, 9);
let courtFocusMode = false;
let courtTouchLocked = false;
let wakeLockSentinel = null;
// Pre-loaded official ElevenLabs MP3s from ./audio/ (plus any user-uploaded custom MP3s)
const customAudioMap = {
  matchpoint_t1: './audio/matchpoint_t1.mp3',
  matchpoint_t2: './audio/matchpoint_t2.mp3',
  matchpoint_t3: './audio/matchpoint_t3.mp3',
  matchpoint_t4: './audio/matchpoint_t4.mp3',
  matchpoint: './audio/matchpoint_t1.mp3',
  victory_t1: './audio/victory_t1.mp3',
  victory_t2: './audio/victory_t2.mp3',
  victory_t3: './audio/victory_t3.mp3',
  victory_t4: './audio/victory_t4.mp3',
  victory: './audio/victory_t1.mp3',
  slay_passada: './audio/deboche_passada.mp3',
  slay_milagre: './audio/deboche_milagre.mp3',
  flop_narnia: './audio/deboche_narnia.mp3',
  flop_inimigas: './audio/deboche_inimigas.mp3',
  flop_aposenta: './audio/deboche_aposenta.mp3',
  flop_close: './audio/deboche_close.mp3',
  deboche_lucinda: './audio/deboche_lucinda.mp3',
  deboche_maluca: './audio/deboche_maluca.mp3',
  deboche_doida: './audio/deboche_doida.mp3',
  deboche_doida2: './audio/deboche_doida2.mp3',
  deboche_ficacalado: './audio/deboche_ficacalado.mp3',
  deboche_risadakiko: './audio/deboche_risadakiko.mp3',
  efeito_grito: './audio/efeito_grito.mp3',
  deboche_bomdia: './audio/deboche_bomdia.mp3',
  deboche_seminaura: './audio/deboche_seminaura.mp3',
  deboche_sapatonas: './audio/deboche_sapatonas.mp3',
  deboche_miaumiau: './audio/deboche_miaumiau.mp3',
  deboche_charlene: './audio/deboche_charlene.mp3',
  deboche_acabapeloamor: './audio/deboche_acabapeloamor.mp3',
  deboche_darkness: './audio/deboche_darkness.mp3',
  deboche_vidadesgraca: './audio/deboche_vidadesgraca.mp3',
  deboche_cr7maquina: './audio/deboche_cr7maquina.mp3',
  deboche_morenoignorante: './audio/deboche_morenoignorante.mp3',
  deboche_ahpara: './audio/deboche_ahpara.mp3',
  deboche_aleluia: './audio/deboche_aleluia.mp3',
  deboche_fakenews: './audio/deboche_fakenews.mp3',
  deboche_plantaoglobo: './audio/deboche_plantaoglobo.mp3',
  deboche_choranao: './audio/deboche_choranao.mp3',
  deboche_acabou: './audio/deboche_acabou.mp3',
  deboche_eita: './audio/deboche_eita.mp3',
  deboche_naoacredito: './audio/deboche_naoacredito.mp3',
  apito_curto: './audio/apito_curto.mp3',
  apito_duplo: './audio/apito_duplo.mp3',
  apito_forte: './audio/apito_forte.mp3',
  apito_fim: './audio/apito_fim.mp3',
  slay_1: './audio/deboche_passada.mp3',
  slay_2: './audio/deboche_lucinda.mp3',
  slay_3: './audio/deboche_milagre.mp3',
  flop_1: './audio/deboche_narnia.mp3',
  flop_2: './audio/deboche_close.mp3',
  flop_3: './audio/deboche_inimigas.mp3',
  flop_4: './audio/deboche_aposenta.mp3'
};
const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('volei_arena_sync_v3') : null;

// Match Timer state
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;

function loadState() {
  try {
    // 1. Check if URL contains a shared live snapshot (?sala=CODE&s=BASE64)
    const params = new URLSearchParams(window.location.search);
    const urlSnap = params.get('s');
    const urlRoom = params.get('sala');

    if (urlSnap) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(urlSnap))));
        if (decoded && Array.isArray(decoded.teams)) {
          const def = createDefaultState();
          const merged = { ...def, ...decoded, sessionSetupConfirmed: true };
          if (urlRoom) merged.roomCode = urlRoom.toUpperCase();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      } catch (_) {}
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = createDefaultState();
      if (urlRoom) def.roomCode = urlRoom.toUpperCase();
      return def;
    }
    const parsed = JSON.parse(raw);
    const def = createDefaultState();
    if (!Array.isArray(parsed.teams) || parsed.teams.length < 2) {
      return def;
    }
    if (!Array.isArray(parsed.matches) || parsed.matches.length === 0) {
      parsed.matches = [createMatchObject(1, parsed.teams[0].id, parsed.teams[1].id, 'Jogo #1')];
      parsed.liveMatchId = 1;
    }
    const finalState = { ...def, ...parsed };
    if (!Array.isArray(finalState.masterRoster) || finalState.masterRoster.length === 0) {
      finalState.masterRoster = loadMasterRoster();
    }
    if (!finalState.sessionId) {
      finalState.sessionId = `sess_${Date.now()}`;
    }
    if (!finalState.tournamentDate) {
      finalState.tournamentDate = getTodayDateIso();
    }
    if (urlRoom) finalState.roomCode = urlRoom.toUpperCase();
    return finalState;
  } catch (e) {
    return createDefaultState();
  }
}

function getSavedSessionsList() {
  try {
    const raw = localStorage.getItem(SAVED_SESSIONS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function upsertCurrentSessionInArchive() {
  try {
    if (!state.sessionId) {
      state.sessionId = `sess_${Date.now()}`;
    }
    const list = getSavedSessionsList();
    const snapshot = JSON.parse(JSON.stringify(state));
    const idx = list.findIndex((item) => item.sessionId === state.sessionId);
    if (idx >= 0) {
      list[idx] = snapshot;
    } else {
      list.unshift(snapshot);
    }
    // Keep up to 35 saved sessions sorted newest updated first
    list.sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));
    localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(list.slice(0, 35)));
  } catch (_) {}
}

function saveState(shouldBroadcast = true) {
  try {
    state.lastSavedAt = new Date().toLocaleTimeString('pt-BR');
    state.updatedAtMs = Date.now();
    saveMasterRoster();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    upsertCurrentSessionInArchive();
    updateSyncStatusUI();

    if (shouldBroadcast) {
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: 'STATE_UPDATE', state });
        } catch (_) {}
      }
      scheduleCloudAndLocalRoomPush();
      if (typeof pushTournamentsHubSync === 'function') {
        pushTournamentsHubSync();
      }
    }
  } catch (_) {}
}

function updateSyncStatusUI() {
  const code = (state.roomCode || 'VOLEI1').toUpperCase();
  const labelEl = document.getElementById('room-sync-label');
  if (labelEl) {
    labelEl.innerHTML = `<span class="btn-label">Salvo (${state.lastSavedAt || 'agora'}) • </span>#${escapeHtml(code)}`;
  }
  const pillEl = document.getElementById('sync-code-pill');
  if (pillEl) {
    pillEl.textContent = `#${code}`;
  }
  const lastSavedText = document.getElementById('sync-last-saved-text');
  if (lastSavedText) {
    lastSavedText.textContent = `✅ Último salvamento automático às ${state.lastSavedAt || 'agora'} • Sincronizado na Sala #${code}.`;
  }
}

/* ==========================================
   MULTI-DEVICE REAL-TIME MQTT SYNC ENGINE
   (HiveMQ WebSocket Broker wss://broker.hivemq.com:8884/mqtt)
   ========================================== */
function getCleanRoomTopic(roomCode) {
  const clean = String(roomCode || state.roomCode || 'VOLEI1')
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '');
  return `volei_arena_room_${clean || 'VOLEI1'}`;
}

function updateRoomConnectionUI(status) {
  const code = (state.roomCode || 'VOLEI1').toUpperCase();
  const labelEl = document.getElementById('room-sync-label');
  const pillEl = document.getElementById('sync-code-pill');
  const lastSavedText = document.getElementById('sync-last-saved-text');
  
  if (labelEl) {
    let icon = '🟢';
    if (status === 'connecting') icon = '🟡';
    if (status === 'disconnected') icon = '⚪';
    labelEl.innerHTML = `${icon} #${escapeHtml(code)}`;
  }
  if (pillEl) {
    pillEl.textContent = `#${code}`;
  }
  if (lastSavedText) {
    lastSavedText.textContent = `📡 Sala #${code} • ${status === 'connected' ? 'Sincronizado ao vivo' : (status === 'connecting' ? 'Conectando...' : 'Offline')}`;
  }
}

function buildCompactSyncPayload() {
  return {
    senderId: myTabId,
    senderTabTime: Date.now(),
    sessionId: state.sessionId,
    tournamentName: state.tournamentName,
    tournamentDate: state.tournamentDate,
    roomCode: state.roomCode,
    rotationMode: state.rotationMode,
    drawFormat: state.drawFormat,
    targetPoints: state.targetPoints,
    winByTwo: state.winByTwo,
    scoringMode: state.scoringMode,
    lastDrawStamp: state.lastDrawStamp,
    teams: state.teams,
    waitingQueue: state.waitingQueue,
    courtStreakTeamId: state.courtStreakTeamId,
    courtStreakCount: state.courtStreakCount,
    masterRoster: state.masterRoster,
    playerPool: state.playerPool,
    matches: state.matches,
    liveMatchId: state.liveMatchId
  };
}

function applyIncomingRoomState(incoming) {
  if (!incoming || !Array.isArray(incoming.teams) || !Array.isArray(incoming.matches)) return false;
  if (incoming.senderTabTime && state.updatedAtMs && incoming.senderTabTime <= state.updatedAtMs) {
    return false;
  }
  state = {
    ...state,
    ...incoming,
    sessionSetupConfirmed: true,
    updatedAtMs: incoming.senderTabTime || Date.now(),
    lastSavedAt: new Date().toLocaleTimeString('pt-BR')
  };
  saveState(false);
  renderAll();
  return true;
}

function scheduleCloudAndLocalRoomPush() {
  if (syncPushTimeout) clearTimeout(syncPushTimeout);
  syncPushTimeout = setTimeout(() => {
    pushRoomStateNow(false);
  }, 200);
}

function pushRoomStateNow(showFeedback = false) {
  const code = (state.roomCode || 'VOLEI1').toUpperCase();
  const payload = buildCompactSyncPayload();

  // 1. Publish to HiveMQ via Paho MQTT (retained = true so any device joining immediately gets latest state)
  if (pahoMqttClient && pahoMqttConnected && pahoMqttTopic) {
    try {
      const msg = new Paho.MQTT.Message(JSON.stringify(payload));
      msg.destinationName = pahoMqttTopic;
      msg.qos = 1;
      msg.retained = true;
      pahoMqttClient.send(msg);
      if (showFeedback) {
        showToast(`📡 Placar sincronizado ao vivo na Sala <strong>#${escapeHtml(code)}</strong>!`, 'success');
      }
    } catch (err) {
      console.warn('MQTT send error:', err);
    }
  }

  // 2. Local Node server backup if running
  fetch(`/api/room/${encodeURIComponent(code)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: payload })
  }).catch(() => {});

  // Também envia sync do Hub de Torneios para o feed do lobby
  pushTournamentsHubSync();
}

/* ==========================================
   PRESENÇA EM TEMPO REAL & HUB DE TORNEIOS
   ========================================== */
let globalPeers = {};
let roomPeers = {};
let presenceHeartbeatInterval = null;
let presencePruneInterval = null;

function sendPresencePing(action = 'ping') {
  if (!pahoMqttClient || !pahoMqttConnected) return;
  try {
    const isMob = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const payload = {
      clientId: myTabId,
      action,
      ua: isMob ? 'Celular' : 'Computador',
      room: (state.roomCode || 'VOLEI1').toUpperCase(),
      ts: Date.now()
    };
    const jsonStr = JSON.stringify(payload);

    // Ping global
    const gMsg = new Paho.MQTT.Message(jsonStr);
    gMsg.destinationName = 'volei_arena/global/presence';
    gMsg.qos = 0;
    pahoMqttClient.send(gMsg);

    // Ping sala atual
    if (state.roomCode) {
      const rMsg = new Paho.MQTT.Message(jsonStr);
      rMsg.destinationName = `volei_arena/room/${(state.roomCode || 'VOLEI1').toUpperCase()}/presence`;
      rMsg.qos = 0;
      pahoMqttClient.send(rMsg);
    }
  } catch (_) {}
}

function pruneAndRenderPresence() {
  const now = Date.now();
  const isMob = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  globalPeers[myTabId] = { ts: now, ua: isMob ? 'Celular' : 'Computador' };
  roomPeers[myTabId] = { ts: now, ua: isMob ? 'Celular' : 'Computador' };

  for (const id in globalPeers) {
    if (now - globalPeers[id].ts > 25000) delete globalPeers[id];
  }
  for (const id in roomPeers) {
    if (now - roomPeers[id].ts > 25000) delete roomPeers[id];
  }

  const globalCount = Object.keys(globalPeers).length;
  const roomCount = Object.keys(roomPeers).length;

  const lobbyCountEl = document.getElementById('lobby-online-count');
  if (lobbyCountEl) {
    lobbyCountEl.textContent = `${globalCount} ${globalCount === 1 ? 'dispositivo online' : 'dispositivos online'}`;
  }

  const headerCountEl = document.getElementById('header-presence-count');
  if (headerCountEl) {
    headerCountEl.textContent = `${roomCount} online`;
  }

  const focusCountEl = document.getElementById('focus-presence-count');
  if (focusCountEl) {
    focusCountEl.textContent = `${roomCount} online`;
  }
}

window.showOnlineDevicesToast = function () {
  pruneAndRenderPresence();
  const count = Object.keys(globalPeers).length;
  const isMob = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const myDevice = isMob ? '📱 Celular' : '💻 Computador';
  showToast(`🌐 <strong>${count} aparelho(s) conectado(s) na Arena ao vivo!</strong><br><small>Seu aparelho atual: ${myDevice}. Sincronização multi-telas ativa via MQTT.</small>`, 'info');
};

window.showRoomPresenceToast = function () {
  pruneAndRenderPresence();
  const roomCount = Object.keys(roomPeers).length;
  const globalCount = Object.keys(globalPeers).length;
  const room = (state.roomCode || 'VOLEI1').toUpperCase();
  showToast(`📡 <strong>${roomCount} aparelho(s) ao vivo na Sala #${escapeHtml(room)}</strong> (${globalCount} no site todo).<br><small>Pontos, times e apitos sincronizam em tempo real entre celular e PC!</small>`, 'success');
};

function pushTournamentsHubSync() {
  if (!pahoMqttClient || !pahoMqttConnected) return;
  try {
    const list = getSavedSessionsList();
    if (!list || list.length === 0) return;
    const payload = {
      senderId: myTabId,
      updatedAt: Date.now(),
      sessions: list
    };
    const msg = new Paho.MQTT.Message(JSON.stringify(payload));
    msg.destinationName = 'volei_arena/hub/tournaments';
    msg.qos = 1;
    msg.retained = true;
    pahoMqttClient.send(msg);
  } catch (err) {
    console.warn('Failed to push tournaments hub sync:', err);
  }
}

function applyIncomingHubTournaments(payload) {
  if (!payload || !Array.isArray(payload.sessions)) return;
  if (payload.senderId === myTabId) return;

  const currentLocal = getSavedSessionsList();
  const sessionMap = {};
  currentLocal.forEach((s) => {
    if (s && s.sessionId) sessionMap[s.sessionId] = s;
  });

  let hasChanges = false;
  payload.sessions.forEach((incomingSess) => {
    if (!incomingSess || !incomingSess.sessionId) return;
    const existing = sessionMap[incomingSess.sessionId];
    if (!existing) {
      sessionMap[incomingSess.sessionId] = incomingSess;
      hasChanges = true;
    } else {
      const incomingStamp = incomingSess.updatedAtMs || 0;
      const existingStamp = existing.updatedAtMs || 0;
      if (incomingStamp > existingStamp) {
        sessionMap[incomingSess.sessionId] = incomingSess;
        hasChanges = true;
      }
    }
  });

  if (hasChanges) {
    const mergedList = Object.values(sessionMap);
    localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(mergedList));

    // Se a sessão aberta no momento foi atualizada na nuvem, atualiza na tela
    if (state.sessionId && sessionMap[state.sessionId]) {
      const updatedSess = sessionMap[state.sessionId];
      if ((updatedSess.updatedAtMs || 0) > (state.updatedAtMs || 0)) {
        state = { ...state, ...updatedSess };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        renderAll();
      }
    }
    renderLobbyFeed();
  }
}

window.addEventListener('beforeunload', () => {
  sendPresencePing('leave');
});
window.addEventListener('pagehide', () => {
  sendPresencePing('leave');
});

function initPahoMqtt(roomCode, showToastFeedback = false) {
  const code = String(roomCode || state.roomCode || 'VOLEI1').trim().toUpperCase();
  state.roomCode = code;
  const topic = getCleanRoomTopic(code);
  pahoMqttTopic = topic;

  if (typeof Paho === 'undefined' || !Paho.MQTT || !Paho.MQTT.Client) {
    console.warn('Paho MQTT not loaded yet; will retry in 1s.');
    setTimeout(() => initPahoMqtt(code, showToastFeedback), 1000);
    return;
  }

  if (pahoMqttClient) {
    try {
      pahoMqttClient.disconnect();
    } catch (_) {}
    pahoMqttClient = null;
    pahoMqttConnected = false;
  }

  if (pahoReconnectTimer) {
    clearTimeout(pahoReconnectTimer);
    pahoReconnectTimer = null;
  }

  pahoMqttConnecting = true;
  updateRoomConnectionUI('connecting');

  const clientId = 'volei_' + code.toLowerCase() + '_' + myTabId;
  const brokerHost = 'broker.hivemq.com';
  const brokerPort = 8884;
  const brokerPath = '/mqtt';

  try {
    pahoMqttClient = new Paho.MQTT.Client(brokerHost, brokerPort, brokerPath, clientId);

    pahoMqttClient.onConnectionLost = (responseObject) => {
      pahoMqttConnected = false;
      pahoMqttConnecting = false;
      updateRoomConnectionUI('disconnected');
      if (responseObject && responseObject.errorCode !== 0) {
        console.warn('MQTT Connection lost:', responseObject.errorMessage);
        if (!pahoReconnectTimer) {
          pahoReconnectTimer = setTimeout(() => {
            initPahoMqtt(state.roomCode);
          }, 3000);
        }
      }
    };

    pahoMqttClient.onMessageArrived = (message) => {
      const arrivedTopic = message.destinationName;
      try {
        const payload = JSON.parse(message.payloadString);
        if (!payload) return;

        if (arrivedTopic === 'volei_arena/hub/tournaments') {
          applyIncomingHubTournaments(payload);
          return;
        }

        if (arrivedTopic === 'volei_arena/global/presence') {
          if (payload.clientId && payload.clientId !== myTabId) {
            if (payload.action === 'leave') {
              delete globalPeers[payload.clientId];
            } else {
              globalPeers[payload.clientId] = { ts: Date.now(), ua: payload.ua || 'Dispositivo' };
            }
            pruneAndRenderPresence();
          }
          return;
        }

        if (arrivedTopic.endsWith('/presence')) {
          if (payload.clientId && payload.clientId !== myTabId) {
            if (payload.action === 'leave') {
              delete roomPeers[payload.clientId];
            } else {
              roomPeers[payload.clientId] = { ts: Date.now(), ua: payload.ua || 'Dispositivo' };
            }
            pruneAndRenderPresence();
          }
          return;
        }

        // Room state update
        if (payload.senderId !== myTabId) {
          const applied = applyIncomingRoomState(payload);
          if (applied) {
            updateRoomConnectionUI('connected');
          }
        }
      } catch (err) {
        console.error('Failed to parse incoming MQTT message:', err);
      }
    };

    pahoMqttClient.connect({
      useSSL: true,
      timeout: 8,
      keepAliveInterval: 30,
      cleanSession: true,
      onSuccess: () => {
        pahoMqttConnected = true;
        pahoMqttConnecting = false;
        updateRoomConnectionUI('connected');

        // Subscribing to:
        // 1. Room state
        pahoMqttClient.subscribe(topic, { qos: 1 });
        // 2. Hub tournaments list (so any tournament created on PC shows on phone)
        pahoMqttClient.subscribe('volei_arena/hub/tournaments', { qos: 1 });
        // 3. Global presence (how many people are on the site)
        pahoMqttClient.subscribe('volei_arena/global/presence', { qos: 0 });
        // 4. Room presence (how many people in this room)
        pahoMqttClient.subscribe(`volei_arena/room/${code}/presence`, { qos: 0 });

        if (showToastFeedback) {
          showToast(`✅ Conectado à Sala <strong>#${escapeHtml(code)}</strong> ao vivo! Sincronizado com PC e celular.`, 'success');
        }

        // Send presence ping immediately
        sendPresencePing('ping');
        pruneAndRenderPresence();

        // Push local tournaments to hub if we have any
        pushTournamentsHubSync();

        // Push room state if we have teams
        if (state.teams && state.teams.length > 0) {
          pushRoomStateNow(false);
        }

        // Start presence heartbeat if not already started
        if (!presenceHeartbeatInterval) {
          presenceHeartbeatInterval = setInterval(() => sendPresencePing('ping'), 10000);
        }
        if (!presencePruneInterval) {
          presencePruneInterval = setInterval(pruneAndRenderPresence, 4000);
        }
      },
      onFailure: (err) => {
        pahoMqttConnected = false;
        pahoMqttConnecting = false;
        updateRoomConnectionUI('disconnected');
        console.warn('MQTT connect failure, retrying in 4s:', err);
        if (!pahoReconnectTimer) {
          pahoReconnectTimer = setTimeout(() => {
            initPahoMqtt(state.roomCode);
          }, 4000);
        }
      }
    });
  } catch (e) {
    console.error('Error instantiating Paho client:', e);
    pahoMqttConnecting = false;
  }

  // Backup local polling if running local node server
  if (localPollInterval) clearInterval(localPollInterval);
  localPollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/room/${encodeURIComponent(code)}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.payload && json.payload.state) {
          applyIncomingRoomState(json.payload.state);
        }
      }
    } catch (_) {}
  }, 3000);
}

// Aliases for compatibility
function subscribeToRoomRealtimeStream(roomCode) {
  initPahoMqtt(roomCode);
}
function pullRoomStateOnce(roomCode, showFeedback = true) {
  initPahoMqtt(roomCode, showFeedback);
}

window.leaveRoomAndOpenLogin = function () {
  if (pahoMqttClient) {
    try {
      pahoMqttClient.disconnect();
    } catch (_) {}
    pahoMqttClient = null;
    pahoMqttConnected = false;
  }
  if (pahoReconnectTimer) {
    clearTimeout(pahoReconnectTimer);
    pahoReconnectTimer = null;
  }
  state.sessionSetupConfirmed = false;
  saveState(false);
  updateRoomConnectionUI('disconnected');
  openSessionsModal();
  showToast('🚪 Você saiu da sala. Digite outro código para entrar ou inicie um novo torneio.', 'info');
};

/* ==========================================
   REAL MP3 AUDIO PLAYER (SEM VOZ ROBÓTICA)
   ========================================== */
function playCustomAudioOrSpeak(slotKey) {
  if (!state.soundEnabled) return;
  if (customAudioMap[slotKey]) {
    try {
      const audio = new Audio(customAudioMap[slotKey]);
      audio.play().catch(() => {});
    } catch (_) {}
  }
}

function speakNarration() {
  // Locutor robótico desativado conforme solicitado (apenas MP3s reais tocam)
}

const DEBOCHE_LINES = {
  matchpoint_t1: 'Atenção! É Match Point para o Time 1!',
  matchpoint_t2: 'Atenção! É Match Point para o Time 2!',
  matchpoint_t3: 'Atenção! É Match Point para o Time 3!',
  matchpoint_t4: 'Atenção! É Match Point para o Time 4!',
  victory_t1: 'Fim de jogo! O Time 1 ganhou a partida!',
  victory_t2: 'Fim de jogo! O Time 2 ganhou a partida!',
  victory_t3: 'Fim de jogo! O Time 3 ganhou a partida!',
  victory_t4: 'Fim de jogo! O Time 4 ganhou a partida!',
  slay_passada: 'Passada! Ela não fez o ponto, ela saiu desfilando!',
  slay_milagre: 'Milagre! Finalmente acertou uma bola, já pode chover!',
  flop_narnia: 'Meu Deus, gata! Mandou essa bola lá pra Nárnia!',
  flop_inimigas: 'Gata, você tá jogando pelo outro time, é? Só dá ponto de graça pras inimigas!',
  flop_aposenta: 'Que vergonha, gata! Pede música no Fantástico e aposenta logo!',
  flop_close: 'Muito close e pouco vôlei, hein amor? Tá na quadra só pra tirar foto?',
  deboche_lucinda: 'Obrigado pelo toque, Lucinda! O que eu mais prezo na vida é conselho de mendiga!',
  deboche_maluca: 'Hahaha! Maluca! Hahaha!',
  deboche_doida: 'Hahaha! Doida! Hahaha!',
  deboche_doida2: 'Hahaha! Doida! Hahaha! (2)',
  deboche_ficacalado: '🤫 Apanhou e aí fica calado! Não vai ficar dando explicação no grupo não! Apanhou, ficou calado!',
  deboche_risadakiko: '🤣 Ar-ar-ar-ar-ar! (Risada do Kiko)',
  efeito_grito: '😱 AAAAAHHH! (Surto na quadra!)',
  deboche_bomdia: '☀️ Bom dia a todas, a todes, a Toddy, Nesquik... Teletubbies!',
  deboche_seminaura: '🫵 Cara você não tem aura mano... Desiste cara, desiste!',
  deboche_sapatonas: '👠 Sapatonas! Eu sinto de longe o cheiro de couro...',
  deboche_miaumiau: '🐱 Miau miau miau miau...',
  deboche_charlene: '🤦 Eu não acredito não, Charlene...',
  deboche_acabapeloamor: '🙏 Acaba pelo amor de Deus, acaba!',
  deboche_darkness: '🌑 Hello darkness my old friend...',
  deboche_vidadesgraca: '🥖 A minha vida aqui é uma desgraça... Caldo de cana e pastel!',
  deboche_cr7maquina: '🤖 O homem, uma máquina, uma besta enjaulada com ódio! Cristiano Ronaldo!',
  deboche_morenoignorante: '😠 Rapaz, o moreno tá ignorante, hein cara...',
  deboche_ahpara: '✋ Ah pára... Hahaha!',
  deboche_aleluia: '👼 Aleluia! Aleluia! Aleluia!',
  deboche_fakenews: '🔮 Momento Fake News! Oferecimento: Mãe Dináh!',
  deboche_plantaoglobo: '🚨 Tchan-tchan-tchan! Plantão da Globo urgente!',
  deboche_choranao: '😭 Vai chorar? Chora não vagabunda, chora não...',
  deboche_acabou: '📢 Acaboooou! É tetra! Acabou!',
  deboche_eita: '😱 Eitaaa!',
  deboche_naoacredito: '🤯 Na moral, sinceramente eu não tô acreditando nisso que eu tô vendo!',
  apito_curto: '📣 Piii! (Apito de Saque / Ponto)',
  apito_duplo: '📣 Piii-Piii! (Apito Duplo)',
  apito_forte: '📣 Prrrrriii! (Apito Forte / Falta)',
  apito_fim: '🏁 Piiiii-Piiiii! (Apito de Fim de Jogo)',
  slay_1: 'Passada! Ela não fez o ponto, ela saiu desfilando!',
  slay_2: 'Obrigado pelo toque, Lucinda! O que eu mais prezo na vida é conselho de mendiga!',
  slay_3: 'Milagre! Finalmente acertou uma bola, já pode chover!',
  flop_1: 'Meu Deus, gata! Mandou essa bola lá pra Nárnia!',
  flop_2: 'Muito close e pouco vôlei, hein amor? Tá na quadra só pra tirar foto?',
  flop_3: 'Gata, você tá jogando pelo outro time, é? Só dá ponto de graça pras inimigas!',
  flop_4: 'Que vergonha, gata! Pede música no Fantástico e aposenta logo!'
};

window.triggerDebocheAudio = function (slotKey) {
  const phrase = DEBOCHE_LINES[slotKey] || DEBOCHE_LINES.flop_1;
  state.soundEnabled = true;
  renderHeaderAndNav();
  playCustomAudioOrSpeak(slotKey, phrase);
  showToast(`🔊 <strong>Som na quadra:</strong> ${escapeHtml(phrase)}`, 'info');
};

function buildElevenLabsScript() {
  const t1 = (state.teams[0]?.name || 'Time 1').toUpperCase();
  const t2 = (state.teams[1]?.name || 'Time 2').toUpperCase();
  const t3 = (state.teams[2]?.name || 'Time 3').toUpperCase();
  const t4 = (state.teams[3]?.name || 'Time 4').toUpperCase();

  return [
    `=== 1. PONTOS, MATCH POINT E VITÓRIA ===`,
    `PONTO... para o ${t1}!`,
    `PONTO... para o ${t2}!`,
    `PONTO... para o ${t3}!`,
    `PONTO... para o ${t4}!`,
    `É MATCH POINT — para o ${t1}!`,
    `FIM DE JOGO! ... ${t1} — GANHOU a partida!`,
    ``,
    `=== 2. DEBOCHE QUANDO ACERTA (PISOU!) ===`,
    `Aiiin... PISOU MENOS, querida! ... Nem precisei suar o glitter!`,
    `ENTREGOU TUDO, mona! ... Aceita — ou SURTA, bebê!`,
    `MILAGRE! ... Até que enfim a gata acertou UMA bola na quadra!`,
    ``,
    `=== 3. DEBOCHE QUANDO ERRA (QUE MICO!) ===`,
    `Mona do céu... QUE MICO foi esse na rede?! ... Chama o SAMU!`,
    `Aiiin... faltou força na munheca, querida? ... Bateu com a mão FOFA!`,
    `Amor... a rede subiu sozinha — ou foi você que tropeçou no salto?!`,
    `Que vergonha, gata! ... Pede música no Fantástico — e APOSENTA logo!`
  ].join('\n');
}

/* ==========================================
   WEB AUDIO SYNTHESIZER (WHISTLE & BEEPS)
   ========================================== */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    const isExplicitWhistle = ['whistle_short', 'whistle_double', 'whistle_strong', 'whistle_end'].includes(type);
    const useWhistleForMatch = state.whistlesEnabled === true && ['setpoint', 'victory', 'buzzer'].includes(type);

    if (isExplicitWhistle || useWhistleForMatch) {
      const mp3Map = {
        setpoint: './audio/apito_duplo.mp3',
        victory: './audio/apito_fim.mp3',
        buzzer: './audio/apito_forte.mp3',
        whistle_short: './audio/apito_curto.mp3',
        whistle_double: './audio/apito_duplo.mp3',
        whistle_strong: './audio/apito_forte.mp3',
        whistle_end: './audio/apito_fim.mp3'
      };
      if (mp3Map[type]) {
        const whistleAudio = new Audio(mp3Map[type]);
        whistleAudio.volume = 0.9;
        whistleAudio.play().catch(() => {});
        return;
      }
    }

    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'point') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'undo') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'setpoint') {
      [0, 0.18].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2750, now + offset);
        osc.frequency.setValueAtTime(2880, now + offset + 0.05);
        gain.gain.setValueAtTime(0.16, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.14);
      });
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.16, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.56);
      });
    } else if (type === 'buzzer') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(145, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.62);
    }
  } catch (_) {}
}

window.toggleWhistles = function (forceVal = null) {
  if (typeof forceVal === 'boolean') {
    state.whistlesEnabled = forceVal;
  } else {
    state.whistlesEnabled = !(state.whistlesEnabled === true);
  }

  if (state.whistlesEnabled) {
    state.soundEnabled = true;
    playSound('whistle_short');
    showToast('📣 <strong>Apitos do Juiz LIGADOS!</strong> Apito real a cada ponto e lance.', 'success');
  } else {
    playSound('point'); // will play soft sine beep
    showToast('🔕 <strong>Apitos do Juiz DESLIGADOS!</strong> Som suave sem apito repetitivo.', 'info');
  }

  saveState();
  renderHeaderAndNav();
  renderLiveScoreboard();
};

function triggerHaptic(pattern = 25) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (_) {}
  }
}

/* ==========================================
   CONFETTI CELEBRATION ENGINE
   ========================================== */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 85 }, () => ({
    x: canvas.width * 0.5 + (Math.random() - 0.5) * 260,
    y: canvas.height * 0.35,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 14 - 4,
    size: Math.random() * 8 + 5,
    color: TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.25,
    alpha: 1
  }));

  let frame = 0;
  function step() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38;
      p.rot += p.vrot;
      if (frame > 55) p.alpha -= 0.022;
      if (p.alpha > 0 && p.y < canvas.height + 30) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }
    }
    if (alive && frame < 120) {
      requestAnimationFrame(step);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(step);
}

/* ==========================================
   HELPERS: TEAMS, QUEUE & MATCHES
   ========================================== */
function getTeamById(teamId) {
  return (
    state.teams.find((t) => t.id === teamId) ||
    state.teams[0] || {
      id: 't1',
      name: 'Time 01',
      color: '#38bdf8',
      icon: './volleyball-player-motion-svgrepo-com.svg',
      players: []
    }
  );
}

function getMatchById(matchId) {
  return state.matches.find((m) => m.id === Number(matchId)) || state.matches[state.matches.length - 1];
}

function getCurrentLiveMatch() {
  return getMatchById(state.liveMatchId);
}

function syncWaitingQueueWithCurrentMatch() {
  const match = getCurrentLiveMatch();
  if (!match) return;
  const onCourtIds = new Set([match.teamAId, match.teamBId]);

  // Keep existing queue order for off-court teams, add any missing off-court teams
  const validWaiting = (state.waitingQueue || []).filter(
    (id) => !onCourtIds.has(id) && state.teams.some((t) => t.id === id)
  );

  for (const t of state.teams) {
    if (!onCourtIds.has(t.id) && !validWaiting.includes(t.id)) {
      validWaiting.push(t.id);
    }
  }

  state.waitingQueue = validWaiting;
}

function isMatchTargetReached(scoreA, scoreB) {
  const target = state.targetPoints;
  const max = Math.max(scoreA, scoreB);
  const diff = Math.abs(scoreA - scoreB);
  if (max < target) return false;
  return state.winByTwo ? diff >= 2 : diff >= 1;
}

function isMatchPointState(scoreA, scoreB) {
  if (isMatchTargetReached(scoreA, scoreB)) return null;
  const aWinsNext = isMatchTargetReached(scoreA + 1, scoreB);
  const bWinsNext = isMatchTargetReached(scoreA, scoreB + 1);
  if (aWinsNext) return 'A';
  if (bWinsNext) return 'B';
  return null;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 3400);
}

/* ==========================================
   MINI TORNEIO BRACKET SYNC & NEXT MATCH GENERATOR
   ("J1: Time 01 x Time 02 | J2: Time 03 x Time 04 | J3: Vencedor J1 x Vencedor J2 | J4: Perdedor J1 x Perdedor J2")
   ========================================== */
function syncMiniTorneioBrackets() {
  state.matches.forEach((m) => {
    if (m.sourceJ1 && m.sourceJ2) {
      const j1 = state.matches.find((x) => x.id === m.sourceJ1);
      const j2 = state.matches.find((x) => x.id === m.sourceJ2);

      if (m.slotInMini === 3) {
        // Jogo 3: Vencedor J1 x Vencedor J2
        m.teamAId = j1 && j1.status === 'done' && j1.winnerId ? j1.winnerId : null;
        m.teamBId = j2 && j2.status === 'done' && j2.winnerId ? j2.winnerId : null;
      } else if (m.slotInMini === 4) {
        // Jogo 4: Perdedor J1 x Perdedor J2
        m.teamAId = j1 && j1.status === 'done' && j1.loserId ? j1.loserId : null;
        m.teamBId = j2 && j2.status === 'done' && j2.loserId ? j2.loserId : null;
      }
    }
  });
}

function generateNextMatchesAfterFinish(finishedMatch) {
  const winnerId = finishedMatch.winnerId;
  const loserId = finishedMatch.loserId;

  // Update court streak
  if (state.courtStreakTeamId === winnerId) {
    state.courtStreakCount += 1;
  } else {
    state.courtStreakTeamId = winnerId;
    state.courtStreakCount = 1;
  }

  // First, propagate winners/losers of J1 & J2 into J3 (Vencedores) and J4 (Perdedores)
  syncMiniTorneioBrackets();

  // Check if there is already a pending match in the queue after this one
  const existingPending = state.matches.find((m) => m.id > finishedMatch.id && m.status !== 'done');
  if (existingPending) {
    return existingPending;
  }

  const nextId = state.matches.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  syncWaitingQueueWithCurrentMatch();

  // MODE: MINI TORNEIO (J1, J2, J3 Vencedor×Vencedor, J4 Perdedor×Perdedor)
  if (state.rotationMode === 'winners_losers' && state.teams.length >= 4) {
    const maxMini = state.matches.reduce((max, m) => Math.max(max, m.miniIndex || 1), 1);
    const newBlock = createMiniTorneioBlock(maxMini + 1, nextId, state.teams);
    state.matches.push(...newBlock);
    syncMiniTorneioBrackets();
    return newBlock[0];
  }

  // MODE: QUEM GANHA FICA (REI DA QUADRA)
  if (state.rotationMode === 'king' || state.rotationMode === 'king_2max') {
    if (state.waitingQueue.length === 0) {
      const nextMatch = createMatchObject(nextId, winnerId, loserId, `Jogo #${nextId} • Revanche`);
      state.matches.push(nextMatch);
      return nextMatch;
    }

    if (state.rotationMode === 'king_2max' && state.courtStreakCount >= 2) {
      state.courtStreakCount = 0;
      state.courtStreakTeamId = null;

      if (state.waitingQueue.length >= 2) {
        const nextA = state.waitingQueue.shift();
        const nextB = state.waitingQueue.shift();
        state.waitingQueue.push(loserId, winnerId);
        const nextMatch = createMatchObject(
          nextId,
          nextA,
          nextB,
          `Jogo #${nextId} • Rodízio (Após 2V seguidas)`
        );
        state.matches.push(nextMatch);
        return nextMatch;
      } else {
        const challengerId = state.waitingQueue.shift();
        state.waitingQueue.push(winnerId);
        const nextMatch = createMatchObject(
          nextId,
          challengerId,
          loserId,
          `Jogo #${nextId} • Rodízio (Campeão 2V descansa)`
        );
        state.matches.push(nextMatch);
        return nextMatch;
      }
    }

    const challengerId = state.waitingQueue.shift();
    state.waitingQueue.push(loserId);

    const nextMatch = createMatchObject(
      nextId,
      winnerId,
      challengerId,
      `Jogo #${nextId} • Vencedor Fica (${state.courtStreakCount}V)`
    );
    state.matches.push(nextMatch);
    return nextMatch;
  }

  // MODE: LIVRE NA HORA (or 3 teams fallback)
  const nextA = winnerId;
  const nextB = state.waitingQueue.length > 0 ? state.waitingQueue.shift() : loserId;
  if (nextB !== loserId) state.waitingQueue.push(loserId);

  const nextMatch = createMatchObject(nextId, nextA, nextB, `Jogo #${nextId} • Confronto Livre`);
  state.matches.push(nextMatch);
  return nextMatch;
}

/* ==========================================
   MODO PARTIDA FIXA (TELA TRAVADA) & HISTÓRICO DE SESSÕES
   ========================================== */
function isCourtTouchBlocked() {
  if (courtTouchLocked) {
    showToast('🔒 <strong>Placar Travado!</strong> Toque em "🔓 Destravar" no topo para alterar os pontos.', 'warn');
    return true;
  }
  return false;
}

async function requestScreenWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
    }
  } catch (_) {}
}

function releaseScreenWakeLock() {
  try {
    if (wakeLockSentinel) {
      wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch (_) {}
}

window.enterCourtFocusMode = function () {
  courtFocusMode = true;
  courtTouchLocked = false;
  document.body.classList.add('court-focus-mode');
  document.body.classList.remove('court-locked');
  document.getElementById('focus-mode-bar')?.classList.remove('hidden');

  const lockBtn = document.getElementById('btn-toggle-court-lock');
  if (lockBtn) {
    lockBtn.classList.remove('locked-active');
    lockBtn.innerHTML = 'Travar Placar';
  }

  // Start timer automatically if not running
  if (!timerRunning) {
    document.getElementById('btn-timer-toggle')?.click();
  }

  requestScreenWakeLock();
  renderLiveScoreboard();
  window.scrollTo({ top: 0, behavior: 'instant' });
  showToast('🏐 <strong>Modo Partida Iniciado!</strong> Tela fixa no placar gigante.', 'success');
};

window.exitCourtFocusMode = function () {
  courtFocusMode = false;
  courtTouchLocked = false;
  document.body.classList.remove('court-focus-mode', 'court-locked');
  document.getElementById('focus-mode-bar')?.classList.add('hidden');
  releaseScreenWakeLock();
  renderLiveScoreboard();
  showToast('🔓 Saiu do Modo Tela Fixa. Painel completo liberado!', 'info');
};

window.toggleCourtTouchLock = function () {
  courtTouchLocked = !courtTouchLocked;
  document.body.classList.toggle('court-locked', courtTouchLocked);
  const lockBtn = document.getElementById('btn-toggle-court-lock');
  if (lockBtn) {
    lockBtn.classList.toggle('locked-active', courtTouchLocked);
    lockBtn.innerHTML = courtTouchLocked ? 'Destravar Placar' : 'Travar Placar';
  }
  renderLiveScoreboard();
  if (courtTouchLocked) {
    showToast('🔒 <strong>Toques Travados!</strong> Ninguém consegue mexer nos pontos até destravar.', 'warn');
  } else {
    showToast('🔓 <strong>Placar Destravado!</strong> Pode marcar os pontos.', 'success');
  }
};

/* ==========================================
   TELA SEPARADA: LOBBY & PAINEL DE JOGOS
   ========================================== */
function showLobbyScreen() {
  document.getElementById('screen-lobby')?.classList.remove('hidden');
  document.getElementById('screen-tournament')?.classList.add('hidden');
  renderLobbyFeed();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Conecta ou mantém MQTT ativo para receber torneios criados em outros aparelhos e presença ao vivo
  if (!pahoMqttClient || !pahoMqttConnected) {
    initPahoMqtt(state.roomCode || 'VOLEI1', false);
  } else {
    sendPresencePing('ping');
    pushTournamentsHubSync();
  }
}

function showTournamentScreen() {
  document.getElementById('screen-lobby')?.classList.add('hidden');
  document.getElementById('screen-tournament')?.classList.remove('hidden');
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSessionsModal() {
  showLobbyScreen();
}

window.goToLobbyScreen = function () {
  sendPresencePing('leave');
  state.sessionSetupConfirmed = false;
  saveState(false);
  showLobbyScreen();
  showToast('🚪 Você voltou ao Painel Principal. Escolha um jogo ou entre com um código.', 'info');
};
window.leaveRoomAndOpenLogin = window.goToLobbyScreen;

window.joinRoomFromLobby = function () {
  const input = document.getElementById('input-lobby-room-code');
  const code = (input ? input.value : '').replace(/^#/, '').trim().toUpperCase();
  if (!code) {
    showToast('⚠️ Digite o código da sala (ex: VOLEI1)!', 'warn');
    return;
  }
  state.roomCode = code;
  state.sessionSetupConfirmed = true;
  saveState();
  showTournamentScreen();
  initPahoMqtt(code, true);
};

window.quickFillLobbyRoom = function (code) {
  const input = document.getElementById('input-lobby-room-code');
  if (input) input.value = code;
  window.joinRoomFromLobby();
};

window.quickFillRoomCode = window.quickFillLobbyRoom;
window.joinRoomFromLogin = window.joinRoomFromLobby;

window.createNewTournamentFromLobby = function () {
  upsertCurrentSessionInArchive();
  const nameInput = document.getElementById('input-lobby-new-title');
  const dateInput = document.getElementById('input-lobby-new-date');
  const roomInput = document.getElementById('input-lobby-new-room');

  const newName = (nameInput?.value || '').trim() || 'VÔLEI INTERNO';
  const newDate = dateInput?.value || getTodayDateIso();
  const newRoom = (roomInput?.value || 'VOLEI1').replace(/^#/, '').trim().toUpperCase() || 'VOLEI1';

  state = createDefaultState(newName, newDate);
  state.roomCode = newRoom;
  state.sessionSetupConfirmed = true;
  saveState();
  showTournamentScreen();
  initPahoMqtt(newRoom, false);
  showToast(`✨ Novo torneio <strong>${escapeHtml(newName)}</strong> criado na Sala <strong>#${escapeHtml(newRoom)}</strong>!`, 'success');
};

function renderLobbyFeed() {
  upsertCurrentSessionInArchive();
  const feedEl = document.getElementById('lobby-tournaments-feed');
  const countPill = document.getElementById('lobby-saved-count-pill');
  if (!feedEl) return;

  const list = getSavedSessionsList();
  if (countPill) {
    countPill.textContent = `${list.length} ${list.length === 1 ? 'jogo salvo' : 'jogos salvos'}`;
  }

  const clearBtn = document.getElementById('btn-clear-all-tournaments');
  if (clearBtn) {
    clearBtn.style.display = list.length > 0 ? 'inline-flex' : 'none';
  }

  if (list.length === 0) {
    feedEl.innerHTML = `
      <div class="feed-empty-state">
        <div class="empty-icon-circle">🏐</div>
        <h3>Nenhum torneio ativo no momento</h3>
        <p>Você pode digitar o código de uma sala acima para entrar em um jogo ao vivo ou criar seu próprio torneio abaixo!</p>
        <button type="button" class="btn-accent-glow" style="margin-top:6px;padding:10px 20px;font-size:0.85rem;" onclick="document.getElementById('input-lobby-new-title')?.focus()">
          Criar Primeiro Torneio
        </button>
      </div>
    `;
    return;
  }

  feedEl.innerHTML = list
    .map((sess) => {
      const isCurrent = sess.sessionId === state.sessionId;
      const doneGames = (sess.matches || []).filter((m) => m.status === 'done').length;
      const totalGames = (sess.matches || []).length;
      const dateFormatted = formatDateBr(sess.tournamentDate);
      const nTeams = (sess.teams || []).length;
      const percentDone = totalGames > 0 ? Math.round((doneGames / totalGames) * 100) : 0;

      // Quick leader calculation
      const winsMap = {};
      (sess.teams || []).forEach((t) => (winsMap[t.id] = { name: t.name, w: 0 }));
      (sess.matches || []).forEach((m) => {
        if (m.status === 'done' && m.winnerId && winsMap[m.winnerId]) {
          winsMap[m.winnerId].w += 1;
        }
      });
      const sortedTeams = Object.values(winsMap).sort((a, b) => b.w - a.w);
      const leaderStr =
        doneGames > 0 && sortedTeams[0]
          ? `🏆 Líder: ${escapeHtml(sortedTeams[0].name)} (${sortedTeams[0].w}V)`
          : (totalGames > 0 ? '⏳ Em andamento' : '🏐 Pronto para iniciar');

      const roomTag = (sess.roomCode || 'VOLEI1').toUpperCase();

      const teamsChips = (sess.teams || [])
        .map((t) => `
          <span class="feed-team-chip" style="border-left: 3px solid ${t.color || '#38bdf8'};">
            <span class="team-mini-dot" style="background:${t.color || '#38bdf8'};"></span>
            ${escapeHtml(t.name)}
          </span>
        `)
        .join('');

      return `
        <article class="tournament-feed-card ${isCurrent ? 'active-feed-card' : ''}">
          <div class="feed-card-header">
            <div class="feed-card-eyebrow">
              <span class="feed-live-dot ${isCurrent ? 'pulse' : ''}"></span>
              <span class="feed-status-text">${isCurrent ? 'EM ANDAMENTO AGORA' : (doneGames === totalGames && totalGames > 0 ? 'CONCLUÍDO' : 'GUARDADO')}</span>
              <span class="feed-room-badge">#${escapeHtml(roomTag)}</span>
              <span class="feed-date-badge">📅 ${escapeHtml(dateFormatted)}</span>
            </div>

            <h3 class="feed-card-name">${escapeHtml(sess.tournamentName || 'VÔLEI INTERNO')}</h3>

            <div class="feed-teams-row">
              ${teamsChips || '<span style="font-size:0.75rem;color:var(--text-secondary);">4 Times padrão</span>'}
            </div>

            <div class="feed-progress-box">
              <div class="feed-progress-bar">
                <div class="feed-progress-fill" style="width: ${percentDone}%;"></div>
              </div>
              <div class="feed-progress-labels">
                <span>🏐 ${doneGames}/${totalGames} partidas concluídas (${percentDone}%)</span>
                <span>•</span>
                <span>${leaderStr}</span>
              </div>
            </div>
          </div>

          <div class="feed-card-actions">
            <button type="button" class="btn-primary feed-enter-btn" onclick="openTournamentSession('${sess.sessionId}')">
              Entrar na Partida
            </button>
            <button type="button" class="chip-btn feed-share-btn" onclick="copySavedSessionSummary('${sess.sessionId}')" title="Copiar resumo para WhatsApp">
              Compartilhar
            </button>
            <button type="button" class="chip-btn danger feed-delete-btn" onclick="promptDeleteSession('${sess.sessionId}')" title="Excluir este torneio (requer senha de segurança)">
              Excluir
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderSavedSessionsModal() {
  renderLobbyFeed();
}

let pendingDeleteTarget = null;

window.promptDeleteSession = function (sessionId) {
  const list = getSavedSessionsList();
  const target = list.find((s) => s.sessionId === sessionId);
  const name = target ? target.tournamentName : 'Torneio';
  pendingDeleteTarget = { type: 'single', sessionId, name };

  const titleEl = document.getElementById('modal-delete-pin-title');
  const descEl = document.getElementById('modal-delete-pin-desc');
  const inputEl = document.getElementById('input-delete-pin');
  const errorEl = document.getElementById('delete-pin-error');

  if (titleEl) titleEl.textContent = `Excluir: ${name}`;
  if (descEl) {
    descEl.innerHTML = `Para evitar que alguém apague o torneio <strong>"${escapeHtml(name)}"</strong> sem querer, digite a <strong>senha de segurança</strong> para confirmar:`;
  }
  if (errorEl) errorEl.classList.add('hidden');
  if (inputEl) {
    inputEl.value = '';
    inputEl.classList.remove('pin-shake');
  }

  document.getElementById('modal-delete-pin')?.classList.remove('hidden');
  setTimeout(() => inputEl?.focus(), 150);
};

window.promptDeleteAllSessions = function () {
  pendingDeleteTarget = { type: 'all' };

  const titleEl = document.getElementById('modal-delete-pin-title');
  const descEl = document.getElementById('modal-delete-pin-desc');
  const inputEl = document.getElementById('input-delete-pin');
  const errorEl = document.getElementById('delete-pin-error');

  if (titleEl) titleEl.textContent = '⚠️ Excluir TODOS os Torneios Salvos';
  if (descEl) {
    descEl.innerHTML = `⚠️ <strong>Atenção!</strong> Você está prestes a apagar <strong>todos os torneios guardados</strong> no aparelho. Digite a <strong>senha de segurança</strong> para confirmar:`;
  }
  if (errorEl) errorEl.classList.add('hidden');
  if (inputEl) {
    inputEl.value = '';
    inputEl.classList.remove('pin-shake');
  }

  document.getElementById('modal-delete-pin')?.classList.remove('hidden');
  setTimeout(() => inputEl?.focus(), 150);
};

window.executeProtectedDelete = function () {
  const inputEl = document.getElementById('input-delete-pin');
  const errorEl = document.getElementById('delete-pin-error');
  const enteredPin = (inputEl?.value || '').trim();

  if (enteredPin !== '2026' && enteredPin !== '1234') {
    playSound('undo');
    triggerHaptic([60, 40, 80]);
    if (errorEl) errorEl.classList.remove('hidden');
    if (inputEl) {
      inputEl.classList.remove('pin-shake');
      void inputEl.offsetWidth;
      inputEl.classList.add('pin-shake');
      inputEl.select();
    }
    showToast('🔒 Senha incorreta! Digite a senha correta (2026) para excluir.', 'warn');
    return;
  }

  if (!pendingDeleteTarget) {
    document.getElementById('modal-delete-pin')?.classList.add('hidden');
    return;
  }

  if (pendingDeleteTarget.type === 'single') {
    const sId = pendingDeleteTarget.sessionId;
    let list = getSavedSessionsList().filter((s) => s.sessionId !== sId);
    localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(list));
    if (state.sessionId === sId) {
      if (list.length > 0) {
        state = { ...createDefaultState(), ...list[0], sessionSetupConfirmed: false };
      } else {
        state = createDefaultState('MEU TORNEIO', getTodayDateIso());
        state.sessionSetupConfirmed = false;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    renderLobbyFeed();
    pushTournamentsHubSync();
    showToast(`🗑️ Torneio <strong>"${escapeHtml(pendingDeleteTarget.name)}"</strong> excluído com sucesso!`, 'success');
  } else if (pendingDeleteTarget.type === 'all') {
    localStorage.removeItem(SAVED_SESSIONS_KEY);
    state = createDefaultState('MEU TORNEIO', getTodayDateIso());
    state.sessionSetupConfirmed = false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderLobbyFeed();
    pushTournamentsHubSync();
    showToast('🗑️ Todos os torneios anteriores foram excluídos com sucesso!', 'success');
  }

  playSound('whistle_short');
  document.getElementById('modal-delete-pin')?.classList.add('hidden');
  pendingDeleteTarget = null;
};

window.openTournamentSession = function (sessionId) {
  upsertCurrentSessionInArchive();
  const list = getSavedSessionsList();
  const target = list.find((s) => s.sessionId === sessionId);
  if (!target) return;

  state = { ...createDefaultState(), ...target, sessionSetupConfirmed: true };
  saveState(true);
  showTournamentScreen();
  initPahoMqtt(state.roomCode || 'VOLEI1', true);
  showToast(
    `📂 Torneio <strong>${escapeHtml(state.tournamentName)} (${formatDateBr(state.tournamentDate)})</strong> aberto na Quadra!`,
    'success'
  );
};

window.loadSavedSessionById = window.openTournamentSession;

window.deleteSavedSessionById = function (sessionId) {
  promptDeleteSession(sessionId);
};

window.clearAllSavedTournaments = function () {
  promptDeleteAllSessions();
};

window.copySavedSessionSummary = function (sessionId) {
  const list = getSavedSessionsList();
  const target = list.find((s) => s.sessionId === sessionId);
  if (!target) return;
  const backupCurrent = state;
  state = target;
  const summaryText = generateWhatsAppSummary();
  state = backupCurrent;
  copyTextToClipboard(
    summaryText,
    `📲 Resumo de "${target.tournamentName} (${formatDateBr(target.tournamentDate)})" copiado!`
  );
};

/* ==========================================
   LIVE SCOREBOARD ACTIONS
   ========================================== */
function addPointToSide(sideKey) {
  if (isCourtTouchBlocked()) return;
  const match = getCurrentLiveMatch();
  if (!match) return;

  const logicalTeam = state.swappedSides
    ? sideKey === 'left'
      ? 'B'
      : 'A'
    : sideKey === 'left'
    ? 'A'
    : 'B';

  const prevServe = match.serving || 'A';
  const prevScoreA = match.scoreA;
  const prevScoreB = match.scoreB;

  if (logicalTeam === 'A') {
    match.scoreA += 1;
  } else {
    match.scoreB += 1;
  }

  if (match.status === 'pending') {
    match.status = 'live';
  }

  const isSideOut = prevServe !== logicalTeam;
  match.serving = logicalTeam;

  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);
  const scoringTeamObj = logicalTeam === 'A' ? teamA : teamB;

  const nowStr = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  match.history = match.history || [];
  match.history.unshift({
    step: match.history.length + 1,
    time: nowStr,
    logicalTeam,
    teamName: scoringTeamObj.name,
    teamColor: scoringTeamObj.color,
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    prevScoreA,
    prevScoreB,
    prevServe,
    note: isSideOut ? '🔄 Virada de bola (Assume o saque)' : '🏐 Ponto de saque (Mantém saque)'
  });

  const numEl = document.getElementById(sideKey === 'left' ? 'left-score-value' : 'right-score-value');
  if (numEl) {
    numEl.classList.remove('pop');
    void numEl.offsetWidth;
    numEl.classList.add('pop');
    setTimeout(() => numEl.classList.remove('pop'), 220);
  }

  const halfPoint = Math.ceil(state.targetPoints / 2);
  if (
    (match.scoreA === halfPoint && prevScoreA === halfPoint - 1 && match.scoreB < halfPoint) ||
    (match.scoreB === halfPoint && prevScoreB === halfPoint - 1 && match.scoreA < halfPoint)
  ) {
    showToast(
      `🔄 <strong>${halfPoint} pontos!</strong> Metade do set — use "Virar Lado" se trocarem de quadra.`,
      'info'
    );
  }

  const teamIdx = state.teams.findIndex((t) => t.id === scoringTeamObj.id) + 1;
  const customPointSlot = `point_t${teamIdx}`;

  if (isMatchTargetReached(match.scoreA, match.scoreB)) {
    playSound('victory');
    triggerHaptic([80, 50, 140]);
    finalizeMatchFromLive(match);
  } else if (isMatchPointState(match.scoreA, match.scoreB)) {
    playSound('setpoint');
    triggerHaptic([40, 40, 40]);
    const mpSide = isMatchPointState(match.scoreA, match.scoreB);
    const mpTeam = mpSide === 'A' ? teamA : teamB;
    const mpTeamIdx = state.teams.findIndex((t) => t.id === mpTeam.id) + 1;
    const mpSlot = customAudioMap[`matchpoint_t${mpTeamIdx}`] ? `matchpoint_t${mpTeamIdx}` : 'matchpoint';
    playCustomAudioOrSpeak(
      mpSlot,
      `Atenção! É Match point para ${mpTeam.name}.`
    );
  } else {
    playSound('point');
    triggerHaptic(25);
    playCustomAudioOrSpeak(
      customPointSlot,
      `Ponto para ${scoringTeamObj.name}.`
    );
  }

  saveState();
  renderAll();
}

function subtractPointFromSide(sideKey) {
  if (isCourtTouchBlocked()) return;
  const match = getCurrentLiveMatch();
  if (!match) return;

  const logicalTeam = state.swappedSides
    ? sideKey === 'left'
      ? 'B'
      : 'A'
    : sideKey === 'left'
    ? 'A'
    : 'B';

  if (logicalTeam === 'A' && match.scoreA > 0) {
    match.scoreA -= 1;
  } else if (logicalTeam === 'B' && match.scoreB > 0) {
    match.scoreB -= 1;
  } else {
    return;
  }

  const nowStr = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  match.history = match.history || [];
  match.history.unshift({
    step: match.history.length + 1,
    time: nowStr,
    logicalTeam,
    teamName: 'Ajuste Manual (-1)',
    teamColor: '#94a3b8',
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    prevServe: match.serving,
    note: '⚠️ Correção manual de -1 ponto'
  });

  if (match.status === 'done' && !isMatchTargetReached(match.scoreA, match.scoreB)) {
    match.status = 'live';
    match.winnerId = null;
    match.loserId = null;
  }

  playSound('undo');
  saveState();
  renderAll();
}

function undoLastPoint() {
  if (isCourtTouchBlocked()) return;
  const match = getCurrentLiveMatch();
  if (!match || !match.history || match.history.length === 0) return;

  const last = match.history.shift();
  if (typeof last.prevScoreA === 'number' && typeof last.prevScoreB === 'number') {
    match.scoreA = last.prevScoreA;
    match.scoreB = last.prevScoreB;
  }
  if (last.prevServe) {
    match.serving = last.prevServe;
  }

  if (!isMatchTargetReached(match.scoreA, match.scoreB)) {
    match.status = match.scoreA === 0 && match.scoreB === 0 ? 'pending' : 'live';
    match.winnerId = null;
    match.loserId = null;
  }

  playSound('undo');
  showToast('↩️ Último lance desfeito com sucesso.', 'info');
  saveState();
  renderAll();
}

function finalizeMatchFromLive(match) {
  if (isCourtTouchBlocked()) return;
  if (match.scoreA === match.scoreB) {
    showToast('⚠️ O jogo está empatado! Desempate antes de encerrar.', 'warn');
    return;
  }

  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);
  const aWon = match.scoreA > match.scoreB;

  match.winnerId = aWon ? teamA.id : teamB.id;
  match.loserId = aWon ? teamB.id : teamA.id;
  match.status = 'done';
  match.finishedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const winnerName = aWon ? teamA.name : teamB.name;
  const nextCreated = generateNextMatchesAfterFinish(match);

  launchConfetti();
  const nextTeamA = getTeamById(nextCreated.teamAId);
  const nextTeamB = getTeamById(nextCreated.teamBId);

  const winTeamIdx = state.teams.findIndex((t) => t.id === match.winnerId) + 1;
  const winSlot = customAudioMap[`victory_t${winTeamIdx}`] ? `victory_t${winTeamIdx}` : 'victory';

  playCustomAudioOrSpeak(
    winSlot,
    `${winnerName} ganhou a partida.`
  );

  showToast(
    `🏆 <strong>${escapeHtml(winnerName)}</strong> venceu o Jogo #${match.id}! Próximo criado: <strong>${escapeHtml(
      nextTeamA.name
    )} × ${escapeHtml(nextTeamB.name)}</strong>`,
    'success'
  );

  saveState();
  renderAll();
}

window.startMatchById = function (matchId) {
  state.liveMatchId = Number(matchId);
  state.swappedSides = false;
  state.activeTab = 'placar';
  syncWaitingQueueWithCurrentMatch();
  saveState();
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ==========================================
   RENDER ALL VIEWS
   ========================================== */
function renderAll() {
  syncMiniTorneioBrackets();
  syncWaitingQueueWithCurrentMatch();
  renderHeaderAndNav();
  renderLiveScoreboard();
  renderDynamicGamesTab();
  renderTeamsAndDrawTab();
  renderElencoTab();
  renderStandingsTab();
}

function renderHeaderAndNav() {
  const doneCount = state.matches.filter((m) => m.status === 'done').length;
  const currentMatch = getCurrentLiveMatch();

  document.getElementById('tournament-title-display').textContent = state.tournamentName;
  const dateBadgeEl = document.getElementById('header-date-display');
  if (dateBadgeEl) {
    dateBadgeEl.textContent = formatDateBr(state.tournamentDate);
  }
  document.getElementById('header-teams-badge').textContent = `${state.teams.length} TIMES`;
  document.getElementById('header-games-count').textContent = `${doneCount} ${
    doneCount === 1 ? 'concluído' : 'concluídos'
  }`;

  document.getElementById('nav-jogos-badge').textContent = `Jogo #${currentMatch ? currentMatch.id : 1}`;
  document.getElementById('nav-times-badge').textContent = `${state.teams.length} Equipes`;
  const navElencoBadge = document.getElementById('nav-elenco-badge');
  if (navElencoBadge) {
    const rosterCount = Array.isArray(state.masterRoster) ? state.masterRoster.length : 0;
    navElencoBadge.textContent = `${rosterCount} Salvos`;
  }

  const whistleHeaderBtn = document.getElementById('btn-whistle-toggle');
  const whistleHeaderIcon = document.getElementById('whistle-header-icon');
  const whistlesOn = state.whistlesEnabled === true;
  if (whistleHeaderBtn && whistleHeaderIcon) {
    whistleHeaderBtn.classList.toggle('active', whistlesOn);
    whistleHeaderIcon.innerHTML = whistlesOn ? UI_SVGS.whistleOn : UI_SVGS.whistleOff;
    whistleHeaderBtn.title = whistlesOn
      ? 'Apitos do Juiz: LIGADOS (Toque para desligar)'
      : 'Apitos do Juiz: DESLIGADOS (Toque para ligar)';
  }

  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn && soundIcon) {
    soundBtn.classList.toggle('active', state.soundEnabled);
    soundIcon.innerHTML = state.soundEnabled ? UI_SVGS.soundOn : UI_SVGS.soundOff;
  }

  const voiceBtn = document.getElementById('btn-voice-toggle');
  const voiceIcon = document.getElementById('voice-icon');
  if (voiceBtn && voiceIcon) {
    voiceBtn.classList.toggle('active', state.voiceEnabled !== false);
    voiceIcon.textContent = state.voiceEnabled !== false ? '🎙️' : '🙊';
  }

  const isLight = state.theme === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  const themeBtn = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn && themeIcon) {
    themeBtn.classList.toggle('active', isLight);
    themeIcon.innerHTML = isLight ? UI_SVGS.moon : UI_SVGS.sun;
    themeBtn.title = isLight ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro';
  }

  updateSyncStatusUI();

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${state.activeTab}`);
  });
}

function buildTeamMiniBadge(teamObj) {
  const meta = getSvgMeta(teamObj.icon);
  return `
    <span class="team-crest-mini" style="background:${teamObj.color};box-shadow:0 3px 10px ${teamObj.color}55;">
      <img src="${teamObj.icon}" alt="" class="${meta.mono ? 'mono-svg' : ''}" />
    </span>
  `;
}

function renderLiveScoreboard() {
  const rotSelect = document.getElementById('rotation-mode-select');
  if (rotSelect) rotSelect.value = state.rotationMode;

  document.querySelectorAll('.pt-pill').forEach((pill) => {
    pill.classList.toggle('active', Number(pill.dataset.pts) === state.targetPoints);
  });

  const deuceBtn = document.getElementById('btn-toggle-deuce');
  if (deuceBtn) {
    deuceBtn.classList.toggle('active', state.winByTwo);
    deuceBtn.textContent = state.winByTwo ? 'Diferença de 2' : 'Ponto Direto';
  }

  const whistlesOn = state.whistlesEnabled === true;

  // Center Court Whistle Button
  const courtWhistleBtn = document.getElementById('btn-toggle-whistle-court');
  const courtWhistleIcon = document.getElementById('court-whistle-icon');
  const courtWhistleLabel = document.getElementById('court-whistle-label');
  if (courtWhistleBtn) {
    courtWhistleBtn.classList.toggle('active', whistlesOn);
    courtWhistleBtn.classList.toggle('subtle', !whistlesOn);
    if (courtWhistleIcon) courtWhistleIcon.innerHTML = UI_SVGS.courtWhistle;
    if (courtWhistleLabel) courtWhistleLabel.textContent = whistlesOn ? 'Apito ON' : 'Apito OFF';
    courtWhistleBtn.title = whistlesOn
      ? 'Apitos do Juiz: LIGADOS (Toque para desligar)'
      : 'Apitos do Juiz: DESLIGADOS (Toque para ligar)';
  }

  // Rules Drawer Whistle Button
  const ruleWhistleBtn = document.getElementById('btn-rule-whistle-toggle');
  if (ruleWhistleBtn) {
    ruleWhistleBtn.classList.toggle('active', whistlesOn);
    ruleWhistleBtn.innerHTML = whistlesOn ? 'Apitos: Ligados' : 'Apitos: Desligados';
  }

  // Soundboard Whistle Toggle Chip
  const soundboardWhistleBtn = document.getElementById('btn-soundboard-whistle-toggle');
  if (soundboardWhistleBtn) {
    soundboardWhistleBtn.classList.toggle('active', whistlesOn);
    soundboardWhistleBtn.innerHTML = whistlesOn
      ? '📣 Apitos Automáticos nos Pontos: ATIVADOS (Toque p/ Desativar)'
      : '🔕 Apitos Automáticos nos Pontos: DESLIGADOS (Toque p/ Ativar)';
  }

  // Render Waiting Queue Bar
  const queueContainer = document.getElementById('waiting-teams-chips');
  if (queueContainer) {
    if (state.waitingQueue.length === 0) {
      queueContainer.innerHTML = `<span style="font-size:0.78rem;color:var(--text-muted)">Apenas 2 times (Sem fila de espera)</span>`;
    } else {
      queueContainer.innerHTML = state.waitingQueue
        .map((teamId, idx) => {
          const t = getTeamById(teamId);
          return `
            <span class="queue-team-chip ${idx === 0 ? 'first-in-line' : ''}">
              ${buildTeamMiniBadge(t)}
              <span>${idx === 0 ? '🔜 Próximo: ' : `${idx + 1}º `}${escapeHtml(t.name)}</span>
            </span>
          `;
        })
        .join('');
    }
  }

  const streakPill = document.getElementById('streak-info-pill');
  if (streakPill) {
    if (state.courtStreakTeamId && state.courtStreakCount > 0) {
      const stTeam = getTeamById(state.courtStreakTeamId);
      streakPill.textContent = `🔥 Na quadra: ${stTeam.name} (${state.courtStreakCount}V seguidas)`;
    } else {
      streakPill.textContent = `🏐 Quadra aberta`;
    }
  }

  const match = getCurrentLiveMatch();
  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);

  const leftTeam = state.swappedSides ? teamB : teamA;
  const rightTeam = state.swappedSides ? teamA : teamB;
  const leftScore = state.swappedSides ? match.scoreB : match.scoreA;
  const rightScore = state.swappedSides ? match.scoreA : match.scoreB;
  const leftLogical = state.swappedSides ? 'B' : 'A';

  document.documentElement.style.setProperty('--team-left-color', leftTeam.color || '#38bdf8');
  document.documentElement.style.setProperty('--team-right-color', rightTeam.color || '#facc15');

  document.getElementById('live-game-number').textContent = `JOGO #${match.id}`;
  document.getElementById('live-stage-desc').textContent = match.stageLabel || 'Partida em Quadra';
  const focusTitleEl = document.getElementById('focus-match-title');
  if (focusTitleEl) {
    focusTitleEl.textContent = `JOGO #${match.id} • ${leftTeam.name} × ${rightTeam.name}`;
  }

  const statusPill = document.getElementById('live-status-pill');
  if (match.status === 'done') {
    const winnerObj = getTeamById(match.winnerId);
    statusPill.className = 'status-indicator finished';
    statusPill.textContent = `✅ ENCERRADO • VENCEDOR: ${winnerObj ? winnerObj.name : ''}`;
  } else {
    statusPill.className = 'status-indicator in-progress';
    statusPill.textContent = state.swappedSides
      ? '🔄 LADOS INVERTIDOS • PLACAR AUDITADO'
      : '⚡ EM QUADRA • SEM DESFEITA';
  }

  // Update Left & Right Team SVG Crests & Inline Switchers
  const leftMeta = getSvgMeta(leftTeam.icon);
  const rightMeta = getSvgMeta(rightTeam.icon);

  const leftAvatarBox = document.getElementById('left-team-avatar-box');
  const leftSvgImg = document.getElementById('left-team-svg');
  const leftWatermark = document.getElementById('left-card-watermark');
  if (leftAvatarBox && leftSvgImg) {
    leftAvatarBox.style.background = leftTeam.color;
    leftAvatarBox.style.boxShadow = `0 6px 18px ${leftTeam.color}66`;
    leftSvgImg.src = leftTeam.icon;
    leftSvgImg.classList.toggle('mono-svg', leftMeta.mono);
  }
  if (leftWatermark) leftWatermark.src = leftTeam.icon;

  const rightAvatarBox = document.getElementById('right-team-avatar-box');
  const rightSvgImg = document.getElementById('right-team-svg');
  const rightWatermark = document.getElementById('right-card-watermark');
  if (rightAvatarBox && rightSvgImg) {
    rightAvatarBox.style.background = rightTeam.color;
    rightAvatarBox.style.boxShadow = `0 6px 18px ${rightTeam.color}66`;
    rightSvgImg.src = rightTeam.icon;
    rightSvgImg.classList.toggle('mono-svg', rightMeta.mono);
  }
  if (rightWatermark) rightWatermark.src = rightTeam.icon;

  // Populate inline team switchers on scoreboard (disabled during Focus Mode so nobody changes teams by accident)
  const selectLeft = document.getElementById('select-team-left');
  const selectRight = document.getElementById('select-team-right');
  if (selectLeft && selectRight) {
    selectLeft.innerHTML = state.teams
      .map(
        (t) => `<option value="${t.id}" ${t.id === leftTeam.id ? 'selected' : ''}>${escapeHtml(t.name)}</option>`
      )
      .join('');
    selectRight.innerHTML = state.teams
      .map(
        (t) => `<option value="${t.id}" ${t.id === rightTeam.id ? 'selected' : ''}>${escapeHtml(t.name)}</option>`
      )
      .join('');
    selectLeft.disabled = courtFocusMode || courtTouchLocked;
    selectRight.disabled = courtFocusMode || courtTouchLocked;
  }

  document.getElementById('left-team-players').textContent =
    leftTeam.players && leftTeam.players.length > 0
      ? leftTeam.players.map((p) => p.name).join(', ')
      : 'Toque em Times & Sorteio para escalar';

  document.getElementById('right-team-players').textContent =
    rightTeam.players && rightTeam.players.length > 0
      ? rightTeam.players.map((p) => p.name).join(', ')
      : 'Toque em Times & Sorteio para escalar';

  document.getElementById('left-score-value').textContent = leftScore;
  document.getElementById('right-score-value').textContent = rightScore;

  const leftServing = (match.serving || 'A') === leftLogical;
  document.getElementById('btn-serve-left').classList.toggle('active', leftServing);
  document.getElementById('btn-serve-right').classList.toggle('active', !leftServing);

  const mpLogical = isMatchPointState(match.scoreA, match.scoreB);
  const leftTag = document.getElementById('left-point-tag');
  const rightTag = document.getElementById('right-point-tag');
  const leftCard = document.getElementById('score-card-left');
  const rightCard = document.getElementById('score-card-right');
  const alertBar = document.getElementById('match-alert-bar');
  const alertText = document.getElementById('match-alert-text');
  const alertActions = document.getElementById('match-alert-actions');

  leftTag.classList.add('hidden');
  rightTag.classList.add('hidden');
  leftCard.classList.remove('winner-glow');
  rightCard.classList.remove('winner-glow');
  if (leftCard) {
    leftCard.style.background = `linear-gradient(160deg, ${leftTeam.color}28 0%, rgba(15, 23, 42, 0.92) 70%)`;
  }
  if (rightCard) {
    rightCard.style.background = `linear-gradient(160deg, ${rightTeam.color}28 0%, rgba(15, 23, 42, 0.92) 70%)`;
  }

  if (match.status === 'done' && match.winnerId) {
    const leftWon = leftTeam.id === match.winnerId;
    if (leftWon) {
      leftTag.textContent = '🏆 VENCEDOR';
      leftTag.className = 'point-status-tag winner';
      leftCard.classList.add('winner-glow');
    } else {
      rightTag.textContent = '🏆 VENCEDOR';
      rightTag.className = 'point-status-tag winner';
      rightCard.classList.add('winner-glow');
    }

    const winnerTeam = leftWon ? leftTeam : rightTeam;
    const nextPending = state.matches.find((m) => m.status !== 'done' && m.id !== match.id);
    const exitFocusBtnHtml = courtFocusMode
      ? `<button type="button" class="chip-btn" onclick="exitCourtFocusMode()">Sair da Tela Fixa</button>`
      : '';

    alertBar.className = 'match-alert-bar victory';
    if (nextPending) {
      const nA = getTeamById(nextPending.teamAId);
      const nB = getTeamById(nextPending.teamBId);
      alertText.innerHTML = `🏆 <strong>${escapeHtml(winnerTeam.name)}</strong> venceu (${match.scoreA}×${
        match.scoreB
      })! Próximo Jogo #${nextPending.id}: <strong>${escapeHtml(nA ? nA.name : 'A definir')} × ${escapeHtml(
        nB ? nB.name : 'A definir'
      )}</strong>`;
      alertActions.innerHTML = `
        <button type="button" class="btn-primary" onclick="startMatchById(${nextPending.id})">
          ▶️ Iniciar Jogo #${nextPending.id} Agora
        </button>
        ${exitFocusBtnHtml}
      `;
    } else {
      alertText.innerHTML = `🏆 <strong>${escapeHtml(winnerTeam.name)}</strong> venceu por <strong>${
        match.scoreA
      } × ${match.scoreB}</strong>!`;
      alertActions.innerHTML = `
        <button type="button" class="btn-primary" onclick="createAndStartNextMatchManual()">
          Criar Próximo Jogo
        </button>
        ${exitFocusBtnHtml}
      `;
    }
  } else if (mpLogical) {
    const mpOnLeft = mpLogical === leftLogical;
    const mpTeam = mpOnLeft ? leftTeam : rightTeam;
    if (mpOnLeft) {
      leftTag.textContent = '🔥 MATCH POINT';
      leftTag.className = 'point-status-tag';
    } else {
      rightTag.textContent = '🔥 MATCH POINT';
      rightTag.className = 'point-status-tag';
    }
    alertBar.className = 'match-alert-bar';
    alertText.innerHTML = `🔥 <strong>MATCH POINT</strong> para <strong>${escapeHtml(mpTeam.name)}</strong>!`;
    alertActions.innerHTML = '';
  } else {
    alertBar.className = 'match-alert-bar hidden';
  }

  document.getElementById('btn-undo-point').disabled = !match.history || match.history.length === 0;

  // Render Point History Audit Log
  const historyList = document.getElementById('point-history-list');
  const auditCount = document.getElementById('audit-count-badge');
  const logs = match.history || [];
  auditCount.textContent = `${logs.length} ${logs.length === 1 ? 'lance' : 'lances'}`;

  if (logs.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state-mini">
        Nenhum ponto registrado ainda nesta partida. Toque em <strong>+1 PONTO</strong> ou no número gigante para marcar!
      </div>
    `;
  } else {
    historyList.innerHTML = logs
      .map(
        (item) => `
        <div class="point-log-item">
          <div class="point-log-left">
            <span class="log-time">#${item.step} • ${item.time}</span>
            <span class="team-color-dot" style="width:10px;height:10px;background:${item.teamColor}"></span>
            <strong>${escapeHtml(item.teamName)}</strong>
            <span style="color:var(--text-secondary);font-size:0.76rem;">${item.note}</span>
          </div>
          <span class="log-score-pill">${item.scoreA} × ${item.scoreB}</span>
        </div>
      `
      )
      .join('');
  }

  // Render Current Mini Torneio Preview (Jogo 1, Jogo 2, Jogo 3 Vencedores, Jogo 4 Perdedores)
  const previewContainer = document.getElementById('live-recent-matches-preview');
  const currentMiniIdx = match.miniIndex || state.matches[state.matches.length - 1]?.miniIndex || 1;
  const currentMiniMatches = state.matches.filter((m) => (m.miniIndex || 1) === currentMiniIdx);
  const previewList = currentMiniMatches.length > 0 ? currentMiniMatches : state.matches.slice(-4);
  previewContainer.innerHTML =
    `<div style="font-size:0.74rem;font-weight:800;color:var(--accent-cyan);letter-spacing:0.06em;margin-bottom:4px;">🏆 ${currentMiniIdx}º MINI TORNEIO (J3: Vencedor J1×J2 | J4: Perdedor J1×J2)</div>` +
    previewList.map((m) => buildMatchRowHtml(m)).join('');
}

function buildPendingSlotHtml(label, alignRight = false) {
  const pill = `<span class="team-crest-mini" style="background:rgba(148,163,184,0.2);border:1px dashed rgba(148,163,184,0.5);font-size:0.7rem;">⏳</span>`;
  const text = `<span class="team-name-truncate" style="color:var(--text-secondary);font-style:italic;">${escapeHtml(label)}</span>`;
  return alignRight ? `${text}${pill}` : `${pill}${text}`;
}

function buildMatchRowHtml(m) {
  const hasTeamA = Boolean(m.teamAId);
  const hasTeamB = Boolean(m.teamBId);
  const teamA = hasTeamA ? getTeamById(m.teamAId) : null;
  const teamB = hasTeamB ? getTeamById(m.teamBId) : null;
  const isLiveSelected = Number(state.liveMatchId) === m.id;
  const isDone = m.status === 'done';
  const aWon = isDone && teamA && m.winnerId === teamA.id;
  const bWon = isDone && teamB && m.winnerId === teamB.id;
  const winnerTeam = isDone && m.winnerId ? getTeamById(m.winnerId) : null;

  const sideAHtml = teamA
    ? `${buildTeamMiniBadge(teamA)}<span class="team-name-truncate">${escapeHtml(teamA.name)} ${aWon ? '🏆' : ''}</span>`
    : buildPendingSlotHtml(m.placeholderA || 'A definir', false);

  const sideBHtml = teamB
    ? `<span class="team-name-truncate">${bWon ? '🏆 ' : ''}${escapeHtml(teamB.name)}</span>${buildTeamMiniBadge(teamB)}`
    : buildPendingSlotHtml(m.placeholderB || 'A definir', true);

  return `
    <div class="match-row-card ${isLiveSelected ? 'active-live' : ''}">
      <div class="match-row-top">
        <span><strong>Jogo ${m.id}</strong> ${m.finishedAt ? `• Finalizado às ${m.finishedAt}` : ''}</span>
        <span class="match-stage-tag">${escapeHtml(m.stageLabel || 'Partida')}</span>
      </div>

      <div class="match-row-main">
        <div class="match-team-side ${aWon ? 'winner' : bWon ? 'loser' : ''}">
          ${sideAHtml}
        </div>

        <div class="match-score-center ${isDone ? 'done' : ''}">
          ${isDone || m.scoreA > 0 || m.scoreB > 0 ? `${m.scoreA} × ${m.scoreB}` : 'X'}
        </div>

        <div class="match-team-side right ${bWon ? 'winner' : aWon ? 'loser' : ''}">
          ${sideBHtml}
        </div>
      </div>

      <div class="match-row-actions">
        <span class="winner-label-chip">
          ${
            winnerTeam
              ? `Vencedor: <strong>${escapeHtml(winnerTeam.name)}</strong>`
              : !hasTeamA || !hasTeamB
              ? `⏳ Aguardando definição (${escapeHtml(m.placeholderA || 'J1')} × ${escapeHtml(m.placeholderB || 'J2')})`
              : isLiveSelected
              ? '⚡ Em quadra agora'
              : '⏳ Pronto para jogar'
          }
        </span>
        <div class="match-btns-group">
          <button type="button" class="mini-action-btn" onclick="startMatchById(${m.id})">
            Placar
          </button>
          <button type="button" class="mini-action-btn" onclick="openQuickScoreModal(${m.id})">
            Editar
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDynamicGamesTab() {
  const container = document.getElementById('dynamic-matches-list');
  if (!container) return;

  // Group matches by miniIndex (1º MINI TORNEIO, 2º MINI TORNEIO...)
  const groupsMap = new Map();
  state.matches.forEach((m) => {
    const idx = m.miniIndex || 1;
    if (!groupsMap.has(idx)) groupsMap.set(idx, []);
    groupsMap.get(idx).push(m);
  });

  const htmlBlocks = [];
  for (const [miniIdx, games] of groupsMap.entries()) {
    const j1Id = games[0]?.id || 1;
    const j2Id = games[1]?.id || 2;
    const j3Id = games[2]?.id || 3;
    const j4Id = games[3]?.id || 4;
    htmlBlocks.push(`
      <div class="glass-card mini-torneio-group-card">
        <div class="mini-torneio-group-header">
          <strong style="font-size:0.95rem;color:#38bdf8;letter-spacing:0.05em;">${miniIdx}º MINI TORNEIO</strong>
          <span style="font-size:0.75rem;color:var(--text-secondary);">J3: vencedores dos dois primeiros jogos | J4: perdedores dos dois primeiros jogos</span>
        </div>
        <div class="mini-torneio-games-grid">
          ${games.map((m) => buildMatchRowHtml(m)).join('')}
        </div>
      </div>
    `);
  }

  container.innerHTML = htmlBlocks.join('');
}

/* ==========================================
   JOGADORES DISPONÍVEIS & ROSTER HELPERS
   ========================================== */
function getAssignedPlayerKeys() {
  const set = new Set();
  (state.teams || []).forEach((t) => {
    (t.players || []).forEach((p) => {
      const k = normalizePlayerKey(p.name);
      if (k) set.add(k);
    });
  });
  return set;
}

function getAvailablePlayers() {
  const assignedKeys = getAssignedPlayerKeys();
  const seen = new Set();
  const list = [];

  // 1. Jogadores no playerPool que não estão escalados em nenhum time
  (state.playerPool || []).forEach((p) => {
    const k = normalizePlayerKey(p.name);
    if (k && !assignedKeys.has(k) && !seen.has(k)) {
      seen.add(k);
      list.push({
        id: p.id || `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        masterId: p.masterId,
        name: p.name,
        role: p.role || 'Geral',
        skill: p.skill || 3
      });
    }
  });

  // 2. Jogadores no elenco fixo marcados como presentes hoje
  (state.masterRoster || []).forEach((mp) => {
    const k = normalizePlayerKey(mp.name);
    if (mp.presentToday && k && !assignedKeys.has(k) && !seen.has(k)) {
      seen.add(k);
      list.push({
        id: `p_m_${mp.id}`,
        masterId: mp.id,
        name: mp.name,
        role: mp.role || 'Geral',
        skill: mp.skill || 3
      });
    }
  });

  return list;
}

function getOtherMasterRosterAvailable() {
  const assignedKeys = getAssignedPlayerKeys();
  const availKeys = new Set(getAvailablePlayers().map((p) => normalizePlayerKey(p.name)));
  const list = [];
  (state.masterRoster || []).forEach((mp) => {
    const k = normalizePlayerKey(mp.name);
    if (k && !assignedKeys.has(k) && !availKeys.has(k)) {
      list.push(mp);
    }
  });
  return list;
}

/* ==========================================
   TAB 3: TEAMS & FLEXIBLE DRAW (3 OR 4)
   ========================================== */
function renderTeamsAndDrawTab() {
  // Format pills
  document.querySelectorAll('.format-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.drawFormat === state.drawFormat);
  });

  // Render 1-Click Quick Roster Chips from Elenco Fixo
  const quickChipsEl = document.getElementById('quick-roster-chips');
  if (quickChipsEl) {
    const roster = Array.isArray(state.masterRoster) ? state.masterRoster : [];
    if (roster.length === 0) {
      quickChipsEl.innerHTML = `<span style="font-size:0.78rem;color:var(--text-muted);">Nenhum jogador salvo no Elenco Fixo ainda. Clique em "Editar Estrelas & Elenco" para cadastrar!</span>`;
    } else {
      const sortedRoster = [...roster].sort((a, b) => (b.skill || 3) - (a.skill || 3) || a.name.localeCompare(b.name));
      quickChipsEl.innerHTML = sortedRoster
        .map((mp) => {
          const isPresent = isMasterPlayerInPoolToday(mp);
          const roleShort = getRoleShortCode(mp.role);
          return `
            <button
              type="button"
              class="roster-pick-chip ${isPresent ? 'present' : ''}"
              onclick="togglePlayerPresenceToday('${mp.id}')"
              title="${isPresent ? 'Clique para tirar da lista de hoje' : 'Clique para colocar no sorteio de hoje'}"
            >
              <span class="pick-status-icon">${isPresent ? '✓' : '+'}</span>
              <span class="pick-name">${escapeHtml(mp.name)}</span>
              <span class="pick-stars">${mp.skill || 3}★</span>
              <span class="pick-role">${roleShort}</span>
            </button>
          `;
        })
        .join('');
    }
  }

  const poolList = document.getElementById('player-pool-list');
  const poolLabel = document.getElementById('pool-count-label');
  const mathHint = document.getElementById('pool-math-hint');

  const nPlayers = state.playerPool.length;
  poolLabel.textContent = `JOGADORES PRESENTES (${nPlayers})`;

  if (nPlayers > 0) {
    if (state.drawFormat === 'size_3') {
      const nTeams = Math.max(2, Math.ceil(nPlayers / 3));
      mathHint.textContent = `Formará ${nTeams} times de ~3 jogadores`;
    } else if (state.drawFormat === 'size_4') {
      const nTeams = Math.max(2, Math.ceil(nPlayers / 4));
      mathHint.textContent = `Formará ${nTeams} times de ~4 jogadores`;
    } else if (state.drawFormat === 'count_3') {
      mathHint.textContent = `Formará 3 times de ~${Math.ceil(nPlayers / 3)} jogadores`;
    } else {
      mathHint.textContent = `Formará 4 times de ~${Math.ceil(nPlayers / 4)} jogadores`;
    }
  } else {
    mathHint.textContent = 'Toque nos jogadores do Elenco acima ou cole do WhatsApp';
  }

  if (nPlayers === 0) {
    poolList.innerHTML = `
      <div class="empty-state-mini" style="grid-column: 1 / -1;">
        Toque nos nomes do <strong>Elenco Fixo</strong> acima para escalar com 1 clique, cole do WhatsApp ou clique em <strong>"Exemplo 12 Jogadores"</strong>!
      </div>
    `;
  } else {
    poolList.innerHTML = state.playerPool
      .map(
        (p) => `
        <div class="pool-player-chip">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
            <img src="${getRoleSvg(p.role)}" alt="" width="20" height="20" class="mono-svg-accent" style="flex-shrink:0;" />
            <div class="pool-player-info" style="min-width:0;flex:1;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span class="pool-player-name">${escapeHtml(p.name)}</span>
                <button
                  type="button"
                  class="pool-role-cycle-btn"
                  onclick="cyclePoolPlayerRole('${p.id}')"
                  title="Clique para trocar a posição rapidamente"
                >${escapeHtml(p.role || 'Geral')}</button>
              </div>
              <div class="pool-inline-stars" title="Clique na estrela para mudar o nível na hora">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (s) => `
                  <button
                    type="button"
                    class="pool-star-btn ${s <= (p.skill || 3) ? 'lit' : ''}"
                    onclick="setPoolPlayerStars('${p.id}', ${s})"
                    aria-label="${s} estrelas"
                  >★</button>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
          <button type="button" class="pool-remove-btn" onclick="removePlayerFromPool('${p.id}')" title="Remover">✕</button>
        </div>
      `
      )
      .join('');
  }

  const stampEl = document.getElementById('draw-audit-stamp');
  if (state.lastDrawStamp) {
    stampEl.classList.remove('hidden');
    stampEl.innerHTML = `✅ <strong>Sorteio Verificado:</strong> ${escapeHtml(state.lastDrawStamp)}`;
  } else {
    stampEl.classList.add('hidden');
  }

  document.getElementById('teams-column-heading').textContent = `Equipes do Dia (${state.teams.length} Times)`;

  const availableToday = getAvailablePlayers();
  const otherMaster = getOtherMasterRosterAvailable();

  // Render Available Players Card
  const availCountBadge = document.getElementById('available-count-badge');
  if (availCountBadge) availCountBadge.textContent = availableToday.length;

  const availChipsWrap = document.getElementById('available-players-chips');
  if (availChipsWrap) {
    if (availableToday.length === 0) {
      availChipsWrap.innerHTML = `
        <div class="available-empty-state">
          <span>✅ <strong>Todos os jogadores escalados!</strong> Quando você clicar no ✕ de qualquer time, o jogador volta direto para cá.</span>
          ${
            otherMaster.length > 0
              ? `<span style="font-size:0.73rem;color:var(--text-secondary);">(${otherMaster.length} outros cadastrados no ⭐ Elenco Fixo)</span>`
              : ''
          }
        </div>
      `;
    } else {
      availChipsWrap.innerHTML = availableToday
        .map(
          (p) => `
        <div class="available-chip">
          <div class="avail-chip-header">
            <img src="${getRoleSvg(p.role)}" width="14" height="14" class="mono-svg-accent" alt="" />
            <strong class="avail-player-name">${escapeHtml(p.name)}</strong>
            <span class="pick-stars">${'★'.repeat(p.skill)}</span>
            <span class="avail-role-badge">${p.role || 'Geral'}</span>
          </div>
          <div class="avail-quick-assign-row">
            <span class="avail-assign-label">+ Escalar:</span>
            <div class="avail-teams-buttons">
              ${state.teams
                .map(
                  (t) => `
                <button
                  type="button"
                  class="mini-team-assign-btn"
                  style="border-color:${t.color}88; background:${t.color}20; color:${t.color};"
                  onclick="addAvailablePlayerToTeam('${t.id}', '${escapeHtml(p.name)}')"
                  title="Escalar ${escapeHtml(p.name)} no ${t.name}"
                >
                  ${t.name.replace('Time ', 'T')}
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `
        )
        .join('');
    }
  }

  const teamsGrid = document.getElementById('four-teams-grid');
  teamsGrid.innerHTML = state.teams
    .map((team, idx) => {
      const avgSkill =
        team.players.length > 0
          ? (team.players.reduce((acc, p) => acc + (Number(p.skill) || 3), 0) / team.players.length).toFixed(1)
          : null;
      const currentSvgMeta = getSvgMeta(team.icon);

      return `
        <div class="team-config-card" style="background: ${getTeamCardGradient(team.color)};">
          <div class="team-config-top">
            <div class="team-crest-badge" style="background:${team.color};box-shadow:0 4px 14px ${team.color}55;width:44px;height:44px;">
              <img src="${team.icon}" alt="" class="team-crest-img ${currentSvgMeta.mono ? 'mono-svg' : ''}" style="width:24px;height:24px;" />
            </div>
            <input
              type="text"
              class="team-name-edit-input"
              value="${escapeHtml(team.name)}"
              aria-label="Nome da equipe ${idx + 1}"
              onchange="updateTeamName('${team.id}', this.value)"
            />
            ${
              state.teams.length > 2
                ? `<button type="button" class="team-delete-btn" onclick="deleteTeam('${team.id}')" title="Remover este time">✕</button>`
                : ''
            }
          </div>

          <details class="team-customize-drawer">
            <summary class="team-customize-summary">Trocar Cor e Escudo ▾</summary>
            <div class="team-customize-body">
              <div class="color-swatches-row">
                <span style="font-size:0.72rem;color:var(--text-secondary);margin-right:4px;">Cor:</span>
                ${TEAM_COLORS.map(
                  (c) => `
                  <button
                    type="button"
                    class="color-swatch-btn ${team.color === c ? 'active' : ''}"
                    style="background:${c}"
                    onclick="updateTeamColor('${team.id}', '${c}')"
                    aria-label="Escolher cor ${c}"
                  ></button>
                `
                ).join('')}
              </div>

              <div class="svg-crest-picker" title="Escolha o escudo SVG do time">
                <span style="font-size:0.68rem;color:var(--text-secondary);font-weight:700;margin-right:2px;">Escudo:</span>
                ${TEAM_SVGS.map(
                  (svgItem) => `
                  <button
                    type="button"
                    class="crest-option-btn ${team.icon === svgItem.src ? 'active' : ''}"
                    title="${svgItem.label}"
                    onclick="updateTeamIcon('${team.id}', '${svgItem.src}')"
                  >
                    <img src="${svgItem.src}" alt="${svgItem.label}" class="${svgItem.mono ? 'mono-svg' : ''}" />
                  </button>
                `
                ).join('')}
              </div>
            </div>
          </details>

          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:var(--text-secondary);">
            <span><strong>${team.players.length}</strong> jogadores (${team.players.length === 3 ? 'Trio' : team.players.length === 4 ? 'Quarteto' : 'Equipe'})</span>
            ${avgSkill ? `<span>Média: ⭐ ${avgSkill}</span>` : '<span>Escalação aberta</span>'}
          </div>

          <div class="team-roster-box">
            ${
              team.players.length === 0
                ? `<div class="empty-state-mini" style="padding:12px;">Sem jogadores. Puxe dos disponíveis ou adicione manualmente abaixo.</div>`
                : team.players
                    .map(
                      (p, pIdx) => `
                    <div class="roster-member-item">
                      <span style="display:flex;align-items:center;gap:6px;">
                        <img src="${getRoleSvg(p.role)}" alt="" width="15" height="15" class="mono-svg-accent" />
                        <span><strong>${pIdx + 1}.</strong> ${escapeHtml(p.name)} <small style="color:var(--text-secondary)">(${p.role || 'Geral'})</small></span>
                      </span>
                      <button type="button" class="pool-remove-btn" onclick="removePlayerFromTeam('${team.id}', ${pIdx})" title="Tirar do time e devolver para os Disponíveis">✕</button>
                    </div>
                  `
                    )
                    .join('')
            }
          </div>

          <!-- SELETOR DE DISPONÍVEIS E ENTRADA MANUAL -->
          <div class="team-add-player-section">
            <div class="team-available-select-wrap">
              <select
                class="modern-select compact team-available-select"
                aria-label="Puxar jogador disponível para ${escapeHtml(team.name)}"
                onchange="addAvailablePlayerToTeam('${team.id}', this.value); this.value='';"
              >
                <option value="">
                  ${availableToday.length > 0 ? `➕ Puxar dos Disponíveis (${availableToday.length})...` : 'Nenhum jogador livre no momento'}
                </option>
                ${
                  availableToday.length > 0
                    ? `<optgroup label="🟢 Disponíveis Hoje (${availableToday.length})">
                        ${availableToday
                          .map(
                            (p) => `
                          <option value="${escapeHtml(p.name)}">
                            ${escapeHtml(p.name)} (${'★'.repeat(p.skill)} • ${p.role || 'Geral'})
                          </option>
                        `
                          )
                          .join('')}
                       </optgroup>`
                    : ''
                }
                ${
                  otherMaster.length > 0
                    ? `<optgroup label="⭐ Do Elenco Fixo (${otherMaster.length})">
                        ${otherMaster
                          .map(
                            (p) => `
                          <option value="${escapeHtml(p.name)}">
                            ${escapeHtml(p.name)} (${'★'.repeat(p.skill)} • ${p.role || 'Geral'})
                          </option>
                        `
                          )
                          .join('')}
                       </optgroup>`
                    : ''
                }
              </select>
            </div>

            <div class="team-quick-add-row">
              <input
                type="text"
                id="quick-player-${team.id}"
                class="team-quick-add-input"
                placeholder="Ou digite manual (ex: Carlos 4* L)..."
                onkeydown="if(event.key==='Enter'){event.preventDefault();addDirectPlayerToTeam('${team.id}');}"
              />
              <button type="button" class="mini-action-btn" onclick="addDirectPlayerToTeam('${team.id}')">+ Add</button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function cryptoRandomInt(max) {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return arr[0] % max;
}

function cryptoShuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ensureTeamCount(targetCount) {
  while (state.teams.length < targetCount) {
    const n = state.teams.length + 1;
    state.teams.push({
      id: `t_${Date.now()}_${n}`,
      name: `Time 0${n}`,
      color: TEAM_COLORS[(n - 1) % TEAM_COLORS.length],
      icon: TEAM_SVGS[(n - 1) % TEAM_SVGS.length].src,
      players: []
    });
  }
  if (state.teams.length > targetCount) {
    state.teams = state.teams.slice(0, targetCount);
  }
}

function executeTeamDraw() {
  const nPlayers = state.playerPool.length;
  if (nPlayers < 4) {
    showToast('⚠️ Adicione pelo menos 4 jogadores na lista para sortear os times!', 'warn');
    return;
  }

  let targetTeamCount = state.teams.length;
  if (state.drawFormat === 'size_3') {
    targetTeamCount = Math.max(2, Math.ceil(nPlayers / 3));
  } else if (state.drawFormat === 'size_4') {
    targetTeamCount = Math.max(2, Math.ceil(nPlayers / 4));
  } else if (state.drawFormat === 'count_3') {
    targetTeamCount = 3;
  } else if (state.drawFormat === 'count_4') {
    targetTeamCount = 4;
  }

  ensureTeamCount(targetTeamCount);

  const modeInput = document.querySelector('input[name="drawMode"]:checked');
  const mode = modeInput ? modeInput.value : 'balanced';

  const buckets = Array.from({ length: targetTeamCount }, () => []);

  if (mode === 'random') {
    const shuffled = cryptoShuffle(state.playerPool);
    shuffled.forEach((player, idx) => {
      buckets[idx % targetTeamCount].push(player);
    });
  } else {
    const setters = cryptoShuffle(state.playerPool.filter((p) => p.role === 'Levantador')).sort(
      (a, b) => b.skill - a.skill
    );
    const others = cryptoShuffle(state.playerPool.filter((p) => p.role !== 'Levantador')).sort(
      (a, b) => b.skill - a.skill
    );

    const ordered = [...setters, ...others];
    const teamIndices = cryptoShuffle(Array.from({ length: targetTeamCount }, (_, i) => i));

    ordered.forEach((player, idx) => {
      const round = Math.floor(idx / targetTeamCount);
      const posInRound = idx % targetTeamCount;
      const targetIdx =
        round % 2 === 0 ? teamIndices[posInRound] : teamIndices[targetTeamCount - 1 - posInRound];
      buckets[targetIdx].push(player);
    });
  }

  state.teams.forEach((team, idx) => {
    team.players = buckets[idx];
  });

  // Update waiting queue
  syncWaitingQueueWithCurrentMatch();

  const hash = Math.abs(cryptoRandomInt(0xffffff))
    .toString(16)
    .toUpperCase()
    .padStart(6, '0');
  const timeStr = new Date().toLocaleString('pt-BR');
  state.lastDrawStamp = `${timeStr} • ${targetTeamCount} Equipes • Hash #${hash}`;

  playSound('victory');
  launchConfetti();
  saveState();
  renderAll();
  state.activeTab = 'times';
  renderAll();
  openTeamsImageModal();
  showToast(
    `🎲 <strong>${targetTeamCount} Times sorteados!</strong> Imagem pronta para compartilhar no WhatsApp.`,
    'success'
  );
}

/* ==========================================
   GERADOR DE IMAGEM (CARD HD) DOS TIMES P/ WHATSAPP
   ========================================== */
function hexToRgba(hex, alpha = 1) {
  const clean = String(hex || '#38bdf8').replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawRoundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function truncateCanvasText(ctx, text, maxWidth) {
  const str = String(text || '');
  if (ctx.measureText(str).width <= maxWidth) return str;
  let clipped = str;
  while (clipped.length > 1 && ctx.measureText(clipped + '…').width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return clipped + '…';
}

function renderTeamsShareCanvas() {
  const canvas = document.getElementById('teams-share-canvas');
  if (!canvas) return null;

  const teams = state.teams || [];
  const cols = 2;
  const rowsCount = Math.ceil(teams.length / cols);
  const maxPlayersInTeam = Math.max(4, ...teams.map((t) => (t.players ? t.players.length : 0)));

  const W = 1080;
  const padX = 48;
  const gap = 28;
  const cardW = Math.floor((W - padX * 2 - gap) / cols);
  const playerRowH = 54;
  const cardHeaderH = 106;
  const cardPadBottom = 24;
  const cardH = cardHeaderH + maxPlayersInTeam * (playerRowH + 10) + cardPadBottom;

  const headerSectionH = 230;
  const matchesSectionH = 155;
  const footerSectionH = 75;
  const H = headerSectionH + rowsCount * cardH + (rowsCount - 1) * gap + matchesSectionH + footerSectionH;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Background Stadium Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#050914');
  bgGrad.addColorStop(0.5, '#0b1326');
  bgGrad.addColorStop(1, '#060a17');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle ambient glow top-left and bottom-right
  const glow1 = ctx.createRadialGradient(180, 110, 10, 180, 110, 460);
  glow1.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
  glow1.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(W - 160, H - 140, 10, W - 160, H - 140, 460);
  glow2.addColorStop(0, 'rgba(250, 204, 21, 0.14)');
  glow2.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // 2. Top Header Banner
  ctx.save();
  drawRoundedRectPath(ctx, padX, 34, W - padX * 2, 166, 24);
  const headerGrad = ctx.createLinearGradient(padX, 34, W - padX, 200);
  headerGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
  headerGrad.addColorStop(1, 'rgba(30, 41, 59, 0.88)');
  ctx.fillStyle = headerGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.stroke();

  // Eyebrow pill
  ctx.font = '800 18px "Plus Jakarta Sans", "Segoe UI", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('🏐 ESCALAÇÃO OFICIAL DOS TIMES • VÔLEI PRO ARENA', padX + 30, 76);

  // Main Tournament Name
  ctx.font = '900 46px "Outfit", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  const titleStr = truncateCanvasText(ctx, (state.tournamentName || 'VÔLEI INTERNO').toUpperCase(), W - padX * 2 - 60);
  ctx.fillText(titleStr, padX + 30, 132);

  // Date & Summary line
  const totalPlayers = teams.reduce((acc, t) => acc + (t.players ? t.players.length : 0), 0);
  ctx.font = '700 21px "JetBrains Mono", "Segoe UI", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    `📅 Data: ${formatDateBr(state.tournamentDate)}   •   🛡️ ${teams.length} Equipes   •   👥 ${totalPlayers} Jogadores`,
    padX + 30,
    174
  );
  ctx.restore();

  // 3. Draw Each Team Card
  teams.forEach((team, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = padX + col * (cardW + gap);
    const y = headerSectionH + row * (cardH + gap);
    const teamColor = team.color || '#38bdf8';

    ctx.save();
    drawRoundedRectPath(ctx, x, y, cardW, cardH, 22);
    const cardGrad = ctx.createLinearGradient(x, y, x, y + cardH);
    cardGrad.addColorStop(0, hexToRgba(teamColor, 0.28));
    cardGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.94)');
    cardGrad.addColorStop(1, 'rgba(9, 14, 28, 0.97)');
    ctx.fillStyle = cardGrad;
    ctx.fill();

    // Top colored accent bar inside card
    ctx.save();
    ctx.clip();
    ctx.fillStyle = teamColor;
    ctx.fillRect(x, y, cardW, 8);
    ctx.restore();

    // Card subtle border
    drawRoundedRectPath(ctx, x, y, cardW, cardH, 22);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = hexToRgba(teamColor, 0.5);
    ctx.stroke();

    // Team Badge Circle
    const badgeX = x + 24;
    const badgeY = y + 26;
    const badgeSize = 54;
    drawRoundedRectPath(ctx, badgeX, badgeY, badgeSize, badgeSize, 16);
    ctx.fillStyle = teamColor;
    ctx.fill();

    ctx.font = '900 24px "Outfit", "Segoe UI", sans-serif';
    ctx.fillStyle = '#060913';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(idx + 1).padStart(2, '0'), badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 1);

    // Team Name
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '900 31px "Outfit", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    const cleanTeamName = truncateCanvasText(ctx, team.name || `Time 0${idx + 1}`, cardW - 210);
    ctx.fillText(cleanTeamName, badgeX + badgeSize + 16, y + 54);

    // Team Sub-meta (Player count + Average stars)
    const players = Array.isArray(team.players) ? team.players : [];
    const avgSkill =
      players.length > 0
        ? (players.reduce((acc, p) => acc + (Number(p.skill) || 3), 0) / players.length).toFixed(1)
        : '—';
    ctx.font = '700 17px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${players.length} integrantes  •  Média ⭐ ${avgSkill}`, badgeX + badgeSize + 16, y + 80);

    // Players List inside Card
    if (players.length === 0) {
      drawRoundedRectPath(ctx, x + 20, y + cardHeaderH, cardW - 40, playerRowH, 12);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fill();
      ctx.font = '600 19px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Nenhum jogador escalado neste time', x + 36, y + cardHeaderH + 34);
    } else {
      players.forEach((p, pIdx) => {
        const py = y + cardHeaderH + pIdx * (playerRowH + 10);
        drawRoundedRectPath(ctx, x + 20, py, cardW - 40, playerRowH, 13);
        ctx.fillStyle = 'rgba(9, 14, 28, 0.78)';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
        ctx.stroke();

        // Number index
        ctx.font = '800 20px "JetBrains Mono", monospace';
        ctx.fillStyle = teamColor;
        ctx.fillText(`${pIdx + 1}.`, x + 34, py + 34);

        // Player Name
        ctx.font = '800 22px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.fillStyle = '#f8fafc';
        const pName = truncateCanvasText(ctx, p.name || 'Jogador', cardW - 245);
        ctx.fillText(pName, x + 68, py + 34);

        // Role Badge & Stars on the right
        const roleShort = getRoleShortCode(p.role || 'Geral');
        const starsCount = Math.max(1, Math.min(5, Number(p.skill) || 3));
        const starsStr = '★'.repeat(starsCount);

        ctx.textAlign = 'right';
        ctx.font = '800 18px "Segoe UI", sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.fillText(starsStr, x + cardW - 34, py + 33);

        const starsWidth = ctx.measureText(starsStr).width;
        ctx.font = '700 15px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText(roleShort.toUpperCase(), x + cardW - 44 - starsWidth, py + 32);
        ctx.textAlign = 'left';
      });
    }

    ctx.restore();
  });

  // 4. Opening Matches Strip ("PRIMEIROS CONFRONTOS")
  const matchesY = headerSectionH + rowsCount * cardH + (rowsCount - 1) * gap + 24;
  ctx.save();
  drawRoundedRectPath(ctx, padX, matchesY, W - padX * 2, 118, 20);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
  ctx.stroke();

  ctx.font = '800 17px "Plus Jakarta Sans", "Segoe UI", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('⚡ PRIMEIROS CONFRONTOS DA TABELA (1º MINI TORNEIO)', padX + 26, matchesY + 36);

  const t1Name = teams[0]?.name || 'Time 01';
  const t2Name = teams[1]?.name || 'Time 02';
  const t3Name = teams[2]?.name || 'Time 03';
  const t4Name = teams[3]?.name || 'Time 04';

  ctx.font = '800 24px "Outfit", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  if (teams.length >= 4) {
    ctx.fillText(`🏐 Jogo 1:  ${t1Name}  ×  ${t2Name}`, padX + 26, matchesY + 80);
    ctx.fillText(`🏐 Jogo 2:  ${t3Name}  ×  ${t4Name}`, padX + 510, matchesY + 80);
  } else if (teams.length === 3) {
    ctx.fillText(`🏐 Jogo 1:  ${t1Name}  ×  ${t2Name}   |   Espera: ${t3Name}`, padX + 26, matchesY + 80);
  } else {
    ctx.fillText(`🏐 Jogo 1:  ${t1Name}  ×  ${t2Name}`, padX + 26, matchesY + 80);
  }
  ctx.restore();

  // 5. Footer Audit Stamp
  const footerY = H - 28;
  ctx.font = '600 17px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  const stampText = state.lastDrawStamp || `Gerado em ${new Date().toLocaleString('pt-BR')}`;
  ctx.fillText(`✅ ${stampText}  •  Sala #${(state.roomCode || 'VOLEI1').toUpperCase()}`, padX + 6, footerY);

  const previewImg = document.getElementById('teams-share-preview-img');
  if (previewImg) {
    previewImg.src = canvas.toDataURL('image/png');
  }
  return canvas;
}

function openTeamsImageModal() {
  renderTeamsShareCanvas();
  document.getElementById('modal-teams-image')?.classList.remove('hidden');
}

function getTeamsShareCaptionText() {
  let text = `🏐 *ESCALAÇÃO OFICIAL — ${state.tournamentName}* (${formatDateBr(state.tournamentDate)})\n\n`;
  state.teams.forEach((t) => {
    const names = t.players.map((p) => p.name).join(', ') || 'A definir';
    text += `🛡️ *${t.name}*: ${names}\n`;
  });
  return text.trim();
}

async function shareTeamsImageNative() {
  const canvas = renderTeamsShareCanvas();
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const fileName = `times-volei-${state.tournamentDate || 'hoje'}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Escalação — ${state.tournamentName}`,
          text: getTeamsShareCaptionText()
        });
        showToast('📲 Imagem enviada para o compartilhamento do WhatsApp!', 'success');
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    // Fallback for Desktop / browsers without file share: copy image to clipboard + download
    await copyTeamsImageToClipboard();
  }, 'image/png');
}

async function copyTeamsImageToClipboard() {
  const canvas = renderTeamsShareCanvas();
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        showToast('✅ <strong>Imagem copiada!</strong> Agora é só dar <strong>Ctrl+V</strong> (ou Colar) no grupo do WhatsApp!', 'success');
        return;
      } catch (_) {}
    }
    downloadTeamsImagePng();
  }, 'image/png');
}

function downloadTeamsImagePng() {
  const canvas = renderTeamsShareCanvas();
  if (!canvas) return;
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `escalacao-times-${state.tournamentDate || 'hoje'}.png`;
  a.click();
  showToast('⬇️ Imagem PNG dos times baixada! Envie no grupo do WhatsApp.', 'success');
}

/* ==========================================
   TAB 4: ELENCO FIXO (1-CLICK STARS & ROLES)
   & SMART IMPORT COMMAND PARSER
   ========================================== */
let elencoFilterStar = 'all';
let elencoSearchQuery = '';
let elencoNewStars = 4;
let elencoNewRole = 'Geral';

const ALL_ROLES = ['Geral', 'Levantador', 'Atacante', 'Bloqueador', 'Defensor'];

function getRoleShortCode(role) {
  if (role === 'Levantador') return 'Lev';
  if (role === 'Atacante') return 'Ata';
  if (role === 'Bloqueador') return 'Bloq';
  if (role === 'Defensor') return 'Def';
  return 'Geral';
}

function findMasterPlayerByName(name) {
  if (!Array.isArray(state.masterRoster)) state.masterRoster = loadMasterRoster();
  const key = normalizePlayerKey(name);
  if (!key) return null;
  return state.masterRoster.find((mp) => normalizePlayerKey(mp.name) === key) || null;
}

function isMasterPlayerInPoolToday(masterPlayer) {
  if (!masterPlayer || !Array.isArray(state.playerPool)) return false;
  const key = normalizePlayerKey(masterPlayer.name);
  return state.playerPool.some(
    (p) => p.masterId === masterPlayer.id || normalizePlayerKey(p.name) === key
  );
}

function upsertMasterPlayer(name, role = null, skill = null) {
  if (!Array.isArray(state.masterRoster)) state.masterRoster = loadMasterRoster();
  const trimmed = String(name || '').trim();
  if (!trimmed) return null;

  const existing = findMasterPlayerByName(trimmed);
  if (existing) {
    existing.name = trimmed;
    if (role) existing.role = role;
    if (skill !== null && skill !== undefined && !Number.isNaN(Number(skill))) {
      existing.skill = Math.max(1, Math.min(5, Number(skill)));
    }
    saveMasterRoster();
    return existing;
  }

  const created = {
    id: `mr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: trimmed,
    role: role || 'Geral',
    skill: skill !== null && skill !== undefined ? Math.max(1, Math.min(5, Number(skill))) : 3
  };
  state.masterRoster.push(created);
  saveMasterRoster();
  return created;
}

function syncMasterPlayerChangesToPoolAndTeams(masterPlayer, oldNormalizedKey = null) {
  if (!masterPlayer) return;
  const targetKey = oldNormalizedKey || normalizePlayerKey(masterPlayer.name);

  if (Array.isArray(state.playerPool)) {
    state.playerPool.forEach((p) => {
      if (p.masterId === masterPlayer.id || normalizePlayerKey(p.name) === targetKey) {
        p.masterId = masterPlayer.id;
        p.name = masterPlayer.name;
        p.role = masterPlayer.role;
        p.skill = masterPlayer.skill;
      }
    });
  }

  if (Array.isArray(state.teams)) {
    state.teams.forEach((t) => {
      if (!Array.isArray(t.players)) return;
      t.players.forEach((p) => {
        if (p.masterId === masterPlayer.id || normalizePlayerKey(p.name) === targetKey) {
          p.masterId = masterPlayer.id;
          p.name = masterPlayer.name;
          p.role = masterPlayer.role;
          p.skill = masterPlayer.skill;
        }
      });
    });
  }
}

function renderElencoTab() {
  const gridEl = document.getElementById('master-roster-grid');
  if (!gridEl) return;

  if (!Array.isArray(state.masterRoster)) {
    state.masterRoster = loadMasterRoster();
  }

  // Update New Player Stars & Role Picker UI
  const newStarsPicker = document.getElementById('elenco-new-stars-picker');
  if (newStarsPicker) {
    newStarsPicker.querySelectorAll('.star-click-btn').forEach((btn) => {
      const val = Number(btn.dataset.starVal || 1);
      btn.classList.toggle('lit', val <= elencoNewStars);
    });
  }
  const newRolePicker = document.getElementById('elenco-new-role-picker');
  if (newRolePicker) {
    newRolePicker.querySelectorAll('.role-pill-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.roleVal === elencoNewRole);
    });
  }

  // Update Filter Buttons
  const filterGroup = document.getElementById('elenco-star-filters');
  if (filterGroup) {
    filterGroup.querySelectorAll('.filter-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.starFilter === elencoFilterStar);
    });
  }

  // Filter & Sort Roster
  const query = normalizePlayerKey(elencoSearchQuery);
  const filtered = state.masterRoster
    .filter((mp) => {
      if (query && !normalizePlayerKey(mp.name).includes(query) && !normalizePlayerKey(mp.role).includes(query)) {
        return false;
      }
      const s = Number(mp.skill) || 3;
      if (elencoFilterStar === '5') return s === 5;
      if (elencoFilterStar === '4') return s === 4;
      if (elencoFilterStar === '3') return s === 3;
      if (elencoFilterStar === '12') return s <= 2;
      if (elencoFilterStar === 'present') return isMasterPlayerInPoolToday(mp);
      return true;
    })
    .sort((a, b) => (b.skill || 3) - (a.skill || 3) || a.name.localeCompare(b.name));

  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-state-mini" style="grid-column: 1 / -1; padding: 24px;">
        Nenhum jogador encontrado neste filtro. Adicione acima ou importe uma lista com comandos!
      </div>
    `;
    return;
  }

  gridEl.innerHTML = filtered
    .map((mp) => {
      const isPresent = isMasterPlayerInPoolToday(mp);
      const stars = Number(mp.skill) || 3;
      const role = mp.role || 'Geral';

      return `
        <div class="master-player-card ${isPresent ? 'is-present' : ''}">
          <div class="mp-card-top">
            <button
              type="button"
              class="mp-presence-toggle-btn ${isPresent ? 'active' : ''}"
              onclick="togglePlayerPresenceToday('${mp.id}')"
              title="${isPresent ? 'Presente no sorteio de hoje (Clique para tirar)' : 'Clique para escalar no sorteio de hoje'}"
            >
              ${isPresent ? 'Joga Hoje' : 'Escalar Hoje'}
            </button>
            <button
              type="button"
              class="mp-delete-btn"
              onclick="deleteMasterPlayer('${mp.id}')"
              title="Excluir do Elenco Fixo"
            >🗑️</button>
          </div>

          <div class="mp-name-row">
            <img src="${getRoleSvg(role)}" alt="" width="22" height="22" class="mono-svg-accent" style="flex-shrink:0;" />
            <input
              type="text"
              class="mp-name-input"
              value="${escapeHtml(mp.name)}"
              aria-label="Nome de ${escapeHtml(mp.name)}"
              onchange="updateMasterPlayerName('${mp.id}', this.value)"
            />
          </div>

          <div class="mp-stars-section">
            <span class="mp-mini-label">NÍVEL (${stars}★):</span>
            <div class="interactive-stars-bar" role="group" aria-label="Alterar estrelas com 1 clique">
              ${[1, 2, 3, 4, 5]
                .map(
                  (s) => `
                <button
                  type="button"
                  class="star-click-btn ${s <= stars ? 'lit' : ''}"
                  onclick="setMasterPlayerStars('${mp.id}', ${s})"
                  title="Definir ${s} estrela${s > 1 ? 's' : ''}"
                >★</button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="mp-roles-section">
            <div class="role-pills-bar">
              ${ALL_ROLES.map(
                (r) => `
                <button
                  type="button"
                  class="role-pill-btn ${role === r ? 'active' : ''}"
                  onclick="setMasterPlayerRole('${mp.id}', '${r}')"
                  title="Posição: ${r}"
                >${getRoleShortCode(r)}</button>
              `
              ).join('')}
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

window.togglePlayerPresenceToday = function (masterId) {
  if (!Array.isArray(state.masterRoster)) return;
  const mp = state.masterRoster.find((item) => item.id === masterId);
  if (!mp) return;

  const key = normalizePlayerKey(mp.name);
  const existingIdx = state.playerPool.findIndex(
    (p) => p.masterId === mp.id || normalizePlayerKey(p.name) === key
  );

  if (existingIdx >= 0) {
    state.playerPool.splice(existingIdx, 1);
    playSound('undo');
  } else {
    state.playerPool.push({
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      masterId: mp.id,
      name: mp.name,
      role: mp.role || 'Geral',
      skill: Number(mp.skill) || 3
    });
    playSound('point');
  }

  saveState();
  renderAll();
};

window.setMasterPlayerStars = function (masterId, stars) {
  if (!Array.isArray(state.masterRoster)) return;
  const mp = state.masterRoster.find((item) => item.id === masterId);
  if (!mp) return;

  mp.skill = Math.max(1, Math.min(5, Number(stars) || 3));
  syncMasterPlayerChangesToPoolAndTeams(mp);
  playSound('point');
  saveState();
  renderAll();
};

window.setMasterPlayerRole = function (masterId, role) {
  if (!Array.isArray(state.masterRoster)) return;
  const mp = state.masterRoster.find((item) => item.id === masterId);
  if (!mp) return;

  mp.role = role || 'Geral';
  syncMasterPlayerChangesToPoolAndTeams(mp);
  playSound('point');
  saveState();
  renderAll();
};

window.updateMasterPlayerName = function (masterId, newName) {
  if (!Array.isArray(state.masterRoster)) return;
  const mp = state.masterRoster.find((item) => item.id === masterId);
  const trimmed = String(newName || '').trim();
  if (!mp || !trimmed) {
    renderElencoTab();
    return;
  }

  const oldKey = normalizePlayerKey(mp.name);
  mp.name = trimmed;
  syncMasterPlayerChangesToPoolAndTeams(mp, oldKey);
  saveState();
  renderAll();
  showToast(`✏️ Nome atualizado para <strong>${escapeHtml(trimmed)}</strong>!`, 'info');
};

window.deleteMasterPlayer = function (masterId) {
  if (!Array.isArray(state.masterRoster)) return;
  const mp = state.masterRoster.find((item) => item.id === masterId);
  if (!mp) return;

  state.masterRoster = state.masterRoster.filter((item) => item.id !== masterId);
  saveState();
  renderAll();
  showToast(`🗑️ <strong>${escapeHtml(mp.name)}</strong> removido do Elenco Fixo.`, 'info');
};

window.setPoolPlayerStars = function (poolId, stars) {
  const p = state.playerPool.find((item) => item.id === poolId);
  if (!p) return;

  const newStars = Math.max(1, Math.min(5, Number(stars) || 3));
  p.skill = newStars;
  upsertMasterPlayer(p.name, p.role, newStars);
  playSound('point');
  saveState();
  renderAll();
};

window.cyclePoolPlayerRole = function (poolId) {
  const p = state.playerPool.find((item) => item.id === poolId);
  if (!p) return;

  const currentIdx = ALL_ROLES.indexOf(p.role || 'Geral');
  const nextRole = ALL_ROLES[(currentIdx + 1) % ALL_ROLES.length];
  p.role = nextRole;
  upsertMasterPlayer(p.name, nextRole, p.skill);
  playSound('point');
  saveState();
  renderAll();
};

window.insertImportCmd = function (cmdText) {
  const ta = document.getElementById('whatsapp-paste-textarea');
  if (!ta) return;

  const start = ta.selectionStart ?? ta.value.length;
  const end = ta.selectionEnd ?? ta.value.length;
  const before = ta.value.slice(0, start);
  const after = ta.value.slice(end);
  const isBlockHeader = cmdText.startsWith('#');
  const insertion = isBlockHeader
    ? `${before && !before.endsWith('\n') ? '\n' : ''}${cmdText}\n`
    : `${before && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : ''}${cmdText} `;

  ta.value = before + insertion + after;
  ta.focus();
  const newCursor = (before + insertion).length;
  ta.setSelectionRange(newCursor, newCursor);
};

/**
 * Interpreta listas do WhatsApp com Comandos Inteligentes de Estrelas e Posições:
 * - Cabeçalhos de bloco: "#5*", "5 ESTRELAS:", "#4*" definem as estrelas dos próximos nomes
 * - Comandos na linha: "Lucas 5* L", "Rafael 4*", "Bruno (5) Ata", "Juliana 4 estrelas Def", "Pedro ⭐⭐⭐⭐"
 * - Busca automática no Elenco Fixo (masterRoster) quando a linha só tem o nome!
 */
function parsePlayersTextWithCommands(rawText) {
  const rawLines = String(rawText || '').split(/\r?\n/);
  const parsedPlayers = [];
  let currentBlockStars = null;
  let currentBlockRole = null;

  const roleMap = {
    l: 'Levantador',
    lev: 'Levantador',
    levantador: 'Levantador',
    levantadora: 'Levantador',
    a: 'Atacante',
    ata: 'Atacante',
    atacante: 'Atacante',
    ponta: 'Atacante',
    oposto: 'Atacante',
    b: 'Bloqueador',
    bloq: 'Bloqueador',
    bloqueador: 'Bloqueador',
    bloqueadora: 'Bloqueador',
    central: 'Bloqueador',
    meio: 'Bloqueador',
    d: 'Defensor',
    def: 'Defensor',
    defensor: 'Defensor',
    defensora: 'Defensor',
    libero: 'Defensor',
    g: 'Geral',
    geral: 'Geral'
  };

  for (const rawLine of rawLines) {
    let line = rawLine.trim();
    if (!line) continue;

    // 1. Check if the entire line is a Block Star Header (e.g. "#5*", "5*", "5 ESTRELAS:", "⭐⭐⭐⭐⭐")
    const blockStarMatch =
      line.match(/^#?\s*([1-5])\s*(?:\*|★|⭐|estrelas?)\s*:?\s*$/i) ||
      line.match(/^(?:nivel|nível|bloco|time)?\s*#?\s*([1-5])\s*(?:estrelas?|\*|★)\s*:?\s*$/i);
    if (blockStarMatch) {
      currentBlockStars = Number(blockStarMatch[1]);
      continue;
    }
    const onlyStarEmojis = line.match(/^#?\s*([⭐★]{1,5})\s*:?\s*$/);
    if (onlyStarEmojis) {
      currentBlockStars = Math.min(5, onlyStarEmojis[1].length);
      continue;
    }

    // 2. Strip leading list numbering / bullets ("1.", "01 -", "1)", "✅", "🏐", "•")
    line = line.replace(/^[\s\d\.\-\)\✅\☑️\🏐\*•➕]+/, '').trim();
    if (!line) continue;

    // Ignore common WhatsApp header titles like "LISTA DE HOJE:", "CONFIRMADOS:", "VÔLEI HOJE"
    if (/^(lista|confirmados|jogadores|presenca|presença|volei|vôlei)\b.*:$/i.test(line)) {
      continue;
    }

    let explicitStars = null;
    let explicitRole = null;

    // 3. Detect emoji stars anywhere in the line (⭐⭐⭐⭐⭐ or ★★★★★)
    const emojiStarsMatch = line.match(/([⭐★]{1,5})/);
    if (emojiStarsMatch) {
      explicitStars = Math.min(5, emojiStarsMatch[1].length);
      line = line.replace(emojiStarsMatch[0], ' ').trim();
    }

    // 4. Detect inline star commands: "5*", "*5", "5 estrelas", "nivel 5", "(5)", "[5]"
    const inlineStarPatterns = [
      /(?:^|[\s\-\/,(\[])([1-5])\s*(?:\*|★|estrelas?)(?=$|[\s\-\/,)\]])/i,
      /(?:^|[\s\-\/,(\[])(?:\*|★)\s*([1-5])(?=$|[\s\-\/,)\]])/i,
      /(?:^|[\s\-\/,(\[])(?:nivel|nível)\s*([1-5])(?=$|[\s\-\/,)\]])/i,
      /[\(\[]\s*([1-5])\s*\*?\s*[\)\]]/
    ];
    for (const regex of inlineStarPatterns) {
      const m = line.match(regex);
      if (m) {
        explicitStars = Number(m[1]);
        line = line.replace(m[0], ' ').trim();
        break;
      }
    }

    // 5. Tokenize remaining line to inspect trailing role codes or trailing standalone digit (1..5)
    // Clean up separators at edges
    line = line.replace(/[\(\)\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
    let tokens = line.split(/[\s\-\/,|]+/).filter(Boolean);

    // Check last 2 tokens for role codes or standalone star digit (1..5)
    for (let pass = 0; pass < 2; pass++) {
      if (tokens.length <= 1) break;
      const lastTokenRaw = tokens[tokens.length - 1];
      const lastTokenNorm = normalizePlayerKey(lastTokenRaw);

      if (!explicitRole && roleMap[lastTokenNorm]) {
        explicitRole = roleMap[lastTokenNorm];
        tokens.pop();
        continue;
      }

      if (explicitStars === null && /^[1-5]$/.test(lastTokenRaw)) {
        explicitStars = Number(lastTokenRaw);
        tokens.pop();
        continue;
      }
    }

    const cleanName = tokens.join(' ').replace(/^[\s\-\/,|:]+|[\s\-\/,|:]+$/g, '').trim();
    if (cleanName.length < 2) continue;

    // 6. Look up in Master Roster for saved stars & role if not explicitly typed
    const savedMaster = findMasterPlayerByName(cleanName);
    const finalStars =
      explicitStars !== null
        ? explicitStars
        : currentBlockStars !== null
        ? currentBlockStars
        : savedMaster
        ? Number(savedMaster.skill) || 3
        : 3;

    const finalRole =
      explicitRole ||
      currentBlockRole ||
      (savedMaster ? savedMaster.role : 'Geral') ||
      'Geral';

    const displayPlayerName = savedMaster ? savedMaster.name : cleanName;

    parsedPlayers.push({
      name: displayPlayerName,
      role: finalRole,
      skill: Math.max(1, Math.min(5, finalStars)),
      hadExplicitCommand: explicitStars !== null || explicitRole !== null || currentBlockStars !== null,
      matchedFromMaster: Boolean(savedMaster)
    });
  }

  return parsedPlayers;
}

/* ==========================================
   TAB 4: STANDINGS ("RANKING DO DIA")
   ========================================== */
function computeStandings() {
  const statsMap = {};
  const currentStreakMap = {};

  state.teams.forEach((t) => {
    statsMap[t.id] = {
      teamId: t.id,
      name: t.name,
      color: t.color,
      icon: t.icon || './volleyball-player-motion-svgrepo-com.svg',
      played: 0,
      wins: 0,
      losses: 0,
      maxStreak: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      diff: 0,
      tablePoints: 0
    };
    currentStreakMap[t.id] = 0;
  });

  state.matches.forEach((m) => {
    if (m.status !== 'done' || !m.winnerId) return;
    const stA = statsMap[m.teamAId];
    const stB = statsMap[m.teamBId];
    if (!stA || !stB) return;

    stA.played += 1;
    stB.played += 1;
    stA.pointsFor += m.scoreA;
    stA.pointsAgainst += m.scoreB;
    stB.pointsFor += m.scoreB;
    stB.pointsAgainst += m.scoreA;

    if (m.winnerId === m.teamAId) {
      stA.wins += 1;
      stB.losses += 1;
      currentStreakMap[m.teamAId] += 1;
      currentStreakMap[m.teamBId] = 0;
      if (currentStreakMap[m.teamAId] > stA.maxStreak) {
        stA.maxStreak = currentStreakMap[m.teamAId];
      }
    } else {
      stB.wins += 1;
      stA.losses += 1;
      currentStreakMap[m.teamBId] += 1;
      currentStreakMap[m.teamAId] = 0;
      if (currentStreakMap[m.teamBId] > stB.maxStreak) {
        stB.maxStreak = currentStreakMap[m.teamBId];
      }
    }
  });

  const rows = Object.values(statsMap).map((st) => {
    st.diff = st.pointsFor - st.pointsAgainst;
    st.winRate = st.played > 0 ? Math.round((st.wins / st.played) * 100) : 0;
    st.tablePoints = st.wins * 3;
    return st;
  });

  rows.sort((a, b) => {
    if (state.scoringMode === 'win_rate') {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.diff - a.diff;
    }
    if (state.scoringMode === 'points_scored') {
      if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
      return b.wins - a.wins;
    }
    // Default: wins_count or wins_3pts
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.pointsFor - a.pointsFor;
  });

  return rows;
}

function renderStandingsTab() {
  const rows = computeStandings();

  const navLeader = document.getElementById('nav-leader-badge');
  if (navLeader && rows[0]) {
    navLeader.textContent = rows[0].played > 0 ? `1º ${rows[0].name}` : 'Ranking';
  }

  const modeSelect = document.getElementById('scoring-mode-select');
  if (modeSelect) modeSelect.value = state.scoringMode;

  const medals = ['🥇 1º LUGAR', '🥈 2º LUGAR', '🥉 3º LUGAR', '4º LUGAR', '5º LUGAR', '6º LUGAR'];
  const podiumEl = document.getElementById('podium-container');
  if (podiumEl) {
    podiumEl.innerHTML = rows
      .slice(0, 4)
      .map(
        (r, idx) => `
        <div class="podium-card rank-${idx + 1}" style="background: ${getTeamCardGradient(r.color)};">
          <div class="podium-rank-badge">${medals[idx] || `${idx + 1}º LUGAR`}</div>
          <div class="podium-team-name">
            ${buildTeamMiniBadge(r)}
            <span>${escapeHtml(r.name)}</span>
          </div>
          <div class="podium-stats-line">
            <strong>${r.wins} Vitórias</strong> (${r.played}J) • Saldo ${r.diff >= 0 ? `+${r.diff}` : r.diff}
          </div>
        </div>
      `
      )
      .join('');
  }

  const tbody = document.getElementById('standings-tbody');
  if (tbody) {
    tbody.innerHTML = rows
      .map((r, idx) => {
        const pos = idx + 1;
        return `
          <tr>
            <td><span class="rank-pill pos-${pos}">${pos}º</span></td>
            <td>
              <div style="display:flex;align-items:center;gap:10px;">
                ${buildTeamMiniBadge(r)}
                <strong>${escapeHtml(r.name)}</strong>
              </div>
            </td>
            <td style="font-family:var(--font-mono)">${r.played}</td>
            <td style="font-family:var(--font-mono);color:#6ee7b7;font-weight:800;font-size:1.02rem;">${r.wins}</td>
            <td style="font-family:var(--font-mono);color:#fda4af;">${r.losses}</td>
            <td style="font-family:var(--font-mono);color:#fde047;">${r.maxStreak > 0 ? `🔥 ${r.maxStreak}V` : '0'}</td>
            <td style="font-family:var(--font-mono)">${r.pointsFor} : ${r.pointsAgainst}</td>
            <td style="font-family:var(--font-mono);color:${r.diff >= 0 ? '#6ee7b7' : '#fda4af'}">${
          r.diff >= 0 ? `+${r.diff}` : r.diff
        }</td>
            <td style="font-family:var(--font-mono);font-size:1.05rem;font-weight:900;color:#38bdf8;">${r.tablePoints}</td>
            <td style="font-family:var(--font-mono)">${r.winRate}%</td>
          </tr>
        `;
      })
      .join('');
  }
}

/* ==========================================
   GLOBAL INTERACTION HANDLERS
   ========================================== */
window.createAndStartNextMatchManual = function () {
  const lastMatch = state.matches[state.matches.length - 1];
  const nextId = state.matches.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  syncWaitingQueueWithCurrentMatch();

  let teamAId = state.teams[0].id;
  let teamBId = state.teams[1 % state.teams.length].id;

  if (lastMatch && lastMatch.winnerId) {
    teamAId = lastMatch.winnerId;
    teamBId = state.waitingQueue.length > 0 ? state.waitingQueue.shift() : lastMatch.loserId;
    if (teamBId !== lastMatch.loserId) state.waitingQueue.push(lastMatch.loserId);
  }

  const newMatch = createMatchObject(nextId, teamAId, teamBId, `Jogo #${nextId}`);
  state.matches.push(newMatch);
  state.liveMatchId = newMatch.id;
  state.swappedSides = false;
  state.activeTab = 'placar';
  saveState();
  renderAll();
  showToast(`➕ <strong>Jogo #${newMatch.id}</strong> criado e pronto na quadra!`, 'success');
};

window.openQuickScoreModal = function (matchId = null) {
  const isNew = matchId === null;
  let match = isNew ? null : getMatchById(matchId);

  if (isNew) {
    const nextId = state.matches.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    const tA = state.teams[0].id;
    const tB = state.teams[1 % state.teams.length].id;
    match = createMatchObject(nextId, tA, tB, `Jogo #${nextId} • Criado na Hora`);
    state.matches.push(match);
    saveState();
  }

  quickScoreMatchId = match.id;
  document.getElementById('modal-qs-subtitle').textContent = `JOGO #${match.id} • ${match.stageLabel}`;

  const selA = document.getElementById('qs-teamA-select');
  const selB = document.getElementById('qs-teamB-select');
  selA.innerHTML = state.teams
    .map((t) => `<option value="${t.id}" ${t.id === match.teamAId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`)
    .join('');
  selB.innerHTML = state.teams
    .map((t) => `<option value="${t.id}" ${t.id === match.teamBId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`)
    .join('');

  document.getElementById('qs-scoreA-input').value = match.scoreA > 0 ? match.scoreA : state.targetPoints;
  document.getElementById('qs-scoreB-input').value =
    match.scoreB > 0 ? match.scoreB : Math.max(0, state.targetPoints - 3);

  document.getElementById('modal-quick-score').classList.remove('hidden');
  renderAll();
};

window.updateTeamName = function (teamId, newName) {
  const trimmed = (newName || '').trim();
  if (!trimmed) return;
  const team = getTeamById(teamId);
  if (team) {
    team.name = trimmed;
    saveState();
    renderAll();
    showToast(`✅ Nome atualizado para <strong>${escapeHtml(trimmed)}</strong>`, 'success');
  }
};

window.updateTeamColor = function (teamId, color) {
  const team = getTeamById(teamId);
  if (team) {
    team.color = color;
    saveState();
    renderAll();
  }
};

window.updateTeamIcon = function (teamId, iconSrc) {
  const team = getTeamById(teamId);
  if (team) {
    team.icon = iconSrc;
    const meta = getSvgMeta(iconSrc);
    saveState();
    renderAll();
    showToast(
      `🛡️ Escudo de <strong>${escapeHtml(team.name)}</strong> alterado para <strong>${meta.label}</strong>!`,
      'info'
    );
  }
};

window.deleteTeam = function (teamId) {
  if (state.teams.length <= 2) {
    showToast('⚠️ São necessários pelo menos 2 times.', 'warn');
    return;
  }
  state.teams = state.teams.filter((t) => t.id !== teamId);
  state.waitingQueue = state.waitingQueue.filter((id) => id !== teamId);
  saveState();
  renderAll();
  showToast('🗑️ Equipe removida.', 'info');
};

window.removePlayerFromPool = function (playerId) {
  state.playerPool = state.playerPool.filter((p) => p.id !== playerId);
  saveState();
  renderAll();
};

window.removePlayerFromTeam = function (teamId, playerIdx) {
  const team = getTeamById(teamId);
  if (!team || !team.players[playerIdx]) return;

  const removed = team.players.splice(playerIdx, 1)[0];

  // Devolve o jogador para o playerPool para reaparecer IMEDIATAMENTE nos Disponíveis!
  if (removed && removed.name) {
    const alreadyInPool = (state.playerPool || []).some(
      (p) => normalizePlayerKey(p.name) === normalizePlayerKey(removed.name)
    );
    if (!alreadyInPool) {
      if (!Array.isArray(state.playerPool)) state.playerPool = [];
      state.playerPool.push({
        id: removed.id || `p_${Date.now()}`,
        masterId: removed.masterId,
        name: removed.name,
        role: removed.role || 'Geral',
        skill: removed.skill || 3
      });
    }

    // Marca no Elenco Fixo como presente hoje
    if (Array.isArray(state.masterRoster)) {
      const mp = state.masterRoster.find(
        (m) => normalizePlayerKey(m.name) === normalizePlayerKey(removed.name)
      );
      if (mp) {
        mp.presentToday = true;
        saveMasterRoster();
      }
    }
  }

  saveState();
  renderAll();
  playSound('undo');
  showToast(`↩️ <strong>${escapeHtml(removed.name)}</strong> saiu do ${escapeHtml(team.name)} e voltou para os <strong>Disponíveis</strong>!`, 'info');
};

window.addAvailablePlayerToTeam = function (teamId, playerNameOrId) {
  if (!playerNameOrId) return;
  const team = getTeamById(teamId);
  if (!team) return;

  const raw = String(playerNameOrId).trim();
  const targetKey = normalizePlayerKey(raw);

  // Procura primeiro nos jogadores disponíveis
  const available = getAvailablePlayers();
  let found = available.find((p) => normalizePlayerKey(p.name) === targetKey || p.id === raw);

  // Se não estiver nos disponíveis imediatos, procura no elenco fixo
  if (!found && Array.isArray(state.masterRoster)) {
    const mp = state.masterRoster.find((m) => normalizePlayerKey(m.name) === targetKey || m.id === raw);
    if (mp) {
      found = {
        id: `p_m_${mp.id}`,
        masterId: mp.id,
        name: mp.name,
        role: mp.role || 'Geral',
        skill: mp.skill || 3
      };
      mp.presentToday = true;
      saveMasterRoster();
    }
  }

  // Se ainda não encontrou, interpreta como entrada direta
  if (!found) {
    const parsed = parsePlayersTextWithCommands(raw)[0];
    const pName = parsed ? parsed.name : raw;
    const pRole = parsed ? parsed.role : 'Geral';
    const pSkill = parsed ? parsed.skill : 3;
    const masterObj = upsertMasterPlayer(pName, pRole, pSkill);
    found = {
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      masterId: masterObj ? masterObj.id : undefined,
      name: masterObj ? masterObj.name : pName,
      role: pRole,
      skill: pSkill
    };
  }

  // Garante que está no playerPool
  const inPool = state.playerPool.some((p) => normalizePlayerKey(p.name) === normalizePlayerKey(found.name));
  if (!inPool) {
    state.playerPool.push({
      id: found.id || `p_${Date.now()}`,
      masterId: found.masterId,
      name: found.name,
      role: found.role,
      skill: found.skill
    });
  }

  // Checa se já está escalado neste time
  const alreadyInTeam = team.players.some((p) => normalizePlayerKey(p.name) === normalizePlayerKey(found.name));
  if (alreadyInTeam) {
    showToast(`⚠️ ${found.name} já está escalado no ${team.name}!`, 'warn');
    return;
  }

  team.players.push({
    id: `tp_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    masterId: found.masterId,
    name: found.name,
    role: found.role || 'Geral',
    skill: found.skill || 3
  });

  saveState();
  renderAll();
  playSound('point');
  showToast(`👤 <strong>${escapeHtml(found.name)}</strong> escalado no <strong>${escapeHtml(team.name)}</strong>!`, 'info');
};

window.addDirectPlayerToTeam = function (teamId) {
  const input = document.getElementById(`quick-player-${teamId}`);
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) return;
  const team = getTeamById(teamId);
  if (team) {
    const parsed = parsePlayersTextWithCommands(raw)[0];
    const pName = parsed ? parsed.name : raw;
    const pRole = parsed ? parsed.role : 'Geral';
    const pSkill = parsed ? parsed.skill : 3;
    const masterObj = upsertMasterPlayer(pName, pRole, pSkill);
    if (masterObj) {
      masterObj.presentToday = true;
      saveMasterRoster();
    }

    const newPlayer = {
      id: `tp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      masterId: masterObj ? masterObj.id : undefined,
      name: masterObj ? masterObj.name : pName,
      role: pRole,
      skill: pSkill
    };

    team.players.push(newPlayer);

    // Mantém no playerPool de hoje também
    const inPool = state.playerPool.some((p) => normalizePlayerKey(p.name) === normalizePlayerKey(newPlayer.name));
    if (!inPool) {
      state.playerPool.push({
        id: `p_${Date.now()}`,
        masterId: newPlayer.masterId,
        name: newPlayer.name,
        role: newPlayer.role,
        skill: newPlayer.skill
      });
    }

    input.value = '';
    saveState();
    renderAll();
    playSound('point');
    showToast(`👤 <strong>${escapeHtml(newPlayer.name)}</strong> adicionado ao <strong>${escapeHtml(team.name)}</strong>!`, 'info');
  }
};

/* ==========================================
   WHATSAPP SUMMARY & CSV EXPORT
   ========================================== */
function generateWhatsAppSummary() {
  const rows = computeStandings();
  const doneMatches = state.matches.filter((m) => m.status === 'done');

  let text = `🏐 *${state.tournamentName}* 🏐\n`;
  text += `📅 _Data: ${formatDateBr(state.tournamentDate)} • ${state.teams.length} Equipes • ${doneMatches.length} Jogos realizados_\n\n`;

  text += `🏆 *RANKING DO DIA:*\n`;
  rows.forEach((r, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`;
    text += `${medal} *${r.name}*: ${r.wins}V - ${r.losses}D (${r.played}J | Saldo: ${
      r.diff >= 0 ? `+${r.diff}` : r.diff
    })\n`;
  });

  const hasPlayers = state.teams.some((t) => t.players.length > 0);
  if (hasPlayers) {
    text += `\n👥 *TIMES ESCALADOS:*\n`;
    state.teams.forEach((t) => {
      const names = t.players.map((p) => p.name).join(', ') || 'Sem lista';
      text += `• *${t.name}*: ${names}\n`;
    });
  }

  if (doneMatches.length > 0) {
    text += `\n📋 *HISTÓRICO DOS JOGOS DE HOJE:*\n`;
    doneMatches.forEach((m) => {
      const tA = getTeamById(m.teamAId);
      const tB = getTeamById(m.teamBId);
      const w = getTeamById(m.winnerId);
      text += `✅ Jogo #${m.id}: ${tA.name} ${m.scoreA}×${m.scoreB} ${tB.name} (Venc: *${w.name}*)\n`;
    });
  }

  return text;
}

function copyTextToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast(successMsg, 'success');
  }
}

function exportTournamentCSV() {
  const lines = [];
  lines.push(`${state.tournamentName} | ${state.teams.length} TIMES,,,,`);
  lines.push(',,,,');
  lines.push('JOGO,EQUIPE A,PLACAR,EQUIPE B,VENCEDOR');

  state.matches.forEach((m) => {
    const tA = getTeamById(m.teamAId);
    const tB = getTeamById(m.teamBId);
    const scoreStr = m.status === 'done' ? `${m.scoreA} x ${m.scoreB}` : 'Em aberto';
    const winner = m.status === 'done' && m.winnerId ? getTeamById(m.winnerId).name : '';
    lines.push(`Jogo ${m.id},"${tA.name}",${scoreStr},"${tB.name}","${winner}"`);
  });

  lines.push(',,,,');
  lines.push('CLASSIFICAÇÃO GERAL DO DIA,,,,');
  lines.push('COLOCAÇÃO,EQUIPE,JOGOS,VITÓRIAS,DERROTAS,SALDO,PONTOS');
  const standings = computeStandings();
  standings.forEach((r, idx) => {
    lines.push(`${idx + 1}º,"${r.name}",${r.played},${r.wins},${r.losses},${r.diff},${r.tablePoints}`);
  });

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'volei-jogos-do-dia.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📊 Planilha CSV exportada com sucesso!', 'success');
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================
   EVENT LISTENERS INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
  });

  // Update Session Clock (2h / 3h court rental tracker)
  function updateSessionClock() {
    const elapsedMs = Math.max(0, Date.now() - (state.sessionStartTime || Date.now()));
    const totalMins = Math.floor(elapsedMs / 60000);
    const hrs = String(Math.floor(totalMins / 60)).padStart(2, '0');
    const mins = String(totalMins % 60).padStart(2, '0');
    const el = document.getElementById('session-clock-display');
    if (el) el.textContent = `${hrs}h ${mins}m`;
  }
  updateSessionClock();
  setInterval(updateSessionClock, 15000);

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      saveState();
      renderAll();
    });
  });

  document.getElementById('btn-whistle-toggle')?.addEventListener('click', () => {
    window.toggleWhistles();
  });

  document.getElementById('btn-toggle-whistle-court')?.addEventListener('click', () => {
    window.toggleWhistles();
  });

  document.getElementById('btn-rule-whistle-toggle')?.addEventListener('click', () => {
    window.toggleWhistles();
  });

  document.getElementById('btn-soundboard-whistle-toggle')?.addEventListener('click', () => {
    window.toggleWhistles();
  });

  document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) playSound('point');
    saveState();
    renderHeaderAndNav();
    showToast(state.soundEnabled ? '🔊 Sons e áudios ativados' : '🔇 Sons silenciados', 'info');
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('volei_theme_pref', state.theme);
    } catch (_) {}
    saveState(false);
    renderAll();
    showToast(
      state.theme === 'light' ? '☀️ Modo Claro ativado!' : '🌙 Modo Escuro ativado!',
      'info'
    );
  });

  // Voice Narration Toggle & ElevenLabs Studio
  document.getElementById('btn-voice-toggle')?.addEventListener('click', () => {
    state.voiceEnabled = state.voiceEnabled === false ? true : false;
    saveState(false);
    renderHeaderAndNav();
    if (state.voiceEnabled) {
      speakNarration('Narração de quadra ativada!');
      showToast('🎙️ <strong>Locutor de Voz ativado!</strong> Os pontos e vitórias serão narrados.', 'success');
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      showToast('🙊 Narração de voz desativada.', 'info');
    }
  });

  document.getElementById('btn-elevenlabs-studio')?.addEventListener('click', () => {
    const scriptArea = document.getElementById('elevenlabs-script-textarea');
    if (scriptArea) scriptArea.value = buildElevenLabsScript();
    document.getElementById('modal-voice-studio')?.classList.remove('hidden');
  });

  document.getElementById('btn-test-voice-point')?.addEventListener('click', () => {
    const t1 = state.teams[0]?.name || 'Time 1';
    state.voiceEnabled = true;
    renderHeaderAndNav();
    playCustomAudioOrSpeak('point_t1', `Ponto para o ${t1}.`);
  });

  document.getElementById('btn-test-voice-win')?.addEventListener('click', () => {
    const t1 = state.teams[0]?.name || 'Time 1';
    state.voiceEnabled = true;
    renderHeaderAndNav();
    playCustomAudioOrSpeak(
      'victory',
      `${t1} ganhou a partida.`
    );
  });

  document.getElementById('btn-copy-elevenlabs-script')?.addEventListener('click', () => {
    copyTextToClipboard(
      buildElevenLabsScript(),
      '🎙️ Roteiro copiado! Cole no ElevenLabs para gerar as vozes da sua resenha!'
    );
  });

  document.querySelectorAll('input[data-audio-slot]').forEach((input) => {
    input.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const slot = input.dataset.audioSlot;
      customAudioMap[slot] = URL.createObjectURL(file);
      const statusEl = document.getElementById('custom-audio-status');
      if (statusEl) {
        statusEl.textContent = `✅ Áudio personalizado "${file.name}" carregado para [${slot}]!`;
      }
      const preview = new Audio(customAudioMap[slot]);
      preview.play().catch(() => {});
      showToast(`🎵 Áudio ElevenLabs carregado com sucesso!`, 'success');
    });
  });

  // Auto-Save & Multi-Phone Room Sync Modal
  document.getElementById('btn-room-sync')?.addEventListener('click', () => {
    const roomInput = document.getElementById('input-room-code');
    if (roomInput) roomInput.value = (state.roomCode || 'VOLEI1').toUpperCase();
    updateSyncStatusUI();
    document.getElementById('modal-room-sync')?.classList.remove('hidden');
  });

  document.getElementById('btn-join-pull-room')?.addEventListener('click', () => {
    const roomInput = document.getElementById('input-room-code');
    const code = (roomInput?.value || 'VOLEI1').trim().toUpperCase();
    initPahoMqtt(code, true);
    document.getElementById('modal-room-sync')?.classList.add('hidden');
  });

  document.getElementById('btn-push-room-now')?.addEventListener('click', () => {
    const roomInput = document.getElementById('input-room-code');
    const code = (roomInput?.value || 'VOLEI1').trim().toUpperCase();
    state.roomCode = code;
    saveState(false);
    initPahoMqtt(code, false);
    pushRoomStateNow(true);
  });

  document.getElementById('btn-share-live-link')?.addEventListener('click', () => {
    const roomInput = document.getElementById('input-room-code');
    const code = (roomInput?.value || state.roomCode || 'VOLEI1').trim().toUpperCase();
    state.roomCode = code;
    saveState(true);

    const payload = buildCompactSyncPayload();
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const baseUrl = window.location.origin + window.location.pathname;
    const liveUrl = `${baseUrl}?sala=${encodeURIComponent(code)}&s=${encodeURIComponent(encoded)}`;

    const shareMsg =
      `🏐 *ACOMPANHE O PLACAR AO VIVO (${state.tournamentName})*\n` +
      `📡 Código da Partida: *#${code}*\n` +
      `🔗 Abra no celular para ver os times e o placar em tempo real:\n${liveUrl}`;

    copyTextToClipboard(
      shareMsg,
      `📲 Link ao vivo da Sala #${code} copiado! Envie no WhatsApp para a galera acompanhar nos celulares!`
    );
  });

  // Cross-tab & Multi-phone real-time listeners
  if (broadcastChannel) {
    broadcastChannel.onmessage = (ev) => {
      if (ev.data && ev.data.type === 'STATE_UPDATE' && ev.data.state) {
        applyIncomingRoomState({ ...ev.data.state, senderTabTime: Date.now() + 5 });
      }
    };
  }
  window.addEventListener('storage', (ev) => {
    if (ev.key === STORAGE_KEY && ev.newValue) {
      try {
        const parsed = JSON.parse(ev.newValue);
        state = { ...state, ...parsed };
        renderAll();
      } catch (_) {}
    }
  });

  document.getElementById('btn-whatsapp-share')?.addEventListener('click', () => {
    copyTextToClipboard(
      generateWhatsAppSummary(),
      '📲 Resumo do dia copiado! Agora é só colar no grupo do WhatsApp.'
    );
  });

  document.getElementById('btn-install-pwa')?.addEventListener('click', async () => {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      await deferredPwaPrompt.userChoice;
      deferredPwaPrompt = null;
    } else {
      document.getElementById('modal-install-help')?.classList.remove('hidden');
    }
  });

  document.getElementById('btn-settings-menu').addEventListener('click', () => {
    document.getElementById('input-tournament-name').value = state.tournamentName;
    document.getElementById('modal-settings').classList.remove('hidden');
  });

  document.getElementById('tournament-title-display').addEventListener('click', () => {
    openSessionsModal();
  });

  document.getElementById('btn-open-sessions')?.addEventListener('click', () => {
    openSessionsModal();
  });

  document.getElementById('btn-save-session-meta')?.addEventListener('click', () => {
    const newName = (document.getElementById('input-session-title')?.value || '').trim() || 'VÔLEI INTERNO';
    const newDate = document.getElementById('input-session-date')?.value || getTodayDateIso();
    const newRoom = (document.getElementById('input-session-room-code')?.value || state.roomCode || 'VOLEI1').replace(/^#/, '').trim().toUpperCase() || 'VOLEI1';
    state.tournamentName = newName;
    state.tournamentDate = newDate;
    state.roomCode = newRoom;
    state.sessionSetupConfirmed = true;
    saveState();
    initPahoMqtt(newRoom, false);
    renderAll();
    document.getElementById('modal-sessions')?.classList.add('hidden');
    showToast(`🏐 Torneio <strong>${escapeHtml(newName)}</strong> iniciado na Sala <strong>#${escapeHtml(newRoom)}</strong>!`, 'success');
  });

  document.getElementById('btn-create-new-session-archive')?.addEventListener('click', () => {
    upsertCurrentSessionInArchive();
    const newName = (document.getElementById('input-session-title')?.value || '').trim() || 'VÔLEI INTERNO';
    const newDate = document.getElementById('input-session-date')?.value || getTodayDateIso();
    const newRoom = (document.getElementById('input-session-room-code')?.value || state.roomCode || 'VOLEI1').replace(/^#/, '').trim().toUpperCase() || 'VOLEI1';

    state = createDefaultState(newName, newDate);
    state.roomCode = newRoom;
    state.sessionSetupConfirmed = true;
    saveState();
    initPahoMqtt(newRoom, false);
    renderAll();
    renderSavedSessionsModal();
    document.getElementById('modal-sessions')?.classList.add('hidden');
    showToast(
      `✨ Torneio anterior guardado! Novo torneio <strong>${escapeHtml(newName)}</strong> criado na Sala <strong>#${escapeHtml(newRoom)}</strong>!`,
      'success'
    );
  });

  // Focus Match Mode ("Iniciar Partida" / Tela Fixa / Travar Toques)
  document.getElementById('btn-start-focus-match')?.addEventListener('click', () => {
    window.enterCourtFocusMode();
  });

  document.getElementById('btn-exit-focus-match')?.addEventListener('click', () => {
    window.exitCourtFocusMode();
  });

  document.getElementById('btn-toggle-court-lock')?.addEventListener('click', () => {
    window.toggleCourtTouchLock();
  });

  document.getElementById('btn-focus-swap-sides')?.addEventListener('click', () => {
    if (isCourtTouchBlocked()) return;
    state.swappedSides = !state.swappedSides;
    playSound('point');
    saveState();
    renderLiveScoreboard();
    showToast('🔄 Lados invertidos!', 'info');
  });

  // Rotation Mode & New Match Creation
  document.getElementById('rotation-mode-select').addEventListener('change', (e) => {
    state.rotationMode = e.target.value;
    saveState();
    renderLiveScoreboard();
    showToast('🔄 Dinâmica de criação de jogos atualizada!', 'info');
  });

  document.getElementById('btn-create-custom-match').addEventListener('click', () => {
    window.openQuickScoreModal(null);
  });

  document.getElementById('btn-new-game-modal').addEventListener('click', () => {
    window.openQuickScoreModal(null);
  });

  document.getElementById('btn-generate-mini-round').addEventListener('click', () => {
    const nextId = state.matches.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    const maxMini = state.matches.reduce((max, m) => Math.max(max, m.miniIndex || 1), 0);
    if (state.teams.length >= 4) {
      const newBlock = createMiniTorneioBlock(maxMini + 1, nextId, state.teams);
      state.matches.push(...newBlock);
      state.liveMatchId = newBlock[0].id;
      state.rotationMode = 'winners_losers';
      saveState();
      renderAll();
      showToast(
        `🏆 <strong>${maxMini + 1}º Mini Torneio</strong> criado (J${nextId}, J${nextId + 1}, Vencedores e Perdedores)!`,
        'success'
      );
    } else {
      window.createAndStartNextMatchManual();
    }
  });

  // Inline Team Switchers on Live Scoreboard
  document.getElementById('select-team-left').addEventListener('change', (e) => {
    const match = getCurrentLiveMatch();
    const chosenId = e.target.value;
    if (state.swappedSides) {
      match.teamBId = chosenId;
    } else {
      match.teamAId = chosenId;
    }
    syncWaitingQueueWithCurrentMatch();
    saveState();
    renderAll();
  });

  document.getElementById('select-team-right').addEventListener('change', (e) => {
    const match = getCurrentLiveMatch();
    const chosenId = e.target.value;
    if (state.swappedSides) {
      match.teamAId = chosenId;
    } else {
      match.teamBId = chosenId;
    }
    syncWaitingQueueWithCurrentMatch();
    saveState();
    renderAll();
  });

  document.querySelectorAll('.pt-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      state.targetPoints = Number(pill.dataset.pts);
      saveState();
      renderLiveScoreboard();
      showToast(`🎯 Meta da partida ajustada para <strong>${state.targetPoints} pontos</strong>`, 'info');
    });
  });

  document.getElementById('btn-toggle-deuce').addEventListener('click', () => {
    state.winByTwo = !state.winByTwo;
    saveState();
    renderLiveScoreboard();
  });

  document.getElementById('btn-swap-sides').addEventListener('click', () => {
    state.swappedSides = !state.swappedSides;
    playSound('point');
    saveState();
    renderLiveScoreboard();
    showToast('🔄 Lados da quadra invertidos na tela!', 'info');
  });

  document.getElementById('btn-fullscreen-score').addEventListener('click', () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  document.getElementById('btn-plus-left').addEventListener('click', () => addPointToSide('left'));
  document.getElementById('btn-plus-right').addEventListener('click', () => addPointToSide('right'));
  document.getElementById('left-score-tap').addEventListener('click', () => addPointToSide('left'));
  document.getElementById('right-score-tap').addEventListener('click', () => addPointToSide('right'));

  document.getElementById('btn-minus-left').addEventListener('click', () => subtractPointFromSide('left'));
  document.getElementById('btn-minus-right').addEventListener('click', () => subtractPointFromSide('right'));

  document.getElementById('btn-serve-left').addEventListener('click', () => {
    if (isCourtTouchBlocked()) return;
    const match = getCurrentLiveMatch();
    match.serving = state.swappedSides ? 'B' : 'A';
    saveState();
    renderLiveScoreboard();
  });

  document.getElementById('btn-serve-right').addEventListener('click', () => {
    if (isCourtTouchBlocked()) return;
    const match = getCurrentLiveMatch();
    match.serving = state.swappedSides ? 'A' : 'B';
    saveState();
    renderLiveScoreboard();
  });

  document.getElementById('btn-undo-point').addEventListener('click', undoLastPoint);

  document.getElementById('btn-reset-live-score').addEventListener('click', () => {
    if (isCourtTouchBlocked()) return;
    const match = getCurrentLiveMatch();
    match.scoreA = 0;
    match.scoreB = 0;
    match.status = 'pending';
    match.winnerId = null;
    match.loserId = null;
    match.history = [];
    playSound('undo');
    saveState();
    renderAll();
    showToast('🧹 Placar da partida atual zerado.', 'info');
  });

  document.getElementById('btn-finish-match').addEventListener('click', () => {
    const match = getCurrentLiveMatch();
    finalizeMatchFromLive(match);
  });

  document.getElementById('btn-goto-all-games').addEventListener('click', () => {
    state.activeTab = 'jogos';
    saveState();
    renderAll();
  });

  // Match Timer & 30s Timeout
  function updateTimerDisplay() {
    const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    const formatted = `${m}:${s}`;
    document.getElementById('match-timer-display').textContent = formatted;
    const focusMirror = document.getElementById('focus-timer-mirror');
    if (focusMirror) focusMirror.textContent = formatted;
  }

  function toggleMatchTimer() {
    timerRunning = !timerRunning;
    const txt = timerRunning ? '⏸️' : '▶️';
    const mainToggle = document.getElementById('btn-timer-toggle');
    if (mainToggle) mainToggle.textContent = txt;
    const focusToggle = document.getElementById('btn-focus-timer-toggle');
    if (focusToggle) focusToggle.textContent = txt;

    if (timerRunning) {
      timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
  }

  function resetMatchTimer() {
    if (timerRunning) {
      timerRunning = false;
      clearInterval(timerInterval);
      const mainToggle = document.getElementById('btn-timer-toggle');
      if (mainToggle) mainToggle.textContent = '▶️';
      const focusToggle = document.getElementById('btn-focus-timer-toggle');
      if (focusToggle) focusToggle.textContent = '▶️';
    }
    timerSeconds = 0;
    updateTimerDisplay();
    playSound('undo');
    showToast('⏱️ Cronômetro zerado para 00:00!', 'info');
  }

  document.getElementById('btn-timer-toggle')?.addEventListener('click', toggleMatchTimer);
  document.getElementById('btn-focus-timer-toggle')?.addEventListener('click', toggleMatchTimer);
  document.getElementById('btn-timer-reset')?.addEventListener('click', resetMatchTimer);
  document.getElementById('btn-focus-timer-reset')?.addEventListener('click', resetMatchTimer);

  document.getElementById('btn-timeout-30s').addEventListener('click', () => {
    playSound('buzzer');
    showToast('✋ <strong>TEMPO TÉCNICO (30s)</strong> solicitado! Cronometrando...', 'warn');
    setTimeout(() => {
      playSound('setpoint');
      showToast('🏐 <strong>Fim do Tempo Técnico!</strong> Bolas em quadra.', 'info');
    }, 30000);
  });

  // Quick Score / Edit Match Modal
  function saveQuickScore(forcedWinnerSide = null) {
    if (!quickScoreMatchId) return;
    const match = getMatchById(quickScoreMatchId);

    const teamAId = document.getElementById('qs-teamA-select').value;
    const teamBId = document.getElementById('qs-teamB-select').value;
    if (teamAId === teamBId) {
      showToast('⚠️ Escolha duas equipes diferentes para o confronto!', 'warn');
      return;
    }

    match.teamAId = teamAId;
    match.teamBId = teamBId;

    let sA = parseInt(document.getElementById('qs-scoreA-input').value, 10) || 0;
    let sB = parseInt(document.getElementById('qs-scoreB-input').value, 10) || 0;

    if (forcedWinnerSide === 'A' && sA <= sB) {
      sA = Math.max(state.targetPoints, sB + 2);
    } else if (forcedWinnerSide === 'B' && sB <= sA) {
      sB = Math.max(state.targetPoints, sA + 2);
    }

    if (sA === sB) {
      showToast('⚠️ O placar não pode terminar empatado!', 'warn');
      return;
    }

    match.scoreA = sA;
    match.scoreB = sB;
    match.winnerId = sA > sB ? teamAId : teamBId;
    match.loserId = sA > sB ? teamBId : teamAId;
    match.status = 'done';
    match.finishedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    generateNextMatchesAfterFinish(match);

    document.getElementById('modal-quick-score').classList.add('hidden');
    playSound('victory');
    launchConfetti();
    saveState();
    renderAll();
    showToast(`✅ Resultado do Jogo #${match.id} salvo (${sA} × ${sB})!`, 'success');
  }

  document.getElementById('btn-qs-save').addEventListener('click', () => saveQuickScore(null));
  document.getElementById('btn-qs-winA').addEventListener('click', () => saveQuickScore('A'));
  document.getElementById('btn-qs-winB').addEventListener('click', () => saveQuickScore('B'));

  document.getElementById('btn-qs-play-live').addEventListener('click', () => {
    if (!quickScoreMatchId) return;
    const match = getMatchById(quickScoreMatchId);
    match.teamAId = document.getElementById('qs-teamA-select').value;
    match.teamBId = document.getElementById('qs-teamB-select').value;
    document.getElementById('modal-quick-score').classList.add('hidden');
    window.startMatchById(match.id);
  });

  document.getElementById('btn-qs-delete').addEventListener('click', () => {
    if (!quickScoreMatchId) return;
    if (state.matches.length <= 1) {
      const m = state.matches[0];
      m.scoreA = 0;
      m.scoreB = 0;
      m.status = 'pending';
      m.winnerId = null;
      m.loserId = null;
    } else {
      state.matches = state.matches.filter((m) => m.id !== quickScoreMatchId);
      if (state.liveMatchId === quickScoreMatchId) {
        state.liveMatchId = state.matches[state.matches.length - 1].id;
      }
    }
    document.getElementById('modal-quick-score').classList.add('hidden');
    saveState();
    renderAll();
    showToast('🗑️ Partida removida.', 'info');
  });

  // Format selector pills (Trios / Quartetos / 3 Times / 4 Times)
  document.querySelectorAll('.format-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.drawFormat = btn.dataset.drawFormat;
      if (state.drawFormat === 'count_3') ensureTeamCount(3);
      if (state.drawFormat === 'count_4') ensureTeamCount(4);
      saveState();
      renderAll();
    });
  });

  document.getElementById('btn-add-new-team').addEventListener('click', () => {
    const n = state.teams.length + 1;
    const newTeam = {
      id: `t_${Date.now()}`,
      name: `Time 0${n}`,
      color: TEAM_COLORS[(n - 1) % TEAM_COLORS.length],
      icon: TEAM_SVGS[(n - 1) % TEAM_SVGS.length].src,
      players: []
    };
    state.teams.push(newTeam);
    syncWaitingQueueWithCurrentMatch();
    saveState();
    renderAll();
    showToast(`🛡️ <strong>${newTeam.name}</strong> adicionado!`, 'success');
  });

  document.getElementById('add-player-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('player-name-input');
    const roleSelect = document.getElementById('player-role-select');
    const skillSelect = document.getElementById('player-skill-select');

    const rawInput = nameInput.value.trim();
    if (!rawInput) return;

    // Even in the quick-add input, support inline commands like "Lucas 5* L" if typed!
    const parsedList = parsePlayersTextWithCommands(rawInput);
    const parsedOne = parsedList[0];
    const finalName = parsedOne ? parsedOne.name : rawInput;
    const finalRole = parsedOne && parsedOne.hadExplicitCommand ? parsedOne.role : roleSelect.value;
    const finalSkill = parsedOne && parsedOne.hadExplicitCommand ? parsedOne.skill : Number(skillSelect.value);

    const masterObj = upsertMasterPlayer(finalName, finalRole, finalSkill);

    const existingInPool = state.playerPool.find(
      (p) => normalizePlayerKey(p.name) === normalizePlayerKey(finalName)
    );
    if (existingInPool) {
      existingInPool.role = finalRole;
      existingInPool.skill = finalSkill;
      if (masterObj) existingInPool.masterId = masterObj.id;
    } else {
      state.playerPool.push({
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        masterId: masterObj ? masterObj.id : undefined,
        name: finalName,
        role: finalRole,
        skill: finalSkill
      });
    }

    nameInput.value = '';
    nameInput.focus();
    saveState();
    renderAll();
  });

  document.querySelectorAll('input[name="drawMode"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      document
        .getElementById('label-mode-balanced')
        .classList.toggle('active', radio.value === 'balanced' && radio.checked);
      document
        .getElementById('label-mode-random')
        .classList.toggle('active', radio.value === 'random' && radio.checked);
    });
  });

  document.getElementById('btn-run-team-draw').addEventListener('click', executeTeamDraw);

  document.getElementById('btn-goto-elenco-tab')?.addEventListener('click', () => {
    state.activeTab = 'elenco';
    saveState();
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('btn-paste-whatsapp-list')?.addEventListener('click', () => {
    document.getElementById('whatsapp-paste-textarea').value = '';
    document.getElementById('modal-paste-players').classList.remove('hidden');
  });

  document.getElementById('btn-elenco-open-import')?.addEventListener('click', () => {
    document.getElementById('whatsapp-paste-textarea').value = '';
    document.getElementById('modal-paste-players').classList.remove('hidden');
  });

  document.getElementById('btn-confirm-paste-players').addEventListener('click', () => {
    const raw = document.getElementById('whatsapp-paste-textarea').value;
    const parsedItems = parsePlayersTextWithCommands(raw);

    if (parsedItems.length === 0) {
      showToast('⚠️ Nenhum nome encontrado na lista.', 'warn');
      return;
    }

    let commandsCount = 0;
    let matchedCount = 0;

    parsedItems.forEach((item, idx) => {
      if (item.hadExplicitCommand) commandsCount++;
      else if (item.matchedFromMaster) matchedCount++;

      const masterObj = upsertMasterPlayer(item.name, item.role, item.skill);

      const existingPool = state.playerPool.find(
        (p) => normalizePlayerKey(p.name) === normalizePlayerKey(item.name)
      );
      if (existingPool) {
        existingPool.name = masterObj ? masterObj.name : item.name;
        existingPool.role = item.role;
        existingPool.skill = item.skill;
        if (masterObj) existingPool.masterId = masterObj.id;
      } else {
        state.playerPool.push({
          id: `p_${Date.now()}_${idx}`,
          masterId: masterObj ? masterObj.id : undefined,
          name: masterObj ? masterObj.name : item.name,
          role: item.role,
          skill: item.skill
        });
      }
    });

    document.getElementById('modal-paste-players').classList.add('hidden');
    playSound('victory');
    saveState();
    renderAll();

    const extraInfo =
      commandsCount > 0
        ? ` (${commandsCount} com comandos de estrelas/posição lidos na hora!)`
        : matchedCount > 0
        ? ` (${matchedCount} puxaram as estrelas salvas do Elenco Fixo!)`
        : '';
    showToast(
      `✅ <strong>${parsedItems.length} jogadores</strong> importados e salvos no Elenco Fixo${extraInfo}`,
      'success'
    );
  });

  // Elenco Fixo Tab Controls
  document.getElementById('elenco-new-stars-picker')?.querySelectorAll('.star-click-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      elencoNewStars = Number(btn.dataset.starVal || 4);
      playSound('point');
      renderElencoTab();
    });
  });

  document.getElementById('elenco-new-role-picker')?.querySelectorAll('.role-pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      elencoNewRole = btn.dataset.roleVal || 'Geral';
      playSound('point');
      renderElencoTab();
    });
  });

  function addNewPlayerFromElencoBar() {
    const input = document.getElementById('elenco-new-name');
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) {
      showToast('⚠️ Digite o nome do jogador para salvar no Elenco Fixo!', 'warn');
      input.focus();
      return;
    }

    // Also allow inline command in the Elenco add input if user types "Pedro 5* L"
    const parsed = parsePlayersTextWithCommands(raw)[0];
    const nameToSave = parsed ? parsed.name : raw;
    const roleToSave = parsed && parsed.hadExplicitCommand ? parsed.role : elencoNewRole;
    const starsToSave = parsed && parsed.hadExplicitCommand ? parsed.skill : elencoNewStars;

    const masterObj = upsertMasterPlayer(nameToSave, roleToSave, starsToSave);
    if (masterObj && !isMasterPlayerInPoolToday(masterObj)) {
      state.playerPool.push({
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        masterId: masterObj.id,
        name: masterObj.name,
        role: masterObj.role,
        skill: masterObj.skill
      });
    } else if (masterObj) {
      syncMasterPlayerChangesToPoolAndTeams(masterObj);
    }

    input.value = '';
    input.focus();
    playSound('point');
    saveState();
    renderAll();
    showToast(
      `⭐ <strong>${escapeHtml(nameToSave)}</strong> (${starsToSave}★ • ${roleToSave}) salvo no Elenco e escalado para hoje!`,
      'success'
    );
  }

  document.getElementById('btn-elenco-add-player')?.addEventListener('click', addNewPlayerFromElencoBar);
  document.getElementById('elenco-new-name')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewPlayerFromElencoBar();
    }
  });

  document.getElementById('elenco-star-filters')?.querySelectorAll('.filter-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      elencoFilterStar = btn.dataset.starFilter || 'all';
      renderElencoTab();
    });
  });

  document.getElementById('elenco-search-input')?.addEventListener('input', (e) => {
    elencoSearchQuery = e.target.value || '';
    renderElencoTab();
  });

  document.getElementById('btn-elenco-select-all-today')?.addEventListener('click', () => {
    if (!Array.isArray(state.masterRoster) || state.masterRoster.length === 0) {
      showToast('⚠️ Nenhum jogador no Elenco Fixo ainda.', 'warn');
      return;
    }
    const allPresent = state.masterRoster.every((mp) => isMasterPlayerInPoolToday(mp));
    if (allPresent) {
      state.playerPool = [];
      playSound('undo');
      showToast('🧹 Seleção de presença de hoje desmarcada.', 'info');
    } else {
      state.masterRoster.forEach((mp) => {
        if (!isMasterPlayerInPoolToday(mp)) {
          state.playerPool.push({
            id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            masterId: mp.id,
            name: mp.name,
            role: mp.role || 'Geral',
            skill: Number(mp.skill) || 3
          });
        }
      });
      playSound('victory');
      showToast(`✅ Todos os <strong>${state.masterRoster.length} jogadores</strong> do Elenco foram escalados para hoje!`, 'success');
    }
    saveState();
    renderAll();
  });

  document.getElementById('btn-elenco-goto-sorteio')?.addEventListener('click', () => {
    state.activeTab = 'times';
    saveState();
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('btn-load-demo-12')?.addEventListener('click', () => {
    const demoPlayers = [
      { name: 'Lucas', role: 'Levantador', skill: 5 },
      { name: 'Gabriel', role: 'Levantador', skill: 4 },
      { name: 'Mariana', role: 'Levantador', skill: 4 },
      { name: 'Pedro', role: 'Levantador', skill: 4 },
      { name: 'Rafael', role: 'Atacante', skill: 5 },
      { name: 'Bruno', role: 'Atacante', skill: 5 },
      { name: 'Thiago', role: 'Atacante', skill: 4 },
      { name: 'Diego', role: 'Atacante', skill: 4 },
      { name: 'Amanda', role: 'Bloqueador', skill: 4 },
      { name: 'Camila', role: 'Bloqueador', skill: 4 },
      { name: 'Juliana', role: 'Defensor', skill: 4 },
      { name: 'Matheus', role: 'Geral', skill: 3 }
    ];

    state.playerPool = demoPlayers.map((p, i) => {
      const mp = upsertMasterPlayer(p.name, p.role, p.skill);
      return {
        id: `demo_${Date.now()}_${i}`,
        masterId: mp ? mp.id : undefined,
        ...p
      };
    });
    saveState();
    renderAll();
    showToast(
      '⚡ 12 jogadores carregados (Dá 4 Trios de 3 ou 3 Quartetos de 4)! Clique em "SORTEAR E MONTAR TIMES".',
      'info'
    );
  });

  document.getElementById('btn-clear-pool')?.addEventListener('click', () => {
    state.playerPool = [];
    saveState();
    renderAll();
    showToast('🗑️ Lista de sorteio de hoje limpa (seu Elenco Fixo continua salvo!).', 'info');
  });

  document.getElementById('btn-share-teams-whatsapp').addEventListener('click', () => {
    let text = `🏐 *ESCALAÇÃO DOS TIMES — ${state.tournamentName}*\n`;
    if (state.lastDrawStamp) text += `_${state.lastDrawStamp}_\n`;
    text += `\n`;
    state.teams.forEach((t) => {
      const names = t.players.map((p) => p.name).join(', ') || 'A definir';
      text += `🛡️ *${t.name}* (${t.players.length}): ${names}\n`;
    });
    copyTextToClipboard(text, '📲 Escalação dos times copiada para o WhatsApp!');
  });

  document.getElementById('btn-open-teams-image-left')?.addEventListener('click', openTeamsImageModal);
  document.getElementById('btn-open-teams-image-top')?.addEventListener('click', openTeamsImageModal);
  document.getElementById('btn-share-image-native')?.addEventListener('click', shareTeamsImageNative);
  document.getElementById('btn-copy-image-clipboard')?.addEventListener('click', copyTeamsImageToClipboard);
  document.getElementById('btn-download-teams-image')?.addEventListener('click', downloadTeamsImagePng);
  document.getElementById('btn-share-teams-text-modal')?.addEventListener('click', () => {
    copyTextToClipboard(getTeamsShareCaptionText(), '📝 Texto da escalação copiado para o WhatsApp!');
  });

  document.getElementById('scoring-mode-select').addEventListener('change', (e) => {
    state.scoringMode = e.target.value;
    saveState();
    renderStandingsTab();
  });

  document.getElementById('btn-copy-standings-wa').addEventListener('click', () => {
    copyTextToClipboard(generateWhatsAppSummary(), '📲 Resumo do dia copiado para o WhatsApp!');
  });

  document.getElementById('btn-export-csv').addEventListener('click', exportTournamentCSV);

  document.getElementById('btn-print-summary').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('input-tournament-name').addEventListener('input', (e) => {
    state.tournamentName = e.target.value.trim() || 'VÔLEI INTERNO';
    saveState();
    renderHeaderAndNav();
  });

  document.getElementById('btn-export-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-volei-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Backup completo salvo!', 'success');
  });

  document.getElementById('input-import-json').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (imported && Array.isArray(imported.matches) && Array.isArray(imported.teams)) {
          state = imported;
          saveState();
          renderAll();
          document.getElementById('modal-settings').classList.add('hidden');
          showToast('✅ Backup restaurado com sucesso!', 'success');
        }
      } catch (_) {
        showToast('⚠️ Arquivo de backup inválido.', 'warn');
      }
    };
    reader.readAsText(file);
  });

  // ==========================================
  // RESET DE TODOS OS JOGOS PROTEGIDO POR SENHA (2026)
  // ==========================================
  const RESET_SECURITY_PIN = '2026';

  function syncResetModeRadioUI(selectedMode) {
    const radios = document.querySelectorAll('input[name="resetPinMode"]');
    radios.forEach((r) => {
      r.checked = r.value === selectedMode;
    });
    document.getElementById('label-reset-scores-only')?.classList.toggle('active', selectedMode === 'scores_only');
    document.getElementById('label-reset-factory')?.classList.toggle('active', selectedMode === 'factory');
  }

  window.openResetGamesPinModal = function (mode = 'scores_only') {
    const resolvedMode = mode === 'factory' ? 'factory' : 'scores_only';
    syncResetModeRadioUI(resolvedMode);

    const pinInput = document.getElementById('input-reset-pin');
    const pinError = document.getElementById('reset-pin-error');
    if (pinInput) {
      pinInput.value = '';
      pinInput.classList.remove('pin-shake');
    }
    if (pinError) {
      pinError.classList.add('hidden');
    }

    document.getElementById('modal-reset-pin')?.classList.remove('hidden');
    setTimeout(() => {
      pinInput?.focus();
    }, 80);
  };

  function executeProtectedReset() {
    const pinInput = document.getElementById('input-reset-pin');
    const pinError = document.getElementById('reset-pin-error');
    const enteredPin = (pinInput?.value || '').trim();

    if (enteredPin !== RESET_SECURITY_PIN) {
      playSound('undo');
      triggerHaptic([60, 40, 80]);
      if (pinError) pinError.classList.remove('hidden');
      if (pinInput) {
        pinInput.classList.remove('pin-shake');
        void pinInput.offsetWidth;
        pinInput.classList.add('pin-shake');
        pinInput.select();
      }
      showToast('🔒 Senha incorreta! Digite a senha correta para zerar os jogos.', 'warn');
      return;
    }

    const selectedRadio = document.querySelector('input[name="resetPinMode"]:checked');
    const resetMode = selectedRadio ? selectedRadio.value : 'scores_only';

    // Para o cronômetro se estiver rodando
    if (timerRunning) {
      timerRunning = false;
      clearInterval(timerInterval);
      const toggleBtn = document.getElementById('btn-timer-toggle');
      if (toggleBtn) toggleBtn.textContent = '▶️';
    }
    timerSeconds = 0;
    updateTimerDisplay();

    // Sai do modo tela fixa caso esteja ativo
    if (typeof courtFocusMode !== 'undefined' && courtFocusMode) {
      if (typeof exitCourtFocusMode === 'function') {
        exitCourtFocusMode();
      }
    }

    if (resetMode === 'factory') {
      const preservedName = state.tournamentName || 'VÔLEI INTERNO';
      const preservedDate = state.tournamentDate || (typeof getTodayDateIso === 'function' ? getTodayDateIso() : getTodayISO());
      state = createDefaultState(preservedName, preservedDate);
      state.sessionSetupConfirmed = true;
      showToast('✅ Senha confirmada! Tudo foi reiniciado do zero no Jogo #1!', 'success');
    } else {
      state.matches = createMiniTorneioBlock(1, 1, state.teams);
      state.liveMatchId = 1;
      state.courtStreakCount = 0;
      state.courtStreakTeamId = null;
      syncWaitingQueueWithCurrentMatch();
      showToast('✅ Senha confirmada! Todos os jogos foram zerados e recomeçaram do Jogo #1!', 'success');
    }

    playSound('whistle_short');
    saveState();
    renderAll();
    document.getElementById('modal-reset-pin')?.classList.add('hidden');
    document.getElementById('modal-settings')?.classList.add('hidden');
  }

  document.querySelectorAll('input[name="resetPinMode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      syncResetModeRadioUI(e.target.value);
    });
  });

  document.getElementById('btn-confirm-reset-pin')?.addEventListener('click', executeProtectedReset);

  document.getElementById('input-reset-pin')?.addEventListener('keydown', (e) => {
    document.getElementById('reset-pin-error')?.classList.add('hidden');
    if (e.key === 'Enter') {
      e.preventDefault();
      executeProtectedReset();
    }
  });

  document.getElementById('btn-confirm-delete-pin')?.addEventListener('click', executeProtectedDelete);

  document.getElementById('input-delete-pin')?.addEventListener('keydown', (e) => {
    document.getElementById('delete-pin-error')?.classList.add('hidden');
    if (e.key === 'Enter') {
      e.preventDefault();
      executeProtectedDelete();
    }
  });

  document.getElementById('btn-reset-scores-only')?.addEventListener('click', () => {
    window.openResetGamesPinModal('scores_only');
  });

  document.getElementById('btn-reset-all-factory')?.addEventListener('click', () => {
    window.openResetGamesPinModal('factory');
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.closeModal;
      if (targetId === 'modal-sessions') {
        state.sessionSetupConfirmed = true;
        saveState(false);
      }
      document.getElementById(targetId)?.classList.add('hidden');
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        if (backdrop.id === 'modal-sessions') {
          state.sessionSetupConfirmed = true;
          saveState(false);
        }
        backdrop.classList.add('hidden');
      }
    });
  });

  document.getElementById('btn-lobby-theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    const isLight = state.theme === 'light';
    const lobbyIcon = document.getElementById('lobby-theme-icon');
    if (lobbyIcon) lobbyIcon.innerHTML = isLight ? UI_SVGS.moon : UI_SVGS.sun;
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.innerHTML = isLight ? UI_SVGS.moon : UI_SVGS.sun;
    saveState(false);
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sala')) {
    const salaCode = urlParams.get('sala').trim().toUpperCase();
    state.roomCode = salaCode;
    state.sessionSetupConfirmed = true;
    saveState(false);
    showTournamentScreen();
    initPahoMqtt(salaCode, true);
  } else if (urlParams.get('jogar') === '1' || urlParams.get('quadra') === '1') {
    showTournamentScreen();
    initPahoMqtt(state.roomCode || 'VOLEI1');
  } else {
    // SEMPRE ABRIR NA PÁGINA PRINCIPAL (LOBBY) QUANDO O USUÁRIO CLICAR NO LINK!
    showLobbyScreen();
  }
});
