"use client";

import { useCart } from "@/context/cart-context";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    images?: string[];
    artisan_id: string;
    profiles?: {
      full_name: string;
    } | null;
  };
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
      artisanName: product.profiles?.full_name || 'Unknown Artisan',
      artisanId: product.artisan_id
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={className || "w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#5a4a38] hover:shadow-lg transition-all transform hover:-translate-y-1"}
    >
      Add to Cart
    </button>
  );
}
