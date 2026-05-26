import { ApiBody } from '@nestjs/swagger';

interface FileField {
  name: string;
  multiple?: boolean;
}

export function ApiFileBody(fields: string | FileField[], multiple = false) {
  const normalized: FileField[] =
    typeof fields === 'string' ? [{ name: fields, multiple }] : fields;

  const properties = Object.fromEntries(
    normalized.map(({ name, multiple: isMultiple = false }) => [
      name,
      isMultiple
        ? { type: 'array', items: { type: 'string', format: 'binary' } }
        : { type: 'string', format: 'binary' },
    ]),
  );

  return ApiBody({ schema: { type: 'object', properties } });
}
