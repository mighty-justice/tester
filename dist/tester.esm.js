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
  return instance.wrappedInstance || instance;
}

function getValue(tester, value) {
  return typeof value === 'function' ? value(tester) : value;
}

function sleep() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
  Tester Configuration Class
*/

var ConfigurationClass =
/*#__PURE__*/
function () {
  function ConfigurationClass(Tester) {
    _classCallCheck(this, ConfigurationClass);

    _defineProperty(this, "enzyme", void 0);

    _defineProperty(this, "hooks", {});

    _defineProperty(this, "profiles", {
      // Default profile, each of it's properties can be overwritten.
      Default: {}
    });

    _defineProperty(this, "Tester", void 0);

    this.Tester = Tester;
    Tester.Configuration = this;
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

      this.createShortcuts(); // Make it globally accessible

      global.Tester = this.Tester;
      return this.Tester;
    }
    /*
      Create shortcuts for each global profiles
      Tester shortcuts allows you to use a specific global profile without having to pass it in in the options.
       E.g.
      Using a new Tester.Light(MyComponent) allows you to skip the initialization of Transport, localStorage + Session and AppState.
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
 *
 * @param {ReactComponent} TestedComponent
 * @param {Object} options
 * @returns {Tester}
 */


var Tester =
/*#__PURE__*/
function () {
  function Tester(TestedComponent) {
    var _this = this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tester);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "initialMount", void 0);

    _defineProperty(this, "onBeforeMount", void 0);

    _defineProperty(this, "opts", void 0);

    _defineProperty(this, "profile", void 0);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "shallow", void 0);

    _defineProperty(this, "TestedComponent", void 0);

    _defineProperty(this, "wrapper", void 0);

    _defineProperty(this, "wrappers", void 0);

    this.config = this.constructor.Configuration;
    this.opts = opts;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.profile = _objectSpread({}, this.config.profiles.Default, opts.profile);
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent; // Allow testing without a main TestedComponent. This require an initialMount.

    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = React.createElement(this.TestedComponent, null, this.initialMount);
    } // Loop through hooks onInit(),


    this.config.getValidHooks(this, 'onInit').forEach(function (hook) {
      hook.onInit(_this);
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
    key: "createShallowWrapper",
    value: function createShallowWrapper() {
      this.shallow = {};
      this.shallow.wrapper = this.config.enzyme.mount(React.createElement(this.TestedComponent.wrappedComponent, _extends({}, this.props, this.AppState)));
      this.shallow.instance = getInstance(this.shallow.wrapper);
    }
  }, {
    key: "mount",
    value: function () {
      var _mount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var mountOpts,
            _iteratorNormalCompletion,
            _didIteratorError,
            _iteratorError,
            _iterator,
            _step,
            hook,
            initialMount,
            WrapperTree,
            _args3 = arguments;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                mountOpts = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
                // Loop through hooks onBeforeMount(),
                // This MUST be a regular for () loop to not throw the promise away. (forEach won't work)
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 4;
                _iterator = this.config.getValidHooks(this, 'onBeforeMount')[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 13;
                  break;
                }

                hook = _step.value;
                _context3.next = 10;
                return hook.onBeforeMount(this, mountOpts);

              case 10:
                _iteratorNormalCompletion = true;
                _context3.next = 6;
                break;

              case 13:
                _context3.next = 19;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 19:
                _context3.prev = 19;
                _context3.prev = 20;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 22:
                _context3.prev = 22;

                if (!_didIteratorError) {
                  _context3.next = 25;
                  break;
                }

                throw _iteratorError;

              case 25:
                return _context3.finish(22);

              case 26:
                return _context3.finish(19);

              case 27:
                if (!this.onBeforeMount) {
                  _context3.next = 30;
                  break;
                }

                _context3.next = 30;
                return this.onBeforeMount(this);

              case 30:
                initialMount = this.initialMount || React.createElement(this.TestedComponent, this.props);
                WrapperTree = this.getWrappers().reduce(function (Tree, wrapper) {
                  var wrapperChildren = wrapper.renderChildren !== false && Tree;

                  if (wrapper.props) {
                    return React.createElement(wrapper.component, wrapper.props, wrapperChildren);
                  }

                  return Tree;
                }, initialMount);
                _context3.next = 34;
                return this.config.enzyme.mount(WrapperTree);

              case 34:
                this.wrapper = _context3.sent;

                if (this.opts.shallow) {
                  this.createShallowWrapper();
                }

                if (!mountOpts.async) {
                  _context3.next = 40;
                  break;
                }

                _context3.next = 39;
                return this.sleep();

              case 39:
                this.update();

              case 40:
                return _context3.abrupt("return", this);

              case 41:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 15, 19, 27], [20,, 22, 26]]);
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

var TesterConfig = new ConfigurationClass(Tester);

export { TesterConfig };
