# Helpers

## Basic

Basic helpers that return what has been mounted OR are simply enzyme shortcuts.

```js
tester.instance // The instance of the tested component
tester.component // The tested component
tester.html() // Retrieve mounted component html
tester.text() // Retrieve mounted component text
tester.wrapper // return of the enzyme mount()
tester.update(); // shortcut for enzyme update();
```

## sleep
```.js
/* await 20ms, useful when triggering mocked Api Calls */
tester.sleep();
```

## refresh
```.js
/*
  Calls both tester.sleep() and tester.update() to
  wait for an action to be fully complete.
  e.g. click + api call + render update.
*/
tester.refresh();
```

## debug
```.js
// render tester.wrapper.debug(); in a console log
tester.debug();
```
