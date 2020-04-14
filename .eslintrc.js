module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true,
    "jest/globals": true
  },
  "extends": "eslint:recommended",
  "plugins": ["jest"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "indent": ["error", 2]
  }
}