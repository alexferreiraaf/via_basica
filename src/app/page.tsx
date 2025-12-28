'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store-context';
import { CATEGORIES } from '@/lib/initial-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

export default function ShopView() {
  const { products, storeConfig } = useStore();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-24">
      <div className="bg-primary text-white p-6 mb-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-headline font-bold mb-2">Bem-vindo(a) à {isClient ? storeConfig.name : '...'}</h1>
        <p className="text-primary-foreground/80 text-sm mb-4">Literatura que edifica sua vida.</p>
        
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Buscar livros, bíblias..." 
            className="w-full p-3 pl-10 h-12 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={`whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500 px-4">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-body">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}
