type FlowInput = {
  expected?: unknown;
  received?: unknown;
  success: boolean;
  error?: unknown;
};

export const logFlow = (name: string, input: FlowInput): void => {
  const { expected, received, success, error } = input;

  console.group(`[FLOW][${name}]`);
  console.log('START');
  console.log('EXPECT:', expected ?? null);
  console.log('RESULT:', received ?? null);

  if (success) {
    console.log('STATUS: SUCCESS ✅');
  } else {
    console.error('STATUS: FAIL ❌');
    console.group('[DEBUG]');
    console.error(error ?? received);
    console.groupEnd();
  }

  console.groupEnd();
};

export const validateRequiredFields = (
  payload: Record<string, unknown>,
  required: string[],
): { ok: boolean; missing: string[] } => {
  const missing = required.filter((key) => {
    const value = payload[key];
    return value === undefined || value === null || value === '';
  });

  return { ok: missing.length === 0, missing };
};

export default logFlow;
