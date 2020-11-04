"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var filter = function filter(config, message_id) {
  return message_id === config.roles.message_id;
};

var prepare = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(config, reaction) {
    var id;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = reaction.message.id;

            if (filter(config, id)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            if (!reaction.partial) {
              _context.next = 13;
              break;
            }

            _context.prev = 4;
            _context.next = 7;
            return reaction.fetch();

          case 7:
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](4);
            console.error('Something went wrong when fetching the message: ', _context.t0);
            return _context.abrupt("return");

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 9]]);
  }));

  return function prepare(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var updateRole = function updateRole(config, reaction, user, isAdd) {
  prepare(config, reaction);
  var pair = config.reactionsToRoleMap.find(function (pair) {
    return pair.emoji === reaction._emoji.name;
  });

  if (pair) {
    var channel = reaction.message.channel;
    var role = channel.guild.roles.cache.find(function (role) {
      return role.name === pair.role;
    });
    var member = channel.guild.members.cache.find(function (member) {
      return member.id === user.id;
    }); // If the role is not assigned...

    if (!member.roles.cache.has(role.id)) {
      // ... and we want it to be, then we add it
      if (isAdd) {
        member.roles.add(role);
        console.log("Successfully added role ".concat(role.name, " to ").concat(member.nickname || member.user.username, "!"));
      } // Otherwise, we don't do anything.
      else {
          console.log("".concat(role.name, " is not assigned to ").concat(member.nickname || member.user.username, "!"));
        }
    } // If the role is assigned...
    else {
        // ... but we don't want it to be, then we remove it
        if (!isAdd) {
          member.roles.remove(role);
          console.log("Successfully removed role ".concat(role.name, " to ").concat(member.nickname || member.user.username, "!"));
        } // Otherwise, guess what
        else {
            console.log("".concat(role.name, " is already assigned to ").concat(member.nickname || member.user.username, "!"));
          }
      }
  } else {
    console.error("".concat(reaction._emoji.name, " doesn't enable any role."));
  }
};

var _default = updateRole;
exports["default"] = _default;