# Configuration
Add this to your `jestSetup.js` file.
```js
// Import the full enzyme to pass it to Tester
import enzyme from 'enzyme';
// Import the proper adapter, version 16 is required.
import Adapter from 'enzyme-adapter-react-16';
import { TransportMock } from './mocks';
import { ConfigureTester } from '@mighty-justice/tester';

// Adapt enzyme BEFORE configuring Tester
enzyme.configure({ adapter: new Adapter() });

// Now you can configure Tester by passing enzyme and the config object
TesterConfig.configure(enzyme, {
    hooks: [
      {
        name: 'Transport',
        // When the Tester is initialized, run the following
        onInit: (tester) => {
          /*
            You can set whatever you want on the tester,
            as long as it doesn't conflict with an existing property.
          */
          tester.Transport = new TransportMock();

          // You can use any options that you pass on the Tester initialization to run code.
          if (tester.opts.registerEndpoints) {
            tester.Transport.register(tester.opts.registerEndpoints);
          }
        },
      },
      // ...
      // You can add as many hooks as you want
    ],
    profiles: [
      {
        name: 'Default', // Using Default overwrites the default profile.
        Transport: true, // These properties MUST match hooks name for them to trigger.
      },
      {
        name: 'Light', // This creates a Tester.Light
        Transport: false, // Disable the hook
      },
    ],
});
```

### Pseudo configuration example
As you can see in the pseudo-code below, there is no limits to how many Tester Profiles / Hooks you can set.
```js
TesterConfig.configure(enzyme, {
    hooks: [
      { name: 'Api', ... },
      { name: 'Session', ... },
      { name: 'Icons', ... },
      { name: 'SelectItemOnInit', ... },
      { name: 'ServerNotResponding', ... },
    ],
    profiles: [
      {
        name: 'Default',
        Api: true,
        Session: true,
      },
      {
        name: 'Light',
        Api: false,
        Session: false,
      },
      {
        name: 'Icon',
        Api: false,
        Session: false,
        Icons: true,
      },
      {
        name: 'SelectItem',
        Api: true,
        Session: true,
        SelectItemOnInit: true,
      },
      {
        name: 'NoServer',
        Api: true,
        Session: true,
        ServerNotResponding: true,
      },
    ],
});
```
