'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

var _Common = require('./types/Common');

var _LazadaRequest = require('../LazadaRequest');

var _LazadaRequest2 = _interopRequireDefault(_LazadaRequest);

var _constants2 = require('../LazadaRequest/constants');

var _Request = require('../LazadaRequest/types/Request');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Protocol = _flowRuntime2.default.tdz(function () {
  return _Request.Protocol;
});

var HttpAction = _flowRuntime2.default.tdz(function () {
  return _Request.HttpAction;
});

var APIAction = _flowRuntime2.default.tdz(function () {
  return _Common.APIAction;
});

var getScheme = _flowRuntime2.default.annotate(function getScheme(protocol) {
  var _protocolType = _flowRuntime2.default.ref(Protocol);

  var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.string());

  _flowRuntime2.default.param('protocol', _protocolType).assert(protocol);

  return _returnType.assert(protocol === _constants2.PROTOCOL.HTTP ? 'http://' : 'https://');
}, _flowRuntime2.default.function(_flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)), _flowRuntime2.default.return(_flowRuntime2.default.string())));

/**
 * GET /shipment/providers/get [Auth Required]
 * Get the list of all active shipping providers, which is needed
 * when working with the SetStatusToPackedByMarketplace API.
 */
var getShipmentProviders = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getShipmentProviders(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType = _flowRuntime2.default.string();

  var _appSecretType = _flowRuntime2.default.string();

  var _gatewayType = _flowRuntime2.default.string();

  var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType = _flowRuntime2.default.any();

  var _actionType = _flowRuntime2.default.ref(HttpAction);

  var _protocolType2 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType).assert(payload);

  _flowRuntime2.default.param('action', _actionType, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType2, true).assert(protocol);

  var apiPath = '/shipment/providers/get';
  var baseURL = getScheme(protocol) + gateway;
  var request = _LazadaRequest2.default.get;
  return request(baseURL, appKey, appSecret, apiPath, accessToken);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.any()), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

exports.default = {
  getShipmentProviders: getShipmentProviders
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXphZGFDbGllbnQvbG9naXN0aWNzLmpzIl0sIm5hbWVzIjpbImdldFNjaGVtZSIsInByb3RvY29sIiwiUFJPVE9DT0wiLCJIVFRQIiwiYXBwS2V5IiwiYXBwU2VjcmV0IiwiZ2F0ZXdheSIsImFjY2Vzc1Rva2VuIiwicGF5bG9hZCIsImFjdGlvbiIsIkhUVFBfQUNUSU9OIiwiR0VUIiwiSFRUUFMiLCJhcGlQYXRoIiwiYmFzZVVSTCIsInJlcXVlc3QiLCJMYXphZGFSZXF1ZXN0IiwiZ2V0IiwiZ2V0U2hpcG1lbnRQcm92aWRlcnMiXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDJDQUFZLG1CQUFDQyxRQUFELEVBQWdDO0FBQUEsc0JBQXZCLG1DQUF1Qjs7QUFBQSxpREFBViw4QkFBVTs7QUFBQTs7QUFDaEQsNEJBQU9BLGFBQWFDLHFCQUFTQyxJQUF0QixHQUE2QixTQUE3QixHQUF5QyxVQUFoRDtBQUNELENBRkssRUFBWSx1RUFBUyxtQ0FBVCxnQ0FBb0IsOEJBQXBCLEVBQVosQ0FBTjs7QUFJQTs7Ozs7QUFLQSwyQkFBMEIsb0NBQTFCLHVDQUF3Qyw4QkFDdENDLE1BRHNDLEVBRXRDQyxTQUZzQyxFQUd0Q0MsT0FIc0MsRUFJdENDLFdBSnNDLEVBS3RDQyxPQUxzQyxFQVFuQztBQUFBLE1BRkhDLE1BRUcsdUVBRm1CQyx3QkFBWUMsR0FFL0I7QUFBQSxNQURIVixRQUNHLHVFQURtQkMscUJBQVNVLEtBQzVCOztBQUFBLG9CQVBHLDhCQU9IOztBQUFBLHVCQU5NLDhCQU1OOztBQUFBLHFCQUxJLDhCQUtKOztBQUFBLHlCQUpRLCtCQUFHLDhCQUFILENBSVI7O0FBQUEscUJBSEksMkJBR0o7O0FBQUEsb0JBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSx5QkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCSyxPQUF0QztBQUNBLE1BQU1TLFVBQVVDLHdCQUFjQyxHQUE5QjtBQUNBLFNBQU9GLFFBQVFELE9BQVIsRUFBaUJWLE1BQWpCLEVBQXlCQyxTQUF6QixFQUFvQ1EsT0FBcEMsRUFBNkNOLFdBQTdDLENBQVA7QUFDRCxDQWJELEVBQXdDLHFFQUNoQyw4QkFEZ0MsNENBRTdCLDhCQUY2QiwwQ0FHL0IsOEJBSCtCLDhDQUkzQiwrQkFBRyw4QkFBSCxDQUoyQiwwQ0FLL0IsMkJBTCtCLHlDQU0vQixxQ0FOK0IsMkNBTzdCLG1DQVA2QixFQUF4Qzs7a0JBZWU7QUFDYlc7QUFEYSxDIiwiZmlsZSI6ImxvZ2lzdGljcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4ndXNlIHN0cmljdCdcbmltcG9ydCB7IEdBVEVXQVkgfSBmcm9tICcuL2NvbnN0YW50cydcbmltcG9ydCB0eXBlIHsgQVBJQWN0aW9uIH0gZnJvbSAnLi90eXBlcy9Db21tb24nXG5pbXBvcnQgTGF6YWRhUmVxdWVzdCBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdCdcbmltcG9ydCB7IFBST1RPQ09MLCBIVFRQX0FDVElPTiB9IGZyb20gJ3NyYy9MYXphZGFSZXF1ZXN0L2NvbnN0YW50cydcbmltcG9ydCB0eXBlIHsgUHJvdG9jb2wsIEh0dHBBY3Rpb24gfSBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdC90eXBlcy9SZXF1ZXN0J1xuXG5jb25zdCBnZXRTY2hlbWUgPSAocHJvdG9jb2w6IFByb3RvY29sKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIHByb3RvY29sID09PSBQUk9UT0NPTC5IVFRQID8gJ2h0dHA6Ly8nIDogJ2h0dHBzOi8vJ1xufVxuXG4vKipcbiAqIEdFVCAvc2hpcG1lbnQvcHJvdmlkZXJzL2dldCBbQXV0aCBSZXF1aXJlZF1cbiAqIEdldCB0aGUgbGlzdCBvZiBhbGwgYWN0aXZlIHNoaXBwaW5nIHByb3ZpZGVycywgd2hpY2ggaXMgbmVlZGVkXG4gKiB3aGVuIHdvcmtpbmcgd2l0aCB0aGUgU2V0U3RhdHVzVG9QYWNrZWRCeU1hcmtldHBsYWNlIEFQSS5cbiAqL1xuY29uc3QgZ2V0U2hpcG1lbnRQcm92aWRlcnM6IEFQSUFjdGlvbiA9IChcbiAgYXBwS2V5OiBzdHJpbmcsXG4gIGFwcFNlY3JldDogc3RyaW5nLFxuICBnYXRld2F5OiBzdHJpbmcsXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLFxuICBwYXlsb2FkOiBhbnksXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9zaGlwbWVudC9wcm92aWRlcnMvZ2V0J1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgY29uc3QgcmVxdWVzdCA9IExhemFkYVJlcXVlc3QuZ2V0XG4gIHJldHVybiByZXF1ZXN0KGJhc2VVUkwsIGFwcEtleSwgYXBwU2VjcmV0LCBhcGlQYXRoLCBhY2Nlc3NUb2tlbilcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRTaGlwbWVudFByb3ZpZGVycyxcbn1cbiJdfQ==