/*
  Utilities
*/

export function getInstance (component: any) {
  const instance = component.instance();
  return instance.wrappedInstance || instance;
}

export function getValue (tester: any, value: unknown) {
  return typeof value === 'function' ? value(tester) : value;
}

export async function sleep (ms: number = 0) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function capitalize (string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isString (value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function flushPromises () {
  return new Promise((resolve, _reject) => setImmediate(resolve));
}
