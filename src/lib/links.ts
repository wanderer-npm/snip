import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

export function makeSlug(custom?: string) {
  if (custom) return custom.trim().replace(/\s+/g, '-').slice(0, 32);
  return nanoid();
}

export function isValidUrl(input: string) {
  try {
    const u = new URL(input);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-_]{3,32}$/.test(slug);
}

export async function hashPassword(pw: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
}

export function checkPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function isExpired(expiresAt: Date | null) {
  if (!expiresAt) return false;
  return expiresAt.getTime() < Date.now();
}

export function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}
