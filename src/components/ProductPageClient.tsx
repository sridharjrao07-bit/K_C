"use client";

import AddToCartButton from "@/components/AddToCartButton";

interface ProductPageClientProps {
  product: {
    id: string;
    title: string;
    price: number;
    images?: string[];
    artisan_id: string;
    inventory_count: number;
    profiles?: {
      full_name: string;
    } | null;
  };
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  if (product.inventory_count <= 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <AddToCartButton
      product={product}
      className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#5a4a38] hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
    />
  );
}
