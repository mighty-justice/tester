# Hooks
Hooks are configurable events that allow you to run specific tasks on `Tester` init and before mounting your components. Hooks are enabled by passing a Profile to a new `Tester` instance.

More about Profiles [here](Profiles.md).

## Structure
Hooks structure consist of a name and optional options:
```js
{
  name: string, // Name of the hook, used in Profiles to define which is enabled or not. (This is the only required property)
  component: React.Component, // React Component used to wrap the TestedComponent
  props: object || fn(tester), // fn() allows you to set more dynamic props. Use an object whenever you can.
  onInit: fn(tester), // Triggers a function on Tester init (new Tester()).
  onBeforeMount: fn(tester), // Triggers a function before your component is mounted. (tester.mount())
}
```

### Quick example
Here is an example of a hook that mock LocalStorage and initialize a user session if passed as an option.
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

// To enable that mock, you need to pass it to Tester either by creating a default Profile or by setting it in the options.

// Create Profile
{
  name: 'Storage',
  LocalStorage: true, // Note: Hooks name get capitalized.
}
// and trigger with shortcut
const tester - new Tester.Storage(TestedComponent);

// You can also make set it as default
{ name: 'Default', LocalStorage: true }
const tester - new Tester(TestedComponent);

// or, without a Profile, you can pass the hook through the profile option
const tester = new Tester(TestedComponent, { profile: { LocalStorage: true } });
```

## Useful examples
*Not availble yet.*