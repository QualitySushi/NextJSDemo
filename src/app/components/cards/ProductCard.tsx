'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  isSale?: boolean;
  onAddToCart: (productName: string, quantity: number) => void;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  originalPrice,
  imageUrl,
  isSale = false,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddClick = () => {
    // Parse numeric value from price string (e.g., "$129.00" -> 129.00)
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

    // Update global persistent cart context
    addToCart(
      {
        id,
        name,
        category,
        price: numericPrice,
        priceFormatted: price,
        imageUrl,
      },
      quantity
    );

    // Trigger parent toast & feedback handler
    onAddToCart(name, quantity);
    
    // Reset stepper back to 1
    setQuantity(1);
  };

  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-border overflow-hidden">
        {isSale && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Sale
          </span>
        )}
        <img 
          src={imageUrl} 
          alt={name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-3 flex flex-col grow">
        <div>
          <span className="text-xs text-muted uppercase tracking-wider">{category}</span>
          <h3 className="text-base font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-amber-500 text-sm">
          <span>★ ★ ★ ★ ☆</span>
          <span className="text-muted text-xs">(128)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted line-through">{originalPrice}</span>
          )}
        </div>

        {/* Quantity Stepper & Add Action */}
        <div className="pt-2 mt-auto border-t border-border flex items-center justify-between gap-3">
          {/* Stepper Control (- # +) */}
          <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
            <button 
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-border disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 text-xs font-semibold text-foreground min-w-6 text-center">
              {quantity}
            </span>
            <button 
              onClick={increaseQuantity}
              className="px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-border transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-1"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}