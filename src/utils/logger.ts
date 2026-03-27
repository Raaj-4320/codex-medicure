export const logEvent = (context: string, payload: unknown): void => {
  try {
    console.log(`[TRACE][${context}]`, JSON.stringify(payload, null, 2));
  } catch (error) {
    console.log(`[TRACE][${context}]`, payload);
    console.error('[TRACE][LOGGER][ERROR]', error);
  }
};

export default logEvent;
