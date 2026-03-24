import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions
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
    id: 's1', sem: '01', title: 'Maestria en Herramientas de Industria',
    subtitle: 'Calidad de Cine', emoji: '🎬', color: C.blue,
    modules: [
      { id: 's1m1', name: 'Creator Club - Edicion Profesional', icon: '🎞️', lessons: [
        { id: 'l001', name: 'Comunidad y Primeros Pasos', tag: 'Creator Club', xp: 30 },
        { id: 'l002', name: 'Packs de Recursos (2 lecciones)', tag: 'Creator Club', xp: 40 },
        { id: 'l003', name: 'Plugins para After Effects: ahorra tiempo', tag: 'Creator Club', xp: 40 },
        { id: 'l004', name: 'Edicion en Premiere y After Effects (20 lecciones)', tag: 'Creator Club', xp: 90 },
        { id: 'l005', name: 'Edicion en CapCut Movil (6 lecciones)', tag: 'Creator Club', xp: 70 },
        { id: 'l006', name: 'Edicion en CapCut (16 lecciones)', tag: 'Creator Club', xp: 80 },
        { id: 'l007', name: 'Edicion en DaVinci Resolve (7 lecciones)', tag: 'Creator Club', xp: 70 },
        { id: 'l008', name: 'Branding e Identidad de Marca (1 leccion)', tag: 'Creator Club', xp: 60 },
        { id: 'l009', name: 'Guionizado Viral con IA (1 leccion)', tag: 'Creator Club', xp: 65 },
        { id: 'l010', name: 'Como Hacer Edicion DINAMICA Nivel VIRAL con CapCut', tag: 'YT', xp: 70 },
        { id: 'l011', name: 'Viral Podcast Reel Editing in Premiere Pro', tag: 'YT', xp: 65 },
      ]},
      { id: 's1m2', name: 'Adobe Suite', icon: '🖥️', lessons: [
        { id: 'l012', name: 'Adobe After Effects', tag: 'Udemy', xp: 70 },
        { id: 'l013', name: 'Adobe Premiere', tag: 'Udemy', xp: 70 },
        { id: 'l014', name: 'After Effects (curso alternativo)', tag: 'Udemy', xp: 65 },
        { id: 'l015', name: 'Como usar tu Camara', tag: 'Gratis', xp: 50 },
        { id: 'l016', name: 'Master SaaS Motion Graphics in 30 Minutes (After Effects)', tag: 'YT', xp: 75 },
      ]},
    ]
  },
  {
    id: 's2', sem: '02', title: 'El Estandar de Hollywood',
    subtitle: 'DaVinci Resolve Mastery', emoji: '🎥', color: C.purple,
    modules: [
      { id: 's2m1', name: 'Blender & 3D', icon: '🟠', lessons: [
        { id: 'l020', name: 'Blender Core (Iniciacion)', tag: 'Plataforma', xp: 80 },
      ]},
      { id: 's2m2', name: 'DaVinci: Fundamentos', icon: '🎬', lessons: [
        { id: 'l021', name: '10 Primeros Pasos en DaVinci (RBG Escuela)', tag: 'YT', xp: 60 },
        { id: 'l022', name: 'Curso DaVinci Resolve 20 Clase #1 - El Mono Editor', tag: 'YT', xp: 80 },
        { id: 'l023', name: 'Curso DaVinci Resolve 20 - Yoney Gallardo 4h30', tag: 'YT', xp: 90 },
        { id: 'l024', name: 'Introduction to DaVinci Full Masterclass 2026 - Casey Faris', tag: 'YT', xp: 100 },
        { id: 'l025', name: 'DaVinci Resolve 20 Complete Tutorial Beginners 2026 - Justin Brown', tag: 'YT', xp: 90 },
        { id: 'l026', name: 'Full Video Editing Course for YouTube 4h - Marcus Jones', tag: 'YT', xp: 100 },
        { id: 'l027', name: 'Master DaVinci Resolve 20 From Basics to Pro - Resolve Cut', tag: 'YT', xp: 85 },
        { id: 'l028', name: 'Everything You Need to Start Editing DaVinci 2026 - Bring Your Own Laptop', tag: 'YT', xp: 85 },
        { id: 'l029', name: 'EL MEJOR PROGRAMA para EDITAR VIDEOS GRATIS - Aura Prods', tag: 'YT', xp: 60 },
        { id: 'l030', name: 'MEJORA tu EDICION con estos TIPS - Juan Ignacio Cali', tag: 'YT', xp: 65 },
        { id: 'l031', name: '9 COSAS que APRENDI tras EDITAR +10.000 Horas - Mirko Vigna', tag: 'YT', xp: 70 },
      ]},
      { id: 's2m3', name: 'Color Grading', icon: '🎨', lessons: [
        { id: 'l032', name: 'DaVinci Resolve Color Grading 2026 Tutorial Completo - Ramiro Maya', tag: 'YT', xp: 80 },
        { id: 'l033', name: 'El Unico Tutorial de Colorizacion - AlwaysJoan', tag: 'YT', xp: 85 },
        { id: 'l034', name: 'How to Color Grade Skin Tones Like A Pro - George.Colorist', tag: 'YT', xp: 90 },
        { id: 'l035', name: '7 MITOS de EDICION de VIDEO que AUN CREES - Mirko Vigna', tag: 'YT', xp: 60 },
      ]},
      { id: 's2m4', name: 'Motion Graphics & VFX', icon: '✨', lessons: [
        { id: 'l036', name: 'How to Edit Advanced Animations DaVinci IN-DEPTH - Zane Hoyer', tag: 'YT', xp: 85 },
        { id: 'l037', name: 'How to Edit Netflix-Level 3D Animations - Zane Hoyer', tag: 'YT', xp: 85 },
        { id: 'l038', name: 'How to Edit Cinematic Animations - Zane Hoyer', tag: 'YT', xp: 80 },
        { id: 'l039', name: 'How To Edit Viral 3-D Videos - Zane Hoyer', tag: 'YT', xp: 70 },
        { id: 'l040', name: 'How to Edit SAAS Animations - Zane Hoyer', tag: 'YT', xp: 75 },
        { id: 'l041', name: 'How to Edit High-End Motion Graphics - Zane Hoyer', tag: 'YT', xp: 75 },
        { id: 'l042', name: 'How VFX Artists Rotoscope Anything DaVinci 20 - Kevin Vandermarliere', tag: 'YT', xp: 75 },
        { id: 'l043', name: 'Create VIRAL Text Effects in DaVinci - Amro', tag: 'YT', xp: 75 },
        { id: 'l044', name: 'Viral Clean Motion Graphics Tutorial - Ritu Solanki', tag: 'YT', xp: 80 },
        { id: 'l045', name: 'This Is How You Animate Like a VIRAL Creator Fusion - The Resolve Effect', tag: 'YT', xp: 75 },
        { id: 'l046', name: 'Como usar FUSION FACIL en DaVinci - Lorenzo', tag: 'YT', xp: 70 },
        { id: 'l047', name: 'Fusion en DaVinci Resolve De CERO a PRO - Cesar Quintus', tag: 'YT', xp: 75 },
        { id: 'l048', name: 'Esto Cambio mi forma de hacer Videos Anima sin Keyframes - Mostro Lab', tag: 'YT', xp: 70 },
        { id: 'l049', name: 'Texturing of Complex Surfaces Track Anything - Jamie Fenn', tag: 'YT', xp: 70 },
      ]},
      { id: 's2m5', name: 'Transiciones & Tecnicas Avanzadas', icon: '⚡', lessons: [
        { id: 'l050', name: 'Master DaVinci Resolve Advanced Animation 7h - GrowTuber Guide', tag: 'YT', xp: 130 },
        { id: 'l051', name: 'Clase FILTRADA: Como editar Reel VIRALES en Davinci - Lorenzo', tag: 'YT', xp: 80 },
        { id: 'l052', name: '+10.000 HORAS en DaVinci resumidas en 20 TRUCOS - Lorenzo', tag: 'YT', xp: 75 },
        { id: 'l053', name: '3 Viral Real Estate Transitions - Joel Van Beek', tag: 'YT', xp: 70 },
        { id: 'l054', name: 'Create Stunning Split Object Transition - VideoEditingCentral', tag: 'YT', xp: 65 },
        { id: 'l055', name: 'Subtitulos Automaticos DINAMICOS DaVinci - Cesar Quintus', tag: 'YT', xp: 65 },
        { id: 'l056', name: 'Como hacer SUBTITULOS VIRALES en Davinci - Lorenzo', tag: 'YT', xp: 65 },
        { id: 'l057', name: 'VIDEOS VERTICALES EN DAVINCI para Shorts TikToks Reels - DaVinci Bro', tag: 'YT', xp: 60 },
        { id: 'l058', name: 'The Best Way to Create Macros in DaVinci - Jake Wipp & Matt McCool', tag: 'YT', xp: 65 },
        { id: 'l059', name: 'Domina las TRANSICIONES en Kdenlive GRATIS - JGuidus-Media', tag: 'YT', xp: 60 },
      ]},
    ]
  },
  {
    id: 's3', sem: '03', title: 'Redes Sociales & Copywriting',
    subtitle: 'Crecimiento Organico', emoji: '📱', color: C.rust,
    modules: [
      { id: 's3m1', name: 'SEO & Algoritmos', icon: '🔍', lessons: [
        { id: 'l070', name: 'Estrategia SEO para Multiplicar CPM x5 - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l071', name: 'El secreto SEO de Mr. Beast - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l072', name: 'Consigue MILLONES de visualizaciones - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l073', name: 'Exponiendo el Nuevo Algoritmo Instagram', tag: 'YT', xp: 70 },
        { id: 'l074', name: '5 Claves del SEO en Instagram - Metricool', tag: 'YT', xp: 65 },
      ]},
      { id: 's3m2', name: 'Instagram & LinkedIn', icon: '📸', lessons: [
        { id: 'l075', name: 'Como CRECER en Instagram 2025 - Pedro SEO', tag: 'YT', xp: 80 },
        { id: 'l076', name: 'La guia definitiva 0 a 1M views Instagram', tag: 'YT', xp: 75 },
        { id: 'l077', name: 'LinkedIn Content Writing Free Course - Matthew Lakajev', tag: 'YT', xp: 80 },
        { id: 'l078', name: 'The Best LinkedIn Growth Strategy - Neil Patel', tag: 'YT', xp: 65 },
        { id: 'l079', name: 'Mi estrategia para crecer +10.000 en LinkedIn - Luis Garau', tag: 'YT', xp: 70 },
      ]},
      { id: 's3m3', name: 'TikTok & Ads', icon: '🎵', lessons: [
        { id: 'l080', name: 'SEO en TikTok Guia completa - Pedro SEO', tag: 'YT', xp: 70 },
        { id: 'l081', name: 'Como hacer SEO para TikTok - HubSpot', tag: 'YT', xp: 65 },
        { id: 'l082', name: 'Facebook Ads para Principiantes - Andres Garza', tag: 'YT', xp: 85 },
        { id: 'l083', name: 'Tutorial Completo Meta Ads 0 a $$$ 9h', tag: 'YT', xp: 110 },
      ]},
      { id: 's3m4', name: 'YouTube Strategy', icon: '▶️', lessons: [
        { id: 'l084', name: 'Haz tu Video Viral con Gancho - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l085', name: 'Tengo 60.000 suscriptores y sin ventas', tag: 'YT', xp: 75 },
        { id: 'l086', name: 'Asi NO vas a vivir de YouTube - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l087', name: 'Cuanto gano con YouTube? - Romuald Fons', tag: 'YT', xp: 65 },
        { id: 'l088', name: 'Tu Videos NO funcionan? - Romuald Fons', tag: 'YT', xp: 65 },
      ]},
      { id: 's3m5', name: 'Copywriting', icon: '✍️', lessons: [
        { id: 'l089', name: 'Clase de Copywriting Vende x9 - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l090', name: 'El Nuevo Copywriting - Romuald Fons', tag: 'YT', xp: 80 },
        { id: 'l091', name: 'Curso GRATIS de Copywriting completo +5h', tag: 'YT', xp: 100 },
        { id: 'l092', name: '4 Years of Copywriting Advice - Cardinal Mason', tag: 'YT', xp: 70 },
        { id: 'l093', name: 'Copywriting y su importancia - Evonny Oficial', tag: 'YT', xp: 85 },
      ]},
    ]
  },
  {
    id: 's4', sem: '04', title: 'La Revolucion de la IA',
    subtitle: 'Herramientas & Automatizacion', emoji: '🤖', color: C.gold,
    modules: [
      { id: 's4m1', name: 'Cursos IA Plataforma', icon: '🎓', lessons: [
        { id: 'l100', name: 'Nano Banana (Google IA)', tag: 'Plataforma', xp: 70 },
        { id: 'l101', name: 'VEO 3 (Video con IA)', tag: 'Plataforma', xp: 90 },
        { id: 'l102', name: 'Flux AI (Imagen)', tag: 'Plataforma', xp: 85 },
        { id: 'l103', name: 'Runway AI', tag: 'Plataforma', xp: 90 },
        { id: 'l104', name: 'Kling AI +3h', tag: 'Plataforma', xp: 95 },
        { id: 'l105', name: 'Curso de Midjourney I.A. +10h', tag: 'Plataforma', xp: 120 },
      ]},
      { id: 's4m2', name: 'Automatizacion Make / N8N', icon: '⚙️', lessons: [
        { id: 'l110', name: 'Curso Completo De Make: Como Crear y Vender Automatizaciones IA - Adrian Saenz', tag: 'YT', xp: 100 },
        { id: 'l111', name: 'Como Crear Chatbots de IA Desde Cero Botpress - UDIA', tag: 'YT', xp: 80 },
        { id: 'l112', name: 'N8N CURSO COMPLETO 6 HORAS - Agustin Medina', tag: 'YT', xp: 110 },
        { id: 'l113', name: 'Curso Completo De N8N: Como Crear y Vender Agentes IA - Adrian Saenz', tag: 'YT', xp: 100 },
        { id: 'l114', name: 'Power Automate Tutorial Beginner To Pro - Pragmatic Works', tag: 'YT', xp: 95 },
        { id: 'l115', name: 'Copilot Microsoft 365 Curso Completo - Miquel Nadal Vela', tag: 'YT', xp: 90 },
        { id: 'l116', name: 'Aprende con los nerds Copilot Studio - Pragmatic Works', tag: 'YT', xp: 80 },
        { id: 'l117', name: 'Automatiza las REDES Sociales por IA - Alejavi Rivera', tag: 'YT', xp: 80 },
        { id: 'l118', name: 'Automatizacion de Redes Sociales con IA y Make.com - CentelA Education', tag: 'YT', xp: 75 },
        { id: 'l119', name: 'Esta IA Crea Contenido Diario Para Redes Sociales - Adrian Saenz', tag: 'YT', xp: 85 },
        { id: 'l120', name: 'Me volvi loco y automatice TODO mi trabajo - Guinxu', tag: 'YT', xp: 75 },
        { id: 'l121', name: 'Como Instalar LLM en local y usarlo en la nube - Jose Andonaire', tag: 'YT', xp: 70 },
        { id: 'l122', name: 'Tutorial completo Google Workspace AI Gemini 2025 - Stewart Gauld', tag: 'YT', xp: 80 },
        { id: 'l123', name: 'Get started with Google Workspace Studio', tag: 'YT', xp: 60 },
        { id: 'l124', name: 'Google Workspace Studio NUEVO 2026 - EdTrainer Tv', tag: 'YT', xp: 70 },
        { id: 'l125', name: 'Google Workspace Studio AI Lo NUEVO de GOOGLE - Buildt Academy', tag: 'YT', xp: 70 },
        { id: 'l126', name: 'Google Workspace Studio: Automate work with AI agents', tag: 'YT', xp: 65 },
        { id: 'l127', name: 'Automatiza Gmail con IA - netCloud', tag: 'YT', xp: 60 },
        { id: 'l128', name: 'La forma CORRECTA de automatizar WhatsApp con COEXISTANCE', tag: 'YT', xp: 65 },
      ]},
      { id: 's4m3', name: 'ComfyUI & Imagen IA', icon: '🖼️', lessons: [
        { id: 'l130', name: 'ComfyUI para PRINCIPIANTES - Nekodificador', tag: 'YT', xp: 80 },
        { id: 'l131', name: 'Aprende ComfyUI desde CERO 2025 - IA SIN FILTROS', tag: 'YT', xp: 85 },
        { id: 'l132', name: 'Master AI image generation ComfyUI FULL TUTORIAL - AI Search', tag: 'YT', xp: 90 },
        { id: 'l133', name: 'How to use ComfyUI for beginners - Sebastian Kamph', tag: 'YT', xp: 80 },
        { id: 'l134', name: 'Master Midjourney Updated Beginner to Advanced - Futurepedia', tag: 'YT', xp: 90 },
        { id: 'l135', name: 'DOMINA Midjourney GUIA COMPLETA - Ruva IA', tag: 'YT', xp: 85 },
        { id: 'l136', name: 'The Freepik AI Masterclass 2026 - Ludovit Nastišin', tag: 'YT', xp: 80 },
        { id: 'l137', name: 'Asi genere mis fotos mas EPICAS con IA Flux + ComfyUI + LoRA - Nate Gentile', tag: 'YT', xp: 80 },
      ]},
      { id: 's4m4', name: 'Avatares, Voz & Video IA', icon: '🎭', lessons: [
        { id: 'l140', name: 'Intro to HeyGen: AI Avatars - HeyGen', tag: 'YT', xp: 75 },
        { id: 'l141', name: 'HeyGen AI Avatar Tutorial Complete Workflow - AI Automation Station', tag: 'YT', xp: 80 },
        { id: 'l142', name: 'The NEW Way to Create Realistic Talking AI Avatars - Tao Prompts', tag: 'YT', xp: 80 },
        { id: 'l143', name: 'La nueva tendencia del 2026: Avatares con IA Heygen - CentelA Education', tag: 'YT', xp: 75 },
        { id: 'l144', name: 'Curso de ElevenLabs: Texto a Voz & Voz a Voz - Diego Cardenas', tag: 'YT', xp: 80 },
        { id: 'l145', name: 'How To Use Elevenlabs Master AI Voice Generator - Dan Kieft', tag: 'YT', xp: 75 },
        { id: 'l146', name: 'Free Runway AI Video Generation Beginner Course NEWEST UPDATES', tag: 'YT', xp: 85 },
        { id: 'l147', name: 'Create Cinematic AI Videos with Runway Gen-4 - Tao Prompts', tag: 'YT', xp: 80 },
        { id: 'l148', name: 'Runway para principiantes: personajes y videos con IA - CentelA Education', tag: 'YT', xp: 75 },
        { id: 'l149', name: 'How to Use Adobe Firefly Ultimate AI Platform - Jason Gandy', tag: 'YT', xp: 80 },
        { id: 'l150', name: 'ADOBE FIREFLY 2025 GUIA COMPLETA - Camilo Adobe', tag: 'YT', xp: 80 },
        { id: 'l151', name: 'The Only Synthesia AI Tutorial - Simon Crowe', tag: 'YT', xp: 75 },
        { id: 'l152', name: 'Esta IA genera videos FALSOS de mi - Nate Gentile', tag: 'YT', xp: 65 },
        { id: 'l153', name: 'He clonado mi estudio con Inteligencia Artificial - Nate Gentile', tag: 'YT', xp: 65 },
        { id: 'l154', name: 'Como Delphi.ai crea tu gemelo digital perfecto - Joe Fier', tag: 'YT', xp: 75 },
        { id: 'l155', name: 'Crea tu propio clon con IA en 15 minutos - Emprende Aprendiendo', tag: 'YT', xp: 70 },
        { id: 'l156', name: 'MEJORO mi EMPRESA usando IA: Chatbots LLM RAG - Nate Gentile', tag: 'YT', xp: 80 },
      ]},
      { id: 's4m5', name: 'ChatGPT / Claude / Gemini', icon: '💬', lessons: [
        { id: 'l160', name: 'Domina ChatGPT: El Curso Mas Practico en Espanol - Emprende Aprendiendo', tag: 'YT', xp: 90 },
        { id: 'l161', name: 'Google Gemini FULL COURSE 3 HOURS - Julian Goldie', tag: 'YT', xp: 90 },
        { id: 'l162', name: 'Goodbye ChatGPT 5 Ultimate Claude 4.1 Guide 2026 - AI Master', tag: 'YT', xp: 80 },
        { id: 'l163', name: 'Claude AI Tutorial Completo En Espanol 2025 - AntonysTutorials', tag: 'YT', xp: 80 },
        { id: 'l164', name: 'ChatGPT SUPERADO? Aprende Claude paso a paso - Emprende Aprendiendo', tag: 'YT', xp: 75 },
        { id: 'l165', name: 'Claude Code Tutorial for Beginners - Kevin Stratvert', tag: 'YT', xp: 75 },
        { id: 'l166', name: 'Ultimate GROK 4 Guide 2026 - AI Master', tag: 'YT', xp: 80 },
        { id: 'l167', name: 'Everything Perplexity In 34 Minutes - Tina Huang', tag: 'YT', xp: 85 },
        { id: 'l168', name: 'Perplexity: Beginner to Pro in 27 Minutes - Ali H. Salem', tag: 'YT', xp: 75 },
        { id: 'l169', name: 'Perplexity Full Tutorial WILD Ai Research Tool - Productive Dude', tag: 'YT', xp: 75 },
        { id: 'l170', name: 'NotebookLM FULL COURSE 4 HOURS - Julian Goldie', tag: 'YT', xp: 95 },
        { id: 'l171', name: 'How To Master NotebookLM in 2026 - Paul J Lipsky', tag: 'YT', xp: 75 },
        { id: 'l172', name: 'Curso Completo NotebookLM: Dominalo mejor que el 99% - David Zamora', tag: 'YT', xp: 80 },
        { id: 'l173', name: 'NotebookLM: La GUIA COMPLETA Paso a Paso - Inteligencia Artificial', tag: 'YT', xp: 75 },
        { id: 'l174', name: 'Como crear un GPT Personalizado que trabaje por ti - Romuald Fons', tag: 'YT', xp: 80 },
        { id: 'l175', name: 'OpenClaw Full Course: Setup Skills Voice Memory - Tech With Tim', tag: 'YT', xp: 80 },
        { id: 'l176', name: 'OpenClaw Full Tutorial for Beginners - freeCodeCamp', tag: 'YT', xp: 75 },
        { id: 'l177', name: 'OpenClaw Crash Course: 24/7 AI Assistant - Mayank Aggarwal', tag: 'YT', xp: 75 },
      ]},
      { id: 's4m6', name: 'Negocios & Agencia IA', icon: '💼', lessons: [
        { id: 'l180', name: 'Los 5 Mejores Negocios Con Inteligencia Artificial - Andres Garza', tag: 'YT', xp: 75 },
        { id: 'l181', name: '7 Negocios De Inteligencia Artificial $500/dia - Adrian Saenz', tag: 'YT', xp: 80 },
        { id: 'l182', name: 'Como Empezar Una Agencia De IA Paso a Paso 8h', tag: 'YT', xp: 120 },
        { id: 'l183', name: 'Como Crear Tu Agencia IA de 32.000$/mes - Emprende Aprendiendo', tag: 'YT', xp: 100 },
        { id: 'l184', name: 'How to Start an AI Business in 2026 - Liam Ottley', tag: 'YT', xp: 85 },
        { id: 'l185', name: 'Como Utilizar La IA Para Ganar Dinero - Adria Sola Pastor', tag: 'YT', xp: 85 },
        { id: 'l186', name: 'Cursos de IA GRATIS para Emprendedores 2026 Agentes de IA', tag: 'YT', xp: 70 },
        { id: 'l187', name: 'El liderazgo en la era de la Inteligencia Artificial - Platzi', tag: 'YT', xp: 70 },
        { id: 'l188', name: 'AI & Leadership: How To Make High-Performing Teams - David Burkus', tag: 'YT', xp: 70 },
        { id: 'l189', name: 'Curso gratis: Como emprender con inteligencia artificial - EDteam', tag: 'YT', xp: 80 },
      ]},
      { id: 's4m7', name: 'Musica IA & Herramientas Extra', icon: '🎵', lessons: [
        { id: 'l190', name: 'Suno AI Tutorial 2026: Every Hidden Button & Feature - ChillPanic', tag: 'YT', xp: 70 },
        { id: 'l191', name: 'GUIA de 0 a PRO para hacer musica con IA SUNO.AI - elomaquiabelo', tag: 'YT', xp: 80 },
        { id: 'l192', name: 'SUNO STUDIO Nuevo: Como funciona y mejores Trucos - Ingenier-IA Musical', tag: 'YT', xp: 80 },
        { id: 'l193', name: 'Lovable FULL Tutorial For COMPLETE Beginners - Tech With Tim', tag: 'YT', xp: 75 },
        { id: 'l194', name: 'Curso de Lovable GRATIS Crea sitios web con IA 2025', tag: 'YT', xp: 70 },
        { id: 'l195', name: 'EJECUTA IA en LOCAL GRATIS - Dot CSV Lab', tag: 'YT', xp: 80 },
        { id: 'l196', name: 'Llama: The Open-Weight AI Model - IBM Technology', tag: 'YT', xp: 70 },
        { id: 'l197', name: 'Learn Ollama in 15 Minutes Run LLM Models Locally - Tech With Tim', tag: 'YT', xp: 70 },
        { id: 'l198', name: 'Model Context Protocol MCP Explained', tag: 'YT', xp: 75 },
        { id: 'l199', name: 'Aspectos legales de la IA en plena expansion - practia.global', tag: 'YT', xp: 70 },
        { id: 'l200', name: 'Google AIs New Pomelli Photoshoot - Paul J Lipsky', tag: 'YT', xp: 60 },
      ]},
      { id: 's4m8', name: 'Desarrollo con IA Cursor & APIs', icon: '💻', lessons: [
        { id: 'l210', name: 'Cursor 2.0 Tutorial for Beginners Full Course - Riley Brown', tag: 'YT', xp: 85 },
        { id: 'l211', name: 'Curso de Cursor: Editor IA Todo Lo Que Necesitas Saber - Fazt', tag: 'YT', xp: 80 },
        { id: 'l212', name: 'Tutorial de Cursor editor de codigo con AI - Platzi', tag: 'YT', xp: 75 },
        { id: 'l213', name: 'Google AI Studio Tutorial Beginner to Expert - Santrel Media', tag: 'YT', xp: 75 },
        { id: 'l214', name: 'OpenAI Assistants API Course for Beginners - freeCodeCamp', tag: 'YT', xp: 90 },
        { id: 'l215', name: 'Copilot Microsoft 365 Curso Completo 3.5h - Miquel Nadal Vela', tag: 'YT', xp: 85 },
        { id: 'l216', name: 'Code Your Own Llama 4 LLM from Scratch - freeCodeCamp', tag: 'YT', xp: 95 },
        { id: 'l217', name: 'Como Crear tu Plan de Marketing con IA en Minutos - Cyberclick', tag: 'YT', xp: 70 },
        { id: 'l218', name: 'Como montar tu propio sistema de marketing con IA - Migue Baena IA', tag: 'YT', xp: 70 },
      ]},
    ]
  },
  {
    id: 's5', sem: '05', title: 'Diseno e Identidad Visual',
    subtitle: 'Photoshop & Monetizacion', emoji: '🎨', color: C.sage,
    modules: [
      { id: 's5m1', name: 'Photoshop Profesional', icon: '🖼️', lessons: [
        { id: 'l220', name: 'Domina Photoshop como un profesional desde cero 4h41', tag: 'Plataforma', xp: 100 },
        { id: 'l221', name: 'Hacks de Photoshop Temporada 2 7h41', tag: 'Plataforma', xp: 110 },
        { id: 'l222', name: 'Masterclass Disenar Banners 1h12', tag: 'Plataforma', xp: 80 },
      ]},
      { id: 's5m2', name: 'Thumbnails & Branding', icon: '✏️', lessons: [
        { id: 'l223', name: 'Viral Thumbnail Template Pack', tag: 'Curso', xp: 75 },
      ]},
      { id: 's5m3', name: 'Monetizacion con Diseno', icon: '💰', lessons: [
        { id: 'l224', name: 'Domina Fiverr y aprende a generar ingresos 4h27', tag: 'Plataforma', xp: 90 },
      ]},
    ]
  },
  {
    id: 's6', sem: '06', title: 'Mentalidad y Estrategia Freelance',
    subtitle: 'Negocio & Emprendimiento', emoji: '💼', color: '#c4883a',
    modules: [
      { id: 's6m1', name: 'Freelance & Emprendimiento', icon: '🚀', lessons: [
        { id: 'l230', name: 'Convierte en Freelance desde cero 4h02', tag: 'Plataforma', xp: 95 },
        { id: 'l231', name: 'Curso de Funnels BIG school', tag: 'Plataforma', xp: 85 },
        { id: 'l232', name: 'Curso Iniciacion Negocios BIG school 60%', tag: 'Plataforma', xp: 80 },
        { id: 'l233', name: 'VideoMarketer BIG school 13%', tag: 'Plataforma', xp: 90 },
        { id: 'l234', name: 'Upgrade | Casos Avanzados para Empresarios', tag: 'Plataforma', xp: 95 },
        { id: 'l235', name: 'Si quieres dinero NO seas influencer - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l236', name: 'Ser autonomo en Espana es una ruina - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l237', name: 'De hobby a empresa rentable: lo que nadie te cuenta - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l238', name: 'Sin paro sin clientes pero se puede! - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l239', name: 'Cobra el doble haciendo lo mismo - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l240', name: 'Mainstream o nicho? La decision que cambiara tu canal - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l241', name: 'Como Emprender siendo Joven SIN MALGASTAR DINERO - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l242', name: '13 anos de aprendizajes sobre NEGOCIOS en 45 minutos - Romuald Fons', tag: 'YT', xp: 80 },
        { id: 'l243', name: 'Como hundir a tu competencia invirtiendo menos - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l244', name: '7 errores que estan DESTROZANDO tu negocio - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l245', name: 'Transforma tu conocimiento en ingresos reales - Romuald Fons', tag: 'YT', xp: 75 },
        { id: 'l246', name: 'Las decisiones que mas dinero me han hecho perder - Romuald Fons', tag: 'YT', xp: 70 },
        { id: 'l247', name: 'Como ser un gran CEO - Platzi', tag: 'YT', xp: 70 },
      ]},
      { id: 's6m2', name: 'Mentalidad & Productividad', icon: '🧠', lessons: [
        { id: 'l250', name: 'Pack GPTs Asistentes IA Personalizados', tag: 'Academy', xp: 80 },
        { id: 'l251', name: 'Coach Teacher', tag: 'Academy', xp: 70 },
        { id: 'l252', name: 'Academy Mastery', tag: 'Academy', xp: 75 },
        { id: 'l253', name: 'Flash Libros 2.0', tag: 'Academy', xp: 65 },
        { id: 'l254', name: 'Leader Summaries', tag: 'Academy', xp: 65 },
        { id: 'l255', name: 'Audios de Mentalidad de Emprendedor', tag: 'Academy', xp: 60 },
        { id: 'l256', name: 'Sesgado | Trucos Psicologicos para Vender', tag: 'Academy', xp: 80 },
        { id: 'l257', name: 'Masterclass Domina ChatGPT Actualizada', tag: 'Academy', xp: 85 },
        { id: 'l258', name: 'SILEX 2.0', tag: 'Academy', xp: 90 },
        { id: 'l259', name: 'Le dije la verdad y se quedo helado - Romuald Fons', tag: 'YT', xp: 65 },
        { id: 'l260', name: 'Emprendedor nato que no sabe priorizar - Romuald Fons', tag: 'YT', xp: 65 },
        { id: 'l261', name: 'Autoempleado mileurista en apuros - Romuald Fons', tag: 'YT', xp: 65 },
      ]},
      { id: 's6m3', name: 'Clon IA & Avatar', icon: '🤖', lessons: [
        { id: 'l262', name: 'Clon IA Euge Oller completado', tag: 'BIG school', xp: 100 },
        { id: 'l263', name: 'Designio | Diseno para Emprendedores', tag: 'Academy', xp: 75 },
      ]},
      { id: 's6m4', name: 'Libros & Fiscalidad', icon: '📚', lessons: [
        { id: 'l264', name: 'Crece y Hazte Rico - Romuald Fons', tag: 'Libro', xp: 70 },
        { id: 'l265', name: 'Autonomo para Dummies - R. Gonzalez Fontenla', tag: 'Libro', xp: 65 },
        { id: 'l266', name: 'Cuanto vale tu empresa sin ti? Valoracion y retirada - Asimetric', tag: 'YT', xp: 75 },
        { id: 'l267', name: 'Como pagar menos en la RENTA y rentabilizar tu dinero - Asimetric', tag: 'YT', xp: 75 },
      ]},
    ]
  },
  {
    id: 's7', sem: '07', title: 'Formacion Avanzada',
    subtitle: 'Drive Propio & Recursos', emoji: '📁', color: '#6a8f9e',
    modules: [
      { id: 's7m1', name: 'Carpetas de Conocimiento', icon: '🗂️', lessons: [
        { id: 'l270', name: 'ChatGPT (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l271', name: 'Comunicacion (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l272', name: 'Criptomonedas (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l273', name: 'E-mail (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l274', name: 'Finanzas (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l275', name: 'Fiscalidad (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l276', name: 'Habitos Financieros (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l277', name: 'IA (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l278', name: 'SEO (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l279', name: 'SEO Redes (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l280', name: 'Sistema Facturacion Automatica', tag: 'Drive', xp: 70 },
        { id: 'l281', name: 'Ventas (carpeta Drive)', tag: 'Drive', xp: 60 },
        { id: 'l282', name: 'Video Marketer (carpeta Drive)', tag: 'Drive', xp: 60 },
      ]},
      { id: 's7m2', name: 'Clases & Recursos Extra', icon: '🎥', lessons: [
        { id: 'l283', name: 'Clase grabada 2024-12-06', tag: 'Video', xp: 50 },
        { id: 'l284', name: 'Clase 1 - La Inversion Si Es Para Ti', tag: 'Video', xp: 55 },
        { id: 'l285', name: 'Clase 2 - La Inversion Si Es Para Ti', tag: 'Video', xp: 55 },
        { id: 'l286', name: 'Clase 3 - La Inversion Si Es Para Ti', tag: 'Video', xp: 55 },
        { id: 'l287', name: 'Calendarios Edicion Video Freelance Mes 1', tag: 'PDF', xp: 40 },
        { id: 'l288', name: 'Calendarios Edicion Video Freelance Mes 2', tag: 'PDF', xp: 40 },
        { id: 'l289', name: 'Calendarios Edicion Video Freelance Mes 3', tag: 'PDF', xp: 40 },
        { id: 'l290', name: 'Calendarios Edicion Video Freelance Mes 4', tag: 'PDF', xp: 40 },
        { id: 'l291', name: 'Calendarios Edicion Video Freelance Mes 5', tag: 'PDF', xp: 40 },
        { id: 'l292', name: 'Calendarios Edicion Video Freelance Mes 6', tag: 'PDF', xp: 40 },
      ]},
    ]
  },
  {
    id: 's8', sem: '08', title: 'Artes Visuales & Animacion',
    subtitle: 'Formacion Complementaria', emoji: '🖌️', color: '#9e5a8f',
    modules: [
      { id: 's8m1', name: 'Dibujo Tradicional', icon: '✏️', lessons: [
        { id: 'l300', name: 'Aprende a dibujar desde cero', tag: 'Plataforma', xp: 70 },
        { id: 'l301', name: 'Tecnicas de lapiz para dibujo realista', tag: 'Plataforma', xp: 75 },
        { id: 'l302', name: 'Ilustracion con carboncillo', tag: 'Plataforma', xp: 70 },
        { id: 'l303', name: 'Iniciacion a la caricatura', tag: 'Plataforma', xp: 65 },
        { id: 'l304', name: 'Curso completo de Retrato a Lapiz', tag: 'Plataforma', xp: 75 },
        { id: 'l305', name: 'Master Class de Dibujo con MANCHA carboncillo', tag: 'Plataforma', xp: 80 },
        { id: 'l306', name: 'Dibuja Mejor en solo 21 Dias', tag: 'Plataforma', xp: 70 },
        { id: 'l307', name: 'Aprende Dibujo Artistico facilmente A. G. Villaran', tag: 'Udemy', xp: 80 },
      ]},
      { id: 's8m2', name: 'Ilustracion Digital', icon: '🖥️', lessons: [
        { id: 'l308', name: 'Introduccion a Adobe Illustrator', tag: 'Plataforma', xp: 75 },
        { id: 'l309', name: 'Ilustracion con Carles Dalmau EN PROGRESO', tag: 'Plataforma', xp: 85 },
        { id: 'l310', name: 'Retrato Realista en Digital masterclass', tag: 'Plataforma', xp: 85 },
        { id: 'l311', name: 'Procreate desde cero', tag: 'Plataforma', xp: 75 },
        { id: 'l312', name: 'Diseno vectorial avanzado', tag: 'Plataforma', xp: 80 },
      ]},
    ]
  },
  {
    id: 's9', sem: '09', title: 'Marketing Digital Completo',
    subtitle: 'Estrategia & Crecimiento', emoji: '📊', color: '#c4593a',
    modules: [
      { id: 's9m1', name: 'Fundamentos de Marketing Digital', icon: '📚', lessons: [
        { id: 'l320', name: 'CURSO de Marketing Digital Completo 2026 - Cyberclick 3h44', tag: 'YT', xp: 110 },
        { id: 'l321', name: 'Aprende Marketing Paso a Paso Metodo Facil - Emprende Aprendiendo', tag: 'YT', xp: 70 },
        { id: 'l322', name: 'Simio explicar Marketing Digital en 10 minutos', tag: 'YT', xp: 55 },
        { id: 'l323', name: 'Asi cambiara el Marketing Digital en 2026 7 Estrategias - Emprende Aprendiendo', tag: 'YT', xp: 70 },
        { id: 'l324', name: 'CURSO DE MARKETING COMPLETO - Yoney Gallardo 3h39', tag: 'YT', xp: 100 },
        { id: 'l325', name: 'Marketing Digital y Redes Sociales Curso completo 2025 - Elevacion Digital', tag: 'YT', xp: 90 },
        { id: 'l326', name: 'Que es Marketing: Con un Verdadero Experto Rolando Arellano', tag: 'YT', xp: 80 },
        { id: 'l327', name: 'El poder de la Estrategia en los negocios y marketing - Velocity Media', tag: 'YT', xp: 70 },
        { id: 'l328', name: '5 SISTEMAS que necesitas para ESCALAR tu EMPRESA - Alvaro Luque', tag: 'YT', xp: 70 },
        { id: 'l329', name: 'Los sistemas convierten un negocio en una maquina - Emprendedor Eficaz', tag: 'YT', xp: 70 },
        { id: 'l330', name: 'Que es MARKETING DIGITAL Como FUNCIONA - Aprendamos Marketing', tag: 'YT', xp: 65 },
        { id: 'l331', name: 'Que es un negocio digital y que vende? - CodiSoft', tag: 'YT', xp: 55 },
        { id: 'l332', name: 'Que son los negocios digitales? - Tiendup', tag: 'YT', xp: 55 },
        { id: 'l333', name: 'LOS 7 FUNDAMENTOS DE UN NEGOCIO DIGITAL - Emprende Aprendiendo', tag: 'YT', xp: 60 },
        { id: 'l334', name: 'TODA LA VERDAD sobre el MARKETING DIGITAL 2025 - The BIG', tag: 'YT', xp: 75 },
        { id: 'l335', name: '13 Years of Marketing Advice in 85 Mins - Alex Hormozi', tag: 'YT', xp: 85 },
      ]},
      { id: 's9m2', name: 'Branding & Identidad de Marca', icon: '🎨', lessons: [
        { id: 'l340', name: 'Como crear la identidad visual de tu marca - Vadezero', tag: 'YT', xp: 60 },
        { id: 'l341', name: 'Que es BRANDING? Definicion de expertos - Frank Moreno', tag: 'YT', xp: 60 },
        { id: 'l342', name: 'PASO A PASO Diseno y desarrollo de logo - Marco Creativo', tag: 'YT', xp: 70 },
        { id: 'l343', name: 'El curso de LOGOS mas corto del mundo - Eze Cichello', tag: 'YT', xp: 55 },
        { id: 'l344', name: 'What Is Branding? 4 Minute Crash Course - The Futur', tag: 'YT', xp: 50 },
        { id: 'l345', name: 'Como crear un BRANDING para tu MARCA PERSONAL o EMPRESA - Juan Ignacio Cali', tag: 'YT', xp: 65 },
        { id: 'l346', name: 'Branding para Principiantes CURSO COMPLETO EN ESPANOL - Oliver Puente', tag: 'YT', xp: 80 },
        { id: 'l347', name: 'Como Crear una MARCA PERSONAL en 2026 - Mirko Vigna', tag: 'YT', xp: 70 },
      ]},
      { id: 's9m3', name: 'SEO Completo', icon: '🔍', lessons: [
        { id: 'l350', name: 'The New Rules of SEO 2026 - Neil Patel', tag: 'YT', xp: 70 },
        { id: 'l351', name: 'Busqueda de palabras clave en 2026: Tutorial 3 pasos - Ahrefs ES', tag: 'YT', xp: 70 },
        { id: 'l352', name: 'Curso SEO eCommerce 2026 Leccion 7 Arquitectura Web', tag: 'YT', xp: 75 },
        { id: 'l353', name: 'Curso SEO eCommerce 2026 Leccion 9 Indexacion SEO', tag: 'YT', xp: 70 },
        { id: 'l354', name: 'Factores SEO 2026 - Jorge Lujan', tag: 'YT', xp: 70 },
        { id: 'l355', name: 'Como hacer seo de 0 a 100 en 2026 - Jorge Lujan', tag: 'YT', xp: 75 },
        { id: 'l356', name: 'Arquitectura Web SEO: Optimiza tu sitio - VISIBILIDADON', tag: 'YT', xp: 65 },
        { id: 'l357', name: 'Como crear un sitemap XML y enviarlo a Google - Antonio de Trei', tag: 'YT', xp: 60 },
        { id: 'l358', name: 'SEO para WordPress en 2026 Guia de 0 a 100 - Luis M. Villanueva', tag: 'YT', xp: 80 },
        { id: 'l359', name: 'WordPress Tutorial Hostinger Complete Setup - Darrel Wilson', tag: 'YT', xp: 75 },
        { id: 'l360', name: 'SEO Full Course 2026 - Simplilearn', tag: 'YT', xp: 90 },
        { id: 'l361', name: 'LINK BUILDING Todo lo que necesitas saber Curso SEO #11', tag: 'YT', xp: 75 },
        { id: 'l362', name: 'Que es y como hacer LinkBuilding en SEO 2026 - GabiFlorensa', tag: 'YT', xp: 70 },
        { id: 'l363', name: 'Como hacer Link building 2026 TRUCOS SEO - Jorge Lujan', tag: 'YT', xp: 65 },
        { id: 'l364', name: 'Como analizar a la competencia en SISTRIX - MJ Cachon', tag: 'YT', xp: 70 },
        { id: 'l365', name: 'Tutorial de Semrush: Guia SEO Completa - Metics Media', tag: 'YT', xp: 75 },
        { id: 'l366', name: 'Curso de Screaming Frog GRATIS desde CERO - MJ Cachon', tag: 'YT', xp: 60 },
        { id: 'l367', name: 'Mejores extensiones SEO para Chrome 2026 - Jorge Lujan', tag: 'YT', xp: 60 },
        { id: 'l368', name: 'Curso SEO para PRINCIPIANTES De 0 a 100 2026 - Javier SEO', tag: 'YT', xp: 85 },
        { id: 'l369', name: '5 GPTs gratis para hacer SEO MASTERCLASS BIG school', tag: 'YT', xp: 75 },
        { id: 'l370', name: '6 CLAVES para el SEO en 2025 BIG lessons Javier Martinez', tag: 'YT', xp: 75 },
        { id: 'l371', name: 'Advanced ASO strategies for 2026 - AppFollow', tag: 'YT', xp: 65 },
        { id: 'l372', name: 'COMO HACER SEO en los NUEVOS RESULTADOS de IA - The BIG', tag: 'YT', xp: 80 },
      ]},
      { id: 's9m4', name: 'Redes Sociales & Algoritmos', icon: '📱', lessons: [
        { id: 'l380', name: 'Como ser un experto en Instagram y Tiktok - Andrea Estratega', tag: 'YT', xp: 75 },
        { id: 'l381', name: 'La guia definitiva para crecer en instagram en 2026 - converzzo', tag: 'YT', xp: 70 },
        { id: 'l382', name: 'Como crecer una audiencia online con 0 seguidores 2026 - Adria Sola Pastor', tag: 'YT', xp: 75 },
        { id: 'l383', name: 'El ALGORITMO de Instagram ha Cambiado en 2026 - Victor Heras Media', tag: 'YT', xp: 70 },
        { id: 'l384', name: 'Exponiendo el Nuevo Algoritmo de Instagram de 2026 - Victor Heras Media', tag: 'YT', xp: 70 },
        { id: 'l385', name: 'COPIA MI ESTRATEGIA DE CONTENIDO para 2026 - Andreina Valderrama', tag: 'YT', xp: 65 },
        { id: 'l386', name: 'La MEJOR herramienta para gestionar REDES SOCIALES - Aprendamos Marketing', tag: 'YT', xp: 65 },
        { id: 'l387', name: 'Como Crecer tu Empresa en LinkedIn: 5 Estrategias 10X - HubSpot Espanol', tag: 'YT', xp: 65 },
        { id: 'l388', name: 'Pinterest Affiliate Marketing: The Full Course For 2026 - Adam Enfroy', tag: 'YT', xp: 70 },
        { id: 'l389', name: 'Influencer marketing: guia completa para principiantes - HubSpot Espanol', tag: 'YT', xp: 65 },
        { id: 'l390', name: 'Romuald Fons: Como GANARTE la VIDA CREANDO CONTENIDO - The BIG', tag: 'YT', xp: 75 },
      ]},
      { id: 's9m5', name: 'Ads & Publicidad de Pago', icon: '💰', lessons: [
        { id: 'l400', name: 'Facebook Ads para Principiantes CURSO Gratis 2026 - Andres Garza', tag: 'YT', xp: 85 },
        { id: 'l401', name: 'Start a Facebook Page in 2025 FULL COURSE - Ytgrow Master', tag: 'YT', xp: 70 },
        { id: 'l402', name: 'Tutorial Completo De Meta Ads Para Principiantes 2026 9h', tag: 'YT', xp: 110 },
        { id: 'l403', name: 'X Twitter Ads for Beginners: The 2026 Guide - Brad Smith', tag: 'YT', xp: 60 },
        { id: 'l404', name: 'Curso de Google Ads 2026 Completo y GRATIS - Alan Valdez', tag: 'YT', xp: 90 },
        { id: 'l405', name: 'Google Ads Full Course 2026 - Simplilearn', tag: 'YT', xp: 85 },
        { id: 'l406', name: 'Copywriting en tus anuncios de Google Ads - Marc Ramentol', tag: 'YT', xp: 70 },
        { id: 'l407', name: 'YouTube Ads 2026 Masterclass - Maciek YouTube Ads', tag: 'YT', xp: 75 },
        { id: 'l408', name: 'Bing Ads Full Tutorial 2026 Microsoft Ads - Ben B2B', tag: 'YT', xp: 65 },
        { id: 'l409', name: 'Curso de LinkedIn Ads para Principiantes - David Garcia Amaya', tag: 'YT', xp: 70 },
        { id: 'l410', name: 'Tutorial de Snapchat Ads: Guia Definitiva - Metics Media', tag: 'YT', xp: 65 },
        { id: 'l411', name: 'My Amazon Ad Strategy for Beginners 2026 - Self Publishing Empire', tag: 'YT', xp: 65 },
        { id: 'l412', name: 'Entrenamiento de Publicidad Digital - The BIG', tag: 'YT', xp: 80 },
        { id: 'l413', name: 'Google Analytics Tutorial For Beginners 2026 - Loves Data', tag: 'YT', xp: 75 },
        { id: 'l414', name: 'Google Ads Conversion Tracking 2026 - Analytics Mania', tag: 'YT', xp: 70 },
      ]},
      { id: 's9m6', name: 'Email Marketing & Funnels', icon: '📧', lessons: [
        { id: 'l420', name: 'Email & Content Marketing Full Course 2026 - Simplilearn 4h', tag: 'YT', xp: 100 },
        { id: 'l421', name: 'Las Mejores Herramientas de Automatizacion de Marketing 2026 - Cyberclick', tag: 'YT', xp: 70 },
        { id: 'l422', name: 'Como hacer Email Marketing Paso a Paso Tutorial 2025 - Ivo Fiz', tag: 'YT', xp: 80 },
        { id: 'l423', name: 'Como Empezar en el COPYWRITING para Principiantes - Ivo Fiz', tag: 'YT', xp: 75 },
        { id: 'l424', name: 'COMO CREAR un FUNNEL DE VENTAS de 0 a 100 - The BIG', tag: 'YT', xp: 80 },
        { id: 'l425', name: 'Las 10 CLAVES para tener una NEWSLETTER de Exito - The BIG', tag: 'YT', xp: 70 },
        { id: 'l426', name: '3 FUNNELS de VENTAS IMPRESCINDIBLES - The BIG', tag: 'YT', xp: 75 },
        { id: 'l427', name: 'Como Crear un Funnel de Ventas desde cero - The BIG', tag: 'YT', xp: 75 },
        { id: 'l428', name: '7 Mejoras para un FUNNEL de VENTA - The BIG', tag: 'YT', xp: 70 },
        { id: 'l429', name: 'Como crear una estrategia de marketing Paso a Paso - Pedro Buerbaum', tag: 'YT', xp: 80 },
      ]},
      { id: 's9m7', name: 'Estrategia Avanzada & Analisis', icon: '📈', lessons: [
        { id: 'l440', name: 'Que es un CRM y como deberas elegir el Correcto - Santi Perez Moreno', tag: 'YT', xp: 65 },
        { id: 'l441', name: 'Growth y CRO en 2026 - PHI La Caja Company', tag: 'YT', xp: 75 },
        { id: 'l442', name: 'Google Looker Studio tutorial 2026 - Porter Metrics', tag: 'YT', xp: 75 },
        { id: 'l443', name: 'Como empezar con la GESTION DE PROYECTOS - HubSpot Espanol', tag: 'YT', xp: 65 },
        { id: 'l444', name: 'Como Planear tu 2026 para Vender Mas - Aprendamos Marketing', tag: 'YT', xp: 70 },
        { id: 'l445', name: 'Auditoria de Marketing Digital a 5 Proyectos MASTERCLASS BIG school', tag: 'YT', xp: 80 },
        { id: 'l446', name: 'BIG camp Dia 1: Disena una Estrategia de Marketing Digital - The BIG', tag: 'YT', xp: 85 },
        { id: 'l447', name: 'Estrategia de Marketing Digital para AUMENTAR VENTAS - The BIG', tag: 'YT', xp: 80 },
        { id: 'l448', name: '7 Mejoras para un FUNNEL de VENTA BIG lessons Paula Gonzalez', tag: 'YT', xp: 70 },
        { id: 'l449', name: 'Siendo autodidacta Guia completa de como empezar - Joss Designer', tag: 'YT', xp: 65 },
        { id: 'l450', name: 'CLASE 01 MARKETING DIGITAL CON INTELIGENCIA ARTIFICIAL - ITEC', tag: 'YT', xp: 75 },
        { id: 'l451', name: 'Cursos de IA GRATIS para Principiantes 2026 - Agentes de IA', tag: 'YT', xp: 65 },
      ]},
    ]
  },
];

const CHALLENGES = [
  { id: 'c1', text: 'Completa una leccion hoy', xp: 20 },
  { id: 'c2', text: 'Practica 30 min de edicion', xp: 25 },
  { id: 'c3', text: 'Crea un clip corto aplicando lo aprendido', xp: 30 },
  { id: 'c4', text: 'Estudia un tutorial de color grading', xp: 20 },
  { id: 'c5', text: 'Revisa tus notas del dia anterior', xp: 15 },
  { id: 'c6', text: 'Exporta un proyecto terminado', xp: 35 },
  { id: 'c7', text: 'Aprende un atajo de teclado nuevo', xp: 10 },
  { id: 'c8', text: 'Disena una thumbnail para un video', xp: 25 },
  { id: 'c9', text: 'Automatiza una tarea con IA', xp: 30 },
  { id: 'c10', text: 'Publica contenido en redes sociales', xp: 20 },
];

const TAG_COLORS = {
  Plataforma: C.purple, YT: C.rust, Udemy: '#e67e22',
  Curso: C.blue, Academy: C.sage, Drive: '#6a8f9e',
  Gratis: C.sage, Libro: C.gold, 'BIG school': '#9e5a8f',
  'Creator Club': C.blue, PDF: '#7a7590', Video: C.blue,
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
      showToast('Leccion desmarcada');
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
      showToast(`Desafio completado! +${challengeXp} XP`);
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
        <Text style={s.heroTitle}>Universidad del{'\n'}Nomada Digital</Text>
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

      <Text style={s.sectionTitle}>Desafios de Hoy</Text>
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
        <Text style={s.pageTitle}>Estadisticas</Text>
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
