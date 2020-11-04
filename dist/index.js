"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = _interopRequireDefault(require("discord.js"));

var _config = _interopRequireDefault(require("../config.json"));

var _guildArrivalComponent = _interopRequireDefault(require("./components/guildArrivalComponent.js"));

var _commandsComponent = _interopRequireDefault(require("./components/commandsComponent.js"));

var _roleManagementComponent = _interopRequireDefault(require("./components/roleManagementComponent.js"));

var argv = process.argv.slice(2);
var arg = argv[0];
var token = argv[1];

if (arg === '--token') {
  _config["default"].meta.token = token;
}

var client = new _discord["default"].Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

var handleMessage = function handleMessage(config, message) {
  var _config$meta = config.meta,
      prefix = _config$meta.prefix,
      commands = _config$meta.commands;
  var content = message.content;
  var command = commands.find(function (command) {
    return content.startsWith("".concat(prefix).concat(command.name));
  });

  if (command) {
    (0, _commandsComponent["default"])(command, message);
  }
};

client.once('ready', function () {});
client.on('guildMemberAdd', function (member) {
  return (0, _guildArrivalComponent["default"])(_config["default"], member);
});
client.on('messageReactionAdd', function (reaction, user) {
  return (0, _roleManagementComponent["default"])(_config["default"], reaction, user, true);
});
client.on('messageReactionRemove', function (reaction, user) {
  return (0, _roleManagementComponent["default"])(_config["default"], reaction, user, false);
});
client.on('message', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", handleMessage(_config["default"], message));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
client.login(_config["default"].meta.token);