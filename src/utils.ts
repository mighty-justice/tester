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

function sleep (ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
