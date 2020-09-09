'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

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

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

// Asynchronously iterate through an object's values
// Uses for...of if the runtime supports it, otherwise iterates until length on a copy
function _forOf(target, body, check) {
	if (typeof target[_iteratorSymbol] === "function") {
		var iterator = target[_iteratorSymbol](), step, pact, reject;
		function _cycle(result) {
			try {
				while (!(step = iterator.next()).done && (!check || !check())) {
					result = body(step.value);
					if (result && result.then) {
						if (_isSettledPact(result)) {
							result = result.v;
						} else {
							result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
							return;
						}
					}
				}
				if (pact) {
					_settle(pact, 1, result);
				} else {
					pact = result;
				}
			} catch (e) {
				_settle(pact || (pact = new _Pact()), 2, e);
			}
		}
		_cycle();
		if (iterator.return) {
			var _fixup = function(value) {
				try {
					if (!step.done) {
						iterator.return();
					}
				} catch(e) {
				}
				return value;
			};
			if (pact && pact.then) {
				return pact.then(_fixup, function(e) {
					throw _fixup(e);
				});
			}
			_fixup();
		}
		return pact;
	}
	// No support for Symbol.iterator
	if (!("length" in target)) {
		throw new TypeError("Object is not iterable");
	}
	// Handle live collections properly
	var values = [];
	for (var i = 0; i < target.length; i++) {
		values.push(target[i]);
	}
	return _forTo(values, function(i) { return body(values[i]); }, check);
}

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

var flushPromises = function flushPromises() {
  try {
    return Promise.resolve(new Promise(function (resolve, _reject) {
      return setImmediate(resolve);
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var sleep = function sleep(ms) {
  if (ms === void 0) {
    ms = 0;
  }

  try {
    return Promise.resolve(new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

var NullComponent = function NullComponent(props) {
  return React__default.createElement(React.Fragment, Object.assign({}, props));
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
*/

/**
 * Testing utility class to mount a specific component with it's required wrappers.
 */


var Tester = /*#__PURE__*/function () {
  function Tester(TestedComponent, opts) {
    var _this = this;

    if (opts === void 0) {
      opts = {};
    }

    this.config = Tester.Configuration;
    this.initialMount = opts.mount;
    this.onBeforeMount = opts.onBeforeMount;
    this.opts = opts;
    this.props = opts.props || {};
    this.TestedComponent = TestedComponent; // Allow testing without a main TestedComponent. This require an initialMount.

    if (!this.TestedComponent && this.initialMount) {
      this.TestedComponent = NullComponent;
      this.initialMount = React__default.createElement(this.TestedComponent, null, this.initialMount);
    } // Loop through hooks onInit(),


    var validHooks = this.config.getValidHooks('onInit');
    validHooks.forEach(function (hook) {
      return hook.onInit(_this);
    });
  }

  var _proto = Tester.prototype;

  _proto.getWrappers = function getWrappers() {
    var _this2 = this;

    var wrappers = [];
    this.config.getValidHooks('component').forEach(function (hook) {
      wrappers.push({
        component: hook.component,
        name: hook.name,
        props: getValue(_this2, hook.props)
      });
    });
    return wrappers;
  };

  _proto.debug = function debug() {
    // tslint:disable-next-line:no-console
    console.log(this.wrapper.debug());
  };

  _proto.html = function html() {
    return this.component.html();
  };

  _proto.text = function text() {
    return this.component.text();
  };

  _proto.find = function find(selector) {
    return this.wrapper.find(selector);
  };

  _proto.update = function update() {
    return this.wrapper.update();
  };

  _proto.sleep = function sleep$1(ms) {
    try {
      return Promise.resolve(sleep(ms)).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.refresh = function refresh(ms) {
    try {
      var _this4 = this;

      return Promise.resolve(sleep(ms)).then(function () {
        _this4.update();
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getComponent = function getComponent(selector) {
    return isString(selector) ? this.find(selector).first() : selector;
  };

  _proto.changeInput = function changeInput(selector, value) {
    var component = this.getComponent(selector);
    component.simulate('focus');
    component.simulate('change', {
      target: {
        value: value
      }
    });
    component.simulate('blur');
  };

  _proto.checkBox = function checkBox(selector, checked) {
    if (checked === void 0) {
      checked = true;
    }

    var component = this.getComponent(selector);
    component.simulate('change', {
      target: {
        checked: checked
      }
    });
  };

  _proto.click = function click(selector) {
    var component = this.getComponent(selector);
    component.simulate('click');
  };

  _proto.submit = function submit(selector) {
    if (selector === void 0) {
      selector = 'form';
    }

    try {
      var _this6 = this;

      var component = _this6.getComponent(selector);

      component.simulate('submit');
      return Promise.resolve(_this6.refresh()).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.mount = function mount(mountOpts) {
    if (mountOpts === void 0) {
      mountOpts = {};
    }

    try {
      var _temp8 = function _temp8() {
        function _temp5() {
          var initialMount = _this8.initialMount || React__default.createElement(_this8.TestedComponent, Object.assign({}, _this8.props));

          var WrapperTree = _this8.getWrappers().reduce(function (Tree, wrapper) {
            var wrapperChildren = wrapper.renderChildren !== false && Tree;

            if (wrapper.props) {
              return React__default.createElement(wrapper.component, Object.assign({}, wrapper.props), wrapperChildren);
            }

            return Tree;
          }, initialMount);

          return Promise.resolve(_this8.config.enzyme.mount(WrapperTree)).then(function (_this7$config$enzyme$) {
            _this8.wrapper = _this7$config$enzyme$;

            var _temp3 = function () {
              if (mountOpts.async !== false) {
                var _temp10 = function _temp10() {
                  // See https://github.com/enzymejs/enzyme/issues/1587
                  return Promise.resolve(flushPromises()).then(function () {
                    return Promise.resolve(_this8.refresh()).then(function () {});
                  });
                };

                var _temp11 = function () {
                  if (_this8.instance) {
                    return Promise.resolve(_this8.instance.componentDidMount()).then(function () {});
                  }
                }();

                return _temp11 && _temp11.then ? _temp11.then(_temp10) : _temp10(_temp11);
              }
            }();

            return _temp3 && _temp3.then ? _temp3.then(function () {
              return _this8;
            }) : _this8;
          });
        }

        var _temp4 = function () {
          if (_this8.onBeforeMount) {
            return Promise.resolve(_this8.onBeforeMount(_this8)).then(function () {});
          }
        }();

        // Allows you to fetch data to set as props, prepare extra stores, etc.
        return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
      };

      var _this8 = this;

      var validHooks = _this8.config.getValidHooks('onBeforeMount');

      var _temp9 = _forOf(validHooks, function (hook) {
        return Promise.resolve(hook.onBeforeMount(_this8, mountOpts)).then(function () {});
      });

      return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(_temp8) : _temp8(_temp9));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _createClass(Tester, [{
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
  Tester Configuration Class
*/
var ConfigurationClass = /*#__PURE__*/function () {
  function ConfigurationClass(argTester) {
    this.hooks = {};
    this.Tester = argTester;
    argTester.Configuration = this;
  }

  var _proto = ConfigurationClass.prototype;

  _proto.configure = function configure(enzyme, config) {
    var _this = this;

    this.enzyme = enzyme;

    if (config.hooks) {
      config.hooks.forEach(function (hook) {
        _this.registerHook(hook);
      });
    }

    return this.Tester;
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
  ;

  _proto.registerHook = function registerHook(hook) {
    if (!hook.name) {
      throw new Error('Tester.registerHook() : A hooks must have a name.');
    }

    if (this.hooks[hook.name]) {
      throw new Error("Tester.registerHook() : A hook named \"" + hook.name + "\" already exist.");
    } // Validate hook properties here.


    this.hooks[hook.name] = hook;
  };

  _proto.getValidHooks = function getValidHooks(hookProp) {
    var hooks = [];
    Object.values(this.hooks).forEach(function (hook) {
      var valid = true;

      if (hookProp && !hook[hookProp]) {
        valid = false;
      }

      if (valid) {
        hooks.push(hook);
      }
    });
    return hooks;
  };

  return ConfigurationClass;
}();

var TesterConfig = /*#__PURE__*/new ConfigurationClass(Tester);

exports.Tester = Tester;
exports.TesterConfig = TesterConfig;
//# sourceMappingURL=tester.cjs.development.js.map
