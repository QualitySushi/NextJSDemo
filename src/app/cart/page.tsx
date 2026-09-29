'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="page-container">
      <Header />

      <main className="grow max-w-4xl w-full mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto text-2xl">
              🛒
            </div>
            <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="text-muted text-sm max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our featured products to get started.
            </p>
            <div>
              <Link 
                href="/details" 
                className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{item.category}</span>
                    <h3 className="text-base font-semibold text-foreground truncate">{item.name}</h3>
                    <p className="text-sm font-bold text-foreground mt-1">{item.priceFormatted}</p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2.5 py-1 text-xs font-medium text-foreground hover:bg-border transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-foreground min-w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2.5 py-1 text-xs font-medium text-foreground hover:bg-border transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted hover:text-red-500 text-sm p-2 transition-colors"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6 h-fit shadow-sm">
              <h2 className="text-lg font-bold text-foreground border-b border-border pb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => alert('Proceeding to checkout simulation!')}
                className="w-full py-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}