import { ApiProperty } from '@nestjs/swagger';

export class ChatFileResponseDto {
  @ApiProperty({ example: 'chat/uuid/file.pdf' })
  declare key: string;

  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/chat/uuid/file.pdf',
  })
  declare url: string;

  @ApiProperty({ example: '기획서.pdf' })
  declare fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  declare fileType: string;

  @ApiProperty({ example: 204_800 })
  declare fileSize: number;
}

export class UploadChatFilesResponseDto {
  @ApiProperty({ format: 'uuid', description: '채팅방 생성 시 사용할 ID' })
  declare roomId: string;

  @ApiProperty({ type: [ChatFileResponseDto] })
  declare files: ChatFileResponseDto[];
}
