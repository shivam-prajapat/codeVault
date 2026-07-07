import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if the user is logged in
    if (!currentUser) return;

    // Use environment variable for backend URL or fallback to localhost
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const newSocket = io(backendUrl);
    
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      
      // Emit the joinRoom event with the user's ID to listen for personal notifications
      newSocket.emit('joinRoom', currentUser);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount or when user logs out
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
