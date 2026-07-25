'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Tag, Truck, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const PRICE_PER_CYLINDER = 185000;
const DELIVERY_FEE = 15000;
const LOYALTY_DISCOUNT_PER_CYLINDER = 5000;

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ReorderCard() {
  const [quantity, setQuantity] = useState(2);
  const [isOrdering, setIsOrdering] = useState(false);
  const [promoApplied, setPromoApplied] = useState(true);

  const subtotal = PRICE_PER_CYLINDER * quantity;
  const loyaltyDiscount = promoApplied ? LOYALTY_DISCOUNT_PER_CYLINDER * quantity : 0;
  const total = subtotal + DELIVERY_FEE - loyaltyDiscount;

  function handleDecrement() {
    if (quantity > 1) setQuantity((q) => q - 1);
  }

  function handleIncrement() {
    if (quantity < 10) setQuantity((q) => q + 1);
  }

  async function handlePlaceOrder() {
    setIsOrdering(true);
    // Backend: POST /api/orders { customerId, quantity, deliveryAddress, promoApplied }
    await new Promise((r) => setTimeout(r, 1800));
    setIsOrdering(false);
    toast.success(`Order placed! ${quantity} cylinder${quantity > 1 ? 's' : ''} on the way.`, {
      description: 'Estimated delivery: Today 14:00–16:00',
      duration: 4000,
    });
  }

  return (
    <div className="bg-card rounded-3xl border border-border card-shadow overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center">
              <ShoppingCart size={20} className="text-primary" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Re-order Gas</h3>
              <p className="text-xs text-muted-foreground">12 Kg LPG Cylinder</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium">In stock</p>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <div className="w-1.5 h-1.5 bg-success rounded-full" />
              <span className="text-xs font-semibold text-success-foreground">Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Quantity</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Max 10 cylinders per order
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-bold transition-all duration-150 active:scale-90 ${
                quantity <= 1
                  ? 'border-border text-muted-foreground/40 bg-muted cursor-not-allowed'
                  : 'border-primary text-primary bg-secondary hover:bg-primary hover:text-white'
              }`}
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-12 text-center">
              <span className="text-2xl font-extrabold text-foreground tabular-nums">
                {quantity}
              </span>
            </div>
            <button
              onClick={handleIncrement}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-bold transition-all duration-150 active:scale-90 ${
                quantity >= 10
                  ? 'border-border text-muted-foreground/40 bg-muted cursor-not-allowed'
                  : 'border-primary text-primary bg-secondary hover:bg-primary hover:text-white'
              }`}
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-muted rounded-2xl p-4 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {quantity}× {formatRupiah(PRICE_PER_CYLINDER)}
            </span>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {formatRupiah(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Truck size={12} className="text-muted-foreground" strokeWidth={2} />
              <span className="text-sm text-muted-foreground">Delivery fee</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {formatRupiah(DELIVERY_FEE)}
            </span>
          </div>
          {promoApplied && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag size={12} className="text-success-foreground" strokeWidth={2} />
                <span className="text-sm text-success-foreground font-medium">
                  Loyalty discount
                </span>
              </div>
              <span className="text-sm font-semibold text-success-foreground tabular-nums">
                -{formatRupiah(loyaltyDiscount)}
              </span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-lg font-extrabold text-primary tabular-nums">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        {/* Promo Toggle */}
        <button
          onClick={() => setPromoApplied((p) => !p)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 mb-4 transition-all duration-150 ${
            promoApplied
              ? 'border-lime-200 bg-accent' :'border-border bg-muted'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag size={16} className={promoApplied ? 'text-accent-foreground' : 'text-muted-foreground'} strokeWidth={2} />
            <div className="text-left">
              <p className={`text-sm font-semibold ${promoApplied ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
                Use Loyalty Points
              </p>
              <p className="text-xs text-muted-foreground">
                450 pts available · Save {formatRupiah(loyaltyDiscount)}
              </p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            promoApplied ? 'bg-primary border-primary' : 'border-border'
          }`}>
            {promoApplied && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </button>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isOrdering}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all duration-150 ${
            isOrdering
              ? 'bg-primary/60 text-white/80 cursor-not-allowed' :'bg-primary text-white active:scale-[0.98] hover:brightness-105 brand-glow'
          }`}
        >
          {isOrdering ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={20} strokeWidth={2.5} />
              <span>Place Order — {formatRupiah(total)}</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Delivery to: <span className="font-semibold text-foreground">Jl. Raya Cimahi No. 47, Bandung</span>
        </p>
      </div>
    </div>
  );
}