# Profiles
Profiles are presets that define which Hooks will be enabled when `Tester` is initialized.

More about Hooks [here](Hooks.md).

Tester uses the profile named `Default` when no profile is passed to a new `Tester` instance. Default is also used to merge a custom `profile` passed as options to the new `Tester` instance.

## Structure
A Profile's structure is just a name and toggled Hook names.
```js
{
    name: string, // Name of the profile, used to create Profile Shortcuts (more on that later)
    HookName: boolean, // Enabled or disabled Hook (that we define when configuring our Tester hooks).
    ... // The rest is just other Hooks, nothing else
}
```

### Quick example
Here is an example of a profile that would set up a user session based on previously created `Api` and `Session` hooks.
```js
// Profile
{
    name: 'User',
    Api: true,
    Session: true,
}
```

## Shortcuts
Any profile has its own shortcut using the Profile's name. In the example above, the shortcut would be
`Tester.User()`.
By default, we have the `Tester.Default()` profile available, which is equivalent to `Tester()`.

## Overwrite default
You can easily overwrite the `Default` shortcut by creating a Profile with `Default` as its name:
```.js
// Overwrite Default profile
{
    name: 'Default',
    Api: true,
    Session: false,
}
```
`Tester()` and `Tester.Default()` will now use this profile: `{ Api: true, Session: false }`.
