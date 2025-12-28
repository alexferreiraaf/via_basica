'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { saveProductAction } from '@/app/actions';
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/initial-data';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { CardTitle } from '../ui/card';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : (
        <>
          <Save size={16} /> Salvar Produto
        </>
      )}
    </Button>
  );
}

export function ProductForm({ product, onSave }: ProductFormProps) {
  const initialState = { message: '', success: false };
  const [state, dispatch] = useFormState(saveProductAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success && state.product) {
      toast({
        title: "Sucesso!",
        description: state.message,
      });
      onSave(state.product as Product);
    } else if (!state.success && state.message) {
      toast({
        title: "Erro",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, onSave, toast]);

  return (
    <>
      <CardTitle className="font-headline mb-4">{product ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
      <form action={dispatch} className="space-y-4">
        <input type="hidden" name="id" value={product?.id || Date.now()} />
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Título do Livro/Produto</Label>
          <Input id="title" name="title" required defaultValue={product?.title} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">Preço (R$)</Label>
            <Input id="price" name="price" type="number" step="0.01" required defaultValue={product?.price} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria</Label>
            <Select name="category" defaultValue={product?.category || "Livros"}>
              <SelectTrigger className="mt-1 w-full bg-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter(c => c !== "Todos").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição Curta</Label>
          <Textarea id="description" name="description" rows={2} defaultValue={product?.description} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="image" className="text-sm font-medium text-gray-700">URL da Imagem</Label>
          <div className="flex gap-2 items-center mt-1">
            <ImageIcon className="text-muted-foreground" />
            <Input id="image" name="image" placeholder="https://... (opcional)" defaultValue={product?.image} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Se deixar em branco, uma capa será gerada por IA.</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
