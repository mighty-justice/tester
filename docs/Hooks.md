# Hooks
Hooks are configurable events that allow you to run specific tasks on `Tester` init and before mounting your components.

## Structure
A hook's structure consists of a required name and optional options:
```js
{
  name: string, // Name of the hook (This is the only required property)
  component: React.Component, // React Component used to wrap the TestedComponent
  props: object || fn(tester), // fn() allows you to set more dynamic props. Use an object whenever you can.
  onInit: fn(tester), // Triggers a function on Tester init (new Tester()).
  onBeforeMount: fn(tester), // Triggers a function before your component is mounted. (tester.mount())
}
```

### Quick example
Here is an example of a hook that mocks LocalStorage and initializes a user session if passed as an option.
```js
// LocalStorage Hook
{
  name: 'localStorage',
  onInit: (tester) => {
    window.localStorage = new LocalStorageMock();
    if (tester.opts.session) {
      window.localStorage.bootstrapSession(tester.opts.user || USER);
    }
  },
},

// To enable that mock, you need to pass it to Tester by setting it in the options.

// You can also make set it as default
{ name: 'Default', LocalStorage: true }
const tester = new Tester(TestedComponent);
```

## Useful examples
*Not available yet.*
