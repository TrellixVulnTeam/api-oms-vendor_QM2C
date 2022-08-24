'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SystemQueryParams = exports.SDKRequestMetaData = exports.Protocol = exports.HttpAction = undefined;

var _Common = require('../../types/Common');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KeyValueDictionary = _flowRuntime2.default.tdz(function () {
  return _Common.KeyValueDictionary;
});

var HttpAction = exports.HttpAction = _flowRuntime2.default.type('HttpAction', _flowRuntime2.default.union(_flowRuntime2.default.string('POST'), _flowRuntime2.default.string('GET'), _flowRuntime2.default.string('PUT'), _flowRuntime2.default.string('PATCH'), _flowRuntime2.default.string('DELETE')));

var Protocol = exports.Protocol = _flowRuntime2.default.type('Protocol', _flowRuntime2.default.union(_flowRuntime2.default.string('HTTPS'), _flowRuntime2.default.string('HTTP')));

/**
 * SDK defined request meta data for debug purpose
 * @typedef SDKRequestMetaData
 * @property {string} method HttpAction
 * @property {string} apiPath api endpoint path
 * @property {Object} payload input
 * @property {Object} query after sign
 */


var SDKRequestMetaData = exports.SDKRequestMetaData = _flowRuntime2.default.type('SDKRequestMetaData', _flowRuntime2.default.object(_flowRuntime2.default.property('method', HttpAction), _flowRuntime2.default.property('apiPath', _flowRuntime2.default.string()), _flowRuntime2.default.property('payload', _flowRuntime2.default.ref(KeyValueDictionary), true), _flowRuntime2.default.property('query', _flowRuntime2.default.ref(KeyValueDictionary))));

/**
 * Lazada API System Parameters
 * @typedef SystemQueryParams
 * @property {string} app_key :mandatory
 * @property {string} access_token :conditional
 * @property {string} timestamp :mandatory
 * @property {string} sign_method :mandatory 'sha256'
 * @property {string} sign :mandatory
 */


var SystemQueryParams = exports.SystemQueryParams = _flowRuntime2.default.type('SystemQueryParams', _flowRuntime2.default.object(_flowRuntime2.default.property('app_key', _flowRuntime2.default.string()), _flowRuntime2.default.property('access_token', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('timestamp', _flowRuntime2.default.string()), _flowRuntime2.default.property('sign_method', _flowRuntime2.default.string()), _flowRuntime2.default.property('sign', _flowRuntime2.default.string())));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9MYXphZGFSZXF1ZXN0L3R5cGVzL1JlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUlBOzs7Ozs7Ozs7Ozs7QUFFTywrRUFBa0Isa0VBQVMsbUNBQVQsRUFBaUIsbUNBQWpCLEVBQXlCLHFDQUF6QixFQUFtQyxzQ0FBbkMsQ0FBbEI7O0FBRUEseUVBQWdCLG1FQUFVLG9DQUFWLENBQWhCOztBQUVQOzs7Ozs7Ozs7O0FBUU8sdUdBQTBCLDZCQUMvQix5Q0FBUSxVQUFSLENBRCtCLEVBRS9CLDBDQUFTLDhCQUFULENBRitCLEVBRy9CLDBDQUFVLDZDQUFWLE9BSCtCLEVBSS9CLHdDQUFPLDZDQUFQLENBSitCLENBQTFCOztBQU9QOzs7Ozs7Ozs7OztBQVNPLG9HQUF5Qiw2QkFDOUIsMENBQVMsOEJBQVQsQ0FEOEIsRUFFOUIsK0NBQWUsOEJBQWYsT0FGOEIsRUFHOUIsNENBQVcsOEJBQVgsQ0FIOEIsRUFJOUIsOENBQWEsOEJBQWIsQ0FKOEIsRUFLOUIsdUNBQU0sOEJBQU4sQ0FMOEIsQ0FBekIiLCJmaWxlIjoiUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEtleVZhbHVlRGljdGlvbmFyeSB9IGZyb20gJ3NyYy90eXBlcy9Db21tb24nXG5cbmV4cG9ydCB0eXBlIEh0dHBBY3Rpb24gPSAnUE9TVCcgfCAnR0VUJyB8ICdQVVQnIHwgJ1BBVENIJyB8ICdERUxFVEUnXG5cbmV4cG9ydCB0eXBlIFByb3RvY29sID0gJ0hUVFBTJyB8ICdIVFRQJ1xuXG4vKipcbiAqIFNESyBkZWZpbmVkIHJlcXVlc3QgbWV0YSBkYXRhIGZvciBkZWJ1ZyBwdXJwb3NlXG4gKiBAdHlwZWRlZiBTREtSZXF1ZXN0TWV0YURhdGFcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXRob2QgSHR0cEFjdGlvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IGFwaVBhdGggYXBpIGVuZHBvaW50IHBhdGhcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXlsb2FkIGlucHV0XG4gKiBAcHJvcGVydHkge09iamVjdH0gcXVlcnkgYWZ0ZXIgc2lnblxuICovXG5leHBvcnQgdHlwZSBTREtSZXF1ZXN0TWV0YURhdGEgPSB7XG4gIG1ldGhvZDogSHR0cEFjdGlvbixcbiAgYXBpUGF0aDogc3RyaW5nLFxuICBwYXlsb2FkPzogS2V5VmFsdWVEaWN0aW9uYXJ5LFxuICBxdWVyeTogS2V5VmFsdWVEaWN0aW9uYXJ5LFxufVxuXG4vKipcbiAqIExhemFkYSBBUEkgU3lzdGVtIFBhcmFtZXRlcnNcbiAqIEB0eXBlZGVmIFN5c3RlbVF1ZXJ5UGFyYW1zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYXBwX2tleSA6bWFuZGF0b3J5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYWNjZXNzX3Rva2VuIDpjb25kaXRpb25hbFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRpbWVzdGFtcCA6bWFuZGF0b3J5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gc2lnbl9tZXRob2QgOm1hbmRhdG9yeSAnc2hhMjU2J1xuICogQHByb3BlcnR5IHtzdHJpbmd9IHNpZ24gOm1hbmRhdG9yeVxuICovXG5leHBvcnQgdHlwZSBTeXN0ZW1RdWVyeVBhcmFtcyA9IHtcbiAgYXBwX2tleTogc3RyaW5nLFxuICBhY2Nlc3NfdG9rZW4/OiBzdHJpbmcsXG4gIHRpbWVzdGFtcDogc3RyaW5nLFxuICBzaWduX21ldGhvZDogc3RyaW5nLFxuICBzaWduOiBzdHJpbmcsXG59XG4iXX0=