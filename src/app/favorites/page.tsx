'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';


export default function FavoritesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { products: allProducts } = useStore(); 
  
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const favCollectionRef = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/favoriteProducts`) : null),
    [user, firestore]
  );

  const { data: favoriteIds, isLoading: isLoadingIds } = useCollection<{ productId: number }>(favCollectionRef);

  useEffect(() => {
    if (isLoadingIds || isUserLoading) {
      setIsLoading(true);
      return;
    }
    
    if (!user) {
      // If user logs out, redirect to login
      router.push('/login');
      return;
    }

    if (favoriteIds) {
      const favedProductIds = new Set(favoriteIds.map(fav => fav.productId));
      const filtered = allProducts.filter(p => favedProductIds.has(p.id));
      setFavoriteProducts(filtered);
    } else {
      setFavoriteProducts([]);
    }
    setIsLoading(false);

  }, [favoriteIds, isLoadingIds, allProducts, user, isUserLoading, router]);

  return (
    <div className="pb-24 px-4 pt-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
            <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft />
            </Button>
            <h2 className="text-2xl font-headline font-bold text-gray-800">Meus Favoritos</h2>
        </div>
        
        {isLoading && (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        )}

        {!isLoading && favoriteProducts.length === 0 && (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-gray-200">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Você ainda não tem favoritos.</p>
                <p className="text-sm text-gray-400">Clique no coração dos produtos para adicioná-los aqui.</p>
                <Button asChild variant="link" className="mt-6 text-primary font-medium">
                    <Link href="/">Começar a explorar</Link>
                </Button>
            </div>
        )}

        {!isLoading && favoriteProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
    </div>
  );
}
