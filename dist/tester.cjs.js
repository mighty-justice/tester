'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var enzyme = {};

var NullComponent = function NullComponent(props) {
  return React__default.createElement(React.Fragment, props);
};

function getInstance(component) {
  var instance = component.instance();
  return instance.wrappedInstance || instance;
}

function _sleep() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/*
  Name: Tester
  Description: Testing utility class to mount a specific component with it's required wrappers.

  Usage:
    // Bootstrap Transport, localStorage + Session and an AppState.
    const tester = new Tester(MyComponent);

    // Bootstrap nothing, use with light components that doesn't need any of the above.
    const tester = new TesterLight(MyComponent);

    // Mount the component
    await tester.mount();

    // Test component that requires more JSX than the component only :
    const new Tester(MyComponent, {mount: (<Form><MyComponent></Form>)});

    // You can mount right away if no Transport or AppState modification is needed.
    const tester = await new Tester(MyComponent).mount();

    // opts.shallow is an experimental feature that allows you to test the TestedComponent instance behaviors.
    // Please only use it when necessary.
    const tester = await new Tester(MyComponent, { shallow: true }).mount();
      tester.shallow.wrapper // equals to shallow(<TestedComponent {...this.props} {...this.AppState} />)
      tester.shallow.instance // equals to tester.shallow.instance()
*/

/**
 * Testing utility class to mount a specific component with it's required wrappers.
 *
 * @param {ReactComponent} TestedComponent
 * @param {Object} options
 * @returns {Tester}
 */


var Tester =
/*#__PURE__*/
function () {
  function Tester(TestedComponent) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tester);

    _defineProperty(this, "initialMount", void 0);

    _defineProperty(this, "onBeforeMount", void 0);

    _defineProperty(this, "opts", void 0);

    _defineProperty(this, "profile", void 0);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "shallow", void 0);

    _defineProperty(this, "TestedComponent", void 0);

    _defineProperty(this, "wrapper", void 0);

    _defineProperty(this, "wrappers", void 0);

    this.opts = opts;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.profile = _objectSpread({}, this.constructor.profiles.Default, opts.profile);
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent; // Allow testing without a main TestedComponent. This require an initialMount.

    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = React__default.createElement(this.TestedComponent, null, this.initialMount);
    } // Loop through hooks onInit(),


    var _arr = Object.keys(this.constructor.hooks);

    for (var _i = 0; _i < _arr.length; _i++) {
      var hookName = _arr[_i];

      if (this.profile[hookName] && this.constructor.hooks[hookName] && typeof this.constructor.hooks[hookName].onInit === 'function') {
        this.constructor.hooks[hookName].onInit(this, opts);
      }
    }
  }

  _createClass(Tester, [{
    key: "getWrappers",
    value: function getWrappers() {
      var wrappers = [];

      var _arr2 = Object.keys(this.constructor.hooks);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var hookName = _arr2[_i2];

        if (this.profile[hookName] && this.constructor.hooks[hookName] && typeof this.constructor.hooks[hookName].wrapper === 'function') {
          wrappers.push(this.constructor.hooks[hookName].wrapper(this, this.opts));
        }
      }

      return wrappers;
    }
  }, {
    key: "debug",
    value: function debug() {
      // eslint-disable-next-line no-console
      console.log(this.wrapper.debug());
    }
  }, {
    key: "html",
    value: function html() {
      return this.component.html();
    }
  }, {
    key: "text",
    value: function text() {
      return this.component.text();
    }
  }, {
    key: "find",
    value: function find(selector) {
      return this.wrapper.find(selector);
    }
  }, {
    key: "update",
    value: function update() {
      return this.wrapper.update();
    }
  }, {
    key: "sleep",
    value: function () {
      var _sleep2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(ms) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _sleep(ms);

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sleep(_x) {
        return _sleep2.apply(this, arguments);
      }

      return sleep;
    }()
  }, {
    key: "refresh",
    value: function () {
      var _refresh = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(ms) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _sleep(ms);

              case 2:
                this.update();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function refresh(_x2) {
        return _refresh.apply(this, arguments);
      }

      return refresh;
    }()
  }, {
    key: "createShallowWrapper",
    value: function createShallowWrapper() {
      this.shallow = {};
      this.shallow.wrapper = enzyme.mount(React__default.createElement(this.TestedComponent.wrappedComponent, _extends({}, this.props, this.AppState)));
      this.shallow.instance = getInstance(this.shallow.wrapper);
    }
  }, {
    key: "mount",
    value: function () {
      var _mount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var mountOpts,
            _arr3,
            _i3,
            hookName,
            initialMount,
            WrapperTree,
            _args3 = arguments;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                mountOpts = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
                // Loop through hooks onBeforeMount(),
                _arr3 = Object.keys(this.profile);
                _i3 = 0;

              case 3:
                if (!(_i3 < _arr3.length)) {
                  _context3.next = 11;
                  break;
                }

                hookName = _arr3[_i3];

                if (!(this.profile[hookName] && this.constructor.hooks[hookName] && typeof this.constructor.hooks[hookName].onBeforeMount === 'function')) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 8;
                return this.constructor.hooks[hookName].onBeforeMount(this, mountOpts);

              case 8:
                _i3++;
                _context3.next = 3;
                break;

              case 11:
                if (!this.onBeforeMount) {
                  _context3.next = 14;
                  break;
                }

                _context3.next = 14;
                return this.onBeforeMount(this);

              case 14:
                initialMount = this.initialMount || React__default.createElement(this.TestedComponent, this.props);
                WrapperTree = this.getWrappers().reduce(function (Tree, wrapper) {
                  var wrapperChildren = wrapper.renderChildren !== false && Tree;

                  if (wrapper.props) {
                    return React__default.createElement(wrapper.Component, wrapper.props, wrapperChildren);
                  }

                  return Tree;
                }, initialMount);
                _context3.next = 18;
                return enzyme.mount(WrapperTree);

              case 18:
                this.wrapper = _context3.sent;

                if (this.opts.shallow) {
                  this.createShallowWrapper();
                }

                if (!mountOpts.async) {
                  _context3.next = 24;
                  break;
                }

                _context3.next = 23;
                return this.sleep();

              case 23:
                this.update();

              case 24:
                return _context3.abrupt("return", this);

              case 25:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function mount() {
        return _mount.apply(this, arguments);
      }

      return mount;
    }()
  }, {
    key: "instance",
    get: function get() {
      return getInstance(this.component);
    }
  }, {
    key: "component",
    get: function get() {
      return this.wrapper.find(this.TestedComponent);
    }
  }]);

  return Tester;
}();
/*
  Profiles,
  {
    // Profile keys must be hook names.
  }
*/


Tester.profiles = {
  // Default profile, each of it's properties can be overwritten.
  Default: {}
};

Tester.registerProfile = function (name, profile) {
  var capitalizedName = capitalize(name);

  if (Tester.profiles[capitalizedName] && capitalizedName !== 'Default') {
    throw new Error("Tester.registerProfile() : A profile named \"".concat(capitalizedName, "\" already exist."));
  }

  Tester.profiles[capitalizedName] = profile;
};
/*
  Hooks,
  {
    name: string,
    component: React.Component,
    props: object || fn(), // fn() allows this.AppState to be set for e.g
    onInit: fn(),
    onBeforeMount: fn(),
    shortCuts: {shortCutName: fn()},
    wrapper: fn() => { Component: React.Component, name: string, props: object }
  }

  Note: Order is important!
*/


Tester.hooks = {};

Tester.registerHook = function (hook) {
  if (!hook.name) {
    throw new Error('Tester.registerHook() : A hooks must have a name.');
  }

  if (Tester.hooks[hook.name]) {
    throw new Error("Tester.registerHook() : A hook named \"".concat(hook.name, "\" already exist."));
  }

  Tester.hooks[hook.name] = hook;
};
/*
  Create shortcuts for each global profiles
  Tester shortcuts allows you to use a specific global profile without having to pass it in in the options.

  E.g.
  Using a new Tester.Light(MyComponent) allows you to skip the initialization of Transport, localStorage + Session and AppState.
*/


Object.keys(Tester.profiles).forEach(function (profileKey) {
  Tester[profileKey] = function (TestedComponent) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Tester(TestedComponent, _objectSpread({}, opts, {
      profile: Tester.profiles[profileKey]
    }));
  };
});

Tester.setEnzyme = function (passedEnzyme) {
  enzyme = passedEnzyme;
};

module.exports = Tester;
