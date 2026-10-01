import { validateInputParams } from './param_validator';

export function handleIncomingRequest(params: Record<string, unknown>) {
  try {
    const count = validateInputParams(params);
    return { status: 200, count };
  } catch (err: any) {
    if (err.message.includes('VALIDATION_ERROR')) {
      return { status: 400, error: err.message };
    }
    return { status: 500, error: 'INTERNAL_SERVER_ERROR' };
  }
}
