'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wine, Mail, MessageCircle } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-cream-200 pb-safe">
      <div className="flex items-center justify-around py-2 px-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            isActive('/') ? 'text-wine-700' : 'text-gray-500'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'animate-pulse-gold' : ''}`} />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>

        <Link
          href="/#catalogo"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            pathname.includes('catalogo') ? 'text-wine-700' : 'text-gray-500'
          }`}
        >
          <Wine className="w-5 h-5" />
          <span className="text-[10px] font-medium">Catálogo</span>
        </Link>

        <a
          href="https://wa.me/50370087508"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-gray-500 hover:text-green-600 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>

        <Link
          href="/contact"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
            isActive('/contact') ? 'text-wine-700' : 'text-gray-500'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-medium">Contacto</span>
        </Link>
      </div>
    </nav>
  );
}