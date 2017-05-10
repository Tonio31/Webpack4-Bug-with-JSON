var OFF = 0, WARN = 1, ERROR = 2;

let eslintConfig = require('./.eslintrc');

let globalsToAdd = {
  "window": true,
  "expect": true,
  "sinon": true,
  "inject": true,
  "assert": true,
  "console": true
};

Object.assign(eslintConfig.globals, globalsToAdd);

eslintConfig.rules["angular/log"] = OFF;
eslintConfig.rules["camelcase"] = OFF;
eslintConfig.rules["no-console"] = OFF;
eslintConfig.rules["init-declarations"] = OFF;
eslintConfig.rules["angular/window-service"] = OFF;
eslintConfig.rules["array-bracket-spacing"] = OFF;
eslintConfig.rules["max-len"] = [ WARN, {
  "code": 200,
  "ignorePattern": "^\\s*it\\(\\'.*\\{",
  "ignoreComments": true
}];

module.exports = exports = eslintConfig;
