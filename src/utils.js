/*
  Utilities
*/

function getInstance (component) {
  const instance = component.instance();
  return instance.wrappedInstance || instance;
}

function getValue (tester, value) {
  return typeof value === 'function' ? value(tester) : value;
}

function sleep (ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  capitalize,
  getInstance,
  getValue,
  sleep,
};
