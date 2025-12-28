'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const favoritesCollectionRef = useMemoFirebase(() => 
    (user && firestore) ? collection(firestore, `users/${user.uid}/favoriteProducts`) : null,
    [user, firestore]
  );

  const favoriteQuery = useMemoFirebase(() => 
    favoritesCollectionRef ? query(favoritesCollectionRef, where("productId", "==", product.id)) : null,
    [favoritesCollectionRef, product.id]
  );

  const { data: favorite, isLoading: isLoadingFavorite } = useCollection(favoriteQuery);

  const isFavorited = favorite ? favorite.length > 0 : false;
  const favoriteId = favorite && favorite[0] ? favorite[0].id : null;


  const handleFavoriteToggle = async () => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Faça login para favoritar",
        description: "Você precisa estar conectado para adicionar produtos aos seus favoritos.",
      });
      return;
    }
    
    if (isLoadingFavorite) return;

    if (isFavorited && favoriteId) {
      const favDocRef = doc(firestore, `users/${user.uid}/favoriteProducts`, favoriteId);
      await deleteDoc(favDocRef);
      toast({
        title: "Removido dos favoritos!",
      });
    } else {
      const newFavDocRef = doc(collection(firestore, `users/${user.uid}/favoriteProducts`));
      await setDoc(newFavDocRef, {
        id: newFavDocRef.id,
        userId: user.uid,
        productId: product.id,
        addedDate: new Date().toISOString(),
      });
      toast({
        title: "Adicionado aos favoritos!",
      });
    }
  };


  return (
    <Card className="bg-card rounded-2xl shadow-sm border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow relative">
       {user && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 left-2 z-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white"
          onClick={handleFavoriteToggle}
          disabled={isLoadingFavorite}
          aria-label="Favoritar"
        >
          <Heart 
            className={cn("transition-all", isFavorited && 'text-red-500 fill-red-500')}
            size={20}
          />
        </Button>
      )}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.title} 
          fill 
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Badge variant="secondary" className="absolute top-2 right-2 bg-white/90 backdrop-blur shadow-sm">{product.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg leading-tight">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-primary">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
        <Button 
          onClick={() => addToCart(product)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Adicionar</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
