import React from 'react';
import { AlertTriangle, Hash, Calendar, ShieldX, Phone, AlertCircle } from 'lucide-react';
import Icon from '@/app/portal/horeca/components/ui/AppIcon';


const suspectCylinder = {
  serialNumber: 'HG-12K-????-??????',
  scanDate: '20 Jul 2026',
  failureCode: 'ERR-NFC-MISMATCH-401',
  reason: 'NFC chip signature does not match registered cylinder database. Possible refill tampering.',
};

export default function TamperedResultDetail() {
  return (
    <div className="bg-card rounded-3xl border-2 border-error overflow-hidden card-shadow-md">
      {/* Error Header */}
      <div className="bg-error-bg px-5 py-5 flex flex-col items-center text-center border-b border-red-100">
        <div className="success-pop w-16 h-16 bg-error rounded-3xl flex items-center justify-center mb-3 card-shadow-md">
          <ShieldX size={34} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-extrabold text-error">
          Verification Failed
        </h2>
        <p className="text-sm text-error/70 mt-1">
          This cylinder could not be authenticated
        </p>
        <div className="flex items-center gap-2 mt-3 bg-error text-white px-4 py-1.5 rounded-full">
          <AlertTriangle size={14} strokeWidth={2.5} />
          <span className="text-xs font-bold uppercase tracking-wide">Do Not Use</span>
        </div>
      </div>
      {/* Warning Details */}
      <div className="px-5 py-4">
        {/* Failure Reason */}
        <div className="flex gap-3 bg-error-bg border border-red-200 rounded-2xl p-4 mb-4">
          <AlertCircle size={18} className="text-error flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-sm font-bold text-error mb-1">Why did this fail?</p>
            <p className="text-xs text-error/70 leading-relaxed">{suspectCylinder?.reason}</p>
          </div>
        </div>

        {/* Scan Info */}
        <div className="space-y-2.5 mb-4">
          {[
            { id: 'fail-serial', icon: Hash, label: 'Detected Serial', value: suspectCylinder?.serialNumber },
            { id: 'fail-date', icon: Calendar, label: 'Scan Date', value: suspectCylinder?.scanDate },
            { id: 'fail-code', icon: AlertTriangle, label: 'Error Code', value: suspectCylinder?.failureCode },
          ]?.map((item) => {
            const Icon = item?.icon;
            return (
              <div key={item?.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-muted rounded-xl flex items-center justify-center">
                    <Icon size={13} className="text-muted-foreground" strokeWidth={2} />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{item?.label}</span>
                </div>
                <span className="text-xs font-bold text-foreground font-mono">{item?.value}</span>
              </div>
            );
          })}
        </div>

        {/* Action Steps */}
        <div className="bg-warning-bg border border-amber-200 rounded-2xl p-4 mb-4">
          <p className="text-sm font-bold text-warning mb-2">What to do now:</p>
          <ol className="space-y-1.5">
            {[
              { id: 'step-a', text: 'Stop using the cylinder immediately' },
              { id: 'step-b', text: 'Do not attempt to ignite or connect to appliances' },
              { id: 'step-c', text: 'Contact HorecaGas support or your delivery agent' },
              { id: 'step-d', text: 'Report to Pertamina at 1500-000 if purchased externally' },
            ]?.map((s, i) => (
              <li key={s?.id} className="flex items-start gap-2 text-xs text-warning font-medium">
                <span className="w-4 h-4 bg-warning/20 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {s?.text}
              </li>
            ))}
          </ol>
        </div>

        {/* Emergency Contact */}
        <a
          href="tel:+622012345678"
          className="w-full flex items-center justify-center gap-3 bg-error/10 border-2 border-error/30 text-error font-bold text-sm py-4 rounded-2xl hover:bg-error/20 transition-all duration-150 active:scale-[0.98]"
          aria-label="Call HorecaGas emergency support"
        >
          <Phone size={18} strokeWidth={2.5} />
          Call HorecaGas Support: 1500-GAS
        </a>
      </div>
    </div>
  );
}