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

function createDefaultState() {
  const teams = createDefaultTeams(4);
  return {
    tournamentName: 'VÔLEI INTERNO',
    roomCode: 'VOLEI1',
    soundEnabled: true,
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
    playerPool: [],
    matches: createMiniTorneioBlock(1, 1, teams),
    liveMatchId: 1
  };
}

let state = loadState();
let quickScoreMatchId = null;
let deferredPwaPrompt = null;
let syncPushTimeout = null;
let ntfyEventSource = null;
let localPollInterval = null;
const customAudioMap = {}; // Custom ElevenLabs MP3 object URLs by slot
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
          const merged = { ...def, ...decoded };
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
    if (urlRoom) finalState.roomCode = urlRoom.toUpperCase();
    return finalState;
  } catch (e) {
    return createDefaultState();
  }
}

function saveState(shouldBroadcast = true) {
  try {
    state.lastSavedAt = new Date().toLocaleTimeString('pt-BR');
    state.updatedAtMs = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateSyncStatusUI();

    if (shouldBroadcast) {
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: 'STATE_UPDATE', state });
        } catch (_) {}
      }
      scheduleCloudAndLocalRoomPush();
    }
  } catch (_) {}
}

function updateSyncStatusUI() {
  const code = (state.roomCode || 'VOLEI1').toUpperCase();
  const labelEl = document.getElementById('room-sync-label');
  if (labelEl) {
    labelEl.textContent = `Salvo Auto (${state.lastSavedAt || 'agora'}) • #${code}`;
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
   MULTI-PHONE REAL-TIME ROOM SYNC ENGINE
   ========================================== */
function getCleanRoomTopic(roomCode) {
  const clean = String(roomCode || 'VOLEI1')
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '');
  return `volei_pro_arena_sync_${clean || 'VOLEI1'}`;
}

function buildCompactSyncPayload() {
  return {
    senderTabTime: state.updatedAtMs,
    tournamentName: state.tournamentName,
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
  }, 350);
}

async function pushRoomStateNow(showFeedback = false) {
  const code = (state.roomCode || 'VOLEI1').toUpperCase();
  const payload = buildCompactSyncPayload();

  // 1. Push to local Node server (/api/room/:code) if available
  fetch(`/api/room/${encodeURIComponent(code)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: payload })
  }).catch(() => {});

  // 2. Push to public real-time relay (ntfy.sh) so phones on 4G/5G or GitHub Pages also sync live
  const topic = getCleanRoomTopic(code);
  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (showFeedback) {
      showToast(`📡 Placar publicado ao vivo na Sala <strong>#${escapeHtml(code)}</strong>!`, 'success');
    }
  } catch (_) {
    if (showFeedback) {
      showToast(`💾 Placar salvo na Sala Local <strong>#${escapeHtml(code)}</strong>!`, 'info');
    }
  }
}

async function pullRoomStateOnce(roomCode, showFeedback = true) {
  const code = String(roomCode || state.roomCode || 'VOLEI1').trim().toUpperCase();
  state.roomCode = code;
  let found = false;

  // 1. Try local server first
  try {
    const res = await fetch(`/api/room/${encodeURIComponent(code)}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.payload && json.payload.state) {
        const inc = json.payload.state;
        inc.senderTabTime = Date.now() + 10;
        applyIncomingRoomState(inc);
        found = true;
      }
    }
  } catch (_) {}

  // 2. Try public cloud relay (ntfy.sh cached messages)
  if (!found) {
    try {
      const topic = getCleanRoomTopic(code);
      const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1&since=12h`, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        if (lines.length > 0) {
          const lastEvent = JSON.parse(lines[lines.length - 1]);
          if (lastEvent && lastEvent.message) {
            const parsedState = JSON.parse(lastEvent.message);
            parsedState.senderTabTime = Date.now() + 10;
            applyIncomingRoomState(parsedState);
            found = true;
          }
        }
      }
    } catch (_) {}
  }

  subscribeToRoomRealtimeStream(code);
  saveState(false);
  renderAll();

  if (showFeedback) {
    if (found) {
      showToast(`✅ Conectado à Sala <strong>#${escapeHtml(code)}</strong>! Placar atualizado na hora.`, 'success');
    } else {
      showToast(`📡 Sala <strong>#${escapeHtml(code)}</strong> criada! Publicando seu placar atual...`, 'info');
      pushRoomStateNow(false);
    }
  }
}

function subscribeToRoomRealtimeStream(roomCode) {
  const code = String(roomCode || state.roomCode || 'VOLEI1').trim().toUpperCase();
  const topic = getCleanRoomTopic(code);

  if (ntfyEventSource) {
    try {
      ntfyEventSource.close();
    } catch (_) {}
  }

  if (typeof EventSource !== 'undefined') {
    try {
      ntfyEventSource = new EventSource(`https://ntfy.sh/${topic}/sse`);
      ntfyEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const incoming = JSON.parse(data.message);
            applyIncomingRoomState(incoming);
          }
        } catch (_) {}
      };
    } catch (_) {}
  }

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
  }, 2500);
}

/* ==========================================
   VOICE NARRATOR (PT-BR) & ELEVENLABS STUDIO
   ========================================== */
function playCustomAudioOrSpeak(slotKey, fallbackText) {
  if (customAudioMap[slotKey]) {
    try {
      const audio = new Audio(customAudioMap[slotKey]);
      audio.play().catch(() => {});
      return;
    } catch (_) {}
  }
  speakNarration(fallbackText);
}

function speakNarration(text) {
  if (!state.voiceEnabled || !text) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 1.12;
    utter.pitch = 1.05;
    utter.volume = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const ptVoice =
      voices.find((v) => v.lang && v.lang.toLowerCase().includes('pt-br') && v.name.toLowerCase().includes('google')) ||
      voices.find((v) => v.lang && v.lang.toLowerCase().includes('pt-br')) ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('pt'));

    if (ptVoice) utter.voice = ptVoice;
    window.speechSynthesis.speak(utter);
  } catch (_) {}
}

function buildElevenLabsScript() {
  const t1 = (state.teams[0]?.name || 'Time 1').toUpperCase();
  const t2 = (state.teams[1]?.name || 'Time 2').toUpperCase();
  const t3 = (state.teams[2]?.name || 'Time 3').toUpperCase();
  const t4 = (state.teams[3]?.name || 'Time 4').toUpperCase();

  return [
    `PONTO... para o ${t1}!`,
    `PONTO... para o ${t2}!`,
    `PONTO... para o ${t3}!`,
    `PONTO... para o ${t4}!`,
    ``,
    `É MATCH POINT — para o ${t1}!`,
    `É MATCH POINT — para o ${t2}!`,
    `É MATCH POINT — para o ${t3}!`,
    `É MATCH POINT — para o ${t4}!`,
    ``,
    `FIM DE JOGO! ... ${t1} — GANHOU a partida!`,
    `FIM DE JOGO! ... ${t2} — GANHOU a partida!`,
    `FIM DE JOGO! ... ${t3} — GANHOU a partida!`,
    `FIM DE JOGO! ... ${t4} — GANHOU a partida!`
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
   LIVE SCOREBOARD ACTIONS
   ========================================== */
function addPointToSide(sideKey) {
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
    playCustomAudioOrSpeak(
      'matchpoint',
      `Ponto para ${scoringTeamObj.name}. Match point para ${mpTeam.name}.`
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

  playCustomAudioOrSpeak(
    'victory',
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
  renderStandingsTab();
}

function renderHeaderAndNav() {
  const doneCount = state.matches.filter((m) => m.status === 'done').length;
  const currentMatch = getCurrentLiveMatch();

  document.getElementById('tournament-title-display').textContent = state.tournamentName;
  document.getElementById('header-teams-badge').textContent = `${state.teams.length} TIMES`;
  document.getElementById('header-games-count').textContent = `${doneCount} ${
    doneCount === 1 ? 'concluído' : 'concluídos'
  }`;

  document.getElementById('nav-jogos-badge').textContent = `Jogo #${currentMatch ? currentMatch.id : 1}`;
  document.getElementById('nav-times-badge').textContent = `${state.teams.length} Equipes`;

  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn && soundIcon) {
    soundBtn.classList.toggle('active', state.soundEnabled);
    soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
  }

  const voiceBtn = document.getElementById('btn-voice-toggle');
  const voiceIcon = document.getElementById('voice-icon');
  if (voiceBtn && voiceIcon) {
    voiceBtn.classList.toggle('active', state.voiceEnabled !== false);
    voiceIcon.textContent = state.voiceEnabled !== false ? '🎙️' : '🙊';
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
    deuceBtn.textContent = state.winByTwo ? '✅ Vai a 2' : '⚡ Ponto Direto';
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

  // Populate inline team switchers on scoreboard
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

    alertBar.className = 'match-alert-bar victory';
    if (nextPending) {
      const nA = getTeamById(nextPending.teamAId);
      const nB = getTeamById(nextPending.teamBId);
      alertText.innerHTML = `🏆 <strong>${escapeHtml(winnerTeam.name)}</strong> venceu (${match.scoreA}×${
        match.scoreB
      })! Próximo Jogo #${nextPending.id}: <strong>${escapeHtml(nA.name)} × ${escapeHtml(nB.name)}</strong>`;
      alertActions.innerHTML = `
        <button type="button" class="btn-primary" onclick="startMatchById(${nextPending.id})">
          ▶️ Iniciar Jogo #${nextPending.id} Agora
        </button>
      `;
    } else {
      alertText.innerHTML = `🏆 <strong>${escapeHtml(winnerTeam.name)}</strong> venceu por <strong>${
        match.scoreA
      } × ${match.scoreB}</strong>!`;
      alertActions.innerHTML = `
        <button type="button" class="btn-primary" onclick="createAndStartNextMatchManual()">
          ➕ Criar Próximo Jogo
        </button>
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
            ⚡ Placar
          </button>
          <button type="button" class="mini-action-btn" onclick="openQuickScoreModal(${m.id})">
            ✏️ Editar
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
      <div class="glass-card" style="padding:16px;margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.16);flex-wrap:wrap;gap:6px;">
          <strong style="font-size:0.95rem;color:#38bdf8;letter-spacing:0.05em;">🏆 ${miniIdx}º MINI TORNEIO</strong>
          <span style="font-size:0.75rem;color:var(--text-secondary);">J3: vencedores dos dois primeiros jogos | J4: perdedores dos dois primeiros jogos</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:10px;">
          ${games.map((m) => buildMatchRowHtml(m)).join('')}
        </div>
      </div>
    `);
  }

  container.innerHTML = htmlBlocks.join('');
}

/* ==========================================
   TAB 3: TEAMS & FLEXIBLE DRAW (3 OR 4)
   ========================================== */
function renderTeamsAndDrawTab() {
  // Format pills
  document.querySelectorAll('.format-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.drawFormat === state.drawFormat);
  });

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
    mathHint.textContent = 'Adicione a galera presente ou cole do WhatsApp';
  }

  if (nPlayers === 0) {
    poolList.innerHTML = `
      <div class="empty-state-mini" style="grid-column: 1 / -1;">
        Adicione os jogadores acima, cole a lista do WhatsApp ou clique em <strong>"Exemplo 12 Jogadores"</strong> para testar!
      </div>
    `;
  } else {
    poolList.innerHTML = state.playerPool
      .map(
        (p) => `
        <div class="pool-player-chip">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <img src="${getRoleSvg(p.role)}" alt="" width="20" height="20" class="mono-svg-accent" style="flex-shrink:0;" />
            <div class="pool-player-info">
              <span class="pool-player-name">${escapeHtml(p.name)}</span>
              <span class="pool-player-meta">${p.role} • ${'⭐'.repeat(p.skill)}</span>
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

  const teamsGrid = document.getElementById('four-teams-grid');
  teamsGrid.innerHTML = state.teams
    .map((team, idx) => {
      const avgSkill =
        team.players.length > 0
          ? (team.players.reduce((acc, p) => acc + (Number(p.skill) || 3), 0) / team.players.length).toFixed(1)
          : null;
      const currentSvgMeta = getSvgMeta(team.icon);

      return `
        <div class="team-config-card" style="background: linear-gradient(160deg, ${team.color}26 0%, rgba(15, 23, 42, 0.88) 68%);">
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
                ? `<button type="button" class="team-delete-btn" onclick="deleteTeam('${team.id}')" title="Remover este time">🗑️</button>`
                : ''
            }
          </div>

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

          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:var(--text-secondary);">
            <span><strong>${team.players.length}</strong> jogadores (${team.players.length === 3 ? 'Trio' : team.players.length === 4 ? 'Quarteto' : 'Equipe'})</span>
            ${avgSkill ? `<span>Média: ⭐ ${avgSkill}</span>` : '<span>Escalação aberta</span>'}
          </div>

          <div class="team-roster-box">
            ${
              team.players.length === 0
                ? `<div class="empty-state-mini" style="padding:12px;">Sem jogadores. Use o sorteador ao lado ou adicione abaixo.</div>`
                : team.players
                    .map(
                      (p, pIdx) => `
                    <div class="roster-member-item">
                      <span style="display:flex;align-items:center;gap:6px;">
                        <img src="${getRoleSvg(p.role)}" alt="" width="15" height="15" class="mono-svg-accent" />
                        <span><strong>${pIdx + 1}.</strong> ${escapeHtml(p.name)} <small style="color:var(--text-secondary)">(${p.role || 'Geral'})</small></span>
                      </span>
                      <button type="button" class="pool-remove-btn" onclick="removePlayerFromTeam('${team.id}', ${pIdx})" title="Remover do time">✕</button>
                    </div>
                  `
                    )
                    .join('')
            }
          </div>

          <div class="team-quick-add-row">
            <input
              type="text"
              id="quick-player-${team.id}"
              class="team-quick-add-input"
              placeholder="Adicionar jogador neste time..."
              onkeydown="if(event.key==='Enter'){event.preventDefault();addDirectPlayerToTeam('${team.id}');}"
            />
            <button type="button" class="mini-action-btn" onclick="addDirectPlayerToTeam('${team.id}')">+ Add</button>
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
  showToast(
    `🎲 <strong>${targetTeamCount} Times sorteados com sucesso!</strong> Pronto para jogar.`,
    'success'
  );
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
        <div class="podium-card rank-${idx + 1}" style="background: linear-gradient(160deg, ${r.color}28 0%, rgba(15, 23, 42, 0.9) 70%);">
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
  renderTeamsAndDrawTab();
};

window.removePlayerFromTeam = function (teamId, playerIdx) {
  const team = getTeamById(teamId);
  if (!team) return;
  team.players.splice(playerIdx, 1);
  saveState();
  renderAll();
};

window.addDirectPlayerToTeam = function (teamId) {
  const input = document.getElementById(`quick-player-${teamId}`);
  if (!input) return;
  const name = input.value.trim();
  if (!name) return;
  const team = getTeamById(teamId);
  if (team) {
    team.players.push({ id: `p_${Date.now()}`, name, role: 'Geral', skill: 3 });
    input.value = '';
    saveState();
    renderAll();
  }
};

/* ==========================================
   WHATSAPP SUMMARY & CSV EXPORT
   ========================================== */
function generateWhatsAppSummary() {
  const rows = computeStandings();
  const doneMatches = state.matches.filter((m) => m.status === 'done');

  let text = `🏐 *${state.tournamentName}* 🏐\n`;
  text += `_${state.teams.length} Equipes • ${doneMatches.length} Jogos realizados hoje_\n\n`;

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

  document.getElementById('btn-sound-toggle').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) playSound('point');
    saveState();
    renderHeaderAndNav();
    showToast(state.soundEnabled ? '🔊 Sons de quadra ativados' : '🔇 Sons silenciados', 'info');
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
    pullRoomStateOnce(code, true);
  });

  document.getElementById('btn-push-room-now')?.addEventListener('click', () => {
    const roomInput = document.getElementById('input-room-code');
    const code = (roomInput?.value || 'VOLEI1').trim().toUpperCase();
    state.roomCode = code;
    saveState(false);
    pushRoomStateNow(true);
    subscribeToRoomRealtimeStream(code);
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

  // Start real-time room stream on boot
  subscribeToRoomRealtimeStream(state.roomCode || 'VOLEI1');
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sala') && !urlParams.get('s')) {
    pullRoomStateOnce(urlParams.get('sala'), true);
  }

  document.getElementById('btn-whatsapp-share').addEventListener('click', () => {
    copyTextToClipboard(
      generateWhatsAppSummary(),
      '📲 Resumo do dia copiado! Agora é só colar no grupo do WhatsApp.'
    );
  });

  document.getElementById('btn-install-pwa').addEventListener('click', async () => {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      await deferredPwaPrompt.userChoice;
      deferredPwaPrompt = null;
    } else {
      document.getElementById('modal-install-help').classList.remove('hidden');
    }
  });

  document.getElementById('btn-settings-menu').addEventListener('click', () => {
    document.getElementById('input-tournament-name').value = state.tournamentName;
    document.getElementById('modal-settings').classList.remove('hidden');
  });

  document.getElementById('tournament-title-display').addEventListener('click', () => {
    document.getElementById('input-tournament-name').value = state.tournamentName;
    document.getElementById('modal-settings').classList.remove('hidden');
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
    const match = getCurrentLiveMatch();
    match.serving = state.swappedSides ? 'B' : 'A';
    saveState();
    renderLiveScoreboard();
  });

  document.getElementById('btn-serve-right').addEventListener('click', () => {
    const match = getCurrentLiveMatch();
    match.serving = state.swappedSides ? 'A' : 'B';
    saveState();
    renderLiveScoreboard();
  });

  document.getElementById('btn-undo-point').addEventListener('click', undoLastPoint);

  document.getElementById('btn-reset-live-score').addEventListener('click', () => {
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
    document.getElementById('match-timer-display').textContent = `${m}:${s}`;
  }

  document.getElementById('btn-timer-toggle').addEventListener('click', () => {
    timerRunning = !timerRunning;
    document.getElementById('btn-timer-toggle').textContent = timerRunning ? '⏸️' : '▶️';
    if (timerRunning) {
      timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
  });

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

  document.getElementById('add-player-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('player-name-input');
    const roleSelect = document.getElementById('player-role-select');
    const skillSelect = document.getElementById('player-skill-select');

    const name = nameInput.value.trim();
    if (!name) return;

    state.playerPool.push({
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      role: roleSelect.value,
      skill: Number(skillSelect.value)
    });

    nameInput.value = '';
    nameInput.focus();
    saveState();
    renderTeamsAndDrawTab();
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

  document.getElementById('btn-paste-whatsapp-list').addEventListener('click', () => {
    document.getElementById('whatsapp-paste-textarea').value = '';
    document.getElementById('modal-paste-players').classList.remove('hidden');
  });

  document.getElementById('btn-confirm-paste-players').addEventListener('click', () => {
    const raw = document.getElementById('whatsapp-paste-textarea').value;
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.replace(/^[\s\d\.\-\)\✅\☑️\🏐\*•]+/, '').trim())
      .filter((line) => line.length >= 2);

    if (lines.length === 0) {
      showToast('⚠️ Nenhum nome encontrado na lista.', 'warn');
      return;
    }

    lines.forEach((name, idx) => {
      state.playerPool.push({
        id: `p_${Date.now()}_${idx}`,
        name,
        role: 'Geral',
        skill: 3
      });
    });

    document.getElementById('modal-paste-players').classList.add('hidden');
    saveState();
    renderTeamsAndDrawTab();
    showToast(`✅ <strong>${lines.length} jogadores</strong> importados para o sorteio!`, 'success');
  });

  document.getElementById('btn-load-demo-12').addEventListener('click', () => {
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

    state.playerPool = demoPlayers.map((p, i) => ({
      id: `demo_${Date.now()}_${i}`,
      ...p
    }));
    saveState();
    renderTeamsAndDrawTab();
    showToast(
      '⚡ 12 jogadores carregados (Dá 4 Trios de 3 ou 3 Quartetos de 4)! Clique em "SORTEAR E MONTAR TIMES".',
      'info'
    );
  });

  document.getElementById('btn-clear-pool').addEventListener('click', () => {
    state.playerPool = [];
    saveState();
    renderTeamsAndDrawTab();
    showToast('🗑️ Lista de sorteio limpa.', 'info');
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

  document.getElementById('btn-reset-scores-only').addEventListener('click', () => {
    state.matches = createMiniTorneioBlock(1, 1, state.teams);
    state.liveMatchId = 1;
    state.courtStreakCount = 0;
    state.courtStreakTeamId = null;
    syncWaitingQueueWithCurrentMatch();
    saveState();
    renderAll();
    document.getElementById('modal-settings').classList.add('hidden');
    showToast('🔄 Histórico reiniciado no 1º Mini Torneio (Jogo 1, Jogo 2, Vencedores e Perdedores)!', 'info');
  });

  document.getElementById('btn-reset-all-factory').addEventListener('click', () => {
    state = createDefaultState();
    saveState();
    renderAll();
    document.getElementById('modal-settings').classList.add('hidden');
    showToast('✨ Sessão reiniciada do zero!', 'info');
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.closeModal;
      document.getElementById(targetId)?.classList.add('hidden');
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.add('hidden');
    });
  });

  renderAll();
});
