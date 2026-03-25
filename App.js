import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, SafeAreaView, Dimensions, Modal, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'undavai_progress';

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
  teal: '#2dd4bf',
  blueClear: '#60a5fa',
  orange: '#c4883a',
  grayBlue: '#6a8f9e',
  mauve: '#9e5a8f',
  yellow: '#facc15',
  pink: '#f472b6',
  text: '#e8e0d5',
  textMuted: '#7a7590',
};

const XP_PER_LEVEL = 500;

const DAILY_CHALLENGES = [
  { id: 'dc1',  text: 'Completa una lección hoy',              xp: 10 },
  { id: 'dc2',  text: 'Practica edición 30 minutos',           xp: 15 },
  { id: 'dc3',  text: 'Dibuja o ilustra algo nuevo',           xp: 10 },
  { id: 'dc4',  text: 'Aprende un prompt nuevo de IA',         xp: 10 },
  { id: 'dc5',  text: 'Publica contenido en redes sociales',   xp: 20 },
  { id: 'dc6',  text: 'Trabaja en tu portafolio freelance',    xp: 15 },
  { id: 'dc7',  text: 'Lee 20 páginas o un resumen',           xp: 10 },
  { id: 'dc8',  text: 'Practica inglés 15 minutos',            xp: 10 },
  { id: 'dc9',  text: 'Modela algo en Blender',                xp: 20 },
  { id: 'dc10', text: 'Estudia teoría del color',              xp: 10 },
  { id: 'dc11', text: 'Escribe código por 20 minutos',         xp: 15 },
  { id: 'dc12', text: 'Investiga un tema de crypto',           xp: 10 },
  { id: 'dc13', text: 'Graba un video de práctica',            xp: 20 },
  { id: 'dc14', text: 'Optimiza tu perfil en Fiverr/Workana',  xp: 15 },
  { id: 'dc15', text: 'Haz un boceto de animación',            xp: 15 },
  { id: 'dc16', text: 'Estudia composición visual',            xp: 10 },
  { id: 'dc17', text: 'Practica doblaje o locución',           xp: 15 },
  { id: 'dc18', text: 'Aprende un shortcut nuevo de software', xp: 5  },
  { id: 'dc19', text: 'Revisa tu avance semanal',              xp: 10 },
  { id: 'dc20', text: 'Contacta a un cliente potencial',       xp: 25 },
];

// ─── CURRICULUM DATA ───────────────────────────────────────────────────────────
const CURRICULUM = [
  // ════════════════════════════════════════
  // S1 — Maestría en Herramientas de Edición
  // ════════════════════════════════════════
  {
    id: 's1', sem: '01', title: 'Maestría en Edición', subtitle: 'Herramientas & Software Pro',
    emoji: '🎬', color: C.blue,
    modules: [
      {
        id: 's1m1', name: 'Creator Club', icon: '🎯',
        lessons: [
          { id: 'l001', name: 'Comunidad y Primeros Pasos', tag: 'Creator Club', xp: 60 },
          { id: 'l002', name: 'Packs de Recursos (Parte 1)', tag: 'Creator Club', xp: 60 },
          { id: 'l003', name: 'Packs de Recursos (Parte 2)', tag: 'Creator Club', xp: 60 },
          { id: 'l004', name: 'Plugins para After Effects: ahorra tiempo', tag: 'Creator Club', xp: 70 },
          { id: 'l005', name: 'Edición en Premiere y After Effects (20 lecciones)', tag: 'Creator Club', xp: 130 },
          { id: 'l006', name: 'Edición en CapCut Móvil (6 lecciones)', tag: 'Creator Club', xp: 90 },
          { id: 'l007', name: 'Edición en CapCut (16 lecciones)', tag: 'Creator Club', xp: 120 },
          { id: 'l008', name: 'Edición en DaVinci Resolve (7 lecciones)', tag: 'Creator Club', xp: 100 },
          { id: 'l009', name: 'Branding e Identidad de Marca', tag: 'Creator Club', xp: 70 },
          { id: 'l010', name: 'Guionizado Viral con IA', tag: 'Creator Club', xp: 70 },
        ],
      },
      {
        id: 's1m2', name: 'Adobe Suite', icon: '🎞️',
        lessons: [
          { id: 'l011', name: 'Adobe After Effects — RGB Escuela', tag: 'Plataforma', xp: 90 },
          { id: 'l012', name: 'Adobe Premiere — RGB Escuela', tag: 'Plataforma', xp: 90 },
          { id: 'l013', name: 'After Effects Avanzado — RGB Escuela', tag: 'Plataforma', xp: 100 },
          { id: 'l014', name: 'Cómo usar tu Cámara — RGB Escuela', tag: 'Plataforma', xp: 70 },
          { id: 'l015', name: 'Iniciación a Adobe Premiere Pro', tag: 'Paper Monster', xp: 80 },
          { id: 'l016', name: 'Adobe Premiere Pro Basics', tag: 'Josh Werner', xp: 70 },
          { id: 'l017', name: 'Adobe After Effects Basics', tag: 'Josh Werner', xp: 70 },
          { id: 'l018', name: 'Adobe Audition Basics', tag: 'Josh Werner', xp: 60 },
          { id: 'l019', name: 'Adobe After Effects (curso alternativo)', tag: 'Udemy', xp: 90 },
          { id: 'l020', name: 'Adobe Premiere (curso Udemy)', tag: 'Udemy', xp: 90 },
          { id: 'l021', name: 'Aprende a editar videos desde 0 con MOVAVI', tag: 'Udemy', xp: 70 },
          { id: 'l022', name: 'Adobe CC Masterclass: Illustrator, Photoshop & After Effects', tag: 'Udemy', xp: 120 },
          { id: 'l023', name: 'Creación de Thumbnails para YouTube en Photoshop CC', tag: 'Udemy', xp: 70 },
          { id: 'l024', name: 'Master SaaS Motion Graphics in 30 Minutes - After Effects', tag: 'YT', xp: 60 },
        ],
      },
      {
        id: 's1m3', name: 'Videos Referencia', icon: '▶️',
        lessons: [
          { id: 'l025', name: 'Como Hacer Edición DINÁMICA Nivel VIRAL con CapCut', tag: 'YT', xp: 60 },
          { id: 'l026', name: 'Viral Podcast Reel Editing in Premiere Pro', tag: 'YT', xp: 60 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S2 — El Estándar de Hollywood
  // ════════════════════════════════════════
  {
    id: 's2', sem: '02', title: 'El Estándar de Hollywood', subtitle: 'DaVinci Mastery',
    emoji: '🎥', color: C.purple,
    modules: [
      {
        id: 's2m1', name: 'Blender & 3D', icon: '🧊',
        lessons: [
          { id: 'l027', name: 'Blender Core (Iniciación)', tag: 'Auraprods', xp: 80 },
        ],
      },
      {
        id: 's2m2', name: 'DaVinci: Fundamentos', icon: '🎬',
        lessons: [
          { id: 'l028', name: '10 Primeros Pasos en DaVinci - RBG Escuela', tag: 'YT', xp: 60 },
          { id: 'l029', name: 'Curso DaVinci Resolve 20 Clase #1 - El Mono Editor', tag: 'YT', xp: 70 },
          { id: 'l030', name: 'Curso DaVinci Resolve 20 - Yoney Gallardo 4h30', tag: 'YT', xp: 100 },
          { id: 'l031', name: 'Introduction to DaVinci Full Masterclass 2026 - Casey Faris', tag: 'YT', xp: 100 },
          { id: 'l032', name: 'DaVinci Resolve 20 Complete Tutorial Beginners 2026 - Justin Brown', tag: 'YT', xp: 100 },
          { id: 'l033', name: 'Full Video Editing Course for YouTube 4h - Marcus Jones', tag: 'YT', xp: 100 },
          { id: 'l034', name: 'Master DaVinci Resolve 20 From Basics to Pro - Resolve Cut', tag: 'YT', xp: 90 },
          { id: 'l035', name: 'Everything You Need to Start Editing DaVinci 2026 - Bring Your Own Laptop', tag: 'YT', xp: 80 },
          { id: 'l036', name: 'EL MEJOR PROGRAMA para EDITAR VIDEOS GRATIS - Aura Prods', tag: 'YT', xp: 60 },
          { id: 'l037', name: 'MEJORA tu EDICIÓN con estos TIPS - Juan Ignacio Cali', tag: 'YT', xp: 60 },
          { id: 'l038', name: '9 COSAS que APRENDÍ tras EDITAR +10.000 Horas - Mirko Vigna', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's2m3', name: 'Color Grading', icon: '🎨',
        lessons: [
          { id: 'l039', name: 'DaVinci Resolve Color Grading 2026 Tutorial Completo - Ramiro Maya', tag: 'YT', xp: 90 },
          { id: 'l040', name: 'El Único Tutorial de Colorización - AlwaysJoan', tag: 'YT', xp: 80 },
          { id: 'l041', name: 'How to Color Grade Skin Tones Like A Pro - George.Colorist', tag: 'YT', xp: 80 },
          { id: 'l042', name: '7 MITOS de EDICIÓN de VIDEO que AUN CREES - Mirko Vigna', tag: 'YT', xp: 60 },
        ],
      },
      {
        id: 's2m4', name: 'Motion Graphics & VFX', icon: '✨',
        lessons: [
          { id: 'l043', name: 'How to Edit Advanced Animations DaVinci IN-DEPTH - Zane Hoyer', tag: 'YT', xp: 90 },
          { id: 'l044', name: 'How to Edit Netflix-Level 3D Animations - Zane Hoyer', tag: 'YT', xp: 100 },
          { id: 'l045', name: 'How to Edit Cinematic Animations - Zane Hoyer', tag: 'YT', xp: 90 },
          { id: 'l046', name: 'How To Edit Viral 3-D Videos - Zane Hoyer', tag: 'YT', xp: 80 },
          { id: 'l047', name: 'How to Edit SAAS Animations - Zane Hoyer', tag: 'YT', xp: 80 },
          { id: 'l048', name: 'How to Edit High-End Motion Graphics - Zane Hoyer', tag: 'YT', xp: 90 },
          { id: 'l049', name: 'How VFX Artists Rotoscope Anything DaVinci 20 - Kevin Vandermarliere', tag: 'YT', xp: 80 },
          { id: 'l050', name: 'Create VIRAL Text Effects in DaVinci - Amro', tag: 'YT', xp: 70 },
          { id: 'l051', name: 'Viral Clean Motion Graphics Tutorial - Ritu Solanki', tag: 'YT', xp: 70 },
          { id: 'l052', name: 'This Is How You Animate Like a VIRAL Creator Fusion - The Resolve Effect', tag: 'YT', xp: 80 },
          { id: 'l053', name: 'Como usar FUSION FÁCIL en DaVinci - Lorenzo', tag: 'YT', xp: 70 },
          { id: 'l054', name: 'Fusion en DaVinci Resolve De CERO a PRO - Cesar Quintus', tag: 'YT', xp: 90 },
          { id: 'l055', name: 'Esto Cambió mi forma de hacer Videos Anima sin Keyframes - Mostro Lab', tag: 'YT', xp: 70 },
          { id: 'l056', name: 'Texturing of Complex Surfaces Track Anything - Jamie Fenn', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's2m5', name: 'Transiciones & Técnicas Avanzadas', icon: '⚡',
        lessons: [
          { id: 'l057', name: 'Master DaVinci Resolve Advanced Animation 7h - GrowTuber Guide', tag: 'YT', xp: 120 },
          { id: 'l058', name: 'Clase FILTRADA: Como editar Reel VIRALES en Davinci - Lorenzo', tag: 'YT', xp: 80 },
          { id: 'l059', name: '+10.000 HORAS en DaVinci resumidas en 20 TRUCOS - Lorenzo', tag: 'YT', xp: 80 },
          { id: 'l060', name: '3 Viral Real Estate Transitions - Joel Van Beek', tag: 'YT', xp: 60 },
          { id: 'l061', name: 'Create Stunning Split Object Transition - VideoEditingCentral', tag: 'YT', xp: 60 },
          { id: 'l062', name: 'Subtítulos Automáticos DINÁMICOS DaVinci - Cesar Quintus', tag: 'YT', xp: 70 },
          { id: 'l063', name: 'Como hacer SUBTÍTULOS VIRALES en Davinci - Lorenzo', tag: 'YT', xp: 70 },
          { id: 'l064', name: 'VIDEOS VERTICALES EN DAVINCI para Shorts TikToks Reels - DaVinci Bro', tag: 'YT', xp: 70 },
          { id: 'l065', name: 'The Best Way to Create Macros in DaVinci - Jake Wipp & Matt McCool', tag: 'YT', xp: 70 },
          { id: 'l066', name: 'Domina las TRANSICIONES en Kdenlive GRATIS - JGuidus-Media', tag: 'YT', xp: 60 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S3 — Redes Sociales & Copywriting
  // ════════════════════════════════════════
  {
    id: 's3', sem: '03', title: 'Redes Sociales & Copywriting', subtitle: 'Algoritmos & Contenido Viral',
    emoji: '📱', color: C.rust,
    modules: [
      {
        id: 's3m1', name: 'SEO & Algoritmos YouTube', icon: '🔍',
        lessons: [
          { id: 'l067', name: 'Estrategia SEO para Multiplicar CPM x5 - Romuald Fons', tag: 'YT', xp: 80 },
          { id: 'l068', name: 'El secreto SEO de Mr. Beast - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l069', name: 'Consigue MILLONES de visualizaciones - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l070', name: 'Exponiendo el Nuevo Algoritmo Instagram', tag: 'YT', xp: 60 },
          { id: 'l071', name: '5 Claves del SEO en Instagram - Metricool', tag: 'YT', xp: 60 },
        ],
      },
      {
        id: 's3m2', name: 'Instagram & LinkedIn', icon: '📸',
        lessons: [
          { id: 'l072', name: 'Como CRECER en Instagram 2025 - Pedro SEO', tag: 'YT', xp: 70 },
          { id: 'l073', name: 'La guía definitiva 0 a 1M views Instagram', tag: 'YT', xp: 80 },
          { id: 'l074', name: 'Marketing en Instagram para tu empresa', tag: 'Udemy', xp: 80 },
          { id: 'l075', name: 'LinkedIn Content Writing Free Course - Matthew Lakajev', tag: 'YT', xp: 70 },
          { id: 'l076', name: 'The Best LinkedIn Growth Strategy - Neil Patel', tag: 'YT', xp: 70 },
          { id: 'l077', name: 'Mi estrategia para crecer +10.000 en LinkedIn - Luis Garau', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's3m3', name: 'TikTok & Ads', icon: '🎵',
        lessons: [
          { id: 'l078', name: 'SEO en TikTok Guía completa - Pedro SEO', tag: 'YT', xp: 70 },
          { id: 'l079', name: 'Como hacer SEO para TikTok - HubSpot', tag: 'YT', xp: 60 },
          { id: 'l080', name: 'Facebook Ads para Principiantes - Andres Garza', tag: 'YT', xp: 70 },
          { id: 'l081', name: 'Tutorial Completo Meta Ads 0 a $$$ 9h', tag: 'YT', xp: 120 },
        ],
      },
      {
        id: 's3m4', name: 'YouTube Strategy', icon: '▶️',
        lessons: [
          { id: 'l082', name: 'YouTube MASTER', tag: 'Paper Monster', xp: 100 },
          { id: 'l083', name: "Ninja's Guide to Streaming: Grow Your Channel", tag: 'Udemy', xp: 80 },
          { id: 'l084', name: 'VideoMarketer', tag: 'Emprende Aprendiendo', xp: 90 },
          { id: 'l085', name: 'Haz tu Video Viral con Gancho - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l086', name: 'Tengo 60.000 suscriptores y sin ventas', tag: 'YT', xp: 60 },
          { id: 'l087', name: 'Así NO vas a vivir de YouTube - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l088', name: 'Cuanto gano con YouTube? - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l089', name: 'Tu Videos NO funcionan? - Romuald Fons', tag: 'YT', xp: 60 },
        ],
      },
      {
        id: 's3m5', name: 'Copywriting', icon: '✍️',
        lessons: [
          { id: 'l090', name: 'Clase de Copywriting Vende x9 - Romuald Fons', tag: 'YT', xp: 80 },
          { id: 'l091', name: 'El Nuevo Copywriting - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l092', name: 'Curso GRATIS de Copywriting completo +5h', tag: 'YT', xp: 100 },
          { id: 'l093', name: '4 Years of Copywriting Advice - Cardinal Mason', tag: 'YT', xp: 70 },
          { id: 'l094', name: 'Copywriting y su importancia - Evonny Oficial', tag: 'YT', xp: 60 },
        ],
      },
      {
        id: 's3m6', name: 'Thumbnails & Recursos', icon: '🖼️',
        lessons: [
          { id: 'l095', name: 'Viral Thumbnail Template Pack', tag: 'Curso', xp: 70 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S4 — La Revolución de la IA
  // ════════════════════════════════════════
  {
    id: 's4', sem: '04', title: 'La Revolución de la IA', subtitle: 'Herramientas & Automatización',
    emoji: '🤖', color: C.gold,
    modules: [
      {
        id: 's4m1', name: 'IA Plataforma (Roco de la Portilla)', icon: '🧠',
        lessons: [
          { id: 'l096', name: 'Roco Prompts', tag: 'Plataforma', xp: 70 },
          { id: 'l097', name: 'Nano Banana (Google IA)', tag: 'Plataforma', xp: 70 },
          { id: 'l098', name: 'VEO 3 (Video con IA)', tag: 'Plataforma', xp: 80 },
          { id: 'l099', name: 'Flux AI (Imagen)', tag: 'Plataforma', xp: 80 },
          { id: 'l100', name: 'Videos Virales con IA', tag: 'Plataforma', xp: 80 },
          { id: 'l101', name: 'Runway AI', tag: 'Plataforma', xp: 80 },
          { id: 'l102', name: 'Kling AI +3h', tag: 'Plataforma', xp: 90 },
          { id: 'l103', name: 'Curso de Midjourney I.A. +10h', tag: 'Plataforma', xp: 120 },
        ],
      },
      {
        id: 's4m2', name: 'Automatización Make / N8N', icon: '⚙️',
        lessons: [
          { id: 'l104', name: 'Curso Completo De Make: Como Crear y Vender Automatizaciones IA - Adrian Saenz', tag: 'YT', xp: 100 },
          { id: 'l105', name: 'Como Crear Chatbots de IA Desde Cero Botpress - UDIA', tag: 'YT', xp: 90 },
          { id: 'l106', name: 'N8N CURSO COMPLETO 6 HORAS - Agustin Medina', tag: 'YT', xp: 120 },
          { id: 'l107', name: 'Curso Completo De N8N: Como Crear y Vender Agentes IA - Adrian Saenz', tag: 'YT', xp: 100 },
          { id: 'l108', name: 'Power Automate Tutorial Beginner To Pro - Pragmatic Works', tag: 'YT', xp: 90 },
          { id: 'l109', name: 'Copilot Microsoft 365 Curso Completo - Miquel Nadal Vela', tag: 'YT', xp: 90 },
          { id: 'l110', name: 'Aprende con los nerds Copilot Studio - Pragmatic Works', tag: 'YT', xp: 80 },
          { id: 'l111', name: 'Automatiza las REDES Sociales por IA - Alejavi Rivera', tag: 'YT', xp: 70 },
          { id: 'l112', name: 'Automatización de Redes Sociales con IA y Make.com - CentelA Education', tag: 'YT', xp: 70 },
          { id: 'l113', name: 'Esta IA Crea Contenido Diario Para Redes Sociales - Adrian Saenz', tag: 'YT', xp: 70 },
          { id: 'l114', name: 'Me volví loco y automaticé TODO mi trabajo - Guinxu', tag: 'YT', xp: 70 },
          { id: 'l115', name: 'Como Instalar LLM en local y usarlo en la nube - Jose Andonaire', tag: 'YT', xp: 70 },
          { id: 'l116', name: 'Tutorial completo Google Workspace AI Gemini 2025 - Stewart Gauld', tag: 'YT', xp: 80 },
          { id: 'l117', name: 'Get started with Google Workspace Studio', tag: 'YT', xp: 60 },
          { id: 'l118', name: 'Google Workspace Studio NUEVO 2026 - EdTrainer Tv', tag: 'YT', xp: 60 },
          { id: 'l119', name: 'Google Workspace Studio AI Lo NUEVO de GOOGLE - Buildt Academy', tag: 'YT', xp: 60 },
          { id: 'l120', name: 'Google Workspace Studio: Automate work with AI agents', tag: 'YT', xp: 70 },
          { id: 'l121', name: 'Automatiza Gmail con IA - netCloud', tag: 'YT', xp: 60 },
          { id: 'l122', name: 'La forma CORRECTA de automatizar WhatsApp con COEXISTANCE - Kevin Belier', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's4m3', name: 'ComfyUI & Imagen IA', icon: '🖼️',
        lessons: [
          { id: 'l123', name: 'ComfyUI para PRINCIPIANTES - Nekodificador', tag: 'YT', xp: 80 },
          { id: 'l124', name: 'Aprende ComfyUI desde CERO 2025 - IA SIN FILTROS', tag: 'YT', xp: 90 },
          { id: 'l125', name: 'Master AI image generation ComfyUI FULL TUTORIAL - AI Search', tag: 'YT', xp: 100 },
          { id: 'l126', name: 'How to use ComfyUI for beginners - Sebastian Kamph', tag: 'YT', xp: 80 },
          { id: 'l127', name: 'Master Midjourney Updated Beginner to Advanced - Futurepedia', tag: 'YT', xp: 90 },
          { id: 'l128', name: 'DOMINA Midjourney GUIA COMPLETA - Ruva IA', tag: 'YT', xp: 90 },
          { id: 'l129', name: 'The Freepik AI Masterclass 2026 - Ludovit Nastišin', tag: 'YT', xp: 80 },
          { id: 'l130', name: 'Así generé mis fotos más ÉPICAS con IA Flux + ComfyUI + LoRA - Nate Gentile', tag: 'YT', xp: 80 },
          { id: 'l131', name: 'Stable Diffusion - Guía Completa', tag: 'YT', xp: 90 },
        ],
      },
      {
        id: 's4m4', name: 'Avatares, Voz & Video IA', icon: '🎭',
        lessons: [
          { id: 'l132', name: 'Intro to HeyGen: AI Avatars - HeyGen', tag: 'YT', xp: 60 },
          { id: 'l133', name: 'HeyGen AI Avatar Tutorial Complete Workflow - AI Automation Station', tag: 'YT', xp: 80 },
          { id: 'l134', name: 'The NEW Way to Create Realistic Talking AI Avatars - Tao Prompts', tag: 'YT', xp: 70 },
          { id: 'l135', name: 'La nueva tendencia del 2026: Avatares con IA Heygen - CentelA Education', tag: 'YT', xp: 70 },
          { id: 'l136', name: 'Curso de ElevenLabs: Texto a Voz & Voz a Voz - Diego Cardenas', tag: 'YT', xp: 80 },
          { id: 'l137', name: 'How To Use Elevenlabs Master AI Voice Generator - Dan Kieft', tag: 'YT', xp: 80 },
          { id: 'l138', name: 'Free Runway AI Video Generation Beginner Course NEWEST UPDATES', tag: 'YT', xp: 80 },
          { id: 'l139', name: 'Create Cinematic AI Videos with Runway Gen-4 - Tao Prompts', tag: 'YT', xp: 80 },
          { id: 'l140', name: 'Runway para principiantes: personajes y videos con IA - CentelA Education', tag: 'YT', xp: 70 },
          { id: 'l141', name: 'How to Use Adobe Firefly Ultimate AI Platform - Jason Gandy', tag: 'YT', xp: 80 },
          { id: 'l142', name: 'ADOBE FIREFLY 2025 GUIA COMPLETA - Camilo Adobe', tag: 'YT', xp: 80 },
          { id: 'l143', name: 'The Only Synthesia AI Tutorial - Simon Crowe', tag: 'YT', xp: 70 },
          { id: 'l144', name: 'Esta IA genera videos FALSOS de mi - Nate Gentile', tag: 'YT', xp: 60 },
          { id: 'l145', name: 'He clonado mi estudio con Inteligencia Artificial - Nate Gentile', tag: 'YT', xp: 60 },
          { id: 'l146', name: 'Como Delphi.ai crea tu gemelo digital perfecto - Joe Fier', tag: 'YT', xp: 60 },
          { id: 'l147', name: 'Crea tu propio clon con IA en 15 minutos - Emprende Aprendiendo', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l148', name: 'Clon IA Euge Oller', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l149', name: 'MEJORÓ mi EMPRESA usando IA: Chatbots LLM RAG - Nate Gentile', tag: 'YT', xp: 80 },
        ],
      },
      {
        id: 's4m5', name: 'ChatGPT / Claude / Gemini', icon: '💬',
        lessons: [
          { id: 'l150', name: 'Domina ChatGPT: El Curso Mas Práctico en Español - Emprende Aprendiendo', tag: 'YT', xp: 90 },
          { id: 'l151', name: 'Masterclass Domina ChatGPT', tag: 'Emprende Aprendiendo', xp: 100 },
          { id: 'l152', name: 'Pack GPTs - Asistentes IA personalizados', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l153', name: 'Google Gemini FULL COURSE 3 HOURS - Julian Goldie', tag: 'YT', xp: 90 },
          { id: 'l154', name: 'Goodbye ChatGPT 5 Ultimate Claude 4.1 Guide 2026 - AI Master', tag: 'YT', xp: 80 },
          { id: 'l155', name: 'Claude AI Tutorial Completo En Español 2025 - AntonysTutorials', tag: 'YT', xp: 80 },
          { id: 'l156', name: 'ChatGPT SUPERADO? Aprende Claude paso a paso - Emprende Aprendiendo', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l157', name: 'Claude Code Tutorial for Beginners - Kevin Stratvert', tag: 'YT', xp: 80 },
          { id: 'l158', name: 'Ultimate GROK 4 Guide 2026 - AI Master', tag: 'YT', xp: 70 },
          { id: 'l159', name: 'Everything Perplexity In 34 Minutes - Tina Huang', tag: 'YT', xp: 60 },
          { id: 'l160', name: 'Perplexity: Beginner to Pro in 27 Minutes - Ali H. Salem', tag: 'YT', xp: 60 },
          { id: 'l161', name: 'Perplexity Full Tutorial WILD Ai Research Tool - Productive Dude', tag: 'YT', xp: 60 },
          { id: 'l162', name: 'NotebookLM FULL COURSE 4 HOURS - Julian Goldie', tag: 'YT', xp: 90 },
          { id: 'l163', name: 'How To Master NotebookLM in 2026 - Paul J Lipsky', tag: 'YT', xp: 70 },
          { id: 'l164', name: 'Curso Completo NotebookLM: Dominalo mejor que el 99% - David Zamora', tag: 'YT', xp: 80 },
          { id: 'l165', name: 'NotebookLM: La GUIA COMPLETA Paso a Paso - Inteligencia Artificial', tag: 'YT', xp: 80 },
          { id: 'l166', name: 'Como crear un GPT Personalizado que trabaje por ti - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l167', name: 'OpenClaw Full Course: Setup Skills Voice Memory - Tech With Tim', tag: 'YT', xp: 80 },
          { id: 'l168', name: 'OpenClaw Full Tutorial for Beginners - freeCodeCamp', tag: 'YT', xp: 80 },
          { id: 'l169', name: 'OpenClaw Crash Course: 24/7 AI Assistant - Mayank Aggarwal', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's4m6', name: 'Negocios & Agencia IA', icon: '💼',
        lessons: [
          { id: 'l170', name: 'Los 5 Mejores Negocios Con Inteligencia Artificial - Andres Garza', tag: 'YT', xp: 70 },
          { id: 'l171', name: '7 Negocios De Inteligencia Artificial $500/dia - Adrian Saenz', tag: 'YT', xp: 70 },
          { id: 'l172', name: 'Como Empezar Una Agencia De IA Paso a Paso 8h', tag: 'YT', xp: 110 },
          { id: 'l173', name: 'Como Crear Tu Agencia IA de 32.000$/mes - Emprende Aprendiendo', tag: 'Emprende Aprendiendo', xp: 100 },
          { id: 'l174', name: 'How to Start an AI Business in 2026 - Liam Ottley', tag: 'YT', xp: 80 },
          { id: 'l175', name: 'Como Utilizar La IA Para Ganar Dinero - Adria Sola Pastor', tag: 'YT', xp: 70 },
          { id: 'l176', name: 'Cursos de IA GRATIS para Emprendedores 2026 Agentes de IA', tag: 'YT', xp: 70 },
          { id: 'l177', name: 'El liderazgo en la era de la Inteligencia Artificial - Platzi', tag: 'YT', xp: 70 },
          { id: 'l178', name: 'AI & Leadership: How To Make High-Performing Teams - David Burkus', tag: 'YT', xp: 70 },
          { id: 'l179', name: 'Curso gratis: Como emprender con inteligencia artificial - EDteam', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's4m7', name: 'Música IA & Herramientas Extra', icon: '🎵',
        lessons: [
          { id: 'l180', name: 'Suno AI Tutorial 2026: Every Hidden Button & Feature - ChillPanic', tag: 'YT', xp: 70 },
          { id: 'l181', name: 'GUIA de 0 a PRO para hacer música con IA SUNO.AI - elomaquiabelo', tag: 'YT', xp: 80 },
          { id: 'l182', name: 'SUNO STUDIO Nuevo: Como funciona y mejores Trucos - Ingenier-IA Musical', tag: 'YT', xp: 70 },
          { id: 'l183', name: 'Lovable FULL Tutorial For COMPLETE Beginners - Tech With Tim', tag: 'YT', xp: 80 },
          { id: 'l184', name: 'Curso de Lovable GRATIS Crea sitios web con IA 2025', tag: 'YT', xp: 80 },
          { id: 'l185', name: 'EJECUTA IA en LOCAL GRATIS - Dot CSV Lab', tag: 'YT', xp: 70 },
          { id: 'l186', name: 'Llama: The Open-Weight AI Model - IBM Technology', tag: 'YT', xp: 60 },
          { id: 'l187', name: 'Learn Ollama in 15 Minutes Run LLM Models Locally - Tech With Tim', tag: 'YT', xp: 60 },
          { id: 'l188', name: 'Model Context Protocol MCP Explained', tag: 'YT', xp: 70 },
          { id: 'l189', name: 'Aspectos legales de la IA en plena expansión - practia.global', tag: 'YT', xp: 60 },
          { id: 'l190', name: 'Google AIs New Pomelli Photoshoot - Paul J Lipsky', tag: 'YT', xp: 60 },
        ],
      },
      {
        id: 's4m8', name: 'Desarrollo con IA Cursor & APIs', icon: '💻',
        lessons: [
          { id: 'l191', name: 'Cursor 2.0 Tutorial for Beginners Full Course - Riley Brown', tag: 'YT', xp: 90 },
          { id: 'l192', name: 'Curso de Cursor: Editor IA Todo Lo Que Necesitas Saber - Fazt', tag: 'YT', xp: 90 },
          { id: 'l193', name: 'Tutorial de Cursor editor de código con AI - Platzi', tag: 'YT', xp: 80 },
          { id: 'l194', name: 'Google AI Studio Tutorial Beginner to Expert - Santrel Media', tag: 'YT', xp: 80 },
          { id: 'l195', name: 'OpenAI Assistants API Course for Beginners - freeCodeCamp', tag: 'YT', xp: 90 },
          { id: 'l196', name: 'Copilot Microsoft 365 Curso Completo 3.5h - Miquel Nadal Vela', tag: 'YT', xp: 90 },
          { id: 'l197', name: 'Code Your Own Llama 4 LLM from Scratch - freeCodeCamp', tag: 'YT', xp: 100 },
          { id: 'l198', name: 'Como Crear tu Plan de Marketing con IA en Minutos - Cyberclick', tag: 'YT', xp: 60 },
          { id: 'l199', name: 'Como montar tu propio sistema de marketing con IA - Migue Baena IA', tag: 'YT', xp: 70 },
          { id: 'l200', name: 'ChatGPT - Prompt Engineering Avanzado', tag: 'YT', xp: 80 },
          { id: 'l201', name: 'IA para Creadores de Contenido', tag: 'YT', xp: 70 },
          { id: 'l202', name: 'Herramientas IA para Freelancers', tag: 'YT', xp: 70 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S5 — Diseño e Identidad Visual
  // ════════════════════════════════════════
  {
    id: 's5', sem: '05', title: 'Diseño e Identidad Visual', subtitle: 'Photoshop, Branding & Thumbnails',
    emoji: '🎨', color: C.sage,
    modules: [
      {
        id: 's5m1', name: 'Photoshop Profesional', icon: '🖼️',
        lessons: [
          { id: 'l203', name: 'Domina Photoshop como un profesional desde cero 4h41', tag: 'Plataforma', xp: 100 },
          { id: 'l204', name: 'Hacks de Photoshop Temporada 1', tag: 'Plataforma', xp: 80 },
          { id: 'l205', name: 'Hacks de Photoshop Temporada 2 7h41', tag: 'Plataforma', xp: 100 },
          { id: 'l206', name: 'Curso de Photoshop (75% completado)', tag: 'Plataforma', xp: 100 },
          { id: 'l207', name: 'Masterclass Diseñar Banners 1h12', tag: 'Plataforma', xp: 70 },
          { id: 'l208', name: 'Photoshop Essentials: From Photos to Art', tag: 'Udemy', xp: 80 },
          { id: 'l209', name: 'Adobe Photoshop Art & Illustration Presets', tag: 'Josh Werner', xp: 70 },
        ],
      },
      {
        id: 's5m2', name: 'Thumbnails & Branding', icon: '✨',
        lessons: [
          { id: 'l210', name: 'Viral Thumbnail Template Pack', tag: 'Curso', xp: 70 },
          { id: 'l211', name: 'Designio | Diseño para Emprendedores', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l212', name: 'Introducción a Adobe Illustrator', tag: 'Plataforma', xp: 70 },
          { id: 'l213', name: 'Inkscape fácil - Edición de gráficos vectoriales (25%)', tag: 'Udemy', xp: 70 },
          { id: 'l214', name: 'Aprende y domina GIMP 2.10 Curso completo (11%)', tag: 'Udemy', xp: 70 },
        ],
      },
      {
        id: 's5m3', name: 'Monetización con Diseño', icon: '💰',
        lessons: [
          { id: 'l215', name: 'Domina Fiverr y aprende a generar ingresos 4h27', tag: 'Plataforma', xp: 100 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S6 — Mentalidad, Freelance & Emprendimiento
  // ════════════════════════════════════════
  {
    id: 's6', sem: '06', title: 'Freelance & Emprendimiento', subtitle: 'Mentalidad & Negocios',
    emoji: '💼', color: C.orange,
    modules: [
      {
        id: 's6m1', name: 'Freelance & Emprendimiento', icon: '🚀',
        lessons: [
          { id: 'l216', name: 'Conviértete en Freelance desde cero 4h02', tag: 'Plataforma', xp: 100 },
          { id: 'l217', name: 'Curso de Funnels BIG school', tag: 'Plataforma', xp: 80 },
          { id: 'l218', name: 'Curso Iniciación Negocios BIG school (60%)', tag: 'Plataforma', xp: 90 },
          { id: 'l219', name: 'VideoMarketer BIG school (13%)', tag: 'Plataforma', xp: 80 },
          { id: 'l220', name: 'Upgrade | Casos Avanzados para Empresarios', tag: 'Emprende Aprendiendo', xp: 90 },
          { id: 'l221', name: 'Método IMPEF', tag: 'Emprende Aprendiendo', xp: 90 },
          { id: 'l222', name: 'SÍLEX 2.0', tag: 'Emprende Aprendiendo', xp: 90 },
          { id: 'l223', name: 'Academy Tools', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l224', name: 'Anti Pirateo', tag: 'Emprende Aprendiendo', xp: 60 },
          { id: 'l225', name: 'Coach Teacher', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l226', name: 'Academy Mastery', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l227', name: 'Academy STEPS', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l228', name: 'Academy Basics', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l229', name: 'Academy Consulting', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l230', name: 'Aprende a Trabajar Online a partir de tus Talentos (25%)', tag: 'Udemy', xp: 70 },
          { id: 'l231', name: 'Si quieres dinero NO seas influencer - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l232', name: 'Ser autónomo en España es una ruina - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l233', name: 'De hobby a empresa rentable: lo que nadie te cuenta - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l234', name: 'Sin paro sin clientes pero se puede! - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l235', name: 'Cobra el doble haciendo lo mismo - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l236', name: 'Mainstream o nicho? La decisión que cambiará tu canal - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l237', name: 'Como Emprender siendo Joven SIN MALGASTAR DINERO - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l238', name: '13 años de aprendizajes sobre NEGOCIOS en 45 minutos - Romuald Fons', tag: 'YT', xp: 80 },
          { id: 'l239', name: 'Como hundir a tu competencia invirtiendo menos - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l240', name: '7 errores que están DESTROZANDO tu negocio - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l241', name: 'Transforma tu conocimiento en ingresos reales - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l242', name: 'Las decisiones que mas dinero me han hecho perder - Romuald Fons', tag: 'YT', xp: 70 },
          { id: 'l243', name: 'Como ser un gran CEO - Platzi', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's6m2', name: 'Mentalidad & Productividad', icon: '🧠',
        lessons: [
          { id: 'l244', name: 'Pack GPTs Asistentes IA Personalizados', tag: 'Academy', xp: 70 },
          { id: 'l245', name: 'Rompiendo paradigmas: Creer, Crear, Crecer (100%)', tag: 'Udemy', xp: 70 },
          { id: 'l246', name: 'Consigue lo que quieres en 7 pasos (100%)', tag: 'Udemy', xp: 70 },
          { id: 'l247', name: 'Sesgado | Trucos Psicológicos para Aumentar tus Ventas', tag: 'Emprende Aprendiendo', xp: 80 },
          { id: 'l248', name: 'Mastermind 12/03/2023', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l249', name: 'Audios de Mentalidad de Emprendedor', tag: 'Emprende Aprendiendo', xp: 60 },
          { id: 'l250', name: 'Curso de Novela: Planifica, Escribe y Publica tu Historia (2%)', tag: 'Udemy', xp: 70 },
        ],
      },
      {
        id: 's6m3', name: 'Estrategia de Contenido', icon: '📊',
        lessons: [
          { id: 'l251', name: 'Si quieres dinero NO seas influencer - Romuald Fons', tag: 'YT', xp: 60 },
          { id: 'l252', name: 'Romuald Fons: Cómo GANARTE la VIDA CREANDO CONTENIDO - The BIG', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's6m4', name: 'Libros & Fiscalidad', icon: '📚',
        lessons: [
          { id: 'l253', name: 'Crece y Hazte Rico - Romuald Fons', tag: 'Libro', xp: 80 },
          { id: 'l254', name: 'Autónomo para Dummies - R. González Fontenla', tag: 'Libro', xp: 80 },
          { id: 'l255', name: 'Flash Libros 2.0', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l256', name: 'Leader Summaries', tag: 'Emprende Aprendiendo', xp: 70 },
          { id: 'l257', name: 'Cuanto vale tu empresa sin ti? Valoración y retirada - Asimetric', tag: 'YT', xp: 60 },
          { id: 'l258', name: 'Como pagar menos en la RENTA y rentabilizar tu dinero - Asimetric', tag: 'YT', xp: 70 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S7 — Formación Avanzada (Recursos Propios)
  // ════════════════════════════════════════
  {
    id: 's7', sem: '07', title: 'Formación Avanzada', subtitle: 'Recursos Propios & Drive',
    emoji: '📁', color: C.grayBlue,
    modules: [
      {
        id: 's7m1', name: 'Carpetas de Conocimiento (Drive)', icon: '☁️',
        lessons: [
          { id: 'l259', name: 'ChatGPT (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l260', name: 'Comunicación (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l261', name: 'Criptomonedas (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l262', name: 'E-mail (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l263', name: 'Finanzas (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l264', name: 'Fiscalidad (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l265', name: 'Hábitos Financieros (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l266', name: 'IA (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l267', name: 'SEO (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l268', name: 'SEO Redes (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l269', name: 'Sistema Facturación Automática', tag: 'Drive', xp: 70 },
          { id: 'l270', name: 'Ventas (carpeta Drive)', tag: 'Drive', xp: 60 },
          { id: 'l271', name: 'Video Marketer (carpeta Drive)', tag: 'Drive', xp: 60 },
        ],
      },
      {
        id: 's7m2', name: 'Clases & Recursos Extra', icon: '🎓',
        lessons: [
          { id: 'l272', name: 'Clase grabada 2024-12-06', tag: 'Video', xp: 70 },
          { id: 'l273', name: 'Clase 1 - La Inversión Sí Es Para Ti', tag: 'Video', xp: 70 },
          { id: 'l274', name: 'Clase 2 - La Inversión Sí Es Para Ti', tag: 'Video', xp: 70 },
          { id: 'l275', name: 'Clase 3 - La Inversión Sí Es Para Ti', tag: 'Video', xp: 70 },
          { id: 'l276', name: 'Calendarios Edición Video Freelance Mes 1', tag: 'PDF', xp: 60 },
          { id: 'l277', name: 'Calendarios Edición Video Freelance Mes 2', tag: 'PDF', xp: 60 },
          { id: 'l278', name: 'Calendarios Edición Video Freelance Mes 3', tag: 'PDF', xp: 60 },
          { id: 'l279', name: 'Calendarios Edición Video Freelance Mes 4', tag: 'PDF', xp: 60 },
          { id: 'l280', name: 'Calendarios Edición Video Freelance Mes 5', tag: 'PDF', xp: 60 },
          { id: 'l281', name: 'Calendarios Edición Video Freelance Mes 6', tag: 'PDF', xp: 60 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S8 — Artes Visuales & Animación
  // ════════════════════════════════════════
  {
    id: 's8', sem: '08', title: 'Artes Visuales & Animación', subtitle: 'Dibujo, Ilustración & 2D',
    emoji: '🖌️', color: C.mauve,
    modules: [
      {
        id: 's8m1', name: 'Dibujo Tradicional', icon: '✏️',
        lessons: [
          { id: 'l282', name: 'Aprende a dibujar desde cero', tag: 'Paper Monster', xp: 80 },
          { id: 'l283', name: 'Iniciación a la anatomía (EN PROGRESO)', tag: 'Paper Monster', xp: 90 },
          { id: 'l284', name: 'Anatomía. Los puntos subcutáneos', tag: 'Paper Monster', xp: 80 },
          { id: 'l285', name: 'Anatomía. El esqueleto humano', tag: 'Paper Monster', xp: 80 },
          { id: 'l286', name: 'Técnicas de lápiz para dibujo realista', tag: 'Paper Monster', xp: 80 },
          { id: 'l287', name: 'Curso completo de Retrato a Lápiz', tag: 'Paper Monster', xp: 90 },
          { id: 'l288', name: 'Master Class de Dibujo con MANCHA carboncillo', tag: 'Paper Monster', xp: 80 },
          { id: 'l289', name: 'Ilustración con carboncillo', tag: 'Paper Monster', xp: 80 },
          { id: 'l290', name: 'Dibuja Mejor en sólo 21 Días', tag: 'Paper Monster', xp: 90 },
          { id: 'l291', name: 'Iniciación a la caricatura', tag: 'Paper Monster', xp: 70 },
          { id: 'l292', name: 'Aprende Dibujo Artístico fácilmente - Antonio García Villarán (100%)', tag: 'Udemy', xp: 80 },
        ],
      },
      {
        id: 's8m2', name: 'Ilustración Digital', icon: '🎨',
        lessons: [
          { id: 'l293', name: 'Retrato Realista en Digital', tag: 'Paper Monster', xp: 90 },
          { id: 'l294', name: 'Aprende a Dibujar Retratos estilo Cartoon', tag: 'Paper Monster', xp: 80 },
          { id: 'l295', name: 'Domina el Color (EN PROGRESO)', tag: 'Paper Monster', xp: 90 },
          { id: 'l296', name: 'Domina la Luz', tag: 'Paper Monster', xp: 90 },
          { id: 'l297', name: 'Domina las Texturas y los Materiales', tag: 'Paper Monster', xp: 80 },
          { id: 'l298', name: 'Master Class de Texturas por Jako Del Bueno', tag: 'Paper Monster', xp: 80 },
          { id: 'l299', name: 'Master Class de Pelo por Arganza', tag: 'Paper Monster', xp: 80 },
          { id: 'l300', name: 'Ilustración con Carles Dalmau (EN PROGRESO)', tag: 'Paper Monster', xp: 90 },
          { id: 'l301', name: 'Ilustración Profesional con Procreate por Ricardo Arganza', tag: 'Paper Monster', xp: 90 },
          { id: 'l302', name: 'Introducción al paisaje urbano en acuarela', tag: 'Paper Monster', xp: 80 },
          { id: 'l303', name: 'Introducción a Adobe Illustrator', tag: 'Paper Monster', xp: 70 },
          { id: 'l304', name: 'Aprende Photoshop desde cero para ilustradores', tag: 'Paper Monster', xp: 80 },
          { id: 'l305', name: 'Aprende a Dibujar Cartoon desde Cero (23%)', tag: 'Udemy', xp: 70 },
          { id: 'l306', name: 'Curso de Dibujo de Anime Vol. 1 Creación de Personajes', tag: 'Udemy', xp: 80 },
        ],
      },
      {
        id: 's8m3', name: 'Personajes & Concept Art', icon: '🧑‍🎨',
        lessons: [
          { id: 'l307', name: 'Crea tu personaje original con Raquel Arellano', tag: 'Paper Monster', xp: 90 },
          { id: 'l308', name: 'Diseño de personajes para videojuegos', tag: 'Paper Monster', xp: 90 },
          { id: 'l309', name: 'Creación de cómic con Tony Ventura', tag: 'Paper Monster', xp: 80 },
          { id: 'l310', name: 'Cómo dibujar heridas y tatuajes', tag: 'Paper Monster', xp: 70 },
          { id: 'l311', name: 'Procreate desde cero', tag: 'Plataforma', xp: 80 },
          { id: 'l312', name: 'Diseño vectorial avanzado', tag: 'Plataforma', xp: 80 },
          { id: 'l313', name: 'Adobe Photoshop Art & Illustration Presets', tag: 'Josh Werner', xp: 70 },
        ],
      },
      {
        id: 's8m4', name: 'Animación 2D & Producción Audiovisual', icon: '🎬',
        lessons: [
          { id: 'l314', name: 'Doblaje de voz para animación - Isabel Martiñón', tag: 'Domestika', xp: 80 },
          { id: 'l315', name: 'Animate on iPad: FlipaClip Beginner Course (80%)', tag: 'Udemy', xp: 80 },
          { id: 'l316', name: 'Simple and Advanced Topics of Animating 2D Characters', tag: 'Udemy', xp: 90 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S9 — Marketing Digital Completo
  // ════════════════════════════════════════
  {
    id: 's9', sem: '09', title: 'Marketing Digital Completo', subtitle: 'SEO, Ads, Funnels & Estrategia',
    emoji: '📊', color: C.rust,
    modules: [
      {
        id: 's9m1', name: 'Fundamentos de Marketing Digital', icon: '📡',
        lessons: [
          { id: 'l317', name: 'CURSO de Marketing Digital Completo 2026 - Cyberclick 3h44', tag: 'YT', xp: 100 },
          { id: 'l318', name: 'Aprende Marketing Paso a Paso Método Fácil - Emprende Aprendiendo', tag: 'YT', xp: 80 },
          { id: 'l319', name: 'Simio explicar Marketing Digital en 10 minutos', tag: 'YT', xp: 60 },
          { id: 'l320', name: 'Así cambiará el Marketing Digital en 2026 - Emprende Aprendiendo', tag: 'YT', xp: 60 },
          { id: 'l321', name: 'CURSO DE MARKETING COMPLETO - Yoney Gallardo 3h39', tag: 'YT', xp: 100 },
          { id: 'l322', name: 'Marketing Digital y Redes Sociales Curso completo 2025 - Elevación Digital', tag: 'YT', xp: 100 },
          { id: 'l323', name: 'Qué es Marketing: Con un Verdadero Experto Rolando Arellano', tag: 'YT', xp: 70 },
          { id: 'l324', name: 'El poder de la Estrategia en los negocios y marketing - Velocity Media', tag: 'YT', xp: 70 },
          { id: 'l325', name: '5 SISTEMAS que necesitas para ESCALAR tu EMPRESA - Alvaro Luque', tag: 'YT', xp: 70 },
          { id: 'l326', name: 'Los sistemas convierten un negocio en una máquina - Emprendedor Eficaz', tag: 'YT', xp: 60 },
          { id: 'l327', name: 'Qué es MARKETING DIGITAL Cómo FUNCIONA - Aprendamos Marketing', tag: 'YT', xp: 60 },
          { id: 'l328', name: 'Qué es un negocio digital y qué vende? - CodiSoft', tag: 'YT', xp: 60 },
          { id: 'l329', name: 'Qué son los negocios digitales? - Tiendup', tag: 'YT', xp: 60 },
          { id: 'l330', name: 'LOS 7 FUNDAMENTOS DE UN NEGOCIO DIGITAL - Emprende Aprendiendo', tag: 'YT', xp: 70 },
          { id: 'l331', name: 'TODA LA VERDAD sobre el MARKETING DIGITAL 2025 - The BIG', tag: 'YT', xp: 70 },
          { id: 'l332', name: '13 Years of Marketing Advice in 85 Mins - Alex Hormozi', tag: 'YT', xp: 90 },
        ],
      },
      {
        id: 's9m2', name: 'Branding & Identidad de Marca', icon: '🏷️',
        lessons: [
          { id: 'l333', name: 'Como crear la identidad visual de tu marca - Vadezero', tag: 'YT', xp: 70 },
          { id: 'l334', name: 'Qué es BRANDING? Definición de expertos - Frank Moreno', tag: 'YT', xp: 60 },
          { id: 'l335', name: 'PASO A PASO Diseño y desarrollo de logo - Marco Creativo', tag: 'YT', xp: 70 },
          { id: 'l336', name: 'El curso de LOGOS más corto del mundo - Eze Cichello', tag: 'YT', xp: 60 },
          { id: 'l337', name: 'What Is Branding? 4 Minute Crash Course - The Futur', tag: 'YT', xp: 60 },
          { id: 'l338', name: 'Como crear un BRANDING para tu MARCA PERSONAL o EMPRESA - Juan Ignacio Cali', tag: 'YT', xp: 70 },
          { id: 'l339', name: 'Branding para Principiantes CURSO COMPLETO EN ESPAÑOL - Oliver Puente', tag: 'YT', xp: 90 },
          { id: 'l340', name: 'Cómo Crear una MARCA PERSONAL en 2026 - Mirko Vigna', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's9m3', name: 'SEO Completo', icon: '🔍',
        lessons: [
          { id: 'l341', name: 'The New Rules of SEO 2026 - Neil Patel', tag: 'YT', xp: 70 },
          { id: 'l342', name: 'Búsqueda de palabras clave en 2026: Tutorial 3 pasos - Ahrefs ES', tag: 'YT', xp: 70 },
          { id: 'l343', name: 'Curso SEO eCommerce 2026 Lección 7 Arquitectura Web', tag: 'YT', xp: 70 },
          { id: 'l344', name: 'Curso SEO eCommerce 2026 Lección 9 Indexación SEO', tag: 'YT', xp: 70 },
          { id: 'l345', name: 'Factores SEO 2026 - Jorge Luján', tag: 'YT', xp: 70 },
          { id: 'l346', name: 'Cómo hacer seo de 0 a 100 en 2026 - Jorge Luján', tag: 'YT', xp: 80 },
          { id: 'l347', name: 'Arquitectura Web SEO: Optimiza tu sitio - VISIBILIDADON', tag: 'YT', xp: 70 },
          { id: 'l348', name: 'Cómo crear un sitemap XML y enviarlo a Google - Antonio de Trei', tag: 'YT', xp: 60 },
          { id: 'l349', name: 'SEO para WordPress en 2026 Guía de 0 a 100 - Luis M. Villanueva', tag: 'YT', xp: 80 },
          { id: 'l350', name: 'WordPress Tutorial Hostinger Complete Setup - Darrel Wilson', tag: 'YT', xp: 80 },
          { id: 'l351', name: 'SEO Full Course 2026 - Simplilearn', tag: 'YT', xp: 100 },
          { id: 'l352', name: 'LINK BUILDING Todo lo que necesitas saber Curso SEO #11', tag: 'YT', xp: 70 },
          { id: 'l353', name: 'Qué es y cómo hacer LinkBuilding en SEO 2026 - GabiFlorensa', tag: 'YT', xp: 70 },
          { id: 'l354', name: 'Cómo hacer Link building 2026 TRUCOS SEO - Jorge Luján', tag: 'YT', xp: 70 },
          { id: 'l355', name: 'Cómo analizar a la competencia en SISTRIX - MJ Cachón', tag: 'YT', xp: 70 },
          { id: 'l356', name: 'Tutorial de Semrush: Guía SEO Completa - Metics Media', tag: 'YT', xp: 80 },
          { id: 'l357', name: 'Curso de Screaming Frog GRATIS desde CERO - MJ Cachón', tag: 'YT', xp: 80 },
          { id: 'l358', name: 'Mejores extensiones SEO para Chrome 2026 - Jorge Luján', tag: 'YT', xp: 60 },
          { id: 'l359', name: 'Curso SEO para PRINCIPIANTES De 0 a 100 2026 - Javier SEO', tag: 'YT', xp: 90 },
          { id: 'l360', name: '5 GPTs gratis para hacer SEO MASTERCLASS BIG school', tag: 'YT', xp: 70 },
          { id: 'l361', name: '6 CLAVES para el SEO en 2025 BIG lessons Javier Martínez', tag: 'YT', xp: 60 },
          { id: 'l362', name: 'Advanced ASO strategies for 2026 - AppFollow', tag: 'YT', xp: 70 },
          { id: 'l363', name: 'COMO HACER SEO en los NUEVOS RESULTADOS de IA - The BIG', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's9m4', name: 'Redes Sociales & Algoritmos', icon: '📱',
        lessons: [
          { id: 'l364', name: 'Cómo ser un experto en Instagram y Tiktok - Andrea Estratega', tag: 'YT', xp: 70 },
          { id: 'l365', name: 'La guía definitiva para crecer en instagram en 2026 - converzzo', tag: 'YT', xp: 80 },
          { id: 'l366', name: 'Cómo crecer una audiencia online con 0 seguidores 2026 - Adrià Solà Pastor', tag: 'YT', xp: 70 },
          { id: 'l367', name: 'El ALGORITMO de Instagram ha Cambiado en 2026 - Víctor Heras Media', tag: 'YT', xp: 70 },
          { id: 'l368', name: 'Exponiendo el Nuevo Algoritmo de Instagram de 2026 - Víctor Heras Media', tag: 'YT', xp: 70 },
          { id: 'l369', name: 'COPIA MI ESTRATEGIA DE CONTENIDO para 2026 - Andreina Valderrama', tag: 'YT', xp: 70 },
          { id: 'l370', name: 'La MEJOR herramienta para gestionar REDES SOCIALES - Aprendamos Marketing', tag: 'YT', xp: 60 },
          { id: 'l371', name: 'Cómo Crecer tu Empresa en LinkedIn: 5 Estrategias 10X - HubSpot Español', tag: 'YT', xp: 70 },
          { id: 'l372', name: 'Pinterest Affiliate Marketing: The Full Course For 2026 - Adam Enfroy', tag: 'YT', xp: 80 },
          { id: 'l373', name: 'Influencer marketing: guía completa para principiantes - HubSpot Español', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's9m5', name: 'Ads & Publicidad de Pago', icon: '💰',
        lessons: [
          { id: 'l374', name: 'Facebook Ads para Principiantes CURSO Gratis 2026 - Andres Garza', tag: 'YT', xp: 80 },
          { id: 'l375', name: 'Start a Facebook Page in 2025 FULL COURSE - Ytgrow Master', tag: 'YT', xp: 80 },
          { id: 'l376', name: 'Tutorial Completo De Meta Ads Para Principiantes 2026 9h', tag: 'YT', xp: 120 },
          { id: 'l377', name: 'X Twitter Ads for Beginners: The 2026 Guide - Brad Smith', tag: 'YT', xp: 70 },
          { id: 'l378', name: 'Curso de Google Ads 2026 Completo y GRATIS - Alan Valdez', tag: 'YT', xp: 100 },
          { id: 'l379', name: 'Google Ads Full Course 2026 - Simplilearn', tag: 'YT', xp: 100 },
          { id: 'l380', name: 'Copywriting en tus anuncios de Google Ads - Marc Ramentol', tag: 'YT', xp: 70 },
          { id: 'l381', name: 'YouTube Ads 2026 Masterclass - Maciek YouTube Ads', tag: 'YT', xp: 90 },
          { id: 'l382', name: 'Bing Ads Full Tutorial 2026 Microsoft Ads - Ben B2B', tag: 'YT', xp: 70 },
          { id: 'l383', name: 'Curso de LinkedIn Ads para Principiantes - David García Amaya', tag: 'YT', xp: 70 },
          { id: 'l384', name: 'Tutorial de Snapchat Ads: Guía Definitiva - Metics Media', tag: 'YT', xp: 70 },
          { id: 'l385', name: 'My Amazon Ad Strategy for Beginners 2026 - Self Publishing Empire', tag: 'YT', xp: 70 },
          { id: 'l386', name: 'Entrenamiento de Publicidad Digital - The BIG', tag: 'YT', xp: 80 },
          { id: 'l387', name: 'Google Analytics Tutorial For Beginners 2026 - Loves Data', tag: 'YT', xp: 80 },
          { id: 'l388', name: 'Google Ads Conversion Tracking 2026 - Analytics Mania', tag: 'YT', xp: 70 },
        ],
      },
      {
        id: 's9m6', name: 'Email Marketing & Funnels', icon: '📧',
        lessons: [
          { id: 'l389', name: 'Email & Content Marketing Full Course 2026 - Simplilearn 4h', tag: 'YT', xp: 100 },
          { id: 'l390', name: 'Las Mejores Herramientas de Automatización de Marketing 2026 - Cyberclick', tag: 'YT', xp: 70 },
          { id: 'l391', name: 'Cómo hacer Email Marketing Paso a Paso Tutorial 2025 - Ivo Fiz', tag: 'YT', xp: 80 },
          { id: 'l392', name: 'Cómo Empezar en el COPYWRITING para Principiantes - Ivo Fiz', tag: 'YT', xp: 70 },
          { id: 'l393', name: 'CÓMO CREAR un FUNNEL DE VENTAS de 0 a 100 - The BIG', tag: 'YT', xp: 80 },
          { id: 'l394', name: 'Las 10 CLAVES para tener una NEWSLETTER de Éxito - The BIG', tag: 'YT', xp: 70 },
          { id: 'l395', name: '3 FUNNELS de VENTAS IMPRESCINDIBLES - The BIG', tag: 'YT', xp: 70 },
          { id: 'l396', name: 'Cómo Crear un Funnel de Ventas desde cero - The BIG', tag: 'YT', xp: 80 },
          { id: 'l397', name: '7 Mejoras para un FUNNEL de VENTA - The BIG', tag: 'YT', xp: 70 },
          { id: 'l398', name: 'Como crear una estrategia de marketing Paso a Paso - Pedro Buerbaum', tag: 'YT', xp: 80 },
        ],
      },
      {
        id: 's9m7', name: 'Estrategia Avanzada & Análisis', icon: '📈',
        lessons: [
          { id: 'l399', name: 'Que es un CRM y como deberías elegir el Correcto - Santi Pérez Moreno', tag: 'YT', xp: 70 },
          { id: 'l400', name: 'Growth y CRO en 2026 - PHI La Caja Company', tag: 'YT', xp: 70 },
          { id: 'l401', name: 'Google Looker Studio tutorial 2026 - Porter Metrics', tag: 'YT', xp: 70 },
          { id: 'l402', name: 'Cómo empezar con la GESTIÓN DE PROYECTOS - HubSpot Español', tag: 'YT', xp: 70 },
          { id: 'l403', name: 'Cómo Planear tu 2026 para Vender Más - Aprendamos Marketing', tag: 'YT', xp: 70 },
          { id: 'l404', name: 'Auditoría de Marketing Digital a 5 Proyectos MASTERCLASS BIG school', tag: 'YT', xp: 90 },
          { id: 'l405', name: 'BIG camp Día 1: Diseña una Estrategia de Marketing Digital - The BIG', tag: 'YT', xp: 80 },
          { id: 'l406', name: 'Estrategia de Marketing Digital para AUMENTAR VENTAS - The BIG', tag: 'YT', xp: 80 },
          { id: 'l407', name: '7 Mejoras para un FUNNEL de VENTA BIG lessons Paula González', tag: 'YT', xp: 70 },
          { id: 'l408', name: 'Siendo autodidacta Guía completa de como empezar - Joss Designer', tag: 'YT', xp: 60 },
          { id: 'l409', name: 'CLASE 01 MARKETING DIGITAL CON INTELIGENCIA ARTIFICIAL - ITEC', tag: 'YT', xp: 70 },
          { id: 'l410', name: 'Cursos de IA GRATIS para Principiantes 2026 - Agentes de IA', tag: 'YT', xp: 70 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S10 — 3D, Animación Avanzada & Videojuegos
  // ════════════════════════════════════════
  {
    id: 's10', sem: '10', title: '3D, Animación & Videojuegos', subtitle: 'Blender Avanzado & Game Dev',
    emoji: '🎮', color: C.teal,
    modules: [
      {
        id: 's10m1', name: 'Blender Avanzado', icon: '🧊',
        lessons: [
          { id: 'l411', name: 'Create Your Own Character in Blender', tag: 'Udemy', xp: 100 },
          { id: 'l412', name: 'Diseño de una motocicleta de ciencia ficción con Blender', tag: 'Udemy', xp: 100 },
          { id: 'l413', name: 'Blender Beginners Guide to 3D Modelling Game Asset Pipeline', tag: 'Udemy', xp: 100 },
          { id: 'l414', name: 'Master 3D para videojuegos Vol. 1 - Interfaz', tag: 'Udemy', xp: 90 },
        ],
      },
      {
        id: 's10m2', name: 'Desarrollo de Videojuegos', icon: '🕹️',
        lessons: [
          { id: 'l415', name: 'Creación de Videojuegos en Unreal Engine para principiantes (29%)', tag: 'Udemy', xp: 100 },
          { id: 'l416', name: 'Unity Third Person Shooter', tag: 'Udemy', xp: 100 },
          { id: 'l417', name: 'Crea tu terreno con un Heightmap en Unity 3D', tag: 'Udemy', xp: 80 },
          { id: 'l418', name: 'Introducción al Desarrollo de Videojuegos con Unity 3D', tag: 'Udemy', xp: 90 },
          { id: 'l419', name: 'Desarrollo de videojuegos con GM:S', tag: 'Udemy', xp: 90 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S11 — Programación & Desarrollo Web
  // ════════════════════════════════════════
  {
    id: 's11', sem: '11', title: 'Programación & Desarrollo Web', subtitle: 'Código & Git',
    emoji: '💻', color: C.blueClear,
    modules: [
      {
        id: 's11m1', name: 'Programación', icon: '⌨️',
        lessons: [
          { id: 'l420', name: 'Aprende Programación en C++ Básico Intermedio Avanzado (5%)', tag: 'Udemy', xp: 100 },
          { id: 'l421', name: 'C++ Working with Files - fstream I/O library', tag: 'Udemy', xp: 80 },
          { id: 'l422', name: 'Programming with Python All in One', tag: 'Udemy', xp: 100 },
          { id: 'l423', name: 'Fundamentos de Programación con Java', tag: 'Udemy', xp: 90 },
          { id: 'l424', name: 'Fundamentos de Programación Web para Principiantes', tag: 'Udemy', xp: 80 },
          { id: 'l425', name: 'Aprende Programación para Principiantes en PHP', tag: 'Udemy', xp: 80 },
          { id: 'l426', name: 'Programación de juegos Web 2D en JavaScript HTML5 con Phaser', tag: 'Udemy', xp: 90 },
          { id: 'l427', name: 'Programación de videojuegos con pygame', tag: 'Udemy', xp: 90 },
        ],
      },
      {
        id: 's11m2', name: 'Git & Control de Versiones', icon: '🔀',
        lessons: [
          { id: 'l428', name: 'Introducción a Git & GitHub', tag: 'Udemy', xp: 80 },
          { id: 'l429', name: 'GitHub Basics', tag: 'Josh Werner', xp: 70 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S12 — Crypto, Finanzas & Inversión
  // ════════════════════════════════════════
  {
    id: 's12', sem: '12', title: 'Crypto, Finanzas & Inversión', subtitle: 'Criptomonedas & Mercados',
    emoji: '💰', color: C.yellow,
    modules: [
      {
        id: 's12m1', name: 'Criptomonedas', icon: '₿',
        lessons: [
          { id: 'l430', name: 'Cómo ganar criptomonedas sin invertir dinero - Nicolás Bonini', tag: 'Udemy', xp: 80 },
        ],
      },
    ],
  },

  // ════════════════════════════════════════
  // S13 — Inglés
  // ════════════════════════════════════════
  {
    id: 's13', sem: '13', title: 'Inglés', subtitle: 'De básico a avanzado',
    emoji: '🇬🇧', color: C.pink,
    modules: [
      {
        id: 's13m1', name: 'Inglés Básico', icon: '📖',
        lessons: [
          { id: 'l431', name: 'Clases Básico English Version - Teacher Noob', tag: 'Udemy', xp: 70 },
        ],
      },
    ],
  },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────

const getTotalLessons = (sem) =>
  sem.modules.reduce((a, m) => a + m.lessons.length, 0);

const getCompletedLessons = (sem, completed) =>
  sem.modules.reduce(
    (a, m) => a + m.lessons.filter((l) => completed[l.id]).length, 0,
  );

const getSemesterProgress = (sem, completed) => {
  const total = getTotalLessons(sem);
  if (total === 0) return 0;
  return getCompletedLessons(sem, completed) / total;
};

const getTotalXP = (completed) => {
  let xp = 0;
  CURRICULUM.forEach((s) =>
    s.modules.forEach((m) =>
      m.lessons.forEach((l) => { if (completed[l.id]) xp += l.xp; }),
    ),
  );
  return xp;
};

const getLevel = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;
const getLevelProgress = (xp) => (xp % XP_PER_LEVEL) / XP_PER_LEVEL;

const TAG_COLORS = {
  'YT': '#ff4444',
  'Plataforma': '#7c5cbf',
  'Udemy': '#a435f0',
  'Paper Monster': '#e8c87a',
  'Creator Club': '#4a7abf',
  'Emprende Aprendiendo': '#5a9e6f',
  'Domestika': '#ff5b5b',
  'Drive': '#4285f4',
  'PDF': '#c4593a',
  'Libro': '#d4a843',
  'Video': '#2dd4bf',
  'Curso': '#f472b6',
  'Academy': '#9e5a8f',
  'Josh Werner': '#60a5fa',
  'Auraprods': '#facc15',
};

const getTagColor = (tag) => TAG_COLORS[tag] || '#7a7590';

const getDailyChallenges = () => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...DAILY_CHALLENGES].sort(
    (a, b) => ((seed * a.id.length) % 7) - ((seed * b.id.length) % 7),
  );
  return shuffled.slice(0, 3);
};

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────

const ProgressBar = ({ value, color, height = 6 }) => (
  <View style={[styles.progressBg, { height }]}>
    <View
      style={[
        styles.progressFill,
        { width: `${Math.min(value * 100, 100)}%`, backgroundColor: color, height },
      ]}
    />
  </View>
);

// ─── TAG BADGE ─────────────────────────────────────────────────────────────────

const TagBadge = ({ tag }) => (
  <View style={[styles.tagBadge, { backgroundColor: getTagColor(tag) + '28', borderColor: getTagColor(tag) + '60' }]}>
    <Text style={[styles.tagText, { color: getTagColor(tag) }]}>{tag}</Text>
  </View>
);

// ─── SCREEN: INICIO ────────────────────────────────────────────────────────────

const InicioScreen = ({ completed, dailyDone, onToggleDaily, xp, level, levelProgress }) => {
  const daily = getDailyChallenges();
  const totalLessons = CURRICULUM.reduce((a, s) => a + getTotalLessons(s), 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const globalProgress = totalLessons > 0 ? completedCount / totalLessons : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>¡Bienvenido, Klaid! 🎓</Text>
        <Text style={styles.subGreeting}>Universidad del Nómada Digital</Text>
        <View style={styles.xpRow}>
          <Text style={styles.levelText}>Nivel {level}</Text>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
        <ProgressBar value={levelProgress} color={C.gold} height={8} />
        <Text style={styles.xpNext}>
          {XP_PER_LEVEL - (xp % XP_PER_LEVEL)} XP para el siguiente nivel
        </Text>
      </View>

      {/* Stats globales */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{totalLessons}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: C.gold }]}>
            {Math.round(globalProgress * 100)}%
          </Text>
          <Text style={styles.statLabel}>Global</Text>
        </View>
      </View>

      {/* Progreso por semestre (top 5) */}
      <Text style={styles.sectionTitle}>Progreso por Semestre</Text>
      {CURRICULUM.map((s) => {
        const prog = getSemesterProgress(s, completed);
        const comp = getCompletedLessons(s, completed);
        const total = getTotalLessons(s);
        return (
          <View key={s.id} style={styles.semProgressRow}>
            <Text style={styles.semProgressEmoji}>{s.emoji}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.semProgressHeader}>
                <Text style={styles.semProgressTitle} numberOfLines={1}>S{s.sem}</Text>
                <Text style={styles.semProgressCount}>{comp}/{total}</Text>
              </View>
              <ProgressBar value={prog} color={s.color} />
            </View>
          </View>
        );
      })}

      {/* Desafíos del día */}
      <Text style={styles.sectionTitle}>⚡ Desafíos del Día</Text>
      {daily.map((ch) => (
        <TouchableOpacity
          key={ch.id}
          style={[styles.challengeCard, dailyDone[ch.id] && styles.challengeDone]}
          onPress={() => onToggleDaily(ch.id, ch.xp)}
          activeOpacity={0.7}
        >
          <View style={styles.challengeCheck}>
            {dailyDone[ch.id] ? (
              <Text style={styles.checkIcon}>✓</Text>
            ) : (
              <View style={styles.checkEmpty} />
            )}
          </View>
          <Text style={[styles.challengeText, dailyDone[ch.id] && styles.challengeTextDone]}>
            {ch.text}
          </Text>
          <View style={styles.challengeXP}>
            <Text style={styles.challengeXPText}>+{ch.xp} XP</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ─── SCREEN: SEMESTRES ─────────────────────────────────────────────────────────

const SemestresScreen = ({ completed, onToggleLesson }) => {
  const [expandedSem, setExpandedSem] = useState(null);
  const [expandedMod, setExpandedMod] = useState(null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.pageTitle}>📚 Semestres</Text>
      {CURRICULUM.map((s) => {
        const prog = getSemesterProgress(s, completed);
        const comp = getCompletedLessons(s, completed);
        const total = getTotalLessons(s);
        const isOpen = expandedSem === s.id;

        return (
          <View key={s.id} style={styles.semCard}>
            <TouchableOpacity
              style={styles.semHeader}
              onPress={() => setExpandedSem(isOpen ? null : s.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.semColorDot, { backgroundColor: s.color }]} />
              <View style={{ flex: 1 }}>
                <View style={styles.semTitleRow}>
                  <Text style={styles.semEmoji}>{s.emoji}</Text>
                  <Text style={styles.semTitle} numberOfLines={1}>{s.title}</Text>
                </View>
                <Text style={styles.semSubtitle} numberOfLines={1}>{s.subtitle}</Text>
                <View style={styles.semProgressRow2}>
                  <ProgressBar value={prog} color={s.color} />
                  <Text style={styles.semProgressPct}>{Math.round(prog * 100)}%</Text>
                </View>
              </View>
              <View style={styles.semInfo}>
                <Text style={styles.semCount}>{comp}/{total}</Text>
                <Text style={styles.semChevron}>{isOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.semBody}>
                {s.modules.map((m) => {
                  const modKey = `${s.id}_${m.id}`;
                  const modOpen = expandedMod === modKey;
                  const modComp = m.lessons.filter((l) => completed[l.id]).length;

                  return (
                    <View key={m.id} style={styles.modCard}>
                      <TouchableOpacity
                        style={styles.modHeader}
                        onPress={() => setExpandedMod(modOpen ? null : modKey)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.modIcon}>{m.icon}</Text>
                        <Text style={styles.modName} numberOfLines={1}>{m.name}</Text>
                        <Text style={styles.modCount}>
                          {modComp}/{m.lessons.length}
                        </Text>
                        <Text style={styles.modChevron}>{modOpen ? '▲' : '▼'}</Text>
                      </TouchableOpacity>

                      {modOpen && (
                        <View style={styles.lessonList}>
                          {m.lessons.map((l) => (
                            <TouchableOpacity
                              key={l.id}
                              style={styles.lessonRow}
                              onPress={() => onToggleLesson(l.id, l.xp)}
                              activeOpacity={0.6}
                            >
                              <View
                                style={[
                                  styles.lessonCheck,
                                  completed[l.id] && { backgroundColor: C.sage, borderColor: C.sage },
                                ]}
                              >
                                {completed[l.id] && (
                                  <Text style={styles.lessonCheckIcon}>✓</Text>
                                )}
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={[
                                    styles.lessonName,
                                    completed[l.id] && styles.lessonNameDone,
                                  ]}
                                  numberOfLines={2}
                                >
                                  {l.name}
                                </Text>
                                <View style={styles.lessonMeta}>
                                  <TagBadge tag={l.tag} />
                                  <Text style={styles.lessonXP}>+{l.xp} XP</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

// ─── SCREEN: STATS ─────────────────────────────────────────────────────────────

const StatsScreen = ({ completed, xp, level, levelProgress }) => {
  const totalLessons = CURRICULUM.reduce((a, s) => a + getTotalLessons(s), 0);
  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.pageTitle}>📈 Estadísticas</Text>

      {/* XP Card */}
      <View style={[styles.headerCard, { alignItems: 'center' }]}>
        <Text style={styles.bigStat}>{xp}</Text>
        <Text style={styles.bigStatLabel}>XP Total</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>NIVEL {level}</Text>
        </View>
        <View style={{ width: '100%', marginTop: 12 }}>
          <ProgressBar value={levelProgress} color={C.gold} height={10} />
        </View>
        <Text style={styles.xpNext}>
          {xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP en nivel actual
        </Text>
      </View>

      {/* Resumen global */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: C.sage }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Lecciones ✓</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{totalLessons - completedCount}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: C.gold }]}>
            {Math.round((completedCount / totalLessons) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Progreso</Text>
        </View>
      </View>

      {/* Detalle por semestre */}
      <Text style={styles.sectionTitle}>Detalle por Semestre</Text>
      {CURRICULUM.map((s) => {
        const prog = getSemesterProgress(s, completed);
        const comp = getCompletedLessons(s, completed);
        const total = getTotalLessons(s);
        return (
          <View key={s.id} style={styles.statsSemRow}>
            <View style={styles.statsSemLeft}>
              <Text style={styles.statsSemEmoji}>{s.emoji}</Text>
              <View>
                <Text style={styles.statsSemTitle} numberOfLines={1}>{s.title}</Text>
                <Text style={styles.statsSemSub}>{comp} / {total} lecciones</Text>
              </View>
            </View>
            <View style={styles.statsSemRight}>
              <Text style={[styles.statsSemPct, { color: s.color }]}>
                {Math.round(prog * 100)}%
              </Text>
              <View style={{ width: 80 }}>
                <ProgressBar value={prog} color={s.color} height={6} />
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [completed, setCompleted] = useState({});
  const [dailyDone, setDailyDone] = useState({});
  const [bonusXP, setBonusXP] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setCompleted(data.completed || {});
          setBonusXP(data.bonusXP || 0);
          // Reset daily if new day
          const today = new Date().toDateString();
          if (data.dailyDate === today) {
            setDailyDone(data.dailyDone || {});
          }
        }
      } catch (e) {
        console.log('Load error:', e);
      }
      setLoading(false);
    })();
  }, []);

  // Save to storage
  const saveData = useCallback(async (comp, daily, bonus) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completed: comp,
          dailyDone: daily,
          dailyDate: new Date().toDateString(),
          bonusXP: bonus,
        }),
      );
    } catch (e) {
      console.log('Save error:', e);
    }
  }, []);

  const handleToggleLesson = useCallback(
    (id, xp) => {
      const next = { ...completed, [id]: !completed[id] };
      setCompleted(next);
      saveData(next, dailyDone, bonusXP);
    },
    [completed, dailyDone, bonusXP, saveData],
  );

  const handleToggleDaily = useCallback(
    (id, xp) => {
      if (dailyDone[id]) return; // ya completado
      const nextDaily = { ...dailyDone, [id]: true };
      const nextBonus = bonusXP + xp;
      setDailyDone(nextDaily);
      setBonusXP(nextBonus);
      saveData(completed, nextDaily, nextBonus);
    },
    [dailyDone, bonusXP, completed, saveData],
  );

  const lessonXP = getTotalXP(completed);
  const xp = lessonXP + bonusXP;
  const level = getLevel(xp);
  const levelProgress = getLevelProgress(xp);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={C.gold} size="large" />
        <Text style={[styles.subGreeting, { marginTop: 12 }]}>Cargando UND AVAI...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'inicio' && (
          <InicioScreen
            completed={completed}
            dailyDone={dailyDone}
            onToggleDaily={handleToggleDaily}
            xp={xp}
            level={level}
            levelProgress={levelProgress}
          />
        )}
        {activeTab === 'semestres' && (
          <SemestresScreen
            completed={completed}
            onToggleLesson={handleToggleLesson}
          />
        )}
        {activeTab === 'stats' && (
          <StatsScreen
            completed={completed}
            xp={xp}
            level={level}
            levelProgress={levelProgress}
          />
        )}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'semestres', label: 'Semestres', icon: '📚' },
          { id: 'stats', label: 'Stats', icon: '📈' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, activeTab === tab.id && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: C.bg },
  screen:           { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  // Header Card
  headerCard:       { backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  greeting:         { fontSize: 22, fontWeight: '700', color: C.cream, marginBottom: 2 },
  subGreeting:      { fontSize: 13, color: C.textMuted, marginBottom: 12 },
  xpRow:            { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelText:        { fontSize: 14, fontWeight: '600', color: C.gold },
  xpText:           { fontSize: 14, fontWeight: '600', color: C.goldLight },
  xpNext:           { fontSize: 11, color: C.textMuted, marginTop: 4 },

  // Stats Row
  statsRow:         { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox:          { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  statNum:          { fontSize: 22, fontWeight: '700', color: C.cream },
  statLabel:        { fontSize: 11, color: C.textMuted, marginTop: 2 },

  // Section title
  sectionTitle:     { fontSize: 15, fontWeight: '700', color: C.cream, marginBottom: 10, marginTop: 4 },
  pageTitle:        { fontSize: 20, fontWeight: '700', color: C.cream, marginBottom: 16 },

  // Sem Progress (Inicio)
  semProgressRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  semProgressEmoji: { fontSize: 18, width: 28 },
  semProgressHeader:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  semProgressTitle: { fontSize: 12, color: C.text, fontWeight: '600' },
  semProgressCount: { fontSize: 11, color: C.textMuted },

  // Challenges
  challengeCard:    { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border },
  challengeDone:    { opacity: 0.55, borderColor: C.sage + '60' },
  challengeCheck:   { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  checkIcon:        { color: C.gold, fontSize: 13, fontWeight: '700' },
  checkEmpty:       {},
  challengeText:    { flex: 1, fontSize: 13, color: C.text },
  challengeTextDone:{ textDecorationLine: 'line-through', color: C.textMuted },
  challengeXP:      { backgroundColor: C.gold + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  challengeXPText:  { fontSize: 11, color: C.gold, fontWeight: '700' },

  // Semester Cards
  semCard:          { backgroundColor: C.card, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  semHeader:        { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  semColorDot:      { width: 4, height: 40, borderRadius: 2 },
  semTitleRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  semEmoji:         { fontSize: 16 },
  semTitle:         { fontSize: 14, fontWeight: '700', color: C.cream, flex: 1 },
  semSubtitle:      { fontSize: 11, color: C.textMuted, marginBottom: 6 },
  semProgressRow2:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  semProgressPct:   { fontSize: 11, color: C.textMuted, width: 32, textAlign: 'right' },
  semInfo:          { alignItems: 'flex-end', gap: 4 },
  semCount:         { fontSize: 12, color: C.textMuted },
  semChevron:       { fontSize: 10, color: C.textMuted },
  semBody:          { paddingHorizontal: 12, paddingBottom: 12 },

  // Module Cards
  modCard:          { backgroundColor: C.surface, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  modHeader:        { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  modIcon:          { fontSize: 16 },
  modName:          { flex: 1, fontSize: 13, fontWeight: '600', color: C.text },
  modCount:         { fontSize: 12, color: C.textMuted },
  modChevron:       { fontSize: 10, color: C.textMuted, marginLeft: 4 },
  lessonList:       { paddingHorizontal: 12, paddingBottom: 10 },

  // Lesson Row
  lessonRow:        { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, gap: 10, borderTopWidth: 1, borderTopColor: C.border },
  lessonCheck:      { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  lessonCheckIcon:  { color: '#fff', fontSize: 11, fontWeight: '700' },
  lessonName:       { fontSize: 12, color: C.text, lineHeight: 18 },
  lessonNameDone:   { textDecorationLine: 'line-through', color: C.textMuted },
  lessonMeta:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  lessonXP:         { fontSize: 11, color: C.gold, fontWeight: '600' },

  // Tag Badge
  tagBadge:         { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 },
  tagText:          { fontSize: 9, fontWeight: '700' },

  // Progress
  progressBg:       { backgroundColor: C.border, borderRadius: 4, flex: 1, overflow: 'hidden' },
  progressFill:     { borderRadius: 4 },

  // Stats Screen
  bigStat:          { fontSize: 52, fontWeight: '800', color: C.gold },
  bigStatLabel:     { fontSize: 14, color: C.textMuted },
  levelBadge:       { backgroundColor: C.gold + '22', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginTop: 8, borderWidth: 1, borderColor: C.gold + '50' },
  levelBadgeText:   { fontSize: 13, fontWeight: '700', color: C.gold, letterSpacing: 1 },
  statsSemRow:      { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: C.border },
  statsSemLeft:     { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  statsSemEmoji:    { fontSize: 20 },
  statsSemTitle:    { fontSize: 13, fontWeight: '600', color: C.text },
  statsSemSub:      { fontSize: 11, color: C.textMuted },
  statsSemRight:    { alignItems: 'flex-end', gap: 4 },
  statsSemPct:      { fontSize: 14, fontWeight: '700' },

  // Tab Bar
  tabBar:           { flexDirection: 'row', backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: 4 },
  tabItem:          { flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 4, position: 'relative' },
  tabIcon:          { fontSize: 20, opacity: 0.5 },
  tabIconActive:    { opacity: 1 },
  tabLabel:         { fontSize: 10, color: C.textMuted, marginTop: 2 },
  tabLabelActive:   { color: C.gold, fontWeight: '600' },
  tabIndicator:     { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 2, backgroundColor: C.gold, borderRadius: 1 },
});
