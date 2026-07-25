'use client';

import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, MapPin, Phone, Clock, ChevronDown, ChevronUp, Star } from 'lucide-react';
import Icon from '@/app/portal/horeca/components/ui/AppIcon';


const deliverySteps = [
  {
    id: 'step-placed',
    label: 'Order Placed',
    sublabel: 'Today, 09:12',
    icon: Package,
    status: 'completed' as const,
  },
  {
    id: 'step-confirmed',
    label: 'Order Confirmed',
    sublabel: 'Today, 09:18',
    icon: CheckCircle2,
    status: 'completed' as const,
  },
  {
    id: 'step-driver',
    label: 'Driver on the Way',
    sublabel: 'Est. arrival 14:30',
    icon: Truck,
    status: 'active' as const,
  },
  {
    id: 'step-delivered',
    label: 'Delivered',
    sublabel: 'Pending',
    icon: MapPin,
    status: 'pending' as const,
  },
];

const driverInfo = {
  name: 'Ahmad Fauzi',
  phone: '+62 812-3456-7890',
  rating: 4.9,
  deliveries: 1240,
  plateNumber: 'D 1823 KL',
  vehicleType: 'Pickup Truck',
};

export default function ActiveDeliveryCard() {
  const [showDriver, setShowDriver] = useState(false);

  return (
    <div className="bg-card rounded-3xl border border-border card-shadow overflow-hidden mb-2">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info-bg rounded-2xl flex items-center justify-center">
              <Truck size={20} className="text-info" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Active Delivery</h3>
              <p className="text-xs text-muted-foreground">Order #HG-20260720-0042</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-info-bg border border-blue-200 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 bg-info rounded-full scan-ring-pulse" />
            <span className="text-xs font-bold text-info">En Route</span>
          </div>
        </div>

        {/* ETA Banner */}
        <div className="mt-3 flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2.5">
          <Clock size={16} className="text-primary" strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">
            Estimated arrival: <span className="text-primary">Today 14:00–16:00</span>
          </p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="px-5 py-5">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />
          {/* Filled portion */}
          <div className="absolute left-[19px] top-6 w-0.5 bg-primary" style={{ height: '55%' }} />

          <div className="flex flex-col gap-5">
            {deliverySteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isPending = step.status === 'pending';

              return (
                <div key={step.id} className="flex items-start gap-4 relative z-10">
                  {/* Step Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary'
                      : isActive
                      ? 'bg-info border-2 border-blue-200 scan-ring-pulse' :'bg-muted border-2 border-border'
                  }`}>
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={
                        isCompleted
                          ? 'text-white'
                          : isActive
                          ? 'text-white' :'text-muted-foreground/50'
                      }
                    />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold leading-none ${
                        isCompleted
                          ? 'text-foreground'
                          : isActive
                          ? 'text-info font-extrabold' :'text-muted-foreground/60'
                      }`}>
                        {step.label}
                      </p>
                      {isActive && (
                        <span className="text-[10px] bg-info-bg text-info font-bold px-2 py-0.5 rounded-full">
                          NOW
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${
                      isCompleted
                        ? 'text-muted-foreground'
                        : isActive
                        ? 'text-info/70' :'text-muted-foreground/40'
                    }`}>
                      {step.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Info Toggle */}
        <button
          onClick={() => setShowDriver((v) => !v)}
          className="w-full flex items-center justify-between mt-5 pt-4 border-t border-border"
          aria-expanded={showDriver}
          aria-label="Toggle driver information"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-secondary rounded-xl flex items-center justify-center">
              <Truck size={14} className="text-primary" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-foreground">Driver Details</span>
          </div>
          {showDriver ? (
            <ChevronUp size={18} className="text-muted-foreground" strokeWidth={2} />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" strokeWidth={2} />
          )}
        </button>

        {/* Driver Details Panel */}
        {showDriver && (
          <div className="mt-3 bg-muted rounded-2xl p-4 fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              {/* Driver Avatar */}
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-extrabold text-base">AF</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{driverInfo.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-warning fill-warning" />
                  <span className="text-xs font-semibold text-foreground">{driverInfo.rating}</span>
                  <span className="text-xs text-muted-foreground">· {driverInfo.deliveries} deliveries</span>
                </div>
              </div>
              <a
                href={`tel:${driverInfo.phone}`}
                className="w-10 h-10 bg-success/10 rounded-2xl flex items-center justify-center hover:bg-success/20 transition-colors active:scale-95"
                aria-label={`Call driver ${driverInfo.name}`}
              >
                <Phone size={18} className="text-success-foreground" strokeWidth={2} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-card rounded-xl p-2.5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Plate No.</p>
                <p className="text-sm font-bold text-foreground mt-0.5 font-mono">{driverInfo.plateNumber}</p>
              </div>
              <div className="bg-card rounded-xl p-2.5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Vehicle</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{driverInfo.vehicleType}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}