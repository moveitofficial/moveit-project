import { WsException } from '@nestjs/websockets';

export function toWsException(error: {
  message: string;
  code: string;
}): WsException {
  return new WsException({ message: error.message, code: error.code });
}
