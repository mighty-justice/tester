# Profiles
Profiles are presets that defines what which Hooks will be enavled when `Tester` will be initialized.

More about Hooks [here](Hooks.md).

Tester uses the profile named `Default` when no profile are passed to a new `Tester` instance. Default is also used to merge custom `profile` passed to the new `Tester` instance options.

## Structure
Profiles structure is just a name and Hook names toggling.
```js
{
    name: string, // Name of the profile, used to create Profile Shortcuts (more on that later)
    HookName: bolean, // Enabled or disabled Hook (that we define when configuring our Tester hooks).
    ... // The rest is just other Hooks, nothing else
}
```

### Quick example
Here is an example of a profile that would set up a user session based on preivously created `Api` and `Session` hooks.
```js
// Profile
{
    name: 'User',
    Api: true,
    Session: true,
}
```

## Shortcuts
Any profile has it's own shortcut using the Profile's name. In the example above, the shortcut would be called:
`Tester.User()`
By default, we have the `Tester.Default()` profile available, which is equal to doing `Tester()`.

## Overwrite default
You can easily overwrite the `Default` shortcut by simply passing it as a name:
```.js
// Overwrite Default profile
{
    name: 'Default',
    Api: true,
    Session: false,
}
```
`Tester()` and `Tester.Default()` will now use this profile: `{ Api: true, Session: false }`.