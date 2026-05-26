import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ example: 'portfolios/uuid/image.png' })
  declare key: string;

  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/portfolios/uuid/image.png',
  })
  declare url: string;
}

export class UploadPortfoliosResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  declare portfolioId: string;

  @ApiProperty({ type: UploadResponseDto })
  declare mainImage: UploadResponseDto;

  @ApiProperty({ type: [UploadResponseDto] })
  declare detailImages: UploadResponseDto[];
}
