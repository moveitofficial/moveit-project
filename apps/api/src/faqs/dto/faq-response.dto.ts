import { ApiProperty } from '@nestjs/swagger';

export class FaqResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '회원가입은 어떻게 하나요?' })
  declare title: string;

  @ApiProperty({
    example:
      '메인 우측 상단의 "회원가입" 버튼을 통해 이메일 또는 SNS(구글/카카오/네이버)로 가입할 수 있어요. 의뢰인과 전문가 회원가입은 분리되어 있습니다.',
  })
  declare content: string;

  @ApiProperty({ example: '2026-01-10T09:00:00.000Z' })
  declare createdAt: Date;
}
