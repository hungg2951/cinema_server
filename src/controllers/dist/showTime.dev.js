"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShowTimeByDate = exports.remove = exports.update = exports.read = exports.list = exports.create = void 0;

var _showTime = _interopRequireDefault(require("../models/showTime"));

var _movie = _interopRequireDefault(require("../models/movie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var moment = require('moment');

var create = function create(req, res) {
  var existShowTime, showTime;
  return regeneratorRuntime.async(function create$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_showTime["default"].find({
            endAt: {
              $gte: req.body.startAt
            },
            roomId: {
              $in: req.body.roomId
            }
          }).populate("roomId").populate("movieId").exec());

        case 3:
          existShowTime = _context.sent;

          if (!existShowTime.length) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Khung giờ hoặc phòng chiếu của phim đang bị trùng, vui lòng tạo khung giờ khác",
            existShowTime: existShowTime
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(new _showTime["default"](req.body).save());

        case 8:
          showTime = _context.sent;
          return _context.abrupt("return", res.json(showTime));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(400).json({
            message: "Don't create!"
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.create = create;

var list = function list(req, res) {
  var showTimes;
  return regeneratorRuntime.async(function list$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_showTime["default"].find({}).populate("movieId").populate({
            path: "roomId",
            populate: {
              path: "formatId"
            }
          }).sort({
            createdAt: -1
          }).exec());

        case 3:
          showTimes = _context2.sent;
          return _context2.abrupt("return", res.status(200).json(showTimes));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(400).json({
            message: "Don't find all!"
          }));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.list = list;

var read = function read(req, res) {
  var filter, showTime;
  return regeneratorRuntime.async(function read$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          filter = {
            _id: req.params.id
          };
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_showTime["default"].findOne(filter).populate("movieId").populate({
            path: "roomId",
            populate: {
              path: "formatId"
            }
          }).exec());

        case 4:
          showTime = _context3.sent;
          return _context3.abrupt("return", res.status(200).json(showTime));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(400).json({
            message: "Don't find one!"
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.read = read;

var update = function update(req, res) {
  var filter, doc, option, showTime;
  return regeneratorRuntime.async(function update$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          filter = {
            _id: req.params.id
          };
          doc = req.body;
          option = {
            "new": true
          };
          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(_showTime["default"].findOneAndUpdate(filter, doc, option).exec());

        case 6:
          showTime = _context4.sent;
          return _context4.abrupt("return", res.status(200).json(showTime));

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](3);
          console.log(_context4.t0);
          return _context4.abrupt("return", res.status(400).json({
            message: "Don't update"
          }));

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

exports.update = update;

var remove = function remove(req, res) {
  var filter, showTime;
  return regeneratorRuntime.async(function remove$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          filter = {
            _id: req.params.id
          };
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_showTime["default"].findOneAndDelete(filter).exec());

        case 4:
          showTime = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            message: "Delete Success!",
            showTime: showTime
          }));

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](1);
          return _context5.abrupt("return", res.status(400).json({
            message: "Don't remove!"
          }));

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.remove = remove;

var getShowTimeByDate = function getShowTimeByDate(req, res) {
  var startOfToday, showTimesByMoiveId;
  return regeneratorRuntime.async(function getShowTimeByDate$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          console.log("req id", req.params.id);
          console.log("req date", req.params.date);
          startOfToday = moment().startOf('day');
          _context6.next = 6;
          return regeneratorRuntime.awrap(_showTime["default"].find({
            movieId: req.params.id
          }, '-movieTypeId').populate({
            path: 'movieId',
            select: 'name _id'
          }).populate("roomId").exec());

        case 6:
          showTimesByMoiveId = _context6.sent;

          if (!(Array.isArray(showTimesByMoiveId) && showTimesByMoiveId.length > 0)) {
            _context6.next = 10;
            break;
          }

          _context6.next = 11;
          break;

        case 10:
          return _context6.abrupt("return", res.status(400).json({
            message: "Không có dữ liệu"
          }));

        case 11:
          return _context6.abrupt("return", res.json(showTimesByMoiveId));

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(400).json({
            message: "Không có dữ liệu"
          }));

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.getShowTimeByDate = getShowTimeByDate;