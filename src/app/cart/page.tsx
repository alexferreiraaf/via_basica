'use client';

import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CartView() {
  const { cart, removeFromCart, updateQuantity, cartTotal, storeConfig, clearCart } = useStore();
  const router = useRouter();
  const { toast } = useToast();

  const sendOrderToWhatsapp = () => {
    let message = `*${storeConfig.name}*\n\n${storeConfig.whatsappMessage}\n\n`;
    
    cart.forEach(item => {
      message += `📖 ${item.quantity}x *${item.title}*\n`;
      message += `   (R$ ${item.price.toFixed(2).replace('.', ',')}) = R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });

    message += `\n💰 *Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`;
    message += `\n\nAguardo confirmação do pagamento e entrega. Deus abençoe!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${storeConfig.phone}?text=${encodedMessage}`, '_blank');
    
    toast({
      title: 'Pedido Enviado!',
      description: 'Seu carrinho foi limpo. Continue comprando!',
    });
    clearCart();
    router.push('/');
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 text-foreground">
        <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
          <ChevronLeft />
        </Button>
        <h2 className="text-2xl font-headline font-bold">Seu Carrinho</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-gray-200">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
          <Button asChild variant="link" className="mt-6 text-primary font-medium">
            <Link href="/">Voltar para a loja</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="bg-card p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-foreground">{item.title}</h4>
                  <p className="text-primary font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-3 bg-background rounded-lg p-1">
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-red-500"
                    aria-label={item.quantity === 1 ? 'Remover item' : 'Diminuir quantidade'}
                  >
                    {item.quantity === 1 ? <Trash2 size={14} /> : '-'}
                  </Button>
                  <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-10">
            <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
              <span className="text-gray-500">Total do Pedido</span>
              <span className="text-3xl font-bold text-primary">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <Button 
              onClick={sendOrderToWhatsapp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 h-14 text-base rounded-xl shadow-green-200 shadow-lg transition-transform hover:scale-[1.02]"
            >
              <MessageCircle size={24} />
              Enviar Pedido no WhatsApp
            </Button>
            <p className="text-center text-xs text-gray-400 mt-3">Você será redirecionado para o WhatsApp da loja.</p>
          </div>
          <div className="h-48"></div> 
        </>
      )}
    </div>
  );
}
