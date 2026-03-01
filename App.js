import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions, Modal, FlatList, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const C = {
  bg: '#0a0a0f', surface: '#12121a', card: '#1a1a26', border: '#2a2a3a',
  gold: '#d4a843', goldLight: '#e8c87a', cream: '#f0e6d3', sage: '#5a9e6f',
  rust: '#c4593a', purple: '#7c5cbf', blue: '#4a7abf',
  text: '#e8e0d5', textMuted: '#7a7590', white: '#ffffff',
};

const CURRICULUM = [
  {
    id: 's1', sem: '01', title: 'Maestría en Herramientas de Industria',
    subtitle: 'Calidad de Cine', emoji: '🎬', color: C.blue,
    modules: [
      { id: 's1m1', name: 'Edición Profesional', icon: '🎞️', lessons: [
        { id: 'l001', name: 'Edición en Premiere y After Effects', tag: 'Plataforma', xp: 90 },
        { id: 'l002', name: 'Edición en CapCut (16 lecciones)', tag: 'Plataforma', xp: 80 },
        { id: 'l003', name: 'Edición en DaVinci Resolve (7 lecciones)', tag: 'Plataforma', xp: 70 },
        { id: 'l004', name: 'Aprende a editar vídeos con CapCut desde cero', tag: 'Curso', xp: 80 },
        { id: 'l005', name: 'Curso completo de Edición de Vídeos (Premiere + AE)', tag: 'Curso', xp: 85 },
      ]},
      { id: 's1m2', name: 'Adobe Suite', icon: '🖥️', lessons: [
        { id: 'l006', name: 'Adobe After Effects', tag: 'Udemy', xp: 70 },
        { id: 'l007', name: 'Adobe Premiere', tag: 'Udemy', xp: 70 },
        { id: 'l008', name: 'After Effects (curso alternativo)', tag: 'Udemy', xp: 65 },
        { id: 'l009', name: 'Cómo usar tu Cámara', tag: 'Gratis', xp: 50 },
      ]},
      { id: 's1m3', name: 'Creatividad & Marca', icon: '🎨', lessons: [
        { id: 'l010', name: 'Branding e Identidad de Marca', tag: 'Plataforma', xp: 60 },
        { id: 'l011', name: 'Guionizado Viral con IA', tag: 'Plataforma', xp: 65 },
      ]},
    ]
  },
  {
    id: 's2', sem: '02', title: 'El Estándar de Hollywood',
    subtitle: 'DaVinci Resolve Mastery', emoji: '🎥', color: C.purple,
    modules: [
      { id: 's2m1', name: 'Blender & 3D', icon: '🟠', lessons: [
        { id: 'l012', name: 'Blender Core (Iniciación)', tag: 'Plataforma', xp: 80 },
      ]},
      { id: 's2m2', name: 'DaVinci: Fundamentos', icon: '🎬', lessons: [
        { id: 'l013', name: '10 Primeros Pasos en DaVinci (RBG Escuela)', tag: 'YT', xp: 60 },
        { id: 'l014', name: 'Curso DaVinci Resolve 20 completo (El Mono Editor)', tag: 'YT', xp: 80 },
        { id: 'l015', name: 'Curso DaVinci Resolve 20 (Yoney Gallardo · 4h30)', tag: 'YT', xp: 90 },
        { id: 'l016', name: 'Introduction to DaVinci – Full Masterclass (Casey Faris)', tag: 'YT', xp: 100 },
        { id: 'l017', name: 'Full Video Editing Course Beginner to Pro (Marcus Jones)', tag: 'YT', xp: 100 },
      ]},
      { id: 's2m3', name: 'Color Grading', icon: '🎨', lessons: [
        { id: 'l018', name: 'DaVinci Resolve Color Grading (Ramiro Maya)', tag: 'YT', xp: 80 },
        { id: 'l019', name: 'El Único Tutorial de Color (AlwaysJoan)', tag: 'YT', xp: 85 },
        { id: 'l020', name: 'How to Color Grade Skin Tones (George.Colorist)', tag: 'YT', xp: 90 },
        { id: 'l021', name: '7 Mitos de Edición de Video (Mirko Vigna)', tag: 'YT', xp: 60 },
      ]},
      { id: 's2m4', name: 'Motion Graphics & VFX', icon: '✨', lessons: [
        { id: 'l022', name: 'How to Edit Advanced Animations (Zane Hoyer)', tag: 'YT', xp: 85 },
        { id: 'l023', name: 'Viral Clean Motion Graphics (Ritu Solanki)', tag: 'YT', xp: 80 },
        { id: 'l024', name: 'Create VIRAL Text Effects (Amro)', tag: 'YT', xp: 75 },
        { id: 'l025', name: 'How to Edit Viral 3D Videos (Zane Hoyer)', tag: 'YT', xp: 70 },
        { id: 'l026', name: 'How VFX Artists Rotoscope (Kevin Vandermars)', tag: 'YT', xp: 75 },
        { id: 'l027', name: 'Cómo usar Fusion Fácil (Lorenzo)', tag: 'YT', xp: 70 },
        { id: 'l028', name: 'Fusion en DaVinci desde Cero (Cesar Quintus)', tag: 'YT', xp: 75 },
      ]},
      { id: 's2m5', name: 'Transiciones & Técnicas Avanzadas', icon: '⚡', lessons: [
        { id: 'l029', name: 'Master DaVinci Resolve Advanced (GrowTuber Guide · 7h42)', tag: 'YT', xp: 130 },
        { id: 'l030', name: 'Create Stunning Split Object Transition', tag: 'YT', xp: 65 },
        { id: 'l031', name: '3 Viral Real Estate Transitions (Joel Van Beek)', tag: 'YT', xp: 70 },
        { id: 'l032', name: 'This Is How You Animate Viral Reel', tag: 'YT', xp: 75 },
        { id: 'l033', name: 'Subtítulos Automáticos DaVinci (Cesar Quintus)', tag: 'YT', xp: 65 },
        { id: 'l034', name: 'Masterclass Filtrada monetización (Lorenzo)', tag: 'YT', xp: 80 },
      ]},
    ]
  },
  {
    id: 's3', sem: '03', title: 'Redes Sociales & Copywriting',
    subtitle: 'Crecimiento Orgánico', emoji: '📱', color: C.rust,
    modules: [
      { id: 's3m1', name: 'SEO & Algoritmos', icon: '🔍', lessons: [
        { id: 'l035', name: 'Estrategia SEO para Multiplicar CPM x5 (Romuald Fons)', tag: 'YT', xp: 75 },
        { id: 'l036', name: 'El secreto SEO de Mr. Beast (Romuald Fons)', tag: 'YT', xp: 70 },
        { id: 'l037', name: 'Consigue MILLONES de visualizaciones (Romuald Fons)', tag: 'YT', xp: 75 },
        { id: 'l038', name: 'Exponiendo el Nuevo Algoritmo Instagram', tag: 'YT', xp: 70 },
        { id: 'l039', name: '5 Claves del SEO en Instagram (Metricool)', tag: 'YT', xp: 65 },
      ]},
      { id: 's3m2', name: 'Instagram & LinkedIn', icon: '📸', lessons: [
        { id: 'l040', name: 'Cómo CRECER en Instagram 2025 (Pedro SEO)', tag: 'YT', xp: 80 },
        { id: 'l041', name: 'La guía definitiva 0 a 1M views Instagram', tag: 'YT', xp: 75 },
        { id: 'l042', name: 'LinkedIn Content Writing Free Course (Matthew Lakajev)', tag: 'YT', xp: 80 },
        { id: 'l043', name: 'The Best LinkedIn Growth Strategy (Neil Patel)', tag: 'YT', xp: 65 },
        { id: 'l044', name: 'Mi estrategia para crecer +10.000 en LinkedIn (Luis Garau)', tag: 'YT', xp: 70 },
      ]},
      { id: 's3m3', name: 'TikTok & Ads', icon: '🎵', lessons: [
        { id: 'l045', name: 'SEO en TikTok Guía completa (Pedro SEO)', tag: 'YT', xp: 70 },
        { id: 'l046', name: 'Cómo hacer SEO para TikTok (HubSpot)', tag: 'YT', xp: 65 },
        { id: 'l047', name: 'Facebook Ads para Principiantes (Andres Garza)', tag: 'YT', xp: 85 },
        { id: 'l048', name: 'Tutorial Completo Meta Ads 0 a $$$ (9h)', tag: 'YT', xp: 110 },
      ]},
      { id: 's3m4', name: 'YouTube Strategy', icon: '▶️', lessons: [
        { id: 'l049', name: 'Haz tu Video Viral con Gancho (Romuald Fons)', tag: 'YT', xp: 70 },
        { id: 'l050', name: 'Tengo 60.000 suscriptores y sin ventas', tag: 'YT', xp: 75 },
        { id: 'l051', name: 'Así NO vas a vivir de YouTube (Romuald Fons)', tag: 'YT', xp: 70 },
        { id: 'l052', name: '¿Cuánto gano con YouTube? (Romuald Fons)', tag: 'YT', xp: 65 },
        { id: 'l053', name: '¿Tu Vídeos NO funcionan? (Romuald Fons)', tag: 'YT', xp: 65 },
      ]},
      { id: 's3m5', name: 'Copywriting', icon: '✍️', lessons: [
        { id: 'l054', name: 'Clase de Copywriting Vende x9 (Romuald Fons)', tag: 'YT', xp: 75 },
        { id: 'l055', name: 'El Nuevo Copywriting (Romuald Fons)', tag: 'YT', xp: 80 },
        { id: 'l056', name: 'Curso GRATIS de Copywriting completo +5h', tag: 'YT', xp: 100 },
        { id: 'l057', name: '4 Years of Copywriting Advice (Cardinal Mason)', tag: 'YT', xp: 70 },
        { id: 'l058', name: 'Copywriting y su importancia (Evonny Oficial)', tag: 'YT', xp: 85 },
      ]},
    ]
  },
  {
    id: 's4', sem: '04', title: 'La Revolución de la IA',
    subtitle: 'Herramientas & Automatización', emoji: '🤖', color: C.gold,
    modules: [
      { id: 's4m1', name: 'Cursos IA Plataforma', icon: '🎓', lessons: [
        { id: 'l059', name: 'Nano Banana (Google IA)', tag: 'Plataforma', xp: 70 },
        { id: 'l060', name: 'VEO 3 (Video con IA)', tag: 'Plataforma', xp: 90 },
        { id: 'l061', name: 'Flux AI (Imagen)', tag: 'Plataforma', xp: 85 },
        { id: 'l062', name: 'Runway AI', tag: 'Plataforma', xp: 90 },
        { id: 'l063', name: 'Kling AI (+3h)', tag: 'Plataforma', xp: 95 },
        { id: 'l064', name: 'Curso de Midjourney I.A. (+10h)', tag: 'Plataforma', xp: 120 },
      ]},
      { id: 's4m2', name: 'Automatización (Make / N8N)', icon: '⚙️', lessons: [
        { id: 'l065', name: 'Curso Completo de Make (Adrián Sáenz · 3h55)', tag: 'YT', xp: 100 },
        { id: 'l066', name: 'N8N Curso Completo 6h (Agustín Medina)', tag: 'YT', xp: 110 },
        { id: 'l067', name: 'Curso Completo N8N +5h', tag: 'YT', xp: 100 },
        { id: 'l068', name: 'Power Automate Beginner to Pro', tag: 'YT', xp: 95 },
        { id: 'l069', name: 'Automatiza las Redes Sociales (Alejavi Rivera)', tag: 'YT', xp: 80 },
        { id: 'l070', name: 'Esta IA Crea Contenido Diario (Adrián Sáenz)', tag: 'YT', xp: 85 },
      ]},
      { id: 's4m3', name: 'ComfyUI & Imagen IA', icon: '🖼️', lessons: [
        { id: 'l071', name: 'ComfyUI para Principiantes (Nekodificador)', tag: 'YT', xp: 80 },
        { id: 'l072', name: 'Aprende ComfyUI desde cero (IA Sin Filtros)', tag: 'YT', xp: 85 },
        { id: 'l073', name: 'Master AI Image Generation ComfyUI', tag: 'YT', xp: 90 },
        { id: 'l074', name: 'Master Midjourney Masterclass (Futurepedia)', tag: 'YT', xp: 90 },
        { id: 'l075', name: 'DOMINA Midjourney Guía Definitiva (Ruva IA)', tag: 'YT', xp: 85 },
        { id: 'l076', name: 'The Freepik AI Masterclass', tag: 'YT', xp: 80 },
      ]},
      { id: 's4m4', name: 'Avatares, Voz & Video IA', icon: '🎭', lessons: [
        { id: 'l077', name: 'HeyGen AI Avatar Tutorial', tag: 'YT', xp: 80 },
        { id: 'l078', name: 'Clon IA con Delphi.ai (Joe Fier)', tag: 'YT', xp: 75 },
        { id: 'l079', name: 'Curso de ElevenLabs con tu voz (Diego Cárdenas)', tag: 'YT', xp: 80 },
        { id: 'l080', name: 'Free Runway AI Video Generation Course', tag: 'YT', xp: 85 },
        { id: 'l081', name: 'Create Cinematic AI with Runway Gen-4', tag: 'YT', xp: 80 },
        { id: 'l082', name: 'The Only Synthesia AI Tutorial (Simon Crowe)', tag: 'YT', xp: 75 },
        { id: 'l083', name: 'Adobe Firefly 2025 (Camilo Adobe)', tag: 'YT', xp: 80 },
      ]},
      { id: 's4m5', name: 'ChatGPT / Claude / Gemini', icon: '💬', lessons: [
        { id: 'l084', name: 'Domina ChatGPT Curso Completo', tag: 'YT', xp: 90 },
        { id: 'l085', name: 'Google Gemini Full Course 3h (Julian Goldie)', tag: 'YT', xp: 90 },
        { id: 'l086', name: 'Claude AI Tutorial Completo', tag: 'YT', xp: 80 },
        { id: 'l087', name: 'Ultimate GROK 4 Guide 2025', tag: 'YT', xp: 80 },
        { id: 'l088', name: 'NotebookLM Full Course (Julian Goldie · 4h)', tag: 'YT', xp: 95 },
        { id: 'l089', name: 'Everything Perplexity in 3h (Tina Huang)', tag: 'YT', xp: 85 },
      ]},
      { id: 's4m6', name: 'Negocios & Agencia IA', icon: '💼', lessons: [
        { id: 'l090', name: 'Los 5 Mejores Negocios con IA (Andres Garza)', tag: 'YT', xp: 75 },
        { id: 'l091', name: '7 Negocios de IA $500/día (Adrián Sáenz)', tag: 'YT', xp: 80 },
        { id: 'l092', name: 'Cómo Empezar una Agencia IA +8h', tag: 'YT', xp: 120 },
        { id: 'l093', name: 'Cómo Crear Tu Agencia IA (Emprende Aprendiendo)', tag: 'YT', xp: 100 },
        { id: 'l094', name: 'Conviértete en Consultor de IA', tag: 'YT', xp: 85 },
      ]},
      { id: 's4m7', name: 'Música IA & Herramientas Extra', icon: '🎵', lessons: [
        { id: 'l095', name: 'Suno AI Tutorial 2026 (ChillPanic)', tag: 'YT', xp: 70 },
        { id: 'l096', name: 'SUNO Studio de 0 a 100 (Ingenier-IA Música)', tag: 'YT', xp: 80 },
        { id: 'l097', name: 'Lovable Full Tutorial (Tech With Tim)', tag: 'YT', xp: 75 },
        { id: 'l098', name: 'Ejecuta IA en Local GRATIS (Dot CSV Lab)', tag: 'YT', xp: 80 },
        { id: 'l099', name: 'Model Context Protocol MCP Explained', tag: 'YT', xp: 75 },
        { id: 'l100', name: 'Aspectos Legales de la IA (practia.global)', tag: 'YT', xp: 70 },
      ]},
    ]
  },
  {
    id: 's5', sem: '05', title: 'Diseño e Identidad Visual',
    subtitle: 'Photoshop & Monetización', emoji: '🎨', color: C.sage,
    modules: [
      { id: 's5m1', name: 'Photoshop Profesional', icon: '🖼️', lessons: [
        { id: 'l101', name: 'Domina Photoshop como un profesional desde cero (4h41)', tag: 'Plataforma', xp: 100 },
        { id: 'l102', name: 'Hacks de Photoshop Temporada 2 (7h41)', tag: 'Plataforma', xp: 110 },
        { id: 'l103', name: 'Masterclass Diseñar Banners (1h12)', tag: 'Plataforma', xp: 80 },
      ]},
      { id: 's5m2', name: 'Thumbnails & Branding', icon: '✏️', lessons: [
        { id: 'l104', name: 'Viral Thumbnail Template Pack', tag: 'Curso', xp: 75 },
      ]},
      { id: 's5m3', name: 'Monetización con Diseño', icon: '💰', lessons: [
        { id: 'l105', name: 'Domina Fiverr y aprende a generar ingresos (4h27)', tag: 'Plataforma', xp: 90 },
      ]},
    ]
  },
  {
    id: 's6', sem: '06', title: 'Mentalidad y Estrategia Freelance',
    subtitle: 'Negocio & Emprendimiento', emoji: '💼', color: '#c4883a',
    modules: [
      { id: 's6m1', name: 'Freelance & Emprendimiento', icon: '🚀', lessons: [
        { id: 'l106', name: 'Conviértete en Freelance desde cero (4h02)', tag: 'Plataforma', xp: 95 },
        { id: 'l107', name: 'Curso de Funnels (BIG school)', tag: 'Plataforma', xp: 85 },
        { id: 'l108', name: 'Curso Iniciación Negocios (BIG school) — 60%', tag: 'Plataforma', xp: 80 },
        { id: 'l109', name: 'VideoMarketer (BIG school) — 13%', tag: 'Plataforma', xp: 90 },
        { id: 'l110', name: 'Upgrade | Casos Avanzados para Empresarios', tag: 'Plataforma', xp: 95 },
      ]},
      { id: 's6m2', name: 'Mentalidad & Productividad', icon: '🧠', lessons: [
        { id: 'l111', name: 'Pack GPTs – Asistentes IA Personalizados', tag: 'Academy', xp: 80 },
        { id: 'l112', name: 'Coach Teacher', tag: 'Academy', xp: 70 },
        { id: 'l113', name: 'Academy Mastery', tag: 'Academy', xp: 75 },
        { id: 'l114', name: 'Flash Libros 2.0', tag: 'Academy', xp: 65 },
        { id: 'l115', name: 'Leader Summaries', tag: 'Academy', xp: 65 },
        { id: 'l116', name: 'Audios de Mentalidad de Emprendedor', tag: 'Academy', xp: 60 },
        { id: 'l117', name: 'Sesgado | Trucos Psicológicos para Vender', tag: 'Academy', xp: 80 },
        { id: 'l118', name: 'Masterclass Domina ChatGPT (Actualizada)', tag: 'Academy', xp: 85 },
        { id: 'l119', name: 'SILEX 2.0', tag: 'Academy', xp: 90 },
      ]},
      { id: 's6m3', name: 'Clon IA & Avatar', icon: '🤖', lessons: [
        { id: 'l120', name: 'Clon IA Euge Oller — completado', tag: 'BIG school', xp: 100 },
        { id: 'l121', name: 'Designio | Diseño para Emprendedores', tag: 'Academy', xp: 75 },
      ]},
      { id: 's6m4', name: 'Libros de Referencia', icon: '📚', lessons: [
        { id: 'l122', name: 'Crece y Hazte Rico – Romuald Fons', tag: 'Libro', xp: 70 },
        { id: 'l123', name: 'Autonomo para Dummies – R. Gonzalez Fontenla', tag: 'Libro', xp: 65 },
      ]},
    ]
  },
  {
    id: 's7', sem: '07', title: 'Formación Avanzada',
    subtitle: 'Drive Propio & Recursos', emoji: '📁', color: '#6a8f9e',
    modules: [
      { id: 's7m1', name: 'Carpetas de Conocimiento', icon: '🗂️', lessons: [
        { id: 'l124', name: 'ChatGPT (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l125', name: 'Comunicación (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l126', name: 'Criptomonedas (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l127', name: 'Edición de Video (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l128', name: 'E-mail (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l129', name: 'Finanzas (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l130', name: 'Fiscalidad (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l131', name: 'Habitos Financieros (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l132', name: 'IA (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l133', name: 'Photoshop (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l134', name: 'SEO (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l135', name: 'SEO Redes (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l136', name: 'Sistema Facturación Automática', tag: 'Drive', xp: 70 },
        { id: 'l137', name: 'Ventas (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l138', name: 'Video Marketer (carpeta Drive)', tag: 'Drive', xp: 60 },
      ]},
      { id: 's7m2', name: 'Clases & Recursos Extra', icon: '🎥', lessons: [
        { id: 'l139', name: 'Clase grabada 2024-12-06', tag: 'Video', xp: 50 },
        { id: 'l140', name: 'Clase 1 – La Inversión Si Es Para Ti', tag: 'Video', xp: 55 },
        { id: 'l141', name: 'Clase 2 – La Inversión Si Es Para Ti', tag: 'Video', xp: 55 },
        { id: 'l142', name: 'Clase 3 – La Inversión Si Es Para Ti', tag: 'Video', xp: 55 },
        { id: 'l143', name: 'Calendarios Edición Video Freelance (Mes 1-6)', tag: 'PDF', xp: 40 },
      ]},
    ]
  },
  {
    id: 's8', sem: '08', title: 'Artes Visuales & Animación',
    subtitle: 'Formación Complementaria', emoji: '🖌️', color: '#9e5a8f',
    modules: [
      { id: 's8m1', name: 'Dibujo Tradicional', icon: '✏️', lessons: [
        { id: 'l144', name: 'Aprende a dibujar desde cero', tag: 'Plataforma', xp: 70 },
        { id: 'l145', name: 'Técnicas de lápiz para dibujo realista', tag: 'Plataforma', xp: 75 },
        { id: 'l146', name: 'Ilustración con carboncillo', tag: 'Plataforma', xp: 70 },
        { id: 'l147', name: 'Iniciación a la caricatura', tag: 'Plataforma', xp: 65 },
        { id: 'l148', name: 'Curso completo de Retrato a Lápiz', tag: 'Plataforma', xp: 75 },
        { id: 'l149', name: 'Master Class de Dibujo con MANCHA (carboncillo)', tag: 'Plataforma', xp: 80 },
        { id: 'l150', name: 'Dibuja Mejor en solo 21 Días', tag: 'Plataforma', xp: 70 },
        { id: 'l151', name: 'Aprende Dibujo Artístico fácilmente (A. G. Villarán)', tag: 'Udemy', xp: 80 },
      ]},
      { id: 's8m2', name: 'Ilustración Digital', icon: '🖥️', lessons: [
        { id: 'l152', name: 'Introducción a Adobe Illustrator', tag: 'Plataforma', xp: 75 },
        { id: 'l153', name: 'Ilustración con Carles Dalmau — EN PROGRESO', tag: 'Plataforma', xp: 85 },
        { id: 'l154', name: 'Retrato Realista en Digital (masterclass)', tag: 'Plataforma', xp: 85 },
        { id: 'l155', name: 'Procreate desde cero', tag: 'Plataforma', xp: 75 },
        { id: 'l156', name: 'Diseño vectorial avanzado', tag: 'Plataforma', xp: 80 },
      ]},
    ]
  },
];

const CHALLENGES = [
  { id: 'c1', text: 'Completa una lección hoy', xp: 20 },
  { id: 'c2', text: 'Practica 30 min de edición', xp: 25 },
  { id: 'c3', text: 'Crea un clip corto aplicando lo aprendido', xp: 30 },
  { id: 'c4', text: 'Estudia un tutorial de color grading', xp: 20 },
  { id: 'c5', text: 'Revisa tus notas del día anterior', xp: 15 },
  { id: 'c6', text: 'Exporta un proyecto terminado', xp: 35 },
  { id: 'c7', text: 'Aprende un atajo de teclado nuevo', xp: 10 },
  { id: 'c8', text: 'Diseña una thumbnail para un video', xp: 25 },
  { id: 'c9', text: 'Automatiza una tarea con IA', xp: 30 },
  { id: 'c10', text: 'Publica contenido en redes sociales', xp: 20 },
];

const TAG_COLORS = {
  Plataforma: C.purple, YT: C.rust, Udemy: '#e67e22',
  Curso: C.blue, Academy: C.sage, Drive: '#6a8f9e',
  Gratis: C.sage, Libro: C.gold, 'BIG school': '#9e5a8f',
  PDF: '#7a7590', Video: C.blue,
};

export default function App() {
  const [completed, setCompleted] = useState({});
  const [challenges, setChallenges] = useState({});
  const [xp, setXp] = useState(0);
  const [selectedSem, setSelectedSem] = useState(null);
  const [tab, setTab] = useState('home');
  const [toastMsg, setToastMsg] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const c = await AsyncStorage.getItem('completed');
      const ch = await AsyncStorage.getItem('challenges');
      const x = await AsyncStorage.getItem('xp');
      if (c) setCompleted(JSON.parse(c));
      if (ch) setChallenges(JSON.parse(ch));
      if (x) setXp(parseInt(x));
    } catch (e) {}
  };

  const saveData = async (c, ch, x) => {
    try {
      await AsyncStorage.setItem('completed', JSON.stringify(c));
      await AsyncStorage.setItem('challenges', JSON.stringify(ch));
      await AsyncStorage.setItem('xp', String(x));
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const toggleLesson = (lessonId, lessonXp) => {
    const newCompleted = { ...completed };
    let newXp = xp;
    if (newCompleted[lessonId]) {
      delete newCompleted[lessonId];
      newXp = Math.max(0, newXp - lessonXp);
      showToast('Lección desmarcada');
    } else {
      newCompleted[lessonId] = true;
      newXp += lessonXp;
      showToast(`+${lessonXp} XP ganado!`);
    }
    setCompleted(newCompleted);
    setXp(newXp);
    saveData(newCompleted, challenges, newXp);
  };

  const toggleChallenge = (challengeId, challengeXp) => {
    const today = new Date().toDateString();
    const key = `${challengeId}_${today}`;
    const newChallenges = { ...challenges };
    let newXp = xp;
    if (newChallenges[key]) {
      delete newChallenges[key];
      newXp = Math.max(0, newXp - challengeXp);
    } else {
      newChallenges[key] = true;
      newXp += challengeXp;
      showToast(`Desafío completado! +${challengeXp} XP`);
    }
    setChallenges(newChallenges);
    setXp(newXp);
    saveData(completed, newChallenges, newXp);
  };

  const isChallengeComplete = (id) => {
    const today = new Date().toDateString();
    return !!challenges[`${id}_${today}`];
  };

  const totalLessons = CURRICULUM.reduce((a, s) =>
    a + s.modules.reduce((b, m) => b + m.lessons.length, 0), 0);
  const completedCount = Object.keys(completed).length;
  const progress = totalLessons > 0 ? completedCount / totalLessons : 0;
  const level = Math.floor(xp / 500) + 1;
  const levelXp = xp % 500;

  const getSemProgress = (sem) => {
    const total = sem.modules.reduce((a, m) => a + m.lessons.length, 0);
    const done = sem.modules.reduce((a, m) =>
      a + m.lessons.filter(l => completed[l.id]).length, 0);
    return total > 0 ? done / total : 0;
  };

  const renderHome = () => (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.heroCard}>
        <Text style={s.heroTitle}>Universidad del{'\n'}Nómada Digital</Text>
        <Text style={s.heroSub}>Tu progreso de hoy</Text>
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{xp.toLocaleString()}</Text>
            <Text style={s.statLabel}>XP Total</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>Nv.{level}</Text>
            <Text style={s.statLabel}>Nivel</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{completedCount}/{totalLessons}</Text>
            <Text style={s.statLabel}>Lecciones</Text>
          </View>
        </View>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${progress * 100}%`, backgroundColor: C.gold }]} />
        </View>
        <Text style={s.progressText}>{Math.round(progress * 100)}% completado</Text>
        <View style={s.levelBar}>
          <View style={[s.levelFill, { width: `${(levelXp / 500) * 100}%` }]} />
        </View>
        <Text style={s.levelText}>{levelXp}/500 XP para nivel {level + 1}</Text>
      </View>

      <Text style={s.sectionTitle}>Desafíos de Hoy</Text>
      {CHALLENGES.slice(0, 5).map(ch => {
        const done = isChallengeComplete(ch.id);
        return (
          <TouchableOpacity key={ch.id} style={[s.challengeCard, done && s.challengeDone]}
            onPress={() => toggleChallenge(ch.id, ch.xp)}>
            <Text style={s.challengeCheck}>{done ? '✅' : '⭕'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.challengeText, done && { color: C.textMuted }]}>{ch.text}</Text>
            </View>
            <Text style={s.challengeXp}>+{ch.xp} XP</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={s.sectionTitle}>Semestres</Text>
      {CURRICULUM.map(sem => {
        const prog = getSemProgress(sem);
        return (
          <TouchableOpacity key={sem.id} style={s.semCard}
            onPress={() => { setSelectedSem(sem); setTab('sem'); }}>
            <Text style={s.semEmoji}>{sem.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.semNum}>Semestre {sem.sem}</Text>
              <Text style={s.semTitle}>{sem.title}</Text>
              <View style={s.semBar}>
                <View style={[s.semFill, { width: `${prog * 100}%`, backgroundColor: sem.color }]} />
              </View>
              <Text style={s.semProg}>{Math.round(prog * 100)}%</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderSem = () => {
    if (!selectedSem) return null;
    return (
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backBtn} onPress={() => { setTab('home'); setSelectedSem(null); }}>
          <Text style={s.backText}>← Volver</Text>
        </TouchableOpacity>
        <View style={[s.semHeader, { borderColor: selectedSem.color }]}>
          <Text style={s.semHeaderEmoji}>{selectedSem.emoji}</Text>
          <Text style={s.semHeaderTitle}>{selectedSem.title}</Text>
          <Text style={s.semHeaderSub}>{selectedSem.subtitle}</Text>
        </View>
        {selectedSem.modules.map(mod => (
          <View key={mod.id} style={s.modCard}>
            <Text style={s.modTitle}>{mod.icon} {mod.name}</Text>
            {mod.lessons.map(lesson => {
              const done = !!completed[lesson.id];
              const tagColor = TAG_COLORS[lesson.tag] || C.textMuted;
              return (
                <TouchableOpacity key={lesson.id} style={[s.lessonRow, done && s.lessonDone]}
                  onPress={() => toggleLesson(lesson.id, lesson.xp)}>
                  <Text style={s.lessonCheck}>{done ? '✅' : '⬜'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.lessonName, done && { color: C.textMuted }]}>{lesson.name}</Text>
                    <View style={[s.tagBadge, { backgroundColor: tagColor + '33' }]}>
                      <Text style={[s.tagText, { color: tagColor }]}>{lesson.tag}</Text>
                    </View>
                  </View>
                  <Text style={s.lessonXp}>+{lesson.xp}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  const renderStats = () => {
    const semStats = CURRICULUM.map(sem => {
      const total = sem.modules.reduce((a, m) => a + m.lessons.length, 0);
      const done = sem.modules.reduce((a, m) =>
        a + m.lessons.filter(l => completed[l.id]).length, 0);
      return { ...sem, total, done, prog: total > 0 ? done / total : 0 };
    });
    return (
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Estadísticas</Text>
        <View style={s.statsGrid}>
          <View style={s.statCard}>
            <Text style={s.statCardNum}>{xp.toLocaleString()}</Text>
            <Text style={s.statCardLabel}>XP Total</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statCardNum}>Nv.{level}</Text>
            <Text style={s.statCardLabel}>Nivel actual</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statCardNum}>{completedCount}</Text>
            <Text style={s.statCardLabel}>Completadas</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statCardNum}>{totalLessons - completedCount}</Text>
            <Text style={s.statCardLabel}>Pendientes</Text>
          </View>
        </View>
        <Text style={s.sectionTitle}>Por Semestre</Text>
        {semStats.map(sem => (
          <View key={sem.id} style={s.semStatCard}>
            <Text style={s.semStatEmoji}>{sem.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.semStatTitle}>{sem.title}</Text>
              <Text style={s.semStatCount}>{sem.done}/{sem.total} lecciones</Text>
              <View style={s.semBar}>
                <View style={[s.semFill, { width: `${sem.prog * 100}%`, backgroundColor: sem.color }]} />
              </View>
            </View>
            <Text style={[s.semStatPct, { color: sem.color }]}>{Math.round(sem.prog * 100)}%</Text>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={s.header}>
        <Text style={s.headerTitle}>
          {tab === 'home' ? '🎓 UND AVAI' : tab === 'sem' && selectedSem ? selectedSem.emoji + ' S' + selectedSem.sem : '📊 Stats'}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'home' && renderHome()}
        {tab === 'sem' && renderSem()}
        {tab === 'stats' && renderStats()}
      </View>

      <View style={s.tabBar}>
        <TouchableOpacity style={s.tabBtn} onPress={() => { setTab('home'); setSelectedSem(null); }}>
          <Text style={[s.tabIcon, tab === 'home' && { color: C.gold }]}>🏠</Text>
          <Text style={[s.tabLabel, tab === 'home' && { color: C.gold }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.tabBtn} onPress={() => setTab('stats')}>
          <Text style={[s.tabIcon, tab === 'stats' && { color: C.gold }]}>📊</Text>
          <Text style={[s.tabLabel, tab === 'stats' && { color: C.gold }]}>Stats</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[s.toast, { opacity: toastAnim,
        transform: [{ translateY: toastAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }] }]}>
        <Text style={s.toastText}>{toastMsg}</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { paddingTop: 50, paddingBottom: 12, paddingHorizontal: 20, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { color: C.gold, fontSize: 20, fontWeight: 'bold' },
  heroCard: { backgroundColor: C.card, borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: C.border },
  heroTitle: { color: C.gold, fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  heroSub: { color: C.textMuted, fontSize: 13, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { alignItems: 'center' },
  statNum: { color: C.gold, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: C.textMuted, fontSize: 11 },
  progressBar: { height: 6, backgroundColor: C.border, borderRadius: 3, marginBottom: 4 },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { color: C.textMuted, fontSize: 12, marginBottom: 10 },
  levelBar: { height: 4, backgroundColor: C.border, borderRadius: 2, marginBottom: 4 },
  levelFill: { height: 4, borderRadius: 2, backgroundColor: C.purple },
  levelText: { color: C.textMuted, fontSize: 11 },
  sectionTitle: { color: C.cream, fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 10 },
  challengeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  challengeDone: { borderColor: C.sage + '44', backgroundColor: C.sage + '11' },
  challengeCheck: { fontSize: 18, marginRight: 10 },
  challengeText: { color: C.text, fontSize: 14 },
  challengeXp: { color: C.gold, fontSize: 13, fontWeight: 'bold' },
  semCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  semEmoji: { fontSize: 28, marginRight: 14 },
  semNum: { color: C.textMuted, fontSize: 11 },
  semTitle: { color: C.text, fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  semBar: { height: 4, backgroundColor: C.border, borderRadius: 2, marginBottom: 2 },
  semFill: { height: 4, borderRadius: 2 },
  semProg: { color: C.textMuted, fontSize: 11 },
  backBtn: { marginTop: 12, marginBottom: 4 },
  backText: { color: C.gold, fontSize: 16 },
  semHeader: { backgroundColor: C.card, borderRadius: 14, padding: 20, marginBottom: 16, borderWidth: 2 },
  semHeaderEmoji: { fontSize: 36, marginBottom: 6 },
  semHeaderTitle: { color: C.cream, fontSize: 18, fontWeight: 'bold' },
  semHeaderSub: { color: C.textMuted, fontSize: 13 },
  modCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  modTitle: { color: C.gold, fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  lessonDone: { opacity: 0.7 },
  lessonCheck: { fontSize: 16, marginRight: 10 },
  lessonName: { color: C.text, fontSize: 13, marginBottom: 4 },
  tagBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: 'bold' },
  lessonXp: { color: C.gold, fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  pageTitle: { color: C.cream, fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  statCard: { backgroundColor: C.card, borderRadius: 12, padding: 16, width: (width - 52) / 2, borderWidth: 1, borderColor: C.border },
  statCardNum: { color: C.gold, fontSize: 24, fontWeight: 'bold' },
  statCardLabel: { color: C.textMuted, fontSize: 12 },
  semStatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  semStatEmoji: { fontSize: 24, marginRight: 12 },
  semStatTitle: { color: C.text, fontSize: 13, fontWeight: 'bold' },
  semStatCount: { color: C.textMuted, fontSize: 11, marginBottom: 4 },
  semStatPct: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  tabBar: { flexDirection: 'row', backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: 20, paddingTop: 8 },
  tabBtn: { flex: 1, alignItems: 'center' },
  tabIcon: { fontSize: 22, color: C.textMuted },
  tabLabel: { color: C.textMuted, fontSize: 11, marginTop: 2 },
  toast: { position: 'absolute', bottom: 90, alignSelf: 'center', backgroundColor: C.gold, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  toastText: { color: C.bg, fontWeight: 'bold', fontSize: 14 },
});
