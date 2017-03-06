var OFF = 0, WARN = 1, ERROR = 2;

let eslintConfig = require('./.eslintrc');

let globalsToAdd = {
  "window": true,
  "expect": true,
  "sinon": true,
  "inject": true,
  "assert": true
};

Object.assign(eslintConfig.globals, globalsToAdd);


eslintConfig.rules["init-declarations"] = OFF;
eslintConfig.rules["angular/window-service"] = OFF;
eslintConfig.rules["array-bracket-spacing"] = OFF;
eslintConfig.rules["max-len"] = [WARN, 200];

module.exports = exports = eslintConfig;
