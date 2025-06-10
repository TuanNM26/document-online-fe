export function getNumberParam(
  value: string | string[] | undefined,
  defaultValue: number
): number {
  if (Array.isArray(value)) {
    value = value[0];
  }
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}
