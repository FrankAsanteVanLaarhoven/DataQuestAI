export type WordingMode = 'industry' | 'plain' | 'expand';

export const roomPlain: Record<string, string> = {
  client: 'The person or program that asks',
  gateway: 'The front door & reverse proxy',
  auth: 'The check of identity and credentials',
  compute: 'The application server that decides',
  cache: 'A fast memory copy kept nearby',
  database: 'The records that must last safely',
  queue: 'A line of work waiting its turn',
  ci: 'The checks before a change is deployed',
  telemetry: 'The measurements and traces of the service',
};

export function wordingText(text: string, mode: WordingMode = 'industry'): string {
  if (!text || mode === 'industry') return text;
  return text;
}

