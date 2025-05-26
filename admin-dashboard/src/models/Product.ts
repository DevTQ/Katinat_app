export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId?: number;
  category_id?: number;
  image: string;
  isBestSeller: boolean;
  isTryFood: boolean;
  is_best_seller?: boolean;
  is_try_food?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  is_best_seller: boolean;
  is_try_food: boolean;
} 