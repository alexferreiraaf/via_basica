'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { Button } from './ui/button';
import { ShoppingBag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useEffect, useState } from 'react';

export function Header() {
  const { cartCount, storeConfig } = useStore();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <header className="bg-card sticky top-0 z-30 shadow-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-primary text-primary-foreground p-1 rounded-lg flex items-center justify-center h-10 w-10">
            <Logo className="w-8 h-8" />
          </div>
          <span className="font-headline font-bold text-lg text-primary hidden sm:block">{isClient ? storeConfig.name : ''}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
           {pathname !== '/admin' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 px-3 py-2 rounded-full"
              asChild
            >
              <Link href="/admin">
                <Settings size={14} /> 
                <span className="hidden sm:inline">Área do Dono</span>
              </Link>
            </Button>
           )}

          <Button
            variant="ghost"
            className="relative p-2 bg-background hover:bg-accent hover:text-primary rounded-xl transition-colors"
            asChild
          >
            <Link href="/cart">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm",
                  "animate-in zoom-in-50"
                  )}>
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
