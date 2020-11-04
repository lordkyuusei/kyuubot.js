"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var guildMemberAdd = function guildMemberAdd(config, member) {
  var guest = config.reactionsToRoleMap.find(function (role) {
    return role.emoji === '🍁';
  });
  var role = member.guild.roles.cache.find(function (role) {
    return role.name === guest.name;
  });
  member.roles.add(role);
  console.log("Successfully added role ".concat(role.name, " to ").concat(member.nickname || member.user.username, "!"));
};

var _default = guildMemberAdd;
exports["default"] = _default;