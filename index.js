"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/tester.min.js");
} else {
  module.exports = require("./src/tester.js");
}