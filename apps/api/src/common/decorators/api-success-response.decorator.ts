import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSuccessResponse(
  status: number,
  dataType?: new (...args: unknown[]) => unknown,
) {
  const dataSchema = dataType
    ? { $ref: getSchemaPath(dataType) }
    : { type: 'object', example: {} };

  return applyDecorators(
    ...(dataType ? [ApiExtraModels(dataType)] : []),
    ApiResponse({
      status,
      description: '요청 성공',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '요청 성공' },
          data: dataSchema,
        },
      },
    }),
  );
}

export function ApiOneOfSuccessResponse(
  status: number,
  ...dataTypes: [
    new (...args: unknown[]) => unknown,
    ...(new (...args: unknown[]) => unknown)[],
  ]
) {
  return applyDecorators(
    ApiExtraModels(...dataTypes),
    ApiResponse({
      status,
      description: '요청 성공',
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '요청 성공' },
          data: {
            oneOf: dataTypes.map((type) => ({ $ref: getSchemaPath(type) })),
          },
        },
      },
    }),
  );
}
