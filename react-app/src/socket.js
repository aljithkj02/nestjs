import { io } from 'socket.io-client';

const URL = 'localhost:8000';
export const socket = io(URL);