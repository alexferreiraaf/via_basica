'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  return (
    <Card className="bg-card rounded-2xl shadow-sm border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
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
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-purple-200 shadow-lg"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Adicionar</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
