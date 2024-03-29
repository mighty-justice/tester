# Tester

![Tester](/docs/tester_logo_200w.png?raw=true "Tester")

[![npm Version](https://img.shields.io/npm/v/@mighty-justice/tester.svg)](https://www.npmjs.com/package/@mighty-justice/tester) [![Build Status](https://travis-ci.org/mighty-justice/tester.svg?branch=master)](https://travis-ci.org/mighty-justice/tester) [![Coverage Status](https://coveralls.io/repos/github/mighty-justice/tester/badge.svg?branch=master)](https://coveralls.io/github/mighty-justice/tester?branch=master)

Centralize and standardize your tests with easy configuration.

## Installation
#### dependencies
```
"react": ">=16",
"react-dom": ">=16",
"enzyme": ">=3.8"
```
#### npm
`npm install --save-dev @mighty-justice/tester`
#### yarn
`yarn add --dev @mighty-justice/tester`

## Quick Start
Tester lets you configure and bootstrap your tests the way you want to. The possibilities are endless, but here's a quick summary to get you started.

In this example, we'll create a Transport hook to mock our API calls and test it.

### Configuration
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
});
```

### Usage
Now that our Tester is configured, let's test one of our components.

```js
/* global */
import Button from './button':
import { Tester } from '@mighty-justice/tester';

describe('Button', () => {
  it('Button triggers API call', async () => {
    const tester = await new Tester(
      Button,
      { props: { callsApiOnClick: true } },
    ).mount();

    expect(tester.Transport.calls.length).toBe(0);
    tester.component.simulate('click');
    expect(tester.Transport.calls.length).toBe(1);
  });
});
```

### Helpers
The most helpful helpers are:
```js
tester.instance // The instance of the tested component
tester.component // The tested component
tester.html() // Retrieve mounted component html
tester.text() // Retrieve mounted component text
tester.wrapper // return of the enzyme mount()
// and more...
```
 Here's the full list: [Helpers](docs/Helpers.md)

## Contributing

- Release: `npm run deploy`
