import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Dimensions, Modal, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const C = {
  bg: '#0a0a14',
  surface: '#13132b',
  card: '#1a1a35',
  cardAlt: '#12122a',
  border: '#2a2a50',
  gold: '#ffd700',
  goldDim: '#c8a800',
  text: '#f0f0ff',
  textMuted: '#7070aa',
  textDim: '#4a4a80',
  green: '#4ade80',
  blue: '#60a5fa',
  purple: '#a78bfa',
  pink: '#f472b6',
  orange: '#fb923c',
  teal: '#2dd4bf',
  red: '#f87171',
  yellow: '#facc15',
};

// ─────────────────────────────────────────────
// CURRICULUM v3.0
// ─────────────────────────────────────────────
const SEMESTERS = [
  {
    id: 1, title: 'Video Editing', emoji: '🎬', color: C.blue,
    desc: 'Edición profesional de video',
    courses: [
      'Premiere Pro - De Cero a Profesional',
      'After Effects - Motion Graphics',
      'DaVinci Resolve - Colorización',
      'Técnicas de Corte y Ritmo',
      'Audio para Video - Mezcla y Mastering',
      'Adobe After Effects (RGB Escuela)',
      'Adobe Premiere (RGB Escuela)',
      'After Effects Avanzado (RGB Escuela)',
      'Cómo usar tu Cámara (RGB Escuela)',
      'Iniciación a Adobe Premiere Pro (Paper Monster)',
      'Adobe Premiere Pro Basics (Josh Werner)',
      'Adobe After Effects Basics (Josh Werner)',
      'Adobe Audition Basics (Josh Werner)',
      'Aprende a editar videos desde 0 con MOVAVI',
      'Adobe CC Masterclass: Illustrator, Photoshop & After Effects',
      'Creación de Thumbnails para YouTube en Photoshop CC',
    ],
  },
  {
    id: 2, title: 'IA & Herramientas', emoji: '🤖', color: C.purple,
    desc: 'Inteligencia artificial aplicada',
    courses: [
      'ChatGPT - Prompt Engineering Avanzado',
      'IA para Creadores de Contenido',
      'Automatización con IA',
      'Herramientas IA para Freelancers',
      'Stable Diffusion - Guía Completa',
      'Roco Prompts (Roco de la Portilla)',
      'Nano Banana - Google AI (Roco de la Portilla)',
      'VEO 3 (Roco de la Portilla)',
      'Flux AI (Roco de la Portilla)',
      'Videos Virales con IA (Roco de la Portilla)',
      'Runway AI (Roco de la Portilla)',
      'Kling AI (Roco de la Portilla)',
      'Curso de Midjourney I.A. (Roco de la Portilla)',
      'Clon IA Euge Oller (Emprende Aprendiendo)',
      'Masterclass Domina ChatGPT (Emprende Aprendiendo)',
      'Pack GPTs - Asistentes IA personalizados (Emprende Aprendiendo)',
    ],
  },
  {
    id: 3, title: 'Social Media & Contenido', emoji: '📱', color: C.orange,
    desc: 'Estrategia y crecimiento en redes',
    courses: [
      'YouTube - Estrategia de Canal',
      'TikTok - Algoritmo y Viralización',
      'Instagram - Crecimiento Orgánico',
      'Copywriting para Redes Sociales',
      'Planificación de Contenido',
      'YouTube MASTER (Paper Monster)',
      'Marketing en Instagram para tu empresa (Udemy)',
      "Ninja's Guide to Streaming: Grow Your Channel (Udemy)",
      'Viral Thumbnail Template Pack (Ali Abdaal - Circle)',
      'VideoMarketer (Emprende Aprendiendo)',
    ],
  },
  {
    id: 4, title: 'Freelance & Negocios', emoji: '💼', color: C.green,
    desc: 'Construye tu negocio freelance',
    courses: [
      'Fiverr - Perfil y Primeros Clientes',
      'Pricing y Propuestas Profesionales',
      'Gestión de Clientes',
      'Facturación y Aspectos Legales España',
      'Escalado del Negocio Freelance',
      'Método IMPEF (Emprende Aprendiendo)',
      'SÍLEX 2.0 (Emprende Aprendiendo)',
      'Upgrade | Casos Avanzados para Emprendedores (Emprende Aprendiendo)',
      'Academy Tools (Emprende Aprendiendo)',
      'Anti Pirateo (Emprende Aprendiendo)',
      'Coach Teacher (Emprende Aprendiendo)',
      'Academy Mastery (Emprende Aprendiendo)',
      'Academy STEPS (Emprende Aprendiendo)',
      'Academy Basics (Emprende Aprendiendo)',
      'Academy Consulting (Emprende Aprendiendo)',
      'Aprende a Trabajar Online a partir de tus Talentos (Udemy)',
    ],
  },
  {
    id: 5, title: 'Ilustración & Arte Digital', emoji: '🎨', color: C.pink,
    desc: 'Dibujo, ilustración y diseño gráfico',
    courses: [
      // Paper Monster
      'Aprende a dibujar desde cero (Paper Monster)',
      'Iniciación a la anatomía (Paper Monster)',
      'Anatomía. Los puntos subcutáneos (Paper Monster)',
      'Anatomía. El esqueleto humano (Paper Monster)',
      'Técnicas de lápiz para dibujo realista (Paper Monster)',
      'Curso completo de Retrato a Lápiz (Paper Monster)',
      'Retrato Realista en Digital (Paper Monster)',
      'Aprende a Dibujar Retratos estilo Cartoon (Paper Monster)',
      'Domina el Color (Paper Monster)',
      'Domina la Luz (Paper Monster)',
      'Domina las Texturas y los Materiales (Paper Monster)',
      'Master Class de Texturas por Jako Del Bueno (Paper Monster)',
      'Master Class de Pelo por Arganza (Paper Monster)',
      'Ilustración con carboncillo (Paper Monster)',
      'Master Class de Dibujo con MANCHA carboncillo (Paper Monster)',
      'Ilustración con Carles Dalmau (Paper Monster)',
      'Ilustración Profesional con Procreate por Ricardo Arganza (Paper Monster)',
      'Iniciación a la caricatura (Paper Monster)',
      'Crea tu personaje original con Raquel Arellano (Paper Monster)',
      'Diseño de personajes para videojuegos (Paper Monster)',
      'Creación de cómic con Tony Ventura (Paper Monster)',
      'Cómo dibujar heridas y tatuajes (Paper Monster)',
      'Introducción al paisaje urbano en acuarela (Paper Monster)',
      'Dibuja Mejor en sólo 21 Días (Paper Monster)',
      'Introducción a Adobe Illustrator (Paper Monster)',
      'Aprende Photoshop desde cero para ilustradores (Paper Monster)',
      // Udemy
      'Aprende Dibujo Artístico fácilmente (Udemy)',
      'Aprende a Dibujar Cartoon desde Cero (Udemy)',
      'Curso de Dibujo de Anime Vol. 1 Creación de Personajes (Udemy)',
      'Inkscape fácil - Edición de gráficos vectoriales (Udemy)',
      'Aprende y domina GIMP 2.10 Curso completo (Udemy)',
      'Photoshop Essentials: From Photos to Art (Udemy)',
      'Adobe Photoshop Art & Illustration Presets (Josh Werner)',
      // Roco de la Portilla
      'Masterclass Diseñar Banners (Roco de la Portilla)',
      'Hacks de Photoshop Temporada 1 (Roco de la Portilla)',
      'Hacks de Photoshop Temporada 2 (Roco de la Portilla)',
      'Curso de Photoshop (Roco de la Portilla)',
      // Emprende Aprendiendo
      'Designio | Diseño para Emprendedores (Emprende Aprendiendo)',
    ],
  },
  {
    id: 6, title: 'Producción Audiovisual', emoji: '🎭', color: C.teal,
    desc: 'Animación, 3D y producción avanzada',
    courses: [
      'Doblaje de voz para animación - Isabel Martiñón (Domestika)',
      'Blender Core (Auraprods)',
      'Create Your Own Character in Blender (Udemy)',
      'Animate on iPad: FlipaClip Beginner Course (Udemy)',
      'Simple and Advanced Topics of Animating 2D Characters (Udemy)',
      'Diseño de una motocicleta de ciencia ficción con Blender (Udemy)',
      'Blender Beginners Guide to 3D Modelling Game Asset Pipeline (Udemy)',
      'Master 3D para videojuegos Vol. 1 - Interfaz (Udemy)',
    ],
  },
  {
    id: 7, title: 'Programación & Dev', emoji: '💻', color: C.blue,
    desc: 'Desarrollo de software y web',
    courses: [
      'Aprende Programación en C++ Básico Intermedio Avanzado (Udemy)',
      'C++ Working with Files - fstream I/O library (Udemy)',
      'Programming with Python All in One (Udemy)',
      'Introducción a Git & GitHub (Udemy)',
      'GitHub Basics (Josh Werner)',
      'Fundamentos de Programación con Java (Udemy)',
      'Programación de juegos Web 2D en JavaScript HTML5 con Phaser (Udemy)',
      'Programación de videojuegos con pygame (Udemy)',
      'Fundamentos de Programación Web para Principiantes (Udemy)',
      'Aprende Programación para Principiantes en PHP (Udemy)',
    ],
  },
  {
    id: 8, title: 'Desarrollo de Videojuegos', emoji: '🎮', color: C.purple,
    desc: 'Crea tus propios videojuegos',
    courses: [
      'Creación de Videojuegos en Unreal Engine para principiantes (Udemy)',
      'Unity Third Person Shooter (Udemy)',
      'Crea tu terreno con un Heightmap en Unity 3D (Udemy)',
      'Introducción al Desarrollo de Videojuegos con Unity 3D (Udemy)',
      'Desarrollo de videojuegos con GM:S (Udemy)',
    ],
  },
  {
    id: 9, title: 'Mentalidad & Crecimiento', emoji: '🧠', color: C.orange,
    desc: 'Mentalidad emprendedora y desarrollo personal',
    courses: [
      'Rompiendo paradigmas: Creer, Crear, Crecer (Udemy)',
      'Consigue lo que quieres en 7 pasos (Udemy)',
      'Curso de Novela: Planifica, Escribe y Publica tu Historia (Udemy)',
      'Sesgado | Trucos Psicológicos para Aumentar tus Ventas (Emprende Aprendiendo)',
      'Mastermind 12/03/2023 (Emprende Aprendiendo)',
      'Audios de Mentalidad de Emprendedor (Emprende Aprendiendo)',
      'Flash Libros 2.0 (Emprende Aprendiendo)',
      'Leader Summaries (Emprende Aprendiendo)',
    ],
  },
  {
    id: 10, title: 'Crypto & Finanzas', emoji: '💰', color: C.yellow,
    desc: 'Inversión y criptomonedas',
    courses: [
      'Cómo ganar criptomonedas sin invertir dinero - Nicolás Bonini (Udemy)',
    ],
  },
  {
    id: 11, title: 'Inglés', emoji: '🇬🇧', color: C.blue,
    desc: 'Aprende inglés paso a paso',
    courses: [
      'Clases Básico English Version (Udemy)',
    ],
  },
];

const CHALLENGES = [
  { id: 1, text: 'Completa una lección hoy', xp: 10 },
  { id: 2, text: 'Practica edición 30 minutos', xp: 15 },
  { id: 3, text: 'Dibuja o ilustra algo nuevo', xp: 10 },
  { id: 4, text: 'Aprende un prompt nuevo de IA', xp: 10 },
  { id: 5, text: 'Publica contenido en redes sociales', xp: 20 },
  { id: 6, text: 'Trabaja en tu portafolio freelance', xp: 15 },
  { id: 7, text: 'Lee 20 páginas o un resumen', xp: 10 },
  { id: 8, text: 'Practica inglés 15 minutos', xp: 10 },
  { id: 9, text: 'Modela algo en Blender', xp: 20 },
  { id: 10, text: 'Estudia teoría del color', xp: 10 },
  { id: 11, text: 'Escribe código por 20 minutos', xp: 15 },
  { id: 12, text: 'Investiga un tema de crypto', xp: 10 },
  { id: 13, text: 'Graba un video de práctica', xp: 20 },
  { id: 14, text: 'Optimiza tu perfil en Fiverr/Workana', xp: 15 },
  { id: 15, text: 'Haz un boceto de animación', xp: 15 },
  { id: 16, text: 'Estudia composición visual', xp: 10 },
  { id: 17, text: 'Practica doblaje o locución', xp: 15 },
  { id: 18, text: 'Aprende un shortcut nuevo de software', xp: 5 },
  { id: 19, text: 'Revisa tu avance semanal', xp: 10 },
  { id: 20, text: 'Contacta a un cliente potencial', xp: 25 },
];

const XP_PER_COURSE = 50;
const STORAGE_KEY = 'undavai_v3_progress';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getTotalCourses() {
  return SEMESTERS.reduce((acc, s) => acc + s.courses.length, 0);
}

function getLevelInfo(xp) {
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpForNext = 500;
  return { level, xpInLevel, xpForNext };
}

function getDailyChallenges(dateStr) {
  const seed = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...CHALLENGES].sort((a, b) => {
    const ha = Math.sin(seed + a.id) * 10000;
    const hb = Math.sin(seed + b.id) * 10000;
    return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
  });
  return shuffled.slice(0, 5);
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function ProgressBar({ value, max, color = C.gold, height = 6 }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <View style={[pb.track, { height }]}>
      <View style={[pb.fill, { width: `${pct}%`, backgroundColor: color, height }]} />
    </View>
  );
}
const pb = StyleSheet.create({
  track: { backgroundColor: C.border, borderRadius: 10, overflow: 'hidden', width: '100%' },
  fill: { borderRadius: 10 },
});

// ─────────────────────────────────────────────
// SCREEN: HOME
// ─────────────────────────────────────────────
function HomeScreen({ completed, xp, onChallengeComplete, completedChallenges }) {
  const today = getToday();
  const dailyChallenges = getDailyChallenges(today);
  const { level, xpInLevel, xpForNext } = getLevelInfo(xp);
  const totalCourses = getTotalCourses();
  const completedCount = Object.values(completed).filter(Boolean).length;
  const pct = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  const totalSemPct = SEMESTERS.map(s => {
    const done = s.courses.filter(c => completed[`${s.id}_${c}`]).length;
    return { id: s.id, emoji: s.emoji, title: s.title, color: s.color, done, total: s.courses.length };
  });

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.homeHeader}>
        <View>
          <Text style={s.homeGreet}>¡Hola, Klaid! 👋</Text>
          <Text style={s.homeSubtitle}>Universidad del Nómada Digital</Text>
          <Text style={s.homeVersion}>v3.0</Text>
        </View>
        <View style={s.xpBadge}>
          <Text style={s.xpBadgeNum}>{xp}</Text>
          <Text style={s.xpBadgeLabel}>XP</Text>
        </View>
      </View>

      {/* Level card */}
      <View style={s.levelCard}>
        <View style={s.levelRow}>
          <Text style={s.levelLabel}>Nivel {level}</Text>
          <Text style={s.levelXpText}>{xpInLevel} / {xpForNext} XP</Text>
        </View>
        <ProgressBar value={xpInLevel} max={xpForNext} color={C.gold} height={8} />
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statNum}>{completedCount}</Text>
          <Text style={s.statLbl}>Cursos</Text>
        </View>
        <View style={[s.statBox, s.statBoxMid]}>
          <Text style={s.statNum}>{pct}%</Text>
          <Text style={s.statLbl}>Global</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statNum}>{SEMESTERS.length}</Text>
          <Text style={s.statLbl}>Semestres</Text>
        </View>
      </View>

      {/* Global progress */}
      <View style={s.card}>
        <Text style={s.cardTitle}>🎯 Progreso Total</Text>
        <View style={{ marginTop: 8 }}>
          <ProgressBar value={completedCount} max={totalCourses} color={C.gold} height={10} />
          <Text style={s.progText}>{completedCount} de {totalCourses} cursos completados</Text>
        </View>
      </View>

      {/* Semester mini progress */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📊 Avance por Semestre</Text>
        {totalSemPct.map(sem => (
          <View key={sem.id} style={s.semRow}>
            <Text style={s.semEmoji}>{sem.emoji}</Text>
            <View style={{ flex: 1 }}>
              <View style={s.semTitleRow}>
                <Text style={s.semTitle} numberOfLines={1}>{sem.title}</Text>
                <Text style={[s.semPct, { color: sem.color }]}>{sem.done}/{sem.total}</Text>
              </View>
              <ProgressBar value={sem.done} max={sem.total} color={sem.color} height={5} />
            </View>
          </View>
        ))}
      </View>

      {/* Daily challenges */}
      <View style={s.card}>
        <Text style={s.cardTitle}>⚡ Desafíos de Hoy</Text>
        {dailyChallenges.map(ch => {
          const done = completedChallenges[`${today}_${ch.id}`];
          return (
            <TouchableOpacity
              key={ch.id}
              style={[s.challengeRow, done && s.challengeDone]}
              onPress={() => !done && onChallengeComplete(ch)}
            >
              <Text style={s.challengeCheck}>{done ? '✅' : '⭕'}</Text>
              <Text style={[s.challengeText, done && s.challengeTextDone]}>{ch.text}</Text>
              <View style={[s.xpChip, done && s.xpChipDone]}>
                <Text style={s.xpChipText}>+{ch.xp}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// SCREEN: SEMESTRES
// ─────────────────────────────────────────────
function SemestresScreen({ completed, onToggle }) {
  const [selected, setSelected] = useState(null);

  if (selected !== null) {
    const sem = SEMESTERS[selected];
    const done = sem.courses.filter(c => completed[`${sem.id}_${c}`]).length;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={s.detailHeader}>
          <TouchableOpacity onPress={() => setSelected(null)} style={s.backBtn}>
            <Text style={s.backBtnText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={s.detailTitle}>{sem.emoji} {sem.title}</Text>
          <Text style={s.detailSub}>{done}/{sem.courses.length} completados</Text>
          <View style={{ marginTop: 8, paddingHorizontal: 20 }}>
            <ProgressBar value={done} max={sem.courses.length} color={sem.color} height={8} />
          </View>
        </View>
        <FlatList
          data={sem.courses}
          keyExtractor={(item) => item}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const key = `${sem.id}_${item}`;
            const isDone = !!completed[key];
            return (
              <TouchableOpacity
                style={[s.courseRow, isDone && s.courseRowDone]}
                onPress={() => onToggle(key)}
              >
                <View style={[s.courseCheck, { borderColor: sem.color }, isDone && { backgroundColor: sem.color }]}>
                  {isDone && <Text style={s.courseCheckMark}>✓</Text>}
                </View>
                <Text style={[s.courseText, isDone && s.courseTextDone]} numberOfLines={2}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <Text style={s.screenTitle}>📚 Semestres</Text>
      <Text style={s.screenSub}>{SEMESTERS.length} semestres · {getTotalCourses()} cursos</Text>
      {SEMESTERS.map((sem, idx) => {
        const done = sem.courses.filter(c => completed[`${sem.id}_${c}`]).length;
        const pct = Math.round((done / sem.courses.length) * 100);
        return (
          <TouchableOpacity key={sem.id} style={s.semCard} onPress={() => setSelected(idx)}>
            <View style={[s.semCardAccent, { backgroundColor: sem.color }]} />
            <View style={{ flex: 1 }}>
              <View style={s.semCardHeader}>
                <Text style={s.semCardEmoji}>{sem.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.semCardTitle}>S{sem.id} — {sem.title}</Text>
                  <Text style={s.semCardDesc}>{sem.desc}</Text>
                </View>
                <View style={[s.semCardPctBadge, { backgroundColor: sem.color + '22', borderColor: sem.color }]}>
                  <Text style={[s.semCardPctText, { color: sem.color }]}>{pct}%</Text>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <ProgressBar value={done} max={sem.courses.length} color={sem.color} height={6} />
                <Text style={s.semCardCount}>{done} / {sem.courses.length} cursos</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// SCREEN: DESAFÍOS
// ─────────────────────────────────────────────
function DesafiosScreen({ completedChallenges, onChallengeComplete }) {
  const today = getToday();
  const daily = getDailyChallenges(today);
  const todayDone = daily.filter(ch => completedChallenges[`${today}_${ch.id}`]).length;

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <Text style={s.screenTitle}>⚡ Desafíos</Text>
      <Text style={s.screenSub}>Completa desafíos diarios para ganar XP</Text>

      <View style={s.card}>
        <View style={s.challengeHeaderRow}>
          <Text style={s.cardTitle}>📅 Hoy — {today}</Text>
          <Text style={[s.todayDoneText, { color: todayDone === daily.length ? C.green : C.gold }]}>
            {todayDone}/{daily.length}
          </Text>
        </View>
        <ProgressBar value={todayDone} max={daily.length} color={C.green} height={6} />
      </View>

      <Text style={s.sectionLabel}>Desafíos de Hoy</Text>
      {daily.map(ch => {
        const done = !!completedChallenges[`${today}_${ch.id}`];
        return (
          <TouchableOpacity
            key={ch.id}
            style={[s.challengeCard, done && s.challengeCardDone]}
            onPress={() => !done && onChallengeComplete(ch)}
          >
            <Text style={s.challengeCardEmoji}>{done ? '✅' : '🎯'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.challengeCardText, done && { color: C.textMuted }]}>{ch.text}</Text>
              {done && <Text style={s.challengeCardDoneLabel}>¡Completado!</Text>}
            </View>
            <View style={[s.xpBig, done && { backgroundColor: C.green + '33' }]}>
              <Text style={[s.xpBigText, done && { color: C.green }]}>+{ch.xp} XP</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={s.sectionLabel}>Banco de Desafíos</Text>
      {CHALLENGES.map(ch => (
        <View key={ch.id} style={s.bankRow}>
          <Text style={s.bankNum}>#{ch.id}</Text>
          <Text style={s.bankText}>{ch.text}</Text>
          <Text style={s.bankXp}>+{ch.xp}</Text>
        </View>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// SCREEN: PERFIL
// ─────────────────────────────────────────────
function PerfilScreen({ xp, completed, onReset }) {
  const { level, xpInLevel, xpForNext } = getLevelInfo(xp);
  const totalCourses = getTotalCourses();
  const completedCount = Object.values(completed).filter(Boolean).length;

  const semStats = SEMESTERS.map(s => {
    const done = s.courses.filter(c => completed[`${s.id}_${c}`]).length;
    const pct = Math.round((done / s.courses.length) * 100);
    return { ...s, done, pct };
  });

  const topSem = [...semStats].sort((a, b) => b.pct - a.pct)[0];

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.profileHeader}>
        <View style={s.profileAvatar}>
          <Text style={s.profileAvatarText}>K</Text>
        </View>
        <Text style={s.profileName}>Klaid</Text>
        <Text style={s.profileTag}>@elklaid.com · Palma, Mallorca</Text>
        <View style={[s.levelPill, { backgroundColor: C.gold + '22' }]}>
          <Text style={[s.levelPillText, { color: C.gold }]}>Nivel {level} · Nómada Digital</Text>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statNum}>{xp}</Text>
          <Text style={s.statLbl}>XP Total</Text>
        </View>
        <View style={[s.statBox, s.statBoxMid]}>
          <Text style={s.statNum}>{level}</Text>
          <Text style={s.statLbl}>Nivel</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statNum}>{completedCount}</Text>
          <Text style={s.statLbl}>Cursos ✓</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>📈 Nivel {level}</Text>
        <View style={{ marginTop: 8 }}>
          <ProgressBar value={xpInLevel} max={xpForNext} color={C.gold} height={10} />
          <Text style={s.progText}>{xpInLevel} / {xpForNext} XP para Nivel {level + 1}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>🏆 Progreso Global</Text>
        <View style={{ marginTop: 8 }}>
          <ProgressBar value={completedCount} max={totalCourses} color={C.gold} height={10} />
          <Text style={s.progText}>{completedCount} / {totalCourses} cursos · {Math.round((completedCount / totalCourses) * 100)}%</Text>
        </View>
        {topSem && topSem.done > 0 && (
          <Text style={s.topSemText}>🥇 Mejor semestre: {topSem.emoji} {topSem.title} ({topSem.pct}%)</Text>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>📚 Detalle por Semestre</Text>
        {semStats.map(sem => (
          <View key={sem.id} style={s.profileSemRow}>
            <Text style={s.semEmoji}>{sem.emoji}</Text>
            <View style={{ flex: 1 }}>
              <View style={s.semTitleRow}>
                <Text style={s.semTitle} numberOfLines={1}>{sem.title}</Text>
                <Text style={[s.semPct, { color: sem.color }]}>{sem.pct}%</Text>
              </View>
              <ProgressBar value={sem.done} max={sem.total} color={sem.color} height={4} />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.resetBtn} onPress={onReset}>
        <Text style={s.resetBtnText}>🗑️ Resetear Progreso</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const [completed, setCompleted] = useState({});
  const [xp, setXp] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [toast, setToast] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setCompleted(data.completed || {});
        setXp(data.xp || 0);
        setCompletedChallenges(data.completedChallenges || {});
      }
    } catch (e) {}
    setLoaded(true);
  }

  async function saveData(c, x, cc) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: c, xp: x, completedChallenges: cc }));
    } catch (e) {}
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function handleToggle(key) {
    const newCompleted = { ...completed, [key]: !completed[key] };
    const delta = newCompleted[key] ? XP_PER_COURSE : -XP_PER_COURSE;
    const newXp = Math.max(0, xp + delta);
    setCompleted(newCompleted);
    setXp(newXp);
    saveData(newCompleted, newXp, completedChallenges);
    showToast(newCompleted[key] ? `+${XP_PER_COURSE} XP ✨` : 'Curso desmarcado');
  }

  function handleChallengeComplete(ch) {
    const today = getToday();
    const k = `${today}_${ch.id}`;
    if (completedChallenges[k]) return;
    const newCC = { ...completedChallenges, [k]: true };
    const newXp = xp + ch.xp;
    setCompletedChallenges(newCC);
    setXp(newXp);
    saveData(completed, newXp, newCC);
    showToast(`+${ch.xp} XP ⚡ ¡Desafío completado!`);
  }

  function handleReset() {
    setCompleted({});
    setXp(0);
    setCompletedChallenges({});
    saveData({}, 0, {});
    showToast('Progreso reseteado');
  }

  const TABS = [
    { label: 'Inicio', icon: '🏠' },
    { label: 'Semestres', icon: '📚' },
    { label: 'Desafíos', icon: '⚡' },
    { label: 'Perfil', icon: '👤' },
  ];

  if (!loaded) {
    return (
      <View style={s.loading}>
        <Text style={s.loadingText}>🎓</Text>
        <Text style={s.loadingLabel}>Cargando UND AVAI...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={{ flex: 1 }}>
        {tab === 0 && <HomeScreen completed={completed} xp={xp} onChallengeComplete={handleChallengeComplete} completedChallenges={completedChallenges} />}
        {tab === 1 && <SemestresScreen completed={completed} onToggle={handleToggle} />}
        {tab === 2 && <DesafiosScreen completedChallenges={completedChallenges} onChallengeComplete={handleChallengeComplete} />}
        {tab === 3 && <PerfilScreen xp={xp} completed={completed} onReset={handleReset} />}
      </View>

      {/* Toast */}
      {toast ? (
        <View style={s.toast} pointerEvents="none">
          <Text style={s.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* Tab Bar */}
      <View style={s.tabBar}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={i} style={s.tabBtn} onPress={() => setTab(i)}>
            <Text style={[s.tabIcon, tab === i && s.tabIconActive]}>{t.icon}</Text>
            <Text style={[s.tabLabel, tab === i && s.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  screen: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 16 },
  loading: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 56 },
  loadingLabel: { color: C.textMuted, fontSize: 16, marginTop: 12 },

  // Home
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 24, paddingBottom: 16 },
  homeGreet: { color: C.text, fontSize: 22, fontWeight: 'bold' },
  homeSubtitle: { color: C.textMuted, fontSize: 13, marginTop: 2 },
  homeVersion: { color: C.gold, fontSize: 11, marginTop: 2 },
  xpBadge: { backgroundColor: C.gold + '22', borderRadius: 12, borderWidth: 1, borderColor: C.gold, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
  xpBadgeNum: { color: C.gold, fontSize: 20, fontWeight: 'bold' },
  xpBadgeLabel: { color: C.gold, fontSize: 10 },

  // Level card
  levelCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.gold + '44' },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  levelLabel: { color: C.gold, fontWeight: 'bold', fontSize: 15 },
  levelXpText: { color: C.textMuted, fontSize: 13 },

  // Stats
  statsRow: { flexDirection: 'row', marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  statBoxMid: { marginHorizontal: 8 },
  statNum: { color: C.gold, fontSize: 22, fontWeight: 'bold' },
  statLbl: { color: C.textMuted, fontSize: 11, marginTop: 2 },

  // Card
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  cardTitle: { color: C.text, fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  progText: { color: C.textMuted, fontSize: 12, marginTop: 6 },

  // Semester row in home
  semRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  semEmoji: { fontSize: 18, marginRight: 10, width: 26 },
  semTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  semTitle: { color: C.text, fontSize: 12, flex: 1 },
  semPct: { fontSize: 12, fontWeight: 'bold', marginLeft: 8 },

  // Challenges
  challengeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  challengeDone: { opacity: 0.5 },
  challengeCheck: { fontSize: 18, marginRight: 10 },
  challengeText: { color: C.text, flex: 1, fontSize: 13 },
  challengeTextDone: { color: C.textMuted, textDecorationLine: 'line-through' },
  xpChip: { backgroundColor: C.gold + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: C.gold },
  xpChipDone: { backgroundColor: C.border, borderColor: C.border },
  xpChipText: { color: C.gold, fontSize: 11, fontWeight: 'bold' },

  // Semestres screen
  screenTitle: { color: C.text, fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 4 },
  screenSub: { color: C.textMuted, fontSize: 13, marginBottom: 16 },
  semCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border, flexDirection: 'row' },
  semCardAccent: { width: 4, borderRadius: 4, marginRight: 14 },
  semCardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  semCardEmoji: { fontSize: 24, marginRight: 10 },
  semCardTitle: { color: C.text, fontWeight: 'bold', fontSize: 14 },
  semCardDesc: { color: C.textMuted, fontSize: 12, marginTop: 2 },
  semCardPctBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, marginLeft: 8 },
  semCardPctText: { fontSize: 13, fontWeight: 'bold' },
  semCardCount: { color: C.textMuted, fontSize: 11, marginTop: 6 },

  // Detail view
  detailHeader: { backgroundColor: C.surface, paddingBottom: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { paddingHorizontal: 20, paddingVertical: 8 },
  backBtnText: { color: C.gold, fontSize: 15 },
  detailTitle: { color: C.text, fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20 },
  detailSub: { color: C.textMuted, fontSize: 13, paddingHorizontal: 20, marginTop: 2 },
  courseRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  courseRowDone: { borderColor: C.green + '44', backgroundColor: C.green + '11' },
  courseCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  courseCheckMark: { color: C.bg, fontSize: 13, fontWeight: 'bold' },
  courseText: { color: C.text, flex: 1, fontSize: 13 },
  courseTextDone: { color: C.textMuted, textDecorationLine: 'line-through' },

  // Challenges screen
  challengeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  todayDoneText: { fontSize: 16, fontWeight: 'bold' },
  sectionLabel: { color: C.textMuted, fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 8, marginBottom: 8, textTransform: 'uppercase' },
  challengeCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center' },
  challengeCardDone: { borderColor: C.green + '44', backgroundColor: C.green + '0a' },
  challengeCardEmoji: { fontSize: 24, marginRight: 12 },
  challengeCardText: { color: C.text, flex: 1, fontSize: 14 },
  challengeCardDoneLabel: { color: C.green, fontSize: 11, marginTop: 4 },
  xpBig: { backgroundColor: C.gold + '22', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.gold },
  xpBigText: { color: C.gold, fontWeight: 'bold', fontSize: 13 },
  bankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  bankNum: { color: C.textDim, fontSize: 11, width: 28 },
  bankText: { color: C.textMuted, flex: 1, fontSize: 13 },
  bankXp: { color: C.goldDim, fontSize: 12, fontWeight: 'bold' },

  // Profile
  profileHeader: { alignItems: 'center', paddingVertical: 28 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.gold + '22', borderWidth: 2, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { color: C.gold, fontSize: 32, fontWeight: 'bold' },
  profileName: { color: C.text, fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  profileTag: { color: C.textMuted, fontSize: 13, marginTop: 4 },
  levelPill: { marginTop: 10, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: C.gold + '44' },
  levelPillText: { fontWeight: 'bold', fontSize: 13 },
  topSemText: { color: C.textMuted, fontSize: 12, marginTop: 8 },
  profileSemRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  resetBtn: { marginHorizontal: 16, marginTop: 8, backgroundColor: C.red + '22', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.red + '44' },
  resetBtnText: { color: C.red, fontWeight: 'bold', fontSize: 14 },

  // Toast
  toast: { position: 'absolute', bottom: 88, alignSelf: 'center', backgroundColor: C.gold, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 22, zIndex: 99 },
  toastText: { color: C.bg, fontWeight: 'bold', fontSize: 14 },

  // Tab bar
  tabBar: { flexDirection: 'row', backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: 8, paddingTop: 8 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  tabIcon: { fontSize: 20, opacity: 0.4 },
  tabIconActive: { opacity: 1 },
  tabLabel: { color: C.textDim, fontSize: 10, marginTop: 2 },
  tabLabelActive: { color: C.gold, fontWeight: 'bold' },
});
