import React, { Fragment } from 'react';

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

/*
  Utilities
*/
function getInstance(component) {
  var instance = component.instance();
  return instance && (instance.wrappedInstance || instance);
}
function getValue(tester, value) {
  return typeof value === 'function' ? value(tester) : value;
}
function sleep() {
  return _sleep.apply(this, arguments);
}

function _sleep() {
  _sleep = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var ms,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ms = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
            return _context.abrupt("return", new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _sleep.apply(this, arguments);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}
function flushPromises() {
  return _flushPromises.apply(this, arguments);
}

function _flushPromises() {
  _flushPromises = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, _reject) {
              return setImmediate(resolve);
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _flushPromises.apply(this, arguments);
}

var NullComponent = function NullComponent(props) {
  return React.createElement(Fragment, props);
};
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
 */


var Tester =
/*#__PURE__*/
function () {
  function Tester(TestedComponent) {
    var _this = this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tester);

    this.opts = void 0;
    this.config = void 0;
    this.initialMount = void 0;
    this.onBeforeMount = void 0;
    this.profile = void 0;
    this.props = void 0;
    this.TestedComponent = void 0;
    this.AppState = void 0;
    this.shallow = void 0;
    this.wrapper = void 0;
    this.config = Tester.Configuration;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.opts = opts;
    this.profile = _objectSpread({}, this.config.profiles.Default, opts.profile);
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent; // Allow testing without a main TestedComponent. This require an initialMount.

    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = React.createElement(this.TestedComponent, null, this.initialMount);
    } // Loop through hooks onInit(),


    var validHooks = this.config.getValidHooks(this, 'onInit');
    validHooks.forEach(function (hook) {
      return hook.onInit(_this);
    });
  }

  _createClass(Tester, [{
    key: "getWrappers",
    value: function getWrappers() {
      var _this2 = this;

      var wrappers = [];
      this.config.getValidHooks(this, 'component').forEach(function (hook) {
        wrappers.push({
          component: hook.component,
          name: hook.name,
          props: getValue(_this2, hook.props)
        });
      });
      return wrappers;
    }
  }, {
    key: "debug",
    value: function debug() {
      // tslint:disable-next-line:no-console
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
                return sleep(ms);

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sleep$$1(_x) {
        return _sleep2.apply(this, arguments);
      }

      return sleep$$1;
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
                return sleep(ms);

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
    key: "getComponent",
    value: function getComponent(selector) {
      return isString(selector) ? this.find(selector).first() : selector;
    }
  }, {
    key: "changeInput",
    value: function changeInput(selector, value) {
      var component = this.getComponent(selector);
      component.simulate('focus');
      component.simulate('change', {
        target: {
          value: value
        }
      });
      component.simulate('blur');
    }
  }, {
    key: "checkBox",
    value: function checkBox(selector) {
      var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var component = this.getComponent(selector);
      component.simulate('change', {
        target: {
          checked: checked
        }
      });
    }
  }, {
    key: "click",
    value: function click(selector) {
      var component = this.getComponent(selector);
      component.simulate('click');
    }
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var selector,
            component,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                selector = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : 'form';
                component = this.getComponent(selector);
                component.simulate('submit');
                _context3.next = 5;
                return this.refresh();

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }, {
    key: "createShallowWrapper",
    value: function createShallowWrapper() {
      this.shallow = {};
      var WrappedComponent = this.TestedComponent.wrappedComponent;
      this.shallow.wrapper = this.config.enzyme.mount(React.createElement(WrappedComponent, _extends({}, this.props, this.AppState)));
      this.shallow.instance = getInstance(this.shallow.wrapper);
    }
  }, {
    key: "mount",
    value: function () {
      var _mount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var mountOpts,
            validHooks,
            _iteratorNormalCompletion,
            _didIteratorError,
            _iteratorError,
            _iterator,
            _step,
            hook,
            initialMount,
            WrapperTree,
            _args4 = arguments;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                mountOpts = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                validHooks = this.config.getValidHooks(this, 'onBeforeMount');
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 5;
                _iterator = validHooks[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 14;
                  break;
                }

                hook = _step.value;
                _context4.next = 11;
                return hook.onBeforeMount(this, mountOpts);

              case 11:
                _iteratorNormalCompletion = true;
                _context4.next = 7;
                break;

              case 14:
                _context4.next = 20;
                break;

              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 20:
                _context4.prev = 20;
                _context4.prev = 21;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 23:
                _context4.prev = 23;

                if (!_didIteratorError) {
                  _context4.next = 26;
                  break;
                }

                throw _iteratorError;

              case 26:
                return _context4.finish(23);

              case 27:
                return _context4.finish(20);

              case 28:
                if (!this.onBeforeMount) {
                  _context4.next = 31;
                  break;
                }

                _context4.next = 31;
                return this.onBeforeMount(this);

              case 31:
                initialMount = this.initialMount || React.createElement(this.TestedComponent, this.props);
                WrapperTree = this.getWrappers().reduce(function (Tree, wrapper) {
                  var wrapperChildren = wrapper.renderChildren !== false && Tree;

                  if (wrapper.props) {
                    return React.createElement(wrapper.component, wrapper.props, wrapperChildren);
                  }

                  return Tree;
                }, initialMount);
                _context4.next = 35;
                return this.config.enzyme.mount(WrapperTree);

              case 35:
                this.wrapper = _context4.sent;

                if (this.opts.shallow) {
                  this.createShallowWrapper();
                }

                if (!(mountOpts.async !== false)) {
                  _context4.next = 45;
                  break;
                }

                if (!this.instance) {
                  _context4.next = 41;
                  break;
                }

                _context4.next = 41;
                return this.instance.componentDidMount();

              case 41:
                _context4.next = 43;
                return flushPromises();

              case 43:
                _context4.next = 45;
                return this.refresh();

              case 45:
                return _context4.abrupt("return", this);

              case 46:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 16, 20, 28], [21,, 23, 27]]);
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

Tester.Configuration = void 0;

/*
  Tester Configuration Class
*/
var ConfigurationClass =
/*#__PURE__*/
function () {
  function ConfigurationClass(argTester) {
    _classCallCheck(this, ConfigurationClass);

    this.enzyme = void 0;
    this.hooks = {};
    this.profiles = {
      // Default profile, each of it's properties can be overwritten.
      Default: {}
    };
    this.Tester = void 0;
    this.Tester = argTester;
    argTester.Configuration = this;
  }

  _createClass(ConfigurationClass, [{
    key: "configure",
    value: function configure(enzyme, config) {
      var _this = this;

      this.enzyme = enzyme;

      if (config.hooks) {
        config.hooks.forEach(function (hook) {
          _this.registerHook(hook);
        });
      }

      if (config.profiles) {
        config.profiles.forEach(function (profile) {
          _this.registerProfile(profile);
        });
      }

      this.createShortcuts();
      return this.Tester;
    }
    /*
      Create shortcuts for each global profiles
      Tester shortcuts allows you to use a specific global profile without having to pass it in in the options.
       E.g.
      Using a new Tester.Light(MyComponent) allows you to skip the initialization of
      Transport, localStorage + Session and AppState.
    */

  }, {
    key: "createShortcuts",
    value: function createShortcuts() {
      var _this2 = this;

      Object.keys(this.profiles).forEach(function (profileKey) {
        _this2.Tester[profileKey] = function (TestedComponent) {
          var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return new _this2.Tester(TestedComponent, _objectSpread({}, opts, {
            profile: _this2.profiles[profileKey]
          }));
        };
      });
    }
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

  }, {
    key: "registerHook",
    value: function registerHook(hook) {
      if (!hook.name) {
        throw new Error('Tester.registerHook() : A hooks must have a name.');
      }

      if (this.hooks[hook.name]) {
        throw new Error("Tester.registerHook() : A hook named \"".concat(hook.name, "\" already exist."));
      } // Validate hook properties here.


      this.hooks[hook.name] = hook;
    }
    /*
      Profiles,
      {
        // Profile keys must be hook names.
      }
    */

  }, {
    key: "registerProfile",
    value: function registerProfile(profile) {
      if (!profile.name) {
        throw new Error('Tester.registerHook() : A hooks must have a name.');
      }

      var capitalizedName = capitalize(profile.name);

      if (this.profiles[capitalizedName] && capitalizedName !== 'Default') {
        throw new Error("Tester.registerProfile() : A profile named \"".concat(capitalizedName, "\" already exist."));
      } // Validate profile properties here.
      //  - Does every key or the profile is a hook ?


      this.profiles[capitalizedName] = profile;
    }
  }, {
    key: "getValidHooks",
    value: function getValidHooks(tester, hookProp) {
      var hooks = [];
      Object.values(this.hooks).forEach(function (hook) {
        var valid = true;

        if (!tester.profile[hook.name]) {
          valid = false;
        }

        if (hookProp && !hook[hookProp]) {
          valid = false;
        }

        if (valid) {
          hooks.push(hook);
        }
      });
      return hooks;
    }
  }]);

  return ConfigurationClass;
}();

var TesterConfig = new ConfigurationClass(Tester);

export { Tester, TesterConfig };
//# sourceMappingURL=tester.esm.js.map
