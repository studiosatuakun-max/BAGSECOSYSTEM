'use client';

import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle2, AlertCircle, Clock, Package, ChevronRight, Tag, Wifi, Cpu, BookOpen, WifiOff, X, FileText, Calendar, Activity, Database } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'sonner';
import { lookupRfidTag } from '../actions';

interface CylinderScan {
  id: string;
  cylinderSerial: string;
  rfidEpc: string;
  weightKg: number;
  scanTime: string;
  operator: string;
  hydrotestExpiry: string;
  hydrotestStatus: 'valid' | 'expiring-soon' | 'expired';
  fillStatus: 'ready' | 'filled' | 'rejected';
}

const MOCK_SCANS: CylinderScan[] = [
  { id: 'cyl-rfid-001', cylinderSerial: 'CYL-26-CNG-0847', rfidEpc: 'EPC:ALIEN:H3:A3B7C209', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2029-03-15', hydrotestStatus: 'valid', fillStatus: 'ready' },
  { id: 'cyl-rfid-002', cylinderSerial: 'CYL-25-CNG-1203', rfidEpc: 'EPC:ALIEN:H3:F1448D2A', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2026-09-08', hydrotestStatus: 'expiring-soon', fillStatus: 'ready' },
  { id: 'cyl-rfid-003', cylinderSerial: 'CYL-23-CNG-0551', rfidEpc: 'EPC:ALIEN:H3:7EC031B5', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2025-12-20', hydrotestStatus: 'expired', fillStatus: 'rejected' },
  { id: 'cyl-rfid-004', cylinderSerial: 'CYL-26-CNG-0912', rfidEpc: 'EPC:ALIEN:H3:8B114A99', weightKg: 12, scanTime: '06:22:58', operator: 'Auto-Reader', hydrotestExpiry: '2029-01-10', hydrotestStatus: 'valid', fillStatus: 'ready' },
];

function HydrotestBadge({ status }: { status: CylinderScan['hydrotestStatus'] }) {
  if (status === 'valid') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
        <CheckCircle2 size={11} className="text-emerald-500" />
        <span>Hydrotest Valid</span>
      </span>
    );
  }
  if (status === 'expiring-soon') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
        <Clock size={11} className="text-amber-500 animate-pulse" />
        <span>Expiring Soon</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 align-middle">
      <AlertCircle size={11} className="text-rose-500 animate-bounce" />
      <span>Expired</span>
    </span>
  );
}

function FillStatusBadge({ status }: { status: CylinderScan['fillStatus'] }) {
  if (status === 'filled') {
    return <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0 align-middle">Filled OK</span>;
  }
  if (status === 'rejected') {
    return <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800 whitespace-nowrap shrink-0 align-middle">Rejected</span>;
  }
  return <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0 align-middle">Ready to Fill</span>;
}

export default function UHFCylinderRfidLogCard() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<CylinderScan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scans, setScans] = useState<CylinderScan[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
  const [isQueryingDevice, setIsQueryingDevice] = useState(false);
  const [isReadingTag, setIsReadingTag] = useState(false);
  const [readResult, setReadResult] = useState<string | null>(null);
  const [lastReadEpc, setLastReadEpc] = useState<string | null>(null);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);

  // Write Tag Modal States
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [writeBank, setWriteBank] = useState<number>(1);
  const [writeHex, setWriteHex] = useState<string>('E20000170217019923902999');
  const [isWriting, setIsWriting] = useState(false);

  const { socket, isAntennaConnected } = useSocket();

  const handleExecuteWriteTag = () => {
    if (!socket) {
      toast.error('Edge Gateway socket not connected!');
      return;
    }
    if (!isAntennaConnected) {
      toast.error('Antenna CT-i607 is offline!', { description: 'Wait for reconnection before writing.' });
      return;
    }

    setIsWriting(true);
    socket.emit('write_tag', { membank: writeBank, hexData: writeHex });
  };

  // Handle write result via event (not Socket.io ack — more reliable)
  useEffect(() => {
    if (!socket) return;
    const handleWriteResult = (response: any) => {
      setIsWriting(false);
      if (response?.success) {
        toast.success('Tag Encoded Successfully!', {
          description: `Frame 0x30 written to Bank ${writeBank}. EPC: ${response.epc}`
        });
        setIsWriteModalOpen(false);
      } else {
        toast.error('Failed to Write Tag', {
          description: response?.error || 'Unknown error'
        });
      }
    };
    socket.on('write_result', handleWriteResult);
    return () => { socket.off('write_result', handleWriteResult); };
  }, [socket, writeBank]);

  const handleQueryDeviceInfo = () => {
    if (!socket || !isAntennaConnected) return;
    setIsQueryingDevice(true);
    socket.emit('query_device_info', {});
  };

  const handleReadTagMemory = () => {
    if (!socket || !isAntennaConnected) return;
    setIsReadingTag(true);
    setReadResult(null);
    socket.emit('read_tag_memory', { membank: 1, startAddress: 2, wordLen: 6 });
  };

  useEffect(() => {
    if (!socket) return;

    const handleTagScanned = async (data: any) => {
      setIsScanning(true);
      
      try {
        const result = await lookupRfidTag(data.epc);
        
        if (result.error || !result.data) {
           toast.error('Unknown Tag Scanned', { description: `Unregistered EPC: ${data.epc}` });
        } else {
           const tagData = result.data;
           if (tagData.tag_type === 'wristband') {
             toast.info('Operator Wristband Scanned', { description: `Tag: ${tagData.epc_hex}` });
           } else {
             const expiryDate = new Date(tagData.hydrotest_expiry);
             const now = new Date();
             const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
             let hStatus: 'valid' | 'expiring-soon' | 'expired' = 'valid';
             if (daysUntilExpiry < 0) hStatus = 'expired';
             else if (daysUntilExpiry < 90) hStatus = 'expiring-soon';
             
             const newScan: CylinderScan = {
               id: `cyl-live-${Date.now()}`,
               cylinderSerial: tagData.cylinder_serial || 'UNKNOWN',
               rfidEpc: `EPC:ALIEN:H3:${data.epc}`,
               weightKg: tagData.weight_kg || 0,
               scanTime: new Date(data.timestamp).toLocaleTimeString('id-ID', { hour12: false }),
               operator: 'Edge-Gateway',
               hydrotestExpiry: tagData.hydrotest_expiry,
               hydrotestStatus: hStatus,
               fillStatus: tagData.fill_status as 'ready' | 'filled' | 'rejected'
             };

             setScans(prev => {
               const filtered = prev.filter(s => s.rfidEpc !== newScan.rfidEpc);
               return [newScan, ...filtered];
             });
           }
        }
      } catch (err) {
        console.error('Error looking up RFID tag:', err);
      } finally {
        setTimeout(() => setIsScanning(false), 1000);
      }
    };

    const handleTagWritten = (data: any) => {
      toast.success('Tag Written Confirmation!', {
        description: `EPC ${data.epc} encoded at ${new Date(data.timestamp).toLocaleTimeString('en-US')}`,
        icon: '✅'
      });
    };

    const handleDeviceInfoResult = (response: any) => {
      setIsQueryingDevice(false);
      if (response?.success) {
        setDeviceInfo(`FW v${response.firmware} | ${response.deviceType}`);
        toast.success('Antenna Responded!', { description: `Firmware: v${response.firmware}, Type: ${response.deviceType}` });
      } else {
        toast.error('Device Info Failed', { description: response?.error });
      }
    };

    const handleReadResult = (response: any) => {
      setIsReadingTag(false);
      if (response?.success) {
        const epcData = response.data || '';
        setReadResult(epcData);
        setLastReadEpc(epcData);
        if (epcData) setWriteHex(epcData);
        toast.success('Tag Memory Read OK!', { description: `EPC Bank Data: ${epcData}` });
      } else {
        toast.error('Read Tag Failed', { description: response?.error });
      }
    };

    socket.on('rfid_tag_scanned', handleTagScanned);
    socket.on('tag_written_success', handleTagWritten);
    socket.on('device_info_result', handleDeviceInfoResult);
    socket.on('read_result', handleReadResult);
    socket.on('simulator_status', (data: { active: boolean }) => {
      setIsSimulatorActive(data.active);
    });

    socket.on('disconnect', () => setIsSimulatorActive(false));

    return () => {
      socket.off('rfid_tag_scanned', handleTagScanned);
      socket.off('tag_written_success', handleTagWritten);
      socket.off('device_info_result', handleDeviceInfoResult);
      socket.off('read_result', handleReadResult);
      socket.off('simulator_status');
      socket.off('disconnect');
    };
  }, [socket]);

  const filteredScans = scans.filter(
    (c) =>
      c.cylinderSerial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rfidEpc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validCount = scans.filter((c) => c.hydrotestStatus === 'valid').length;
  const rejectedCount = scans.filter((c) => c.fillStatus === 'rejected').length;

  const handleSimulatorToggle = () => {
    if (!socket) return;
    if (isSimulatorActive) {
      socket.emit('stop_simulator');
    } else {
      socket.emit('start_simulator');
    }
  };

  const simulateBatchScan = () => {
    if (isSimulatorActive) return;
    setIsScanning(true);
    // Simulate Cardteck i607 reading 27 tags at once (we'll just load the mock 4 for demo)
    setTimeout(() => {
      setScans(MOCK_SCANS);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-emerald-500/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 relative overflow-hidden">
            {isAntennaConnected ? (
              <Wifi size={20} className="text-emerald-500 z-10" />
            ) : (
              <WifiOff size={20} className="text-rose-500 z-10" />
            )}
            {isScanning && <div className="absolute inset-0 bg-indigo-400/30 animate-ping rounded-2xl" />}
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">UHF RFID HORECA 12Kg Scanner</h2>
            <p className="text-xs font-bold mt-0.5 flex items-center gap-1">
              <span className={isAntennaConnected ? 'text-emerald-500' : 'text-rose-500'}>
                {isAntennaConnected ? '● Connected' : '○ Disconnected'}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-indigo-600 dark:text-indigo-400">CT-i607</span>
              {deviceInfo && <span className="text-slate-500">· {deviceInfo}</span>}
              {isScanning && <span className="animate-pulse text-indigo-400">· Scanning...</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button
            onClick={handleQueryDeviceInfo}
            disabled={isQueryingDevice || !isAntennaConnected}
            className="px-2.5 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 hover:text-white font-bold rounded-lg text-[10px] border border-slate-700/50 transition-all active:scale-95 flex items-center gap-1 disabled:opacity-30"
            title="Query Device Info (0x40)"
          >
            <Cpu size={12} />
            <span>Info</span>
          </button>
          <button
            onClick={handleReadTagMemory}
            disabled={isReadingTag || !isAntennaConnected}
            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-bold rounded-lg text-[10px] border border-amber-700/50 transition-all active:scale-95 flex items-center gap-1 disabled:opacity-30"
            title="Read Tag Memory (0x31)"
          >
            <BookOpen size={12} />
            <span>Read</span>
          </button>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            disabled={!isAntennaConnected}
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-extrabold rounded-lg text-[10px] border border-emerald-500/30 transition-all active:scale-95 flex items-center gap-1 disabled:opacity-30"
          >
            <Tag size={12} />
            <span>Encode</span>
          </button>
          <button
            onClick={simulateBatchScan}
            disabled={isScanning || isSimulatorActive}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold rounded-lg text-[10px] shadow-md transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Scan size={12} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Reading...' : 'Batch Scan'}
          </button>
          <button
            onClick={handleSimulatorToggle}
            disabled={isScanning}
            className={`px-2.5 py-1.5 font-extrabold rounded-lg text-[10px] border transition-all active:scale-95 flex items-center gap-1 ${
              isSimulatorActive
                ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
            }`}
            title={isSimulatorActive ? 'Stop Simulator' : 'Start Simulator'}
          >
            <Cpu size={12} className={isSimulatorActive ? 'animate-pulse' : ''} />
            <span>{isSimulatorActive ? 'Stop Sim' : 'Sim'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Summary Row */}
      <div className="space-y-3">
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search CNG serial, EPC tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{scans.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Detected</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-3 border border-emerald-200/80 dark:border-emerald-800/80 text-center">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{validCount}</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">Valid</div>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/40 rounded-2xl p-3 border border-rose-200/80 dark:border-rose-800/80 text-center">
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 tabular-nums">{rejectedCount}</div>
            <div className="text-[11px] text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wider">Rejected</div>
          </div>
        </div>
      </div>

      {/* Cylinder list */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[260px] scrollbar-thin pr-1">
        {filteredScans.length > 0 ? (
          filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => setSelectedScan(scan)}
              className={`rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${
                hoveredRow === scan.id
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-indigo-300 dark:border-indigo-700 shadow-md scale-[1.01]'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              } ${scan.fillStatus === 'rejected' ? 'border-rose-200 dark:border-rose-900/80 bg-rose-50/40 dark:bg-rose-950/20' : ''}`}
              onMouseEnter={() => setHoveredRow(scan.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Row top */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      scan.fillStatus === 'rejected' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Package size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Tag size={13} className="text-indigo-500 shrink-0" />
                      <div className="text-sm font-black text-slate-900 dark:text-white font-mono truncate">{scan.cylinderSerial}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <FillStatusBadge status={scan.fillStatus} />
                </div>
              </div>

              {/* Row bottom */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <HydrotestBadge status={scan.hydrotestStatus} />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{scan.weightKg}Kg</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="tabular-nums text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">{scan.scanTime}</span>
                  {hoveredRow === scan.id && <ChevronRight size={14} className="text-indigo-500 animate-pulse" />}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-center text-xs font-bold text-slate-400 italic">
            <Wifi size={24} className="text-slate-300 dark:text-slate-700 mb-1" />
            <p>Waiting for Cardteck i607 scan event...</p>
            <p className="text-[10px] text-slate-500">Ensure Tubeskid Gurita is within 7m range.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* Read Result Display */}
      {readResult && (
        <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-2xl">
          <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">Tag Memory Read (EPC Bank)</div>
          <div className="text-xs font-mono text-white break-all">{readResult}</div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Reader: <strong className="text-slate-700 dark:text-slate-300 font-mono">CT-i607 [TCP/IP]</strong></span>
        <span className={`font-extrabold flex items-center gap-1 ${isAntennaConnected ? 'text-emerald-500' : 'text-rose-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAntennaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{isAntennaConnected ? 'Antenna Active (868-928MHz)' : 'Antenna Offline'}</span>
        </span>
      </div>

      {/* Write Tag Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Tag className="text-emerald-400" size={18} />
                <span>Write Data to Physical Tag</span>
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Target Memory Bank</label>
                <select
                  value={writeBank}
                  onChange={(e) => setWriteBank(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value={1}>Bank 1 - EPC Memory (ID Tabung / Kartu)</option>
                  <option value={3}>Bank 3 - USER Memory (Data SIO / Inspeksi)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Data Payload (HEX String)</label>
                <input
                  type="text"
                  placeholder="e.g. E20000170217019923902999"
                  value={writeHex}
                  onChange={(e) => setWriteHex(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">Must be valid Hexadecimal characters (0-9, A-F).</p>
                {lastReadEpc && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <span>Auto-filled from Read — click Read first to get actual tag data</span>
                  </p>
                )}
              </div>
            </div>

            {isWriting && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
                <p className="text-xs font-bold text-emerald-400 animate-pulse">
                  Sending Frame 0x30 to antenna — waiting for response...
                </p>
                <p className="text-[10px] text-emerald-300/60 mt-1">Do not move tag while writing.</p>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsWriteModalOpen(false)}
                disabled={isWriting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteWriteTag}
                disabled={isWriting || !writeHex.trim() || !isAntennaConnected}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isWriting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    Writing...
                  </>
                ) : 'Write To Tag Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Master (KTP Tabung) Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <FileText className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">Asset Master Data</h3>
                  <p className="text-[11px] font-bold text-slate-400">Tabung CNG 12Kg</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cylinder Identity */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Package size={80} />
              </div>
              <div className="flex justify-center mb-2 relative z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Property of BaGS
                </span>
              </div>
              <div className="flex justify-center mb-1 relative z-10"><Tag size={16} className="text-indigo-500" /></div>
              <div className="text-2xl font-black text-white font-mono tracking-wider relative z-10">{selectedScan.cylinderSerial}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 relative z-10">{selectedScan.rfidEpc}</div>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <Package size={12} /> Merk Pabrik
                </div>
                <div className="text-sm font-bold text-white">Sinoma (Seamless)</div>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <Calendar size={12} /> Tahun Rilis
                </div>
                <div className="text-sm font-bold text-white">2024</div>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <Database size={12} /> Kap. Air
                </div>
                <div className="text-sm font-bold text-white">50 Liter</div>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <Activity size={12} /> WP
                </div>
                <div className="text-sm font-bold text-white">250 Bar</div>
              </div>
            </div>

            {/* Hydrotest Status */}
            <div className={`rounded-2xl p-4 border ${
              selectedScan.hydrotestStatus === 'valid' ? 'bg-emerald-500/10 border-emerald-500/30' :
              selectedScan.hydrotestStatus === 'expiring-soon' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-rose-500/10 border-rose-500/30'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jadwal Hydrotest</div>
                  <div className="text-sm font-bold text-white">{new Date(selectedScan.hydrotestExpiry).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <HydrotestBadge status={selectedScan.hydrotestStatus} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}