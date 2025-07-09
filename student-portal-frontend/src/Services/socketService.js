import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
let socket;

export const initSocket = () => {
  socket = io(API_URL);
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const subscribeToFeeUpdates = (callback) => {
  const socket = getSocket();
  socket.on('fee-update', (data) => {
    callback(data);
  });
};

export const unsubscribeFromFeeUpdates = () => {
  const socket = getSocket();
  socket.off('fee-update');
};