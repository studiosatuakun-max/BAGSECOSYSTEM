'use client';
import React, { useState } from 'react';
import { Zap, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';

export default function EmergencyRefillCard() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleRequest() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  }

  function handleReset() {
    setSubmitted(false);
  }

  return (
    <div className="bg-blue-900 rounded-2xl border border-blue-800 shadow-card p-5 h-full flex flex-col gap-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-800/50 pointer-events-none" />
      <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-blue-800/30 pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-2.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 shrink-0">
          <Zap size={17} className="text-amber-300" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Emergency Refill</h3>
          <p className="text-xs text-blue-300 mt-0.5">Request early delivery</p>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex-1 flex flex-col gap-3">
        {!submitted ? (
          <>
            {/* Warning notice */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 leading-relaxed">
                Use only if consumption spikes unexpectedly or pressure drops below threshold.
              </p>
            </div>

            {/* Current fill level indicator */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-300 font-medium">Current Fill Level</span>
                <span className="text-xs font-bold text-white tabular-nums">73%</span>
              </div>
              <div className="h-2 bg-blue-800 rounded-full overflow-hidden">
                <div className="h-full w-[73%] bg-gradient-to-r from-blue-400 to-blue-300 rounded-full" />
              </div>
              <p className="text-xs text-blue-400">Est. depletion: ~4.2 days at current rate</p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRequest}
              disabled={loading}
              className="mt-auto w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 disabled:opacity-70 text-blue-950 text-sm font-bold rounded-xl px-4 py-3 transition-colors shadow-lg"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
                  Sending Request…
                </>
              ) : (
                <>
                  <Zap size={15} />
                  Request Emergency Refill
                </>
              )}
            </button>

            {/* Contact line */}
            <div className="flex items-center justify-center gap-1.5">
              <Phone size={11} className="text-blue-400" />
              <span className="text-xs text-blue-400">Or call: +62 21 5555-0199</span>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Request Submitted!</p>
              <p className="text-xs text-blue-300 mt-1 leading-relaxed">
                Our team will contact you within 30 minutes to confirm the delivery schedule.
              </p>
            </div>
            <p className="text-xs text-blue-400 font-medium">Ref: ERF-2026-{Math.floor(Math.random() * 9000) + 1000}</p>
            <button
              onClick={handleReset}
              className="text-xs text-blue-300 hover:text-white underline underline-offset-2 transition-colors mt-1"
            >
              Submit another request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
