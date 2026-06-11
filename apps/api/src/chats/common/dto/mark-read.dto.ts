import { IsUUID } from 'class-validator';

export class MarkReadDto {
  @IsUUID()
  declare roomId: string;

  @IsUUID()
  declare messageId: string;
}
