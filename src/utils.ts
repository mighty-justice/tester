/*
  Utilities
*/

function getInstance (component: any) {
  const instance = component.instance();
  return instance.wrappedInstance || instance;
}

function getValue (tester: any, value: unknown) {
  return typeof value === 'function' ? value(tester) : value;
}

async function sleep (ms: number = 0) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function capitalize (string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  capitalize,
  getInstance,
  getValue,
  sleep,
};
