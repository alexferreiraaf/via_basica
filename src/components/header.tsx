'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { Button } from './ui/button';
import { ShoppingBag, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useEffect, useState } from 'react';
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';

type UserProfile = {
  isAdmin?: boolean;
  firstName?: string;
  email?: string;
};

export function Header() {
  const { cartCount, storeConfig } = useStore();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => (user && firestore ? doc(firestore, `users/${user.uid}`) : null), [user, firestore]);
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (email: string | null | undefined) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };
  
  const showAdminButton = user && userProfile?.isAdmin && pathname !== '/admin';


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
           {showAdminButton && (
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

            {!isUserLoading && (
                <>
                {user ? (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
                            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userProfile?.firstName || 'Usuário'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">
                            <UserIcon size={16} /> Entrar
                        </Link>
                    </Button>
                )}
                </>
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
