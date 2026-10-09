'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';

// ==========================================
// FIX: Declaración de tipos para evitar 
// conflicto entre React 19 y lucide-react
// en entornos monorepo con Next.js 15
// ==========================================
const HomeIcon = Home as unknown as React.ElementType;
const SearchIcon = Search as unknown as React.ElementType;
const CartIcon = ShoppingCart as unknown as React.ElementType;
const UserIcon = User as unknown as React.ElementType;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Mejora: Centralizar la configuración de la navegación para mantener el código DRY
  const navItems = [
    { href: '/', label: 'Inicio', Icon: HomeIcon },
    { href: '/catalogo', label: 'Catálogo', Icon: SearchIcon },
    { href: '/carrito', label: 'Carrito', Icon: CartIcon },
    { href: '/perfil', label: 'Perfil', Icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-cream-200 shadow-premium md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${
              isActive(href)
                ? 'text-wine-700'
                : 'text-gray-500 hover:text-wine-600'
            }`}
          >
            {/* Aquí se usa el Icono tipado correctamente */}
            <Icon className={`w-5 h-5 ${isActive(href) ? 'animate-pulse-gold' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}