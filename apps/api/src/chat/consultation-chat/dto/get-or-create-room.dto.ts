import { IsUUID } from 'class-validator';

export class GetOrCreateRoomDto {
  @IsUUID()
  declare expertUserId: string;

  @IsUUID()
  declare serviceId: string;
}
