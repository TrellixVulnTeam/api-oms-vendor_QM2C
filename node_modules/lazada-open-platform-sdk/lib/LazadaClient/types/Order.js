'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderStatus = undefined;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrderStatus = exports.OrderStatus = _flowRuntime2.default.type('OrderStatus', _flowRuntime2.default.union(_flowRuntime2.default.string('pending'), _flowRuntime2.default.string('canceled'), _flowRuntime2.default.string('ready_to_ship'), _flowRuntime2.default.string('delivered'), _flowRuntime2.default.string('returned'), _flowRuntime2.default.string('shipped'), _flowRuntime2.default.string('failed')));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9MYXphZGFDbGllbnQvdHlwZXMvT3JkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUdPLGtGQUNMLDRCQUFFLHVDQUFGLEVBQ0Usd0NBREYsRUFFRSw2Q0FGRixFQUdFLHlDQUhGLEVBSUUsd0NBSkYsRUFLRSx1Q0FMRixFQU1FLHNDQU5GLENBREsiLCJmaWxlIjoiT3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cbmV4cG9ydCB0eXBlIE9yZGVyU3RhdHVzID1cbiAgfCAncGVuZGluZydcbiAgfCAnY2FuY2VsZWQnXG4gIHwgJ3JlYWR5X3RvX3NoaXAnXG4gIHwgJ2RlbGl2ZXJlZCdcbiAgfCAncmV0dXJuZWQnXG4gIHwgJ3NoaXBwZWQnXG4gIHwgJ2ZhaWxlZCdcbiJdfQ==