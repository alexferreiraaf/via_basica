'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import type { Product, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus, Settings, Trash2, X, Share2, Users, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductForm } from '@/components/admin/product-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

function ClientList() {
  const firestore = useFirestore();
  const usersCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: users, isLoading } = useCollection<UserProfile>(usersCollectionRef);

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="font-headline text-primary mb-2 flex items-center gap-2">
          <Users size={20} /> Clientes Cadastrados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="flex justify-center items-center p-4"><Loader2 className="animate-spin" /></div>}
        {!isLoading && (!users || users.length === 0) && (
            <p className="text-sm text-gray-500">Nenhum cliente cadastrado ainda.</p>
        )}
        {users && users.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map(user => (
              <div key={user.id} className="text-sm p-2 rounded-md bg-gray-50 flex justify-between items-center">
                <span>{user.email}</span>
                {user.isAdmin && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Admin</span>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


export default function AdminView() {
  const router = useRouter();
  const { products, setProducts, storeConfig, setStoreConfig } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
  }

  const handleProductSaved = (savedProduct: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      // Check for existing ID to avoid duplicates on fast clicks
      const exists = products.some(p => p.id === savedProduct.id);
      if (!exists) {
        setProducts(prev => [savedProduct, ...prev]);
      }
    }
    setIsEditing(false);
    setEditingProduct(null);
  };
  
  const handleShare = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copiado!',
      description: 'O link da sua loja foi copiado para a área de transferência.',
    });
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
            <Button onClick={() => router.push('/')} variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft />
            </Button>
            <h2 className="text-2xl font-headline font-bold text-gray-800">Painel Administrativo</h2>
        </div>
        <Button onClick={handleShare} variant="outline">
            <Share2 size={16} /> Compartilhar Catálogo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 space-y-6 h-fit sticky top-20">
          <Card className="bg-blue-50/50">
            <CardHeader>
              <CardTitle className="font-headline text-primary mb-2 flex items-center gap-2">
                <Settings size={20} /> Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="block text-xs font-bold text-blue-800 uppercase mb-1">Nome da Loja</Label>
                <Input 
                  type="text" 
                  value={storeConfig.name}
                  onChange={(e) => setStoreConfig({...storeConfig, name: e.target.value})}
                  className="w-full p-2 rounded-lg border-blue-200 border bg-white focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <Label className="block text-xs font-bold text-blue-800 uppercase mb-1">WhatsApp (com DDD)</Label>
                <Input 
                  type="text" 
                  value={storeConfig.phone}
                  onChange={(e) => setStoreConfig({...storeConfig, phone: e.target.value})}
                  className="w-full p-2 rounded-lg border-blue-200 border bg-white focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="5511999999999"
                />
                <p className="text-xs text-blue-600 mt-1">Apenas números, com código do país (55) e DDD.</p>
              </div>
            </CardContent>
          </Card>
          <ClientList />
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline font-bold text-gray-800 text-lg">Seus Produtos</h3>
            <Button 
              onClick={handleAddNewClick}
              className="bg-primary text-primary-foreground text-sm font-medium"
            >
              <Plus size={16} /> Novo Produto
            </Button>
          </div>

          {isEditing && (
            <div className="bg-card p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 mb-6 relative animate-in fade-in slide-in-from-top-4">
              <ProductForm 
                product={editingProduct} 
                onSave={handleProductSaved} 
              />
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground" onClick={handleCancelEdit}>
                <X size={18} />
              </Button>
            </div>
          )}

          <div className="bg-card rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {products.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>Nenhum produto cadastrado ainda. Clique em "Novo Produto" para começar.</p>
              </div>
            )}
            {products.map(product => (
              <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="relative w-12 h-16 bg-gray-200 rounded shrink-0">
                  <Image src={product.image} alt={product.title} className="object-cover rounded" fill />
                </div>
                <div className="flex-grow">
                  <h5 className="font-bold text-gray-800">{product.title}</h5>
                  <p className="text-sm text-gray-500">{product.category} • R$ {product.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEditClick(product)} variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                    <Settings size={18} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                        <Trash2 size={18} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto "{product.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
