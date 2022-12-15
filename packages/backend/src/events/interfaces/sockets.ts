import { Socket } from 'socket.io';

export interface ClientSocket extends Socket {
  sessionId: string;
}

export interface AdminSocket extends Socket {
  adminToken: string;
}
