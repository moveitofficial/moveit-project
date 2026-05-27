import { randomBytes } from 'node:crypto';

const TEMP_PASSWORD_LENGTH = 8;

export function generateTempPassword(): string {
  return randomBytes(TEMP_PASSWORD_LENGTH)
    .toString('hex')
    .slice(0, TEMP_PASSWORD_LENGTH);
}
