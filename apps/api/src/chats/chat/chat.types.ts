import type { OrderStatus } from '@prisma/client';

export interface RoomCurrentService {
  id: string;
  title: string;
  servicePrice: number;
}

export interface RoomOrder {
  id: string;
  status: OrderStatus;
  agreedServicePrice: number;
  platformFee: number;
  totalAmount: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface RoomWithOrder {
  room: {
    id: string;
    clientUserId: string;
    expertUserId: string;
    currentServiceId: string;
    currentService: RoomCurrentService;
  };
  order: RoomOrder | null;
}
