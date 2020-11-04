"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _messages = _interopRequireDefault(require("../store/messages.js"));

var _ytdlCore = _interopRequireDefault(require("ytdl-core"));

var playMusicSafeguard = function playMusicSafeguard(_ref, message) {
  var args = _ref.args;
  return musicCommandChecks(message) === true ? playMusic(args, message) : null;
};

var playMusic = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(args, message) {
    var voiceChannel, command, theme, songDetails, song, queue, queueConstruct, connection, serverQueue, dispatcher;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            voiceChannel = message.member.voice.channel;
            command = message.content.split(' ');
            theme = musicArguments.find(function (theme) {
              return Object.keys(theme)[0] === command[1];
            });
            _context.next = 5;
            return _ytdlCore["default"].getBasicInfo(theme[command[1]]);

          case 5:
            _context.next = 7;
            return _context.sent.videoDetails;

          case 7:
            songDetails = _context.sent;
            console.log(songDetails);
            song = {
              title: songDetails.title,
              url: songDetails.video_url
            };
            queue = new Map();
            queueConstruct = {
              textChannel: message.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [song],
              volume: 5,
              playing: true
            };
            queue.set(message.guild.id, queueConstruct);
            _context.prev = 13;
            _context.next = 16;
            return voiceChannel.join();

          case 16:
            connection = _context.sent;
            queueConstruct.connection = connection;
            serverQueue = queue.get(message.guild.id);

            if (queueConstruct.songs[0]) {
              _context.next = 23;
              break;
            }

            voiceChannel.leave();
            queue["delete"](message.guild.id);
            return _context.abrupt("return");

          case 23:
            dispatcher = serverQueue.connection.play((0, _ytdlCore["default"])(song.url)).on("finish", function () {
              serverQueue.songs.shift();
            }).on("error", function (error) {
              return console.error(error);
            });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send("Ye want'd me to start playing: **".concat(song.title, "**"));
            _context.next = 33;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](13);
            console.log(_context.t0);
            queue["delete"](message.guild.id);
            return _context.abrupt("return", message.channel.send(_messages["default"].err.ERR_MUSIC_CRASH));

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[13, 28]]);
  }));

  return function playMusic(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var musicCommandChecks = function musicCommandChecks(message) {
  var voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(_messages["default"].err.ERR_NO_VOICE_CHANNEL);
  }

  var permissions = voiceChannel.permissionsFor(message.client.user);

  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(_messages["default"].err.ERR_NO_VOICE_PERMISSIONS);
  }

  var command = message.content.split(' ');

  if (command.length !== 2) {
    return message.channel.send(_messages["default"].err.ERR_WRONG_MUSIC_COMMAND);
  }

  var theme = musicArguments.find(function (theme) {
    return Object.keys(theme)[0] === command[1];
  });

  if (!theme) {
    return message.channel.send(_messages["default"].err.ERR_WRONG_MUSIC_ARG);
  }

  return true;
};

var stopMusicSafeguard = function stopMusicSafeguard(message) {};

var musicCommands = [{
  "amb": playMusicSafeguard
}, {
  "stop": stopMusicSafeguard
}];
var musicArguments = [{
  "test": "https://youtu.be/55-ERhJEfaM"
}, {
  "among_us": "https://www.youtube.com/watch?v=55-ERhJEfaM"
}];

var handleCommands = function handleCommands(command, message) {
  var action = musicCommands.find(function (action) {
    return Object.keys(action)[0] === command.name;
  });

  if (action) {
    action[command.name](command, message);
  } else {
    console.log("Unrecognized ".concat(command));
  }
};

var _default = handleCommands;
exports["default"] = _default;