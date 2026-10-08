'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax: el fondo se mueve más lento que el scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[90vh] min-h-[650px] overflow-hidden">
      {/* Video de fondo con Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -top-20"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[120%] object-cover"
          poster="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1920&q=80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-pouring-red-wine-into-a-glass-2559/1080p.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-wine-950/75 via-wine-900/50 to-wine-950/85" />
        {/* Textura de grano sobre el video */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Contenido con Parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex items-center justify-center px-4"
      >
        <div className="text-center max-w-4xl">
          {/* Subtítulo con revelado */}
          <div className="overflow-hidden mb-6">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gold-300 font-medium tracking-[0.4em] uppercase text-xs md:text-sm"
            >
              Catálogo Premium 2026
            </motion.p>
          </div>

          {/* Título principal con revelado */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none"
            >
              GWS Wine
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block text-gold-400 text-3xl md:text-5xl lg:text-6xl italic font-serif"
            >
              Platform
            </motion.span>
          </div>

          {/* Descripción */}
          <div className="overflow-hidden mb-10">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-white/90 text-lg md:text-2xl max-w-2xl mx-auto font-light"
            >
              Descubra nuestra selección premium de vinos y licores de todo el mundo.
            </motion.p>
          </div>

          {/* Botón con brillo */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Link
              href="#catalogo"
              className="btn-shine inline-block px-12 py-5 bg-gold-500 text-wine-950 font-bold rounded-full hover:bg-gold-400 transition-all shadow-2xl hover:shadow-gold-500/50 hover:scale-105 text-lg"
            >
              Explorar Catálogo
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}