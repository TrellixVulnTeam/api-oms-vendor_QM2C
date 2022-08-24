'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazadaOpenPlatformAPIResponse = exports.LazadaOpenPlatformAPIResponseError = exports.LazadaOpenPlatformAPIResponseSuccess = undefined;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Lazada API success response object
 * @typedef LazadaOpenPlatformAPIResponseSuccess
 * @property {string} request_id hash id
 * @property {string} code should always == "0"
 * @property {Object} data
 */
var LazadaOpenPlatformAPIResponseSuccess = exports.LazadaOpenPlatformAPIResponseSuccess = _flowRuntime2.default.type('LazadaOpenPlatformAPIResponseSuccess', _flowRuntime2.default.object(_flowRuntime2.default.property('request_id', _flowRuntime2.default.string()), _flowRuntime2.default.property('code', _flowRuntime2.default.string('0')), _flowRuntime2.default.property('data', _flowRuntime2.default.any())));

/**
 * Lazada API error response object
 * @typedef LazadaOpenPlatformAPIResponseError
 * @property {string} request_id hash id
 * @property {string} code non "0" value
 * @property {string} type SYSTEM (API platform error), ISV (Business data error), ISP (Backend service error)
 * @property {string} message error message
 */


var LazadaAPICommonErrorType = _flowRuntime2.default.type('LazadaAPICommonErrorType', _flowRuntime2.default.union(_flowRuntime2.default.string('SYSTEM'), _flowRuntime2.default.string('ISV'), _flowRuntime2.default.string('ISP')));

var LazadaOpenPlatformAPIResponseError = exports.LazadaOpenPlatformAPIResponseError = _flowRuntime2.default.type('LazadaOpenPlatformAPIResponseError', _flowRuntime2.default.object(_flowRuntime2.default.property('request_id', _flowRuntime2.default.string()), _flowRuntime2.default.property('code', _flowRuntime2.default.string()), _flowRuntime2.default.property('type', _flowRuntime2.default.union(LazadaAPICommonErrorType, _flowRuntime2.default.string())), _flowRuntime2.default.property('message', _flowRuntime2.default.string())));

var LazadaOpenPlatformAPIResponse = exports.LazadaOpenPlatformAPIResponse = _flowRuntime2.default.type('LazadaOpenPlatformAPIResponse', _flowRuntime2.default.union(LazadaOpenPlatformAPIResponseSuccess, LazadaOpenPlatformAPIResponseError));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9MYXphZGFSZXF1ZXN0L3R5cGVzL1Jlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFJQTs7Ozs7OztBQU9PLDZKQUE0Qyw2QkFDakQsNkNBQVksOEJBQVosQ0FEaUQsRUFFakQsdUNBQU0saUNBQU4sQ0FGaUQsRUFHakQsdUNBQU0sMkJBQU4sQ0FIaUQsQ0FBNUM7O0FBTVA7Ozs7Ozs7Ozs7QUFRQSxzRkFBZ0Msb0VBQVcsbUNBQVgsRUFBbUIsbUNBQW5CLENBQWhDOztBQUNPLHVKQUEwQyw2QkFDL0MsNkNBQVksOEJBQVosQ0FEK0MsRUFFL0MsdUNBQU0sOEJBQU4sQ0FGK0MsRUFHL0MsdUNBQU0sc0RBQTJCLDhCQUEzQixDQUFOLENBSCtDLEVBSS9DLDBDQUFTLDhCQUFULENBSitDLENBQTFDOztBQU9BLHdJQUNMLDRCQUFFLG9DQUFGLEVBQ0Usa0NBREYsQ0FESyIsImZpbGUiOiJSZXNwb25zZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKipcbiAqIExhemFkYSBBUEkgc3VjY2VzcyByZXNwb25zZSBvYmplY3RcbiAqIEB0eXBlZGVmIExhemFkYU9wZW5QbGF0Zm9ybUFQSVJlc3BvbnNlU3VjY2Vzc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IHJlcXVlc3RfaWQgaGFzaCBpZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGUgc2hvdWxkIGFsd2F5cyA9PSBcIjBcIlxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGFcbiAqL1xuZXhwb3J0IHR5cGUgTGF6YWRhT3BlblBsYXRmb3JtQVBJUmVzcG9uc2VTdWNjZXNzID0ge1xuICByZXF1ZXN0X2lkOiBzdHJpbmcsXG4gIGNvZGU6ICcwJyxcbiAgZGF0YTogYW55LFxufVxuXG4vKipcbiAqIExhemFkYSBBUEkgZXJyb3IgcmVzcG9uc2Ugb2JqZWN0XG4gKiBAdHlwZWRlZiBMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZUVycm9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcmVxdWVzdF9pZCBoYXNoIGlkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY29kZSBub24gXCIwXCIgdmFsdWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIFNZU1RFTSAoQVBJIHBsYXRmb3JtIGVycm9yKSwgSVNWIChCdXNpbmVzcyBkYXRhIGVycm9yKSwgSVNQIChCYWNrZW5kIHNlcnZpY2UgZXJyb3IpXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWVzc2FnZSBlcnJvciBtZXNzYWdlXG4gKi9cbnR5cGUgTGF6YWRhQVBJQ29tbW9uRXJyb3JUeXBlID0gJ1NZU1RFTScgfCAnSVNWJyB8ICdJU1AnXG5leHBvcnQgdHlwZSBMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZUVycm9yID0ge1xuICByZXF1ZXN0X2lkOiBzdHJpbmcsXG4gIGNvZGU6IHN0cmluZyxcbiAgdHlwZTogTGF6YWRhQVBJQ29tbW9uRXJyb3JUeXBlIHwgc3RyaW5nLFxuICBtZXNzYWdlOiBzdHJpbmcsXG59XG5cbmV4cG9ydCB0eXBlIExhemFkYU9wZW5QbGF0Zm9ybUFQSVJlc3BvbnNlID1cbiAgfCBMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZVN1Y2Nlc3NcbiAgfCBMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZUVycm9yXG4iXX0=