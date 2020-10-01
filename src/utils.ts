/*
  Utilities
*/

export function getInstance(component: any) {
  const instance = component.instance();
  return instance && (instance.wrappedInstance || instance);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function getValue(tester: any, value: unknown) {
  return isFunction(value) ? value(tester) : value;
}

export async function sleep(ms: number = 0) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export async function flushPromises() {
  return new Promise<void>((resolve, _reject) => setImmediate(resolve));
}
