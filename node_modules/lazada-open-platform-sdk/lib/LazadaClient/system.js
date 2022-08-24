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
 * GET|POST /auth/token/create [No Auth Required]
 * Default POST
 * @param {Object} payload
 * @typedef payload
 * @property {string} code :require | oauth code, get from app callback URL
 * @property {string} uuid :optional | unique identifier, anti-replay
 * @param {HttpAction} action GET or POST default: POST
 */
var generateAccessToken = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function generateAccessToken(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.POST;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType = _flowRuntime2.default.string();

  var _appSecretType = _flowRuntime2.default.string();

  var _gatewayType = _flowRuntime2.default.string();

  var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType = _flowRuntime2.default.object(_flowRuntime2.default.property('code', _flowRuntime2.default.string()), _flowRuntime2.default.property('uuid', _flowRuntime2.default.string(), true));

  var _actionType = _flowRuntime2.default.ref(HttpAction);

  var _protocolType2 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType).assert(payload);

  _flowRuntime2.default.param('action', _actionType, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType2, true).assert(protocol);

  var apiPath = '/auth/token/create';
  var authURL = getScheme(protocol) + _constants.GATEWAY.AUTH;

  var request = action === _constants2.HTTP_ACTION.GET ? _LazadaRequest2.default.get : _LazadaRequest2.default.post;
  return request(authURL, appKey, appSecret, apiPath, undefined, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('code', _flowRuntime2.default.string()), _flowRuntime2.default.property('uuid', _flowRuntime2.default.string(), true))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * GET|POST /auth/token/refresh [No Auth Required]
 * Default POST
 * @param {Object} payload
 * @typedef payload
 * @property {string} refresh_token :require
 * @param {HttpAction} action GET or POST default: POST
 */
var refreshAccessToken = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function refreshAccessToken(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.POST;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType2 = _flowRuntime2.default.string();

  var _appSecretType2 = _flowRuntime2.default.string();

  var _gatewayType2 = _flowRuntime2.default.string();

  var _accessTokenType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType2 = _flowRuntime2.default.object(_flowRuntime2.default.property('refresh_token', _flowRuntime2.default.string()));

  var _actionType2 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType3 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType2).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType2).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType2).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType2).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType2).assert(payload);

  _flowRuntime2.default.param('action', _actionType2, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType3, true).assert(protocol);

  var apiPath = '/auth/token/refresh';
  var authURL = getScheme(protocol) + _constants.GATEWAY.AUTH;

  var request = action === _constants2.HTTP_ACTION.GET ? _LazadaRequest2.default.get : _LazadaRequest2.default.post;
  return request(authURL, appKey, appSecret, apiPath, undefined, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('refresh_token', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

exports.default = {
  generateAccessToken: generateAccessToken,
  refreshAccessToken: refreshAccessToken
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXphZGFDbGllbnQvc3lzdGVtLmpzIl0sIm5hbWVzIjpbImdldFNjaGVtZSIsInByb3RvY29sIiwiUFJPVE9DT0wiLCJIVFRQIiwiYXBwS2V5IiwiYXBwU2VjcmV0IiwiZ2F0ZXdheSIsImFjY2Vzc1Rva2VuIiwicGF5bG9hZCIsImFjdGlvbiIsIkhUVFBfQUNUSU9OIiwiUE9TVCIsIkhUVFBTIiwiYXBpUGF0aCIsImF1dGhVUkwiLCJHQVRFV0FZIiwiQVVUSCIsInJlcXVlc3QiLCJHRVQiLCJMYXphZGFSZXF1ZXN0IiwiZ2V0IiwicG9zdCIsInVuZGVmaW5lZCIsImdlbmVyYXRlQWNjZXNzVG9rZW4iLCJyZWZyZXNoQWNjZXNzVG9rZW4iXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDJDQUFZLG1CQUFDQyxRQUFELEVBQWdDO0FBQUEsc0JBQXZCLG1DQUF1Qjs7QUFBQSxpREFBViw4QkFBVTs7QUFBQTs7QUFDaEQsNEJBQU9BLGFBQWFDLHFCQUFTQyxJQUF0QixHQUE2QixTQUE3QixHQUF5QyxVQUFoRDtBQUNELENBRkssRUFBWSx1RUFBUyxtQ0FBVCxnQ0FBb0IsOEJBQXBCLEVBQVosQ0FBTjs7QUFJQTs7Ozs7Ozs7O0FBU0EsMEJBQXlCLG9DQUF6Qix1Q0FBdUMsNkJBQ3JDQyxNQURxQyxFQUVyQ0MsU0FGcUMsRUFHckNDLE9BSHFDLEVBSXJDQyxXQUpxQyxFQUtyQ0MsT0FMcUMsRUFXbEM7QUFBQSxNQUZIQyxNQUVHLHVFQUZtQkMsd0JBQVlDLElBRS9CO0FBQUEsTUFESFYsUUFDRyx1RUFEbUJDLHFCQUFTVSxLQUM1Qjs7QUFBQSxvQkFWRyw4QkFVSDs7QUFBQSx1QkFUTSw4QkFTTjs7QUFBQSxxQkFSSSw4QkFRSjs7QUFBQSx5QkFQUSwrQkFBRyw4QkFBSCxDQU9SOztBQUFBLHFCQU5JLDZCQUNMLHVDQUFNLDhCQUFOLENBREssRUFFTCx1Q0FBTyw4QkFBUCxPQUZLLENBTUo7O0FBQUEsb0JBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxvQkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCYyxtQkFBUUMsSUFBOUM7O0FBRUEsTUFBTUMsVUFDSlIsV0FBV0Msd0JBQVlRLEdBQXZCLEdBQTZCQyx3QkFBY0MsR0FBM0MsR0FBaURELHdCQUFjRSxJQURqRTtBQUVBLFNBQU9KLFFBQVFILE9BQVIsRUFBaUJWLE1BQWpCLEVBQXlCQyxTQUF6QixFQUFvQ1EsT0FBcEMsRUFBNkNTLFNBQTdDLEVBQXdEZCxPQUF4RCxDQUFQO0FBQ0QsQ0FsQkQsRUFBdUMscUVBQy9CLDhCQUQrQiw0Q0FFNUIsOEJBRjRCLDBDQUc5Qiw4QkFIOEIsOENBSTFCLCtCQUFHLDhCQUFILENBSjBCLDBDQUs5Qiw2QkFDTCx1Q0FBTSw4QkFBTixDQURLLEVBRUwsdUNBQU8sOEJBQVAsT0FGSyxDQUw4Qix5Q0FTOUIscUNBVDhCLDJDQVU1QixtQ0FWNEIsRUFBdkM7O0FBb0JBOzs7Ozs7OztBQVFBLHlCQUF3QixvQ0FBeEIsdUNBQXNDLDRCQUNwQ0osTUFEb0MsRUFFcENDLFNBRm9DLEVBR3BDQyxPQUhvQyxFQUlwQ0MsV0FKb0MsRUFLcENDLE9BTG9DLEVBUWpDO0FBQUEsTUFGSEMsTUFFRyx1RUFGbUJDLHdCQUFZQyxJQUUvQjtBQUFBLE1BREhWLFFBQ0csdUVBRG1CQyxxQkFBU1UsS0FDNUI7O0FBQUEscUJBUEcsOEJBT0g7O0FBQUEsd0JBTk0sOEJBTU47O0FBQUEsc0JBTEksOEJBS0o7O0FBQUEsMEJBSlEsK0JBQUcsOEJBQUgsQ0FJUjs7QUFBQSxzQkFISSw2QkFBSSxnREFBZSw4QkFBZixDQUFKLENBR0o7O0FBQUEscUJBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxxQkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCYyxtQkFBUUMsSUFBOUM7O0FBRUEsTUFBTUMsVUFDSlIsV0FBV0Msd0JBQVlRLEdBQXZCLEdBQTZCQyx3QkFBY0MsR0FBM0MsR0FBaURELHdCQUFjRSxJQURqRTtBQUVBLFNBQU9KLFFBQVFILE9BQVIsRUFBaUJWLE1BQWpCLEVBQXlCQyxTQUF6QixFQUFvQ1EsT0FBcEMsRUFBNkNTLFNBQTdDLEVBQXdEZCxPQUF4RCxDQUFQO0FBQ0QsQ0FmRCxFQUFzQyxxRUFDOUIsOEJBRDhCLDRDQUUzQiw4QkFGMkIsMENBRzdCLDhCQUg2Qiw4Q0FJekIsK0JBQUcsOEJBQUgsQ0FKeUIsMENBSzdCLDZCQUFJLGdEQUFlLDhCQUFmLENBQUosQ0FMNkIseUNBTTdCLHFDQU42QiwyQ0FPM0IsbUNBUDJCLEVBQXRDOztrQkFpQmU7QUFDYmUsMENBRGE7QUFFYkM7QUFGYSxDIiwiZmlsZSI6InN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4ndXNlIHN0cmljdCdcbmltcG9ydCB7IEdBVEVXQVkgfSBmcm9tICcuL2NvbnN0YW50cydcbmltcG9ydCB0eXBlIHsgQVBJQWN0aW9uIH0gZnJvbSAnLi90eXBlcy9Db21tb24nXG5pbXBvcnQgTGF6YWRhUmVxdWVzdCBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdCdcbmltcG9ydCB7IFBST1RPQ09MLCBIVFRQX0FDVElPTiB9IGZyb20gJ3NyYy9MYXphZGFSZXF1ZXN0L2NvbnN0YW50cydcbmltcG9ydCB0eXBlIHsgUHJvdG9jb2wsIEh0dHBBY3Rpb24gfSBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdC90eXBlcy9SZXF1ZXN0J1xuXG5jb25zdCBnZXRTY2hlbWUgPSAocHJvdG9jb2w6IFByb3RvY29sKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIHByb3RvY29sID09PSBQUk9UT0NPTC5IVFRQID8gJ2h0dHA6Ly8nIDogJ2h0dHBzOi8vJ1xufVxuXG4vKipcbiAqIEdFVHxQT1NUIC9hdXRoL3Rva2VuL2NyZWF0ZSBbTm8gQXV0aCBSZXF1aXJlZF1cbiAqIERlZmF1bHQgUE9TVFxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIEB0eXBlZGVmIHBheWxvYWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjb2RlIDpyZXF1aXJlIHwgb2F1dGggY29kZSwgZ2V0IGZyb20gYXBwIGNhbGxiYWNrIFVSTFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHV1aWQgOm9wdGlvbmFsIHwgdW5pcXVlIGlkZW50aWZpZXIsIGFudGktcmVwbGF5XG4gKiBAcGFyYW0ge0h0dHBBY3Rpb259IGFjdGlvbiBHRVQgb3IgUE9TVCBkZWZhdWx0OiBQT1NUXG4gKi9cbmNvbnN0IGdlbmVyYXRlQWNjZXNzVG9rZW46IEFQSUFjdGlvbiA9IChcbiAgYXBwS2V5OiBzdHJpbmcsXG4gIGFwcFNlY3JldDogc3RyaW5nLFxuICBnYXRld2F5OiBzdHJpbmcsIC8vIGlnbm9yZVxuICBhY2Nlc3NUb2tlbjogP3N0cmluZywgLy8gaWdub3JlXG4gIHBheWxvYWQ6IHtcbiAgICBjb2RlOiBzdHJpbmcsIC8vIG9hdXRoIGNvZGUsIGdldCBmcm9tIGFwcCBjYWxsYmFjayBVUkxcbiAgICB1dWlkPzogc3RyaW5nLCAvLyB1bmlxdWUgaWRlbnRpZmllciwgYW50aS1yZXBsYXlcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLlBPU1QsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9hdXRoL3Rva2VuL2NyZWF0ZSdcbiAgY29uc3QgYXV0aFVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBHQVRFV0FZLkFVVEhcblxuICBjb25zdCByZXF1ZXN0ID1cbiAgICBhY3Rpb24gPT09IEhUVFBfQUNUSU9OLkdFVCA/IExhemFkYVJlcXVlc3QuZ2V0IDogTGF6YWRhUmVxdWVzdC5wb3N0XG4gIHJldHVybiByZXF1ZXN0KGF1dGhVUkwsIGFwcEtleSwgYXBwU2VjcmV0LCBhcGlQYXRoLCB1bmRlZmluZWQsIHBheWxvYWQpXG59XG5cbi8qKlxuICogR0VUfFBPU1QgL2F1dGgvdG9rZW4vcmVmcmVzaCBbTm8gQXV0aCBSZXF1aXJlZF1cbiAqIERlZmF1bHQgUE9TVFxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIEB0eXBlZGVmIHBheWxvYWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZWZyZXNoX3Rva2VuIDpyZXF1aXJlXG4gKiBAcGFyYW0ge0h0dHBBY3Rpb259IGFjdGlvbiBHRVQgb3IgUE9TVCBkZWZhdWx0OiBQT1NUXG4gKi9cbmNvbnN0IHJlZnJlc2hBY2Nlc3NUb2tlbjogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZywgLy8gaWdub3JlXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLCAvLyBpZ25vcmVcbiAgcGF5bG9hZDogeyByZWZyZXNoX3Rva2VuOiBzdHJpbmcgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLlBPU1QsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9hdXRoL3Rva2VuL3JlZnJlc2gnXG4gIGNvbnN0IGF1dGhVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgR0FURVdBWS5BVVRIXG5cbiAgY29uc3QgcmVxdWVzdCA9XG4gICAgYWN0aW9uID09PSBIVFRQX0FDVElPTi5HRVQgPyBMYXphZGFSZXF1ZXN0LmdldCA6IExhemFkYVJlcXVlc3QucG9zdFxuICByZXR1cm4gcmVxdWVzdChhdXRoVVJMLCBhcHBLZXksIGFwcFNlY3JldCwgYXBpUGF0aCwgdW5kZWZpbmVkLCBwYXlsb2FkKVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdlbmVyYXRlQWNjZXNzVG9rZW4sXG4gIHJlZnJlc2hBY2Nlc3NUb2tlbixcbn1cbiJdfQ==