import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

type DtoType = new (...args: unknown[]) => unknown;

export function ApiSuccessResponse(
  status: number,
  dataType?: DtoType | [DtoType],
) {
  const isArray = Array.isArray(dataType);
  const actualType = isArray ? dataType[0] : dataType;

  const dataSchema = actualType
    ? isArray
      ? { type: 'array', items: { $ref: getSchemaPath(actualType) } }
      : { $ref: getSchemaPath(actualType) }
    : { type: 'object', example: {} };

  return applyDecorators(
    ...(actualType ? [ApiExtraModels(actualType)] : []),
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
