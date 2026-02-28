import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, Modal, FlatList, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ─── COLORES ───────────────────────────────────────────────────────────────
const C = {
  bg: '#0a0a0f',
  surface: '#12121a',
  card: '#1a1a26',
  border: '#2a2a3a',
  gold: '#d4a843',
  goldLight: '#e8c87a',
  cream: '#f0e6d3',
  sage: '#5a9e6f',
  rust: '#c4593a',
  purple: '#7c5cbf',
  blue: '#4a7abf',
  text: '#e8e0d5',
  textMuted: '#7a7590',
  white: '#ffffff',
};

// ─── CURRICULUM COMPLETO ────────────────────────────────────────────────────
const CURRICULUM = [
  {
    id: 's1',
    sem: '01',
    title: 'Maestría en Herramientas de Industria',
    subtitle: 'Calidad de Cine',
    emoji: '🎬',
    color: C.blue,
    modules: [
      {
        id: 's1m1', name: 'Edición Profesional', icon: '🎞️',
        lessons: [
          { id: 'l001', name: 'Edición en Premiere y After Effects', tag: 'Plataforma', xp: 90 },
          { id: 'l002', name: 'Edición en CapCut (16 lecciones)', tag: 'Plataforma', xp: 80 },
          { id: 'l003', name: 'Edición en DaVinci Resolve (7 lecciones)', tag: 'Plataforma', xp: 70 },
          { id: 'l004', name: 'Aprende a editar vídeos con CapCut desde cero', tag: 'Curso', xp: 80 },
          { id: 'l005', name: 'Curso completo de Edición de Vídeos (Premiere + AE)', tag: 'Curso', xp: 85 },
        ]
      },
      {
        id: 's1m2', name: 'Adobe Suite', icon: '🖥️',
        lessons: [
          { id: 'l006', name: 'Adobe After Effects', tag: 'Udemy', xp: 70 },
          { id: 'l007', name: 'Adobe Premiere', tag: 'Udemy', xp: 70 },
          { id: 'l008', name: 'After Effects (curso alternativo)', tag: 'Udemy', xp: 65 },
          { id: 'l009', name: 'Cómo usar tu Cámara', tag: 'Gratis', xp: 50 },
        ]
      },
      {
        id: 's1m3', name: 'Creatividad & Marca', icon: '🎨',
        lessons: [
          { id: 'l010', name: 'Branding e Identidad de Marca', tag: 'Plataforma', xp: 60 },
          { id: 'l011', name: 'Guionizado Viral con IA', tag: 'Plataforma', xp: 65 },
        ]
      },
    ]
  },
  {
    id: 's2',
    sem: '02',
    title: 'El Estándar de Hollywood',
    subtitle: 'DaVinci Resolve Mastery',
    emoji: '🎥',
    color: C.purple,
    modules: [
      {
        id: 's2m1', name: 'Blender & 3D', icon: '🟠',
        lessons: [
          { id: 'l012', name: 'Blender Core (Iniciación)', tag: 'Plataforma', xp: 80 },
        ]
      },
      {
        id: 's2m2', name: 'DaVinci: Fundamentos', icon: '🎬',
        lessons: [
          { id: 'l013', name: '10 Primeros Pasos en DaVinci (RBG Escuela)', tag: 'YT', xp: 60 },
          { id: 'l014', name: 'Curso DaVinci Resolve 20 completo (El Mono Editor)', tag: 'YT', xp: 80 },
          { id: 'l015', name: 'Curso DaVinci Resolve 20 (Yoney Gallardo · 4h30)', tag: 'YT', xp: 90 },
          { id: 'l016', name: 'Introduction to DaVinci – Full Masterclass (Casey Faris)', tag: 'YT', xp: 100 },
          { id: 'l017', name: 'Full Video Editing Course Beginner to Pro (Marcus Jones)', tag: 'YT', xp: 100 },
        ]
      },
      {
        id: 's2m3', name: 'Color Grading', icon: '🎨',
        lessons: [
          { id: 'l018', name: 'DaVinci Resolve Color Grading (Ramiro Maya)', tag: 'YT', xp: 80 },
          { id: 'l019', name: 'El Único Tutorial de Color (AlwaysJoan)', tag: 'YT', xp: 85 },
          { id: 'l020', name: 'How to Color Grade Skin Tones (George.Colorist)', tag: 'YT', xp: 90 },
          { id: 'l021', name: '7 Mitos de Edición de Video (Mirko Vigna)', tag: 'YT', xp: 60 },
        ]
      },
      {
        id: 's2m4', name: 'Motion Graphics & VFX', icon: '✨',
        lessons: [
          { id: 'l022', name: 'How to Edit Advanced Animations (Zane Hoyer)', tag: 'YT', xp: 85 },
          { id: 'l023', name: 'Viral Clean Motion Graphics (Ritu Solanki)', tag: 'YT', xp: 80 },
          { id: 'l024', name: 'Create VIRAL Text Effects (Amro)', tag: 'YT', xp: 75 },
          { id: 'l025', name: 'How to Edit Viral 3D Videos (Zane Hoyer)', tag: 'YT', xp: 70 },
          { id: 'l026', name: 'How VFX Artists Rotoscope (Kevin Vandermars)', tag: 'YT', xp: 75 },
          { id: 'l027', name: 'Cómo usar Fusion Fácil (Lorenzo)', tag: 'YT', xp: 70 },
          { id: 'l028', name: 'Fusion en DaVinci desde Cero (Cesar Quintus)', tag: 'YT', xp: 75 },
        ]
      },
      {
        id: 's2m5', name: 'Transiciones & Técnicas Avanzadas', icon: '⚡',
        lessons: [
          { id: 'l029', name: 'Master DaVinci Resolve Advanced (GrowTuber Guide · 7h42)', tag: 'YT', xp: 130 },
          { id: 'l030', name: 'Create Stunning Split Object Transition', tag: 'YT', xp: 65 },
          { id: 'l031', name: '3 Viral Real Estate Transitions (Joel Van Beek)', tag: 'YT', xp: 70 },
          { id: 'l032', name: 'This Is How You Animate Viral Reel', tag: 'YT', xp: 75 },
          { id: 'l033', name: 'Subtítulos Automáticos DaVinci (Cesar Quintus)', tag: 'YT', xp: 65 },
          { id: 'l034', name: 'Masterclass Filtrada monetización (Lorenzo)', tag: 'YT', xp: 80 },
        ]
      },
    ]
  },
  {
    id: 's3',
    sem: '03',
    title: 'Redes Sociales & Copywriting',
    subtitle: 'Crecimiento Orgánico',
    emoji: '📱',
    color: C.rust,
    modules: [
      {
        id: 's3m1', name: 'SEO & Algoritmos', icon: '🔍',
        lessons: [
          { id: 'l035', name: 'Estrategia SEO para Multiplicar CPM x5 (Romuald Fons)', tag: 'YT', xp: 75 },
          { id: 'l036', name: 'El secreto SEO de Mr. Beast (Romuald Fons)', tag: 'YT', xp: 70 },
          { id: 'l037', name: 'Consigue MILLONES de visualizaciones (Romuald Fons)', tag: 'YT', xp: 75 },
          { id: 'l038', name: 'Exponiendo el Nuevo Algoritmo Instagram', tag: 'YT', xp: 70 },
          { id: 'l039', name: '5 Claves del SEO en Instagram (Metricool)', tag: 'YT', xp: 65 },
        ]
      },
      {
        id: 's3m2', name: 'Instagram & LinkedIn', icon: '📸',
        lessons: [
          { id: 'l040', name: 'Cómo CRECER en Instagram 2025 (Pedro SEO)', tag: 'YT', xp: 80 },
          { id: 'l041', name: 'La guía definitiva 0 a 1M views Instagram', tag: 'YT', xp: 75 },
          { id: 'l042', name: 'LinkedIn Content Writing Free Course (Matthew Lakajev)', tag: 'YT', xp: 80 },
          { id: 'l043', name: 'The Best LinkedIn Growth Strategy (Neil Patel)', tag: 'YT', xp: 65 },
          { id: 'l044', name: 'Mi estrategia para crecer +10.000 en LinkedIn (Luis Garau)', tag: 'YT', xp: 70 },
        ]
      },
      {
        id: 's3m3', name: 'TikTok & Ads', icon: '🎵',
        lessons: [
          { id: 'l045', name: 'SEO en TikTok Guía completa (Pedro SEO)', tag: 'YT', xp: 70 },
          { id: 'l046', name: 'Cómo hacer SEO para TikTok (HubSpot)', tag: 'YT', xp: 65 },
          { id: 'l047', name: 'Facebook Ads para Principiantes (Andres Garza)', tag: 'YT', xp: 85 },
          { id: 'l048', name: 'Tutorial Completo Meta Ads 0 a $$$ (9h)', tag: 'YT', xp: 110 },
        ]
      },
      {
        id: 's3m4', name: 'YouTube Strategy', icon: '▶️',
        lessons: [
          { id: 'l049', name: 'Haz tu Video Viral con Gancho (Romuald Fons)', tag: 'YT', xp: 70 },
          { id: 'l050', name: 'Tengo 60.000 suscriptores y sin ventas', tag: 'YT', xp: 75 },
          { id: 'l051', name: 'Así NO vas a vivir de YouTube (Romuald Fons)', tag: 'YT', xp: 70 },
          { id: 'l052', name: '¿Cuánto gano con YouTube? (Romuald Fons)', tag: 'YT', xp: 65 },
          { id: 'l053', name: '¿Tu Vídeos NO funcionan? (Romuald Fons)', tag: 'YT', xp: 65 },
        ]
      },
      {
        id: 's3m5', name: 'Copywriting', icon: '✍️',
        lessons: [
          { id: 'l054', name: 'Clase de Copywriting Vende x9 (Romuald Fons)', tag: 'YT', xp: 75 },
          { id: 'l055', name: 'El Nuevo Copywriting (Romuald Fons)', tag: 'YT', xp: 80 },
          { id: 'l056', name: 'Curso GRATIS de Copywriting completo +5h', tag: 'YT', xp: 100 },
          { id: 'l057', name: '4 Years of Copywriting Advice (Cardinal Mason)', tag: 'YT', xp: 70 },
          { id: 'l058', name: 'Copywriting y su importancia (Evonny Oficial)', tag: 'YT', xp: 85 },
        ]
      },
    ]
  },
  {
    id: 's4',
    sem: '04',
    title: 'La Revolución de la IA',
    subtitle: 'Herramientas & Automatización',
    emoji: '🤖',
    color: C.gold,
    modules: [
      {
        id: 's4m1', name: 'Cursos IA Plataforma', icon: '🎓',
        lessons: [
          { id: 'l059', name: 'Nano Banana (Google IA)', tag: 'Plataforma', xp: 70 },
          { id: 'l060', name: 'VEO 3 (Video con IA)', tag: 'Plataforma', xp: 90 },
          { id: 'l061', name: 'Flux AI (Imagen)', tag: 'Plataforma', xp: 85 },
          { id: 'l062', name: 'Runway AI', tag: 'Plataforma', xp: 90 },
          { id: 'l063', name: 'Kling AI (+3h)', tag: 'Plataforma', xp: 95 },
          { id: 'l064', name: 'Curso de Midjourney I.A. (+10h)', tag: 'Plataforma', xp: 120 },
        ]
      },
      {
        id: 's4m2', name: 'Automatización (Make / N8N)', icon: '⚙️',
        lessons: [
          { id: 'l065', name: 'Curso Completo de Make (Adrián Sáenz · 3h55)', tag: 'YT', xp: 100 },
          { id: 'l066', name: 'N8N Curso Completo 6h (Agustín Medina)', tag: 'YT', xp: 110 },
          { id: 'l067', name: 'Curso Completo N8N +5h', tag: 'YT', xp: 100 },
          { id: 'l068', name: 'Power Automate Beginner to Pro', tag: 'YT', xp: 95 },
          { id: 'l069', name: 'Automatiza las Redes Sociales (Alejavi Rivera)', tag: 'YT', xp: 80 },
          { id: 'l070', name: 'Esta IA Crea Contenido Diario (Adrián Sáenz)', tag: 'YT', xp: 85 },
        ]
      },
      {
        id: 's4m3', name: 'ComfyUI & Imagen IA', icon: '🖼️',
        lessons: [
          { id: 'l071', name: 'ComfyUI para Principiantes (Nekodificador)', tag: 'YT', xp: 80 },
          { id: 'l072', name: 'Aprende ComfyUI desde cero (IA Sin Filtros)', tag: 'YT', xp: 85 },
          { id: 'l073', name: 'Master AI Image Generation ComfyUI', tag: 'YT', xp: 90 },
          { id: 'l074', name: 'Master Midjourney Masterclass (Futurepedia)', tag: 'YT', xp: 90 },
          { id: 'l075', name: 'DOMINA Midjourney Guía Definitiva (Ruva IA)', tag: 'YT', xp: 85 },
          { id: 'l076', name: 'The Freepik AI Masterclass', tag: 'YT', xp: 80 },
        ]
      },
      {
        id: 's4m4', name: 'Avatares, Voz & Video IA', icon: '🎭',
        lessons: [
          { id: 'l077', name: 'HeyGen AI Avatar Tutorial', tag: 'YT', xp: 80 },
          { id: 'l078', name: 'Clon IA con Delphi.ai (Joe Fier)', tag: 'YT', xp: 75 },
          { id: 'l079', name: 'Curso de ElevenLabs con tu voz (Diego Cárdenas)', tag: 'YT', xp: 80 },
          { id: 'l080', name: 'Free Runway AI Video Generation Course', tag: 'YT', xp: 85 },
          { id: 'l081', name: 'Create Cinematic AI with Runway Gen-4', tag: 'YT', xp: 80 },
          { id: 'l082', name: 'The Only Synthesia AI Tutorial (Simon Crowe)', tag: 'YT', xp: 75 },
          { id: 'l083', name: 'Adobe Firefly 2025 (Camilo Adobe)', tag: 'YT', xp: 80 },
        ]
      },
      {
        id: 's4m5', name: 'ChatGPT / Claude / Gemini', icon: '💬',
        lessons: [
          { id: 'l084', name: 'Domina ChatGPT Curso Completo', tag: 'YT', xp: 90 },
          { id: 'l085', name: 'Google Gemini Full Course 3h (Julian Goldie)', tag: 'YT', xp: 90 },
          { id: 'l086', name: 'Claude AI Tutorial Completo', tag: 'YT', xp: 80 },
          { id: 'l087', name: 'Ultimate GROK 4 Guide 2025', tag: 'YT', xp: 80 },
          { id: 'l088', name: 'NotebookLM Full Course (Julian Goldie · 4h)', tag: 'YT', xp: 95 },
          { id: 'l089', name: 'Everything Perplexity in 3h (Tina Huang)', tag: 'YT', xp: 85 },
        ]
      },
      {
        id: 's4m6', name: 'Negocios & Agencia IA', icon: '💼',
        lessons: [
          { id: 'l090', name: 'Los 5 Mejores Negocios con IA (Andres Garza)', tag: 'YT', xp: 75 },
          { id: 'l091', name: '7 Negocios de IA $500/día (Adrián Sáenz)', tag: 'YT', xp: 80 },
          { id: 'l092', name: 'Cómo Empezar una Agencia IA +8h', tag: 'YT', xp: 120 },
          { id: 'l093', name: 'Cómo Crear Tu Agencia IA (Emprende Aprendiendo)', tag: 'YT', xp: 100 },
          { id: 'l094', name: 'Conviértete en Consultor de IA', tag: 'YT', xp: 85 },
        ]
      },
      {
        id: 's4m7', name: 'Música IA & Herramientas Extra', icon: '🎵',
        lessons: [
          { id: 'l095', name: 'Suno AI Tutorial 2026 (ChillPanic)', tag: 'YT', xp: 70 },
          { id: 'l096', name: 'SUNO Studio de 0 a 100 (Ingenier-IA Música)', tag: 'YT', xp: 80 },
          { id: 'l097', name: 'Lovable Full Tutorial (Tech With Tim)', tag: 'YT', xp: 75 },
          { id: 'l098', name: 'Ejecuta IA en Local GRATIS (Dot CSV Lab)', tag: 'YT', xp: 80 },
          { id: 'l099', name: 'Model Context Protocol MCP Explained', tag: 'YT', xp: 75 },
          { id: 'l100', name: 'Aspectos Legales de la IA (practia.global)', tag: 'YT', xp: 70 },
        ]
      },
    ]
  },
  {
    id: 's5',
    sem: '05',
    title: 'Diseño e Identidad Visual',
    subtitle: 'Photoshop & Monetización',
    emoji: '🎨',
    color: C.sage,
    modules: [
      {
        id: 's5m1', name: 'Photoshop Profesional', icon: '🖼️',
        lessons: [
          { id: 'l101', name: 'Domina Photoshop como un profesional desde cero (4h41)', tag: 'Plataforma', xp: 100 },
          { id: 'l102', name: 'Hacks de Photoshop Temporada 2 (7h41)', tag: 'Plataforma', xp: 110 },
          { id: 'l103', name: 'Masterclass Diseñar Banners (1h12)', tag: 'Plataforma', xp: 80 },
        ]
      },
      {
        id: 's5m2', name: 'Thumbnails & Branding', icon: '✏️',
        lessons: [
          { id: 'l104', name: 'Viral Thumbnail Template Pack', tag: 'Curso', xp: 75 },
        ]
      },
      {
        id: 's5m3', name: 'Monetización con Diseño', icon: '💰',
        lessons: [
          { id: 'l105', name: 'Domina Fiverr y aprende a generar ingresos (4h27)', tag: 'Plataforma', xp: 90 },
        ]
      },
    ]
  },
  {
    id: 's6',
    sem: '06',
    title: 'Mentalidad y Estrategia Freelance',
    subtitle: 'Negocio & Emprendimiento',
    emoji: '💼',
    color: '#c4883a',
    modules: [
      {
        id: 's6m1', name: 'Freelance & Emprendimiento', icon: '🚀',
        lessons: [
          { id: 'l106', name: 'Conviértete en Freelance desde cero (4h02)', tag: 'Plataforma', xp: 95 },
          { id: 'l107', name: 'Curso de Funnels (BIG school)', tag: 'Plataforma', xp: 85 },
          { id: 'l108', name: 'Curso Iniciación Negocios (BIG school) — 60%', tag: 'Plataforma', xp: 80 },
          { id: 'l109', name: 'VideoMarketer (BIG school) — 13%', tag: 'Plataforma', xp: 90 },
          { id: 'l110', name: 'Upgrade | Casos Avanzados para Empresarios', tag: 'Plataforma', xp: 95 },
        ]
      },
      {
        id: 's6m2', name: 'Mentalidad & Productividad', icon: '🧠',
        lessons: [
          { id: 'l111', name: 'Pack GPTs – Asistentes IA Personalizados', tag: 'Academy', xp: 80 },
          { id: 'l112', name: 'Coach Teacher', tag: 'Academy', xp: 70 },
          { id: 'l113', name: 'Academy Mastery', tag: 'Academy', xp: 75 },
          { id: 'l114', name: 'Flash Libros 2.0', tag: 'Academy', xp: 65 },
          { id: 'l115', name: 'Leader Summaries', tag: 'Academy', xp: 65 },
          { id: 'l116', name: 'Audios de Mentalidad de Emprendedor', tag: 'Academy', xp: 60 },
          { id: 'l117', name: 'Sesgado | Trucos Psicológicos para Vender', tag: 'Academy', xp: 80 },
          { id: 'l118', name: 'Masterclass Domina ChatGPT (Actualizada)', tag: 'Academy', xp: 85 },
          { id: 'l119', name: 'SÍLEX 2.0', tag: 'Academy', xp: 90 },
        ]
      },
      {
        id: 's6m3', name: 'Clon IA & Avatar', icon: '🤖',
        lessons: [
          { id: 'l120', name: 'Clon IA Euge Oller — ✅ 100% completado', tag: 'BIG school', xp: 100 },
          { id: 'l121', name: 'Designio | Diseño para Emprendedores', tag: 'Academy', xp: 75 },
        ]
      },
      {
        id: 's6m4', name: 'Libros de Referencia', icon: '📚',
        lessons: [
          { id: 'l122', name: 'Crece y Hazte Rico – Romuald Fons', tag: 'Libro', xp: 70 },
          { id: 'l123', name: 'Autónomo para Dummies – R. González Fontenla', tag: 'Libro', xp: 65 },
        ]
      },
    ]
  },
  {
    id: 's7',
    sem: '07',
    title: 'Formación Avanzada',
    subtitle: 'Drive Propio & Recursos',
    emoji: '📁',
    color: '#6a8f9e',
    modules: [
      {
        id: 's7m1', name: 'Carpetas de Conocimiento', icon: '🗂️',
        lessons: [
          { id: 'l124', name: 'ChatGPT (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l125', name: 'Comunicación (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l126', name: 'Criptomonedas (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l127', name: 'Edición de Video (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l128', name: 'E-mail (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l129', name: 'Finanzas (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l130', name: 'Fiscalidad (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l131', name: 'Hábitos Financieros (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l132', name: 'IA (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l133', name: 'Photoshop (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l134', name: 'SEO (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l135', name: 'SEO Redes (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l136', name: 'Sistema Facturación Automática', tag: 'Drive', xp: 70 },
          { id: 'l137', name: 'Ventas (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l138', name: 'Video Marketer (carpeta Drive)', tag: 'Drive', xp: 60 },
        ]
      },
      {
        id: 's7m2', name: 'Clases & Recursos Extra', icon: '🎥',
        lessons: [
          { id: 'l139', name: 'Clase grabada 2024-12-06', tag: 'Video', xp: 50 },
          { id: 'l140', name: 'Clase 1 – La Inversión Sí Es Para Ti', tag: 'Video', xp: 55 },
          { id: 'l141', name: 'Clase 2 – La Inversión Sí Es Para Ti', tag: 'Video', xp: 55 },
          { id: 'l142', name: 'Clase 3 – La Inversión Sí Es Para Ti', tag: 'Video', xp: 55 },
          { id: 'l143', name: 'Calendarios Edición Video Freelance (Mes 1-6)', tag: 'PDF', xp: 40 },
        ]
      },
    ]
  },
  {
    id: 's8',
    sem: '08',
    title: 'Artes Visuales & Animación',
    subtitle: 'Formación Complementaria',
    emoji: '🖌️',
    color: '#9e5a8f',
    modules: [
      {
        id: 's8m1', name: 'Dibujo Tradicional', icon: '✏️',
        lessons: [
          { id: 'l144', name: 'Aprende a dibujar desde cero', tag: 'Plataforma', xp: 70 },
          { id: 'l145', name: 'Técnicas de lápiz para dibujo realista', tag: 'Plataforma', xp: 75 },
          { id: 'l146', name: 'Ilustración con carboncillo', tag: 'Plataforma', xp: 70 },
          { id: 'l147', name: 'Iniciación a la caricatura', tag: 'Plataforma', xp: 65 },
          { id: 'l148', name: 'Curso completo de Retrato a Lápiz', tag: 'Plataforma', xp: 75 },
          { id: 'l149', name: 'Master Class de Dibujo con MANCHA (carboncillo)', tag: 'Plataforma', xp: 80 },
          { id: 'l150', name: 'Dibuja Mejor en sólo 21 Días', tag: 'Plataforma', xp: 70 },
          { id: 'l151', name: 'Aprende Dibujo Artístico fácilmente (A. G. Villarán) ✅', tag: 'Udemy', xp: 80 },
        ]
      },
      {
        id: 's8m2', name: 'Ilustración Digital', icon: '🖥️',
        lessons: [
          { id: 'l152', name: 'Introducción a Adobe Illustrator', tag: 'Plataforma', xp: 75 },
          { id: 'l153', name: 'Ilustración con Carles Dalmau — EN PROGRESO', tag: 'Plataforma', xp: 85 },
          { id: 'l154', name: 'Retrato Realista en Digital (masterclass)', tag: 'Plataforma', xp: 85 },
   
