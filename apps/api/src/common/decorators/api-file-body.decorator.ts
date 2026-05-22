import { ApiBody } from '@nestjs/swagger';

export function ApiFileBody(fieldName: string, multiple = false) {
  const property = multiple
    ? { type: 'array', items: { type: 'string', format: 'binary' } }
    : { type: 'string', format: 'binary' };
  return ApiBody({
    schema: { type: 'object', properties: { [fieldName]: property } },
  });
}
