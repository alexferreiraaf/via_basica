export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StoreConfig {
  name: string;
  phone: string;
  whatsappMessage: string;
}
