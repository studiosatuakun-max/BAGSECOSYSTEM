// Re-export from SocketProvider singleton context
// All components that call useSocket() will share ONE WebSocket connection
export { useSocket } from '@/providers/SocketProvider';
