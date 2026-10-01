export function validateInputParams(params: { count?: unknown }): number {
  if (params.count === undefined || params.count === null) {
    return 10; // Default count
  }
  const num = Number(params.count);
  if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
    throw new Error('VALIDATION_ERROR: count must be a positive integer');
  }
  return num;
}
