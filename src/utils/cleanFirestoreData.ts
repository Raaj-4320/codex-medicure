type FirestorePrimitive = string | number | boolean | null;
type FirestoreValue = FirestorePrimitive | Date | FirestoreValue[] | { [key: string]: FirestoreValue | undefined };

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const cleanFirestoreData = <T>(input: T): T => {
  if (input === undefined) {
    return undefined as T;
  }

  if (input === null || input instanceof Date) {
    return input;
  }

  if (Array.isArray(input)) {
    return input
      .map((item) => cleanFirestoreData(item))
      .filter((item) => item !== undefined) as T;
  }

  if (isPlainObject(input)) {
    const cleanedEntries = Object.entries(input).reduce<Record<string, unknown>>((acc, [key, value]) => {
      if (value === undefined) return acc;

      const cleaned = cleanFirestoreData(value as FirestoreValue);
      if (cleaned !== undefined) {
        acc[key] = cleaned;
      }
      return acc;
    }, {});

    return cleanedEntries as T;
  }

  return input;
};

export default cleanFirestoreData;
