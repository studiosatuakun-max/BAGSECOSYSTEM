'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4001';

interface SocketContextType {
  socket: Socket | null;
  isAntennaConnected: boolean;
  isSimulatorActive: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isAntennaConnected: false,
  isSimulatorActive: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAntennaConnected, setIsAntennaConnected] = useState(false);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);

  useEffect(() => {
    const socketInstance = io(WS_URL);
    setSocket(socketInstance);

    socketInstance.on('antenna_status', (data: { connected: boolean }) => {
      setIsAntennaConnected(data.connected);
    });

    socketInstance.on('simulator_status', (data: { active: boolean }) => {
      setIsSimulatorActive(data.active);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isAntennaConnected, isSimulatorActive }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
