import type { Product } from './types';
import { placeholderImages } from './placeholder-images';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Bíblia de Estudo NVI",
    price: 159.90,
    category: "Bíblias",
    description: "Capa luxo, letra gigante, com concordância e mapas coloridos.",
    image: placeholderImages['biblia-nvi'].imageUrl,
  },
  {
    id: 2,
    title: "O Poder da Oração",
    price: 39.90,
    category: "Livros",
    description: "Um guia prático para transformar sua vida de oração.",
    image: placeholderImages['poder-oracao'].imageUrl,
  },
  {
    id: 3,
    title: "Kit História Bíblica Infantil",
    price: 89.90,
    category: "Infantil",
    description: "3 Livros ilustrados com histórias do Antigo e Novo Testamento.",
    image: placeholderImages['kit-infantil'].imageUrl,
  },
  {
    id: 4,
    title: "Harpa Cristã Avivada",
    price: 25.00,
    category: "Louvor",
    description: "Com corinhos e hinos tradicionais. Capa flexível.",
    image: placeholderImages['harpa-crista'].imageUrl,
  }
];

export const CATEGORIES = ["Todos", "Bíblias", "Livros", "Infantil", "Louvor", "Presentes"];
