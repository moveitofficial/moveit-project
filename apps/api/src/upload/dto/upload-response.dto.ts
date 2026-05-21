import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ example: 'portfolios/uuid.png' })
  declare key: string;

  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/portfolios/uuid.png',
  })
  declare url: string;
}
