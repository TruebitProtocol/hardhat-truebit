export function parseBoolean(value: string): boolean | undefined {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
}

export function parseInteger(value: string): number | undefined {
  const parsed = parseInt(value);
  return !Number.isNaN(parsed) ? parsed : undefined;
}
