type UILogPayload = {
  context: string;
  success: boolean;
  reason?: string;
};

export function logUI(action: string, { context, success, reason }: UILogPayload): void {
  console.group(`[UI][${action}]`);
  console.log('ACTION:', context);
  if (success) {
    console.log('STATUS: WORKING ✅');
  } else {
    console.warn('STATUS: NOT WORKING ❌');
    if (reason) {
      console.warn('REASON:', reason);
    }
  }
  console.groupEnd();
}

export default logUI;
