'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Venture = exports.AccessToken = exports.KeyValueDictionary = undefined;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KeyValueDictionary = exports.KeyValueDictionary = _flowRuntime2.default.type('KeyValueDictionary', _flowRuntime2.default.object(_flowRuntime2.default.indexer('key', _flowRuntime2.default.string(), _flowRuntime2.default.any())));

var AccessToken = exports.AccessToken = _flowRuntime2.default.type('AccessToken', _flowRuntime2.default.object(_flowRuntime2.default.property('access_token', _flowRuntime2.default.string())));

var Venture = exports.Venture = _flowRuntime2.default.type('Venture', _flowRuntime2.default.union(_flowRuntime2.default.string('SINGAPORE'), _flowRuntime2.default.string('THAILAND'), _flowRuntime2.default.string('MALAYSIA'), _flowRuntime2.default.string('VIETNAM'), _flowRuntime2.default.string('PHILIPPINES'), _flowRuntime2.default.string('INDONESIA')));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9Db21tb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUdPLHVHQUEwQiw2QkFDL0IscUNBQU0sOEJBQU4sRUFBZSwyQkFBZixDQUQrQixDQUExQjs7QUFJQSxrRkFBbUIsNkJBQ3hCLCtDQUFjLDhCQUFkLENBRHdCLENBQW5COztBQUlBLHNFQUNMLDRCQUFFLHlDQUFGLEVBQ0Usd0NBREYsRUFFRSx3Q0FGRixFQUdFLHVDQUhGLEVBSUUsMkNBSkYsRUFLRSx5Q0FMRixDQURLIiwiZmlsZSI6IkNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuZXhwb3J0IHR5cGUgS2V5VmFsdWVEaWN0aW9uYXJ5ID0ge1xuICBba2V5OiBzdHJpbmddOiBhbnksIC8vIHN0cmluZyB8IG51bWJlcixcbn1cblxuZXhwb3J0IHR5cGUgQWNjZXNzVG9rZW4gPSB7XG4gIGFjY2Vzc190b2tlbjogc3RyaW5nLFxufVxuXG5leHBvcnQgdHlwZSBWZW50dXJlID1cbiAgfCAnU0lOR0FQT1JFJ1xuICB8ICdUSEFJTEFORCdcbiAgfCAnTUFMQVlTSUEnXG4gIHwgJ1ZJRVROQU0nXG4gIHwgJ1BISUxJUFBJTkVTJ1xuICB8ICdJTkRPTkVTSUEnXG4iXX0=