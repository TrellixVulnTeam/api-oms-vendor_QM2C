'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatDictionaryKeyValue = exports.keysort = exports.signRequest = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _Common = require('../../types/Common');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KeyValueDictionary = _flowRuntime2.default.tdz(function () {
  return _Common.KeyValueDictionary;
});

/**
 * Calculate a signature hash
 * @param {string} appSecret
 * @param {string} apiPath e.g. /order/get
 * @param {Object} params
 * @return {string} signature hash
 */


var signRequest = _flowRuntime2.default.annotate(function signRequest(appSecret, apiPath, params) {
  var _appSecretType = _flowRuntime2.default.string();

  var _apiPathType = _flowRuntime2.default.string();

  var _paramsType = _flowRuntime2.default.ref(KeyValueDictionary);

  var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('apiPath', _apiPathType).assert(apiPath);

  _flowRuntime2.default.param('params', _paramsType).assert(params);

  // 1. Sort all request parameters (except the “sign” and parameters with byte array type)
  var keysortParams = keysort(params);

  // 2. Concatenate the sorted parameters into a string i.e. "key" + "value" + "key2" + "value2"...
  var concatString = concatDictionaryKeyValue(keysortParams);

  // 3. Add API name in front of the string in (2)
  var preSignString = apiPath + concatString;

  // 4. Encode the concatenated string in UTF-8 format & and make a digest (HMAC_SHA256)
  var hash = _crypto2.default.createHmac('sha256', appSecret).update(preSignString)
  // 5. Convert the digest to hexadecimal format
  .digest('hex');

  return _returnType.assert(hash.toUpperCase()); // must use upper case
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('apiPath', _flowRuntime2.default.string()), _flowRuntime2.default.param('params', _flowRuntime2.default.ref(KeyValueDictionary)), _flowRuntime2.default.return(_flowRuntime2.default.string())));

/**
 * Shallow copy an object with sorted keys
 * @param {Object} unordered
 * @return {Object} ordered
 */
var keysort = _flowRuntime2.default.annotate(function keysort(unordered) {
  var _unorderedType = _flowRuntime2.default.ref(KeyValueDictionary);

  var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(KeyValueDictionary));

  _flowRuntime2.default.param('unordered', _unorderedType).assert(unordered);

  return _returnType2.assert(Object.keys(unordered).sort().reduce(function (ordered, key) {
    ordered[key] = unordered[key];
    return ordered;
  }, {}));
}, _flowRuntime2.default.function(_flowRuntime2.default.param('unordered', _flowRuntime2.default.ref(KeyValueDictionary)), _flowRuntime2.default.return(_flowRuntime2.default.ref(KeyValueDictionary))));

/**
 * { key: value } => 'keyvalue'
 * @param {Object} dictionary
 * @return {string} concatString
 */
var concatDictionaryKeyValue = _flowRuntime2.default.annotate(function concatDictionaryKeyValue(object) {
  var _objectType = _flowRuntime2.default.ref(KeyValueDictionary);

  var _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.string());

  _flowRuntime2.default.param('object', _objectType).assert(object);

  return _returnType3.assert(Object.keys(object).reduce(function (concatString, key) {
    return concatString.concat(key + object[key]);
  }, ''));
}, _flowRuntime2.default.function(_flowRuntime2.default.param('object', _flowRuntime2.default.ref(KeyValueDictionary)), _flowRuntime2.default.return(_flowRuntime2.default.string())));

exports.signRequest = signRequest;
exports.keysort = keysort;
exports.concatDictionaryKeyValue = concatDictionaryKeyValue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9MYXphZGFSZXF1ZXN0L3NpZ25hdHVyZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJzaWduUmVxdWVzdCIsImFwcFNlY3JldCIsImFwaVBhdGgiLCJwYXJhbXMiLCJrZXlzb3J0UGFyYW1zIiwia2V5c29ydCIsImNvbmNhdFN0cmluZyIsImNvbmNhdERpY3Rpb25hcnlLZXlWYWx1ZSIsInByZVNpZ25TdHJpbmciLCJoYXNoIiwiY3J5cHRvIiwiY3JlYXRlSG1hYyIsInVwZGF0ZSIsImRpZ2VzdCIsInRvVXBwZXJDYXNlIiwidW5vcmRlcmVkIiwiT2JqZWN0Iiwia2V5cyIsInNvcnQiLCJyZWR1Y2UiLCJvcmRlcmVkIiwia2V5Iiwib2JqZWN0IiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiQUFDQTs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7QUFPQSxJQUFNQSw2Q0FBYyxxQkFDbEJDLFNBRGtCLEVBRWxCQyxPQUZrQixFQUdsQkMsTUFIa0IsRUFJUDtBQUFBLHVCQUhGLDhCQUdFOztBQUFBLHFCQUZKLDhCQUVJOztBQUFBLG9CQURMLDZDQUNLOztBQUFBLGlEQUFWLDhCQUFVOztBQUFBOztBQUFBOztBQUFBOztBQUNYO0FBQ0EsTUFBTUMsZ0JBQWdCQyxRQUFRRixNQUFSLENBQXRCOztBQUVBO0FBQ0EsTUFBTUcsZUFBZUMseUJBQXlCSCxhQUF6QixDQUFyQjs7QUFFQTtBQUNBLE1BQU1JLGdCQUFnQk4sVUFBVUksWUFBaEM7O0FBRUE7QUFDQSxNQUFNRyxPQUFPQyxpQkFDVkMsVUFEVSxDQUNDLFFBREQsRUFDV1YsU0FEWCxFQUVWVyxNQUZVLENBRUhKLGFBRkc7QUFHWDtBQUhXLEdBSVZLLE1BSlUsQ0FJSCxLQUpHLENBQWI7O0FBTUEsNEJBQU9KLEtBQUtLLFdBQUwsRUFBUCxFQWpCVyxDQWlCZTtBQUMzQixDQXRCSyxFQUFjLHdFQUNULDhCQURTLDBDQUVYLDhCQUZXLHlDQUdaLDZDQUhZLGdDQUluQiw4QkFKbUIsRUFBZCxDQUFOOztBQXdCQTs7Ozs7QUFLQSxJQUFNVCx5Q0FBVSxpQkFBQ1UsU0FBRCxFQUF1RDtBQUFBLHVCQUE3Qyw2Q0FBNkM7O0FBQUEsa0RBQXRCLDZDQUFzQjs7QUFBQTs7QUFDckUsNkJBQU9DLE9BQU9DLElBQVAsQ0FBWUYsU0FBWixFQUNKRyxJQURJLEdBRUpDLE1BRkksQ0FFRyxVQUFDQyxPQUFELEVBQVVDLEdBQVYsRUFBa0I7QUFDeEJELFlBQVFDLEdBQVIsSUFBZU4sVUFBVU0sR0FBVixDQUFmO0FBQ0EsV0FBT0QsT0FBUDtBQUNELEdBTEksRUFLRixFQUxFLENBQVA7QUFNRCxDQVBLLEVBQVUsd0VBQVUsNkNBQVYsZ0NBQStCLDZDQUEvQixFQUFWLENBQU47O0FBU0E7Ozs7O0FBS0EsSUFBTWIsMERBQTJCLGtDQUFDZSxNQUFELEVBQXdDO0FBQUEsb0JBQWpDLDZDQUFpQzs7QUFBQSxrREFBViw4QkFBVTs7QUFBQTs7QUFDdkUsNkJBQU9OLE9BQU9DLElBQVAsQ0FBWUssTUFBWixFQUFvQkgsTUFBcEIsQ0FDTCxVQUFDYixZQUFELEVBQWVlLEdBQWY7QUFBQSxXQUF1QmYsYUFBYWlCLE1BQWIsQ0FBb0JGLE1BQU1DLE9BQU9ELEdBQVAsQ0FBMUIsQ0FBdkI7QUFBQSxHQURLLEVBRUwsRUFGSyxDQUFQO0FBSUQsQ0FMSyxFQUEyQixxRUFBTyw2Q0FBUCxnQ0FBNEIsOEJBQTVCLEVBQTNCLENBQU47O1FBT1NyQixXLEdBQUFBLFc7UUFBYUssTyxHQUFBQSxPO1FBQVNFLHdCLEdBQUFBLHdCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbid1c2Ugc3RyaWN0J1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nXG5pbXBvcnQgdHlwZSB7IEtleVZhbHVlRGljdGlvbmFyeSB9IGZyb20gJ3NyYy90eXBlcy9Db21tb24nXG5cbi8qKlxuICogQ2FsY3VsYXRlIGEgc2lnbmF0dXJlIGhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcHBTZWNyZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcGlQYXRoIGUuZy4gL29yZGVyL2dldFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHJldHVybiB7c3RyaW5nfSBzaWduYXR1cmUgaGFzaFxuICovXG5jb25zdCBzaWduUmVxdWVzdCA9IChcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGFwaVBhdGg6IHN0cmluZyxcbiAgcGFyYW1zOiBLZXlWYWx1ZURpY3Rpb25hcnksXG4pOiBzdHJpbmcgPT4ge1xuICAvLyAxLiBTb3J0IGFsbCByZXF1ZXN0IHBhcmFtZXRlcnMgKGV4Y2VwdCB0aGUg4oCcc2lnbuKAnSBhbmQgcGFyYW1ldGVycyB3aXRoIGJ5dGUgYXJyYXkgdHlwZSlcbiAgY29uc3Qga2V5c29ydFBhcmFtcyA9IGtleXNvcnQocGFyYW1zKVxuXG4gIC8vIDIuIENvbmNhdGVuYXRlIHRoZSBzb3J0ZWQgcGFyYW1ldGVycyBpbnRvIGEgc3RyaW5nIGkuZS4gXCJrZXlcIiArIFwidmFsdWVcIiArIFwia2V5MlwiICsgXCJ2YWx1ZTJcIi4uLlxuICBjb25zdCBjb25jYXRTdHJpbmcgPSBjb25jYXREaWN0aW9uYXJ5S2V5VmFsdWUoa2V5c29ydFBhcmFtcylcblxuICAvLyAzLiBBZGQgQVBJIG5hbWUgaW4gZnJvbnQgb2YgdGhlIHN0cmluZyBpbiAoMilcbiAgY29uc3QgcHJlU2lnblN0cmluZyA9IGFwaVBhdGggKyBjb25jYXRTdHJpbmdcblxuICAvLyA0LiBFbmNvZGUgdGhlIGNvbmNhdGVuYXRlZCBzdHJpbmcgaW4gVVRGLTggZm9ybWF0ICYgYW5kIG1ha2UgYSBkaWdlc3QgKEhNQUNfU0hBMjU2KVxuICBjb25zdCBoYXNoID0gY3J5cHRvXG4gICAgLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGFwcFNlY3JldClcbiAgICAudXBkYXRlKHByZVNpZ25TdHJpbmcpXG4gICAgLy8gNS4gQ29udmVydCB0aGUgZGlnZXN0IHRvIGhleGFkZWNpbWFsIGZvcm1hdFxuICAgIC5kaWdlc3QoJ2hleCcpXG5cbiAgcmV0dXJuIGhhc2gudG9VcHBlckNhc2UoKSAvLyBtdXN0IHVzZSB1cHBlciBjYXNlXG59XG5cbi8qKlxuICogU2hhbGxvdyBjb3B5IGFuIG9iamVjdCB3aXRoIHNvcnRlZCBrZXlzXG4gKiBAcGFyYW0ge09iamVjdH0gdW5vcmRlcmVkXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9yZGVyZWRcbiAqL1xuY29uc3Qga2V5c29ydCA9ICh1bm9yZGVyZWQ6IEtleVZhbHVlRGljdGlvbmFyeSk6IEtleVZhbHVlRGljdGlvbmFyeSA9PiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh1bm9yZGVyZWQpXG4gICAgLnNvcnQoKVxuICAgIC5yZWR1Y2UoKG9yZGVyZWQsIGtleSkgPT4ge1xuICAgICAgb3JkZXJlZFtrZXldID0gdW5vcmRlcmVkW2tleV1cbiAgICAgIHJldHVybiBvcmRlcmVkXG4gICAgfSwge30pXG59XG5cbi8qKlxuICogeyBrZXk6IHZhbHVlIH0gPT4gJ2tleXZhbHVlJ1xuICogQHBhcmFtIHtPYmplY3R9IGRpY3Rpb25hcnlcbiAqIEByZXR1cm4ge3N0cmluZ30gY29uY2F0U3RyaW5nXG4gKi9cbmNvbnN0IGNvbmNhdERpY3Rpb25hcnlLZXlWYWx1ZSA9IChvYmplY3Q6IEtleVZhbHVlRGljdGlvbmFyeSk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLnJlZHVjZShcbiAgICAoY29uY2F0U3RyaW5nLCBrZXkpID0+IGNvbmNhdFN0cmluZy5jb25jYXQoa2V5ICsgb2JqZWN0W2tleV0pLFxuICAgICcnLFxuICApXG59XG5cbmV4cG9ydCB7IHNpZ25SZXF1ZXN0LCBrZXlzb3J0LCBjb25jYXREaWN0aW9uYXJ5S2V5VmFsdWUgfVxuIl19