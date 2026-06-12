import { IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsUUID()
  declare roomId: string;
}
