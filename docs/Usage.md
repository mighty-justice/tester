# Usage
Once your Tester is configured, there are a couple of ways you can use it.

### Multi steps
```ts
// The Tester instance is created, onInit is called, but the TestedComponent is not mounted yet.
const tester = new Tester(TestedComponent, { props: { color: 'blue' } });
// We're now mounting the component.
tester.mount();
// the component is ready and we can use all the utils available.
tester.instance();
tester.html();
tester.text();
...
```

### Awaiting API calls to finish after mount
```ts
/*
  If we trigger a lot of API calls and event when mounting our TestedComponent,
  we can use the 'async' options when mounting it.
*/
const tester = new Tester(TestedComponent, { props: { color: 'blue' } });
// This will automatically run tester.sleep(); and tester.update();
// right after mounting the TestedComponent.
await tester.mount({ async: true });

// The 'async' option is a shortut for this:
const tester = new Tester(TestedComponent, { props: { color: 'blue' } });
tester.mount();
await tester.sleep();
await tester.update();

```

### All the shortcuts !
```ts
const tester = await new Tester(TestedComponent, { props: { color: 'blue' } }).mount({ async: true });
// Your TestedComponent is now mounted. It waited for API calls to finish and updated once.
// You can now use all the utils available.
```
