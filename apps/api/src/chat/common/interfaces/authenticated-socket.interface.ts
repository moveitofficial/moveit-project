import type { Role } from '@prisma/client';
import type { Socket } from 'socket.io';

export interface ConsultationSocketData {
  userId: string;
  role: Role;
}

export interface CsUserSocketData {
  kind: 'user';
  userId: string;
}

export interface CsAdminSocketData {
  kind: 'admin';
  adminId: string;
}

export type CsSocketData = CsUserSocketData | CsAdminSocketData;

export type ConsultationSocket = Omit<Socket, 'data'> & {
  data: ConsultationSocketData;
};
export type CsSocket = Omit<Socket, 'data'> & {
  data: CsSocketData;
};
