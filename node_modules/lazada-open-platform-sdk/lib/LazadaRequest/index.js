'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Determind if response is successful
 * @param {LazadaOpenPlatformAPIResponse} response
 * @return {boolean} success
 */


var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _constants = require('./constants');

var _signature = require('./signature');

var _Common = require('../types/Common');

var _Request = require('./types/Request');

var _Response = require('./types/Response');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LazadaOpenPlatformAPIResponse = _flowRuntime2.default.tdz(function () {
  return _Response.LazadaOpenPlatformAPIResponse;
});

var SDKRequestMetaData = _flowRuntime2.default.tdz(function () {
  return _Request.SDKRequestMetaData;
});

var SystemQueryParams = _flowRuntime2.default.tdz(function () {
  return _Request.SystemQueryParams;
});

var KeyValueDictionary = _flowRuntime2.default.tdz(function () {
  return _Common.KeyValueDictionary;
});

var isResponseSuccessful = _flowRuntime2.default.annotate(function isResponseSuccessful(response) {
  var _responseType = _flowRuntime2.default.union(_flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse), _flowRuntime2.default.any());

  var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.boolean());

  _flowRuntime2.default.param('response', _responseType).assert(response);

  return _returnType.assert((typeof response === 'undefined' ? 'undefined' : _typeof(response)) === 'object' && response !== null && response.hasOwnProperty('code') && response.code === _constants.RESPONSE.SUCCESS.CODE);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('response', _flowRuntime2.default.union(_flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse), _flowRuntime2.default.any())), _flowRuntime2.default.return(_flowRuntime2.default.boolean())));

var handleLazadaResponse = _flowRuntime2.default.annotate(function handleLazadaResponse(response, meta) {
  var _responseType2 = _flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse);

  var _metaType = _flowRuntime2.default.ref(SDKRequestMetaData);

  var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse));

  _flowRuntime2.default.param('response', _responseType2).assert(response);

  _flowRuntime2.default.param('meta', _metaType).assert(meta);

  // for debug only
  var _log_request = _flowRuntime2.default.annotate(function _log_request(_arg, response) {
    var _t$ref$assert = _flowRuntime2.default.ref(SDKRequestMetaData).assert(_arg),
        method = _t$ref$assert.method,
        apiPath = _t$ref$assert.apiPath,
        payload = _t$ref$assert.payload,
        query = _t$ref$assert.query;

    console.info('[%s] '.replace(/%s/, method) + apiPath, ' ', payload, ' ', query);
    console.log(JSON.stringify(response, null, 2));
  }, _flowRuntime2.default.function(_flowRuntime2.default.param('_arg', _flowRuntime2.default.ref(SDKRequestMetaData)), _flowRuntime2.default.param('response', _flowRuntime2.default.any())));
  // _log_request(meta, response)
  if (isResponseSuccessful(response)) {
    return Promise.resolve(response).then(function (_arg2) {
      return _returnType2.assert(_arg2);
    });
  } else {
    return Promise.reject(response).then(function (_arg3) {
      return _returnType2.assert(_arg3);
    });
  }
}, _flowRuntime2.default.function(_flowRuntime2.default.param('response', _flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse)), _flowRuntime2.default.param('meta', _flowRuntime2.default.ref(SDKRequestMetaData)), _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse)))));

var get = _flowRuntime2.default.annotate(function get(base, appKey, appSecret, apiPath, accessToken, params) {
  var _baseType = _flowRuntime2.default.string();

  var _appKeyType = _flowRuntime2.default.string();

  var _appSecretType = _flowRuntime2.default.string();

  var _apiPathType = _flowRuntime2.default.string();

  var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _paramsType = _flowRuntime2.default.ref(KeyValueDictionary);

  var _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse));

  _flowRuntime2.default.param('base', _baseType).assert(base);

  _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('apiPath', _apiPathType).assert(apiPath);

  _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

  _flowRuntime2.default.param('params', _paramsType, true).assert(params);

  var qs = Object.assign({}, params, getSystemQueryParamObject(appKey, appSecret, apiPath, accessToken, params));

  return (0, _requestPromise2.default)({
    url: base + apiPath,
    qs: qs,
    json: true
  }).then(function (response) {
    var meta = {
      method: 'GET',
      apiPath: apiPath,
      payload: params,
      query: qs
    };
    return handleLazadaResponse(response, meta);
  }).then(function (_arg4) {
    return _returnType3.assert(_arg4);
  });
}, _flowRuntime2.default.function(_flowRuntime2.default.param('base', _flowRuntime2.default.string()), _flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('apiPath', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('params', _flowRuntime2.default.ref(KeyValueDictionary)), _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse)))));

var post = _flowRuntime2.default.annotate(function post(base, appKey, appSecret, apiPath, accessToken, body) {
  var _baseType2 = _flowRuntime2.default.string();

  var _appKeyType2 = _flowRuntime2.default.string();

  var _appSecretType2 = _flowRuntime2.default.string();

  var _apiPathType2 = _flowRuntime2.default.string();

  var _accessTokenType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _bodyType = _flowRuntime2.default.ref(KeyValueDictionary);

  var _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse));

  _flowRuntime2.default.param('base', _baseType2).assert(base);

  _flowRuntime2.default.param('appKey', _appKeyType2).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType2).assert(appSecret);

  _flowRuntime2.default.param('apiPath', _apiPathType2).assert(apiPath);

  _flowRuntime2.default.param('accessToken', _accessTokenType2).assert(accessToken);

  _flowRuntime2.default.param('body', _bodyType, true).assert(body);

  // turns out even it's HTTP POST, Lazada expect `body` to be part of query string
  var qs = Object.assign({}, body, getSystemQueryParamObject(appKey, appSecret, apiPath, accessToken, body));
  return (0, _requestPromise2.default)({
    method: 'POST',
    url: base + apiPath,
    qs: qs,
    json: true,
    body: body
  }).then(function (response) {
    var meta = {
      method: 'POST',
      apiPath: apiPath,
      payload: body,
      query: qs
    };
    return handleLazadaResponse(response, meta);
  }).then(function (_arg5) {
    return _returnType4.assert(_arg5);
  });
}, _flowRuntime2.default.function(_flowRuntime2.default.param('base', _flowRuntime2.default.string()), _flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('apiPath', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('body', _flowRuntime2.default.ref(KeyValueDictionary)), _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.ref(LazadaOpenPlatformAPIResponse)))));

/**
 * Gather system and business parameters to compute signature
 * @param {string} appKey
 * @param {string} appSecret
 * @param {string} apiPath
 * @param {string?} accessToken
 * @param {KeyValueDictionary?} payload
 * @return {SystemQueryParams}
 */
var getSystemQueryParamObject = _flowRuntime2.default.annotate(function getSystemQueryParamObject(appKey, appSecret, apiPath, accessToken, payload) {
  var _appKeyType3 = _flowRuntime2.default.string();

  var _appSecretType3 = _flowRuntime2.default.string();

  var _apiPathType3 = _flowRuntime2.default.string();

  var _accessTokenType3 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType = _flowRuntime2.default.ref(KeyValueDictionary);

  var _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.ref(SystemQueryParams));

  _flowRuntime2.default.param('appKey', _appKeyType3).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType3).assert(appSecret);

  _flowRuntime2.default.param('apiPath', _apiPathType3).assert(apiPath);

  _flowRuntime2.default.param('accessToken', _accessTokenType3).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType, true).assert(payload);

  var systemParams = _flowRuntime2.default.object(_flowRuntime2.default.property('app_key', _flowRuntime2.default.string()), _flowRuntime2.default.property('timestamp', _flowRuntime2.default.string()), _flowRuntime2.default.property('sign_method', _flowRuntime2.default.string()), _flowRuntime2.default.property('access_token', _flowRuntime2.default.string(), true)).assert({
    app_key: appKey,
    timestamp: Date.now().toString(),
    sign_method: 'sha256'
  });

  if (accessToken) {
    systemParams.access_token = accessToken;
  }

  return _returnType5.assert(Object.assign({}, {
    sign: (0, _signature.signRequest)(appSecret, apiPath, Object.assign({}, payload, systemParams))
  }, systemParams));
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('apiPath', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.ref(KeyValueDictionary)), _flowRuntime2.default.return(_flowRuntime2.default.ref(SystemQueryParams))));

// constructor
module.exports = {
  get: get,
  post: post,
  isResponseSuccessful: isResponseSuccessful,
  // helper
  getSystemQueryParamObject: getSystemQueryParamObject
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXphZGFSZXF1ZXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbImlzUmVzcG9uc2VTdWNjZXNzZnVsIiwicmVzcG9uc2UiLCJoYXNPd25Qcm9wZXJ0eSIsImNvZGUiLCJSRVNQT05TRSIsIlNVQ0NFU1MiLCJDT0RFIiwiaGFuZGxlTGF6YWRhUmVzcG9uc2UiLCJtZXRhIiwiX2xvZ19yZXF1ZXN0IiwibWV0aG9kIiwiYXBpUGF0aCIsInBheWxvYWQiLCJxdWVyeSIsImNvbnNvbGUiLCJpbmZvIiwicmVwbGFjZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldCIsImJhc2UiLCJhcHBLZXkiLCJhcHBTZWNyZXQiLCJhY2Nlc3NUb2tlbiIsInBhcmFtcyIsInFzIiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0U3lzdGVtUXVlcnlQYXJhbU9iamVjdCIsInVybCIsImpzb24iLCJ0aGVuIiwicG9zdCIsImJvZHkiLCJhcHBfa2V5IiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInRvU3RyaW5nIiwic2lnbl9tZXRob2QiLCJzeXN0ZW1QYXJhbXMiLCJhY2Nlc3NfdG9rZW4iLCJzaWduIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7QUFVQTs7Ozs7OztBQVJBOzs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLElBQU1BLHNEQUF1Qiw4QkFDM0JDLFFBRDJCLEVBRWY7QUFBQSxzQkFESiw0QkFBRSx3REFBRixFQUFrQywyQkFBbEMsQ0FDSTs7QUFBQSxpREFBWCwrQkFBVzs7QUFBQTs7QUFDWiw0QkFDRSxRQUFPQSxRQUFQLHlDQUFPQSxRQUFQLE9BQW9CLFFBQXBCLElBQ0FBLGFBQWEsSUFEYixJQUVBQSxTQUFTQyxjQUFULENBQXdCLE1BQXhCLENBRkEsSUFHQUQsU0FBU0UsSUFBVCxLQUFrQkMsb0JBQVNDLE9B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RGQsNkNBQ2M7O0FBQUEsa0RBQXJCLDRDQUFxQjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDdEIscUJBQWtCLDZCQUNoQiwwQ0FBUyw4QkFBVCxDQURnQixFQUVoQiw0Q0FBVyw4QkFBWCxDQUZnQixFQUdoQiw4Q0FBYSw4QkFBYixDQUhnQixFQUloQiwrQ0FBZSw4QkFBZixPQUpnQixDQUFsQixRQUtJO0FBQ0YwQixhQUFTYixNQURQO0FBRUZjLGVBQVdDLEtBQUtDLEdBQUwsR0FBV0MsUUFBWCxFQUZUO0FBR0ZDLGlCQUFhO0FBSFgsR0FMSjs7QUFXQSxNQUFJaEIsV0FBSixFQUFpQjtBQUNmaUIsaUJBQWFDLFlBQWIsR0FBNEJsQixXQUE1QjtBQUNEOztBQUVELDZCQUFPRyxPQUFPQyxNQUFQLENBQ0wsRUFESyxFQUVMO0FBQ0VlLFVBQU0sNEJBQ0pwQixTQURJLEVBRUpmLE9BRkksRUFHSm1CLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCbkIsT0FBbEIsRUFBMkJnQyxZQUEzQixDQUhJO0FBRFIsR0FGSyxFQVNMQSxZQVRLLENBQVA7QUFXRCxDQWpDSyxFQUE0QixxRUFDMUIsOEJBRDBCLDRDQUV2Qiw4QkFGdUIsMENBR3pCLDhCQUh5Qiw4Q0FJckIsK0JBQUcsOEJBQUgsQ0FKcUIsMENBS3hCLDZDQUx3QixnQ0FNakMsNENBTmlDLEVBQTVCLENBQU47O0FBbUNBO0FBQ0FHLE9BQU9DLE9BQVAsR0FBaUI7QUFDZnpCLE9BQUtBLEdBRFU7QUFFZmEsUUFBTUEsSUFGUztBQUdmcEMsd0JBQXNCQSxvQkFIUDtBQUlmO0FBQ0FnQyw2QkFBMkJBO0FBTFosQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnXG5cbmltcG9ydCB7IFJFU1BPTlNFIH0gZnJvbSAnLi9jb25zdGFudHMnXG5pbXBvcnQgeyBzaWduUmVxdWVzdCB9IGZyb20gJy4vc2lnbmF0dXJlJ1xuaW1wb3J0IHR5cGUgeyBLZXlWYWx1ZURpY3Rpb25hcnkgfSBmcm9tICdzcmMvdHlwZXMvQ29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBTREtSZXF1ZXN0TWV0YURhdGEsIFN5c3RlbVF1ZXJ5UGFyYW1zIH0gZnJvbSAnLi90eXBlcy9SZXF1ZXN0J1xuaW1wb3J0IHR5cGUgeyBMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZSB9IGZyb20gJy4vdHlwZXMvUmVzcG9uc2UnXG5cbi8qKlxuICogRGV0ZXJtaW5kIGlmIHJlc3BvbnNlIGlzIHN1Y2Nlc3NmdWxcbiAqIEBwYXJhbSB7TGF6YWRhT3BlblBsYXRmb3JtQVBJUmVzcG9uc2V9IHJlc3BvbnNlXG4gKiBAcmV0dXJuIHtib29sZWFufSBzdWNjZXNzXG4gKi9cbmNvbnN0IGlzUmVzcG9uc2VTdWNjZXNzZnVsID0gKFxuICByZXNwb25zZTogTGF6YWRhT3BlblBsYXRmb3JtQVBJUmVzcG9uc2UgfCBhbnksXG4pOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgcmVzcG9uc2UgPT09ICdvYmplY3QnICYmXG4gICAgcmVzcG9uc2UgIT09IG51bGwgJiZcbiAgICByZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnY29kZScpICYmXG4gICAgcmVzcG9uc2UuY29kZSA9PT0gUkVTUE9OU0UuU1VDQ0VTUy5DT0RFXG4gIClcbn1cblxuY29uc3QgaGFuZGxlTGF6YWRhUmVzcG9uc2UgPSAoXG4gIHJlc3BvbnNlOiBMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZSxcbiAgbWV0YTogU0RLUmVxdWVzdE1ldGFEYXRhLFxuKTogUHJvbWlzZTxMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZT4gPT4ge1xuICAvLyBmb3IgZGVidWcgb25seVxuICBjb25zdCBfbG9nX3JlcXVlc3QgPSAoXG4gICAgeyBtZXRob2QsIGFwaVBhdGgsIHBheWxvYWQsIHF1ZXJ5IH06IFNES1JlcXVlc3RNZXRhRGF0YSxcbiAgICByZXNwb25zZSxcbiAgKSA9PiB7XG4gICAgY29uc29sZS5pbmZvKFxuICAgICAgJ1slc10gJy5yZXBsYWNlKC8lcy8sIG1ldGhvZCkgKyBhcGlQYXRoLFxuICAgICAgJyAnLFxuICAgICAgcGF5bG9hZCxcbiAgICAgICcgJyxcbiAgICAgIHF1ZXJ5LFxuICAgIClcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgbnVsbCwgMikpXG4gIH1cbiAgLy8gX2xvZ19yZXF1ZXN0KG1ldGEsIHJlc3BvbnNlKVxuICBpZiAoaXNSZXNwb25zZVN1Y2Nlc3NmdWwocmVzcG9uc2UpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzcG9uc2UpXG4gIH1cbn1cblxuY29uc3QgZ2V0ID0gKFxuICBiYXNlOiBzdHJpbmcsXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgYXBpUGF0aDogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGFyYW1zPzogS2V5VmFsdWVEaWN0aW9uYXJ5LFxuKTogUHJvbWlzZTxMYXphZGFPcGVuUGxhdGZvcm1BUElSZXNwb25zZT4gPT4ge1xuICBjb25zdCBxcyA9IE9iamVjdC5hc3NpZ24oXG4gICAge30sXG4gICAgcGFyYW1zLFxuICAgIGdldFN5c3RlbVF1ZXJ5UGFyYW1PYmplY3QoYXBwS2V5LCBhcHBTZWNyZXQsIGFwaVBhdGgsIGFjY2Vzc1Rva2VuLCBwYXJhbXMpLFxuICApXG5cbiAgcmV0dXJuIHJwKHtcbiAgICB1cmw6IGJhc2UgKyBhcGlQYXRoLFxuICAgIHFzLFxuICAgIGpzb246IHRydWUsXG4gIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgIGNvbnN0IG1ldGEgPSB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgYXBpUGF0aCxcbiAgICAgIHBheWxvYWQ6IHBhcmFtcyxcbiAgICAgIHF1ZXJ5OiBxcyxcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZUxhemFkYVJlc3BvbnNlKHJlc3BvbnNlLCBtZXRhKVxuICB9KVxufVxuXG5jb25zdCBwb3N0ID0gKFxuICBiYXNlOiBzdHJpbmcsXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgYXBpUGF0aDogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgYm9keT86IEtleVZhbHVlRGljdGlvbmFyeSxcbik6IFByb21pc2U8TGF6YWRhT3BlblBsYXRmb3JtQVBJUmVzcG9uc2U+ID0+IHtcbiAgLy8gdHVybnMgb3V0IGV2ZW4gaXQncyBIVFRQIFBPU1QsIExhemFkYSBleHBlY3QgYGJvZHlgIHRvIGJlIHBhcnQgb2YgcXVlcnkgc3RyaW5nXG4gIGNvbnN0IHFzID0gT2JqZWN0LmFzc2lnbihcbiAgICB7fSxcbiAgICBib2R5LFxuICAgIGdldFN5c3RlbVF1ZXJ5UGFyYW1PYmplY3QoYXBwS2V5LCBhcHBTZWNyZXQsIGFwaVBhdGgsIGFjY2Vzc1Rva2VuLCBib2R5KSxcbiAgKVxuICByZXR1cm4gcnAoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogYmFzZSArIGFwaVBhdGgsXG4gICAgcXMsXG4gICAganNvbjogdHJ1ZSxcbiAgICBib2R5LFxuICB9KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICBjb25zdCBtZXRhID0ge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBhcGlQYXRoLFxuICAgICAgcGF5bG9hZDogYm9keSxcbiAgICAgIHF1ZXJ5OiBxcyxcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZUxhemFkYVJlc3BvbnNlKHJlc3BvbnNlLCBtZXRhKVxuICB9KVxufVxuXG4vKipcbiAqIEdhdGhlciBzeXN0ZW0gYW5kIGJ1c2luZXNzIHBhcmFtZXRlcnMgdG8gY29tcHV0ZSBzaWduYXR1cmVcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcHBLZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcHBTZWNyZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcGlQYXRoXG4gKiBAcGFyYW0ge3N0cmluZz99IGFjY2Vzc1Rva2VuXG4gKiBAcGFyYW0ge0tleVZhbHVlRGljdGlvbmFyeT99IHBheWxvYWRcbiAqIEByZXR1cm4ge1N5c3RlbVF1ZXJ5UGFyYW1zfVxuICovXG5jb25zdCBnZXRTeXN0ZW1RdWVyeVBhcmFtT2JqZWN0ID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGFwaVBhdGg6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ/OiBLZXlWYWx1ZURpY3Rpb25hcnksXG4pOiBTeXN0ZW1RdWVyeVBhcmFtcyA9PiB7XG4gIGNvbnN0IHN5c3RlbVBhcmFtczoge1xuICAgIGFwcF9rZXk6IHN0cmluZyxcbiAgICB0aW1lc3RhbXA6IHN0cmluZyxcbiAgICBzaWduX21ldGhvZDogc3RyaW5nLFxuICAgIGFjY2Vzc190b2tlbj86IHN0cmluZyxcbiAgfSA9IHtcbiAgICBhcHBfa2V5OiBhcHBLZXksXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksXG4gICAgc2lnbl9tZXRob2Q6ICdzaGEyNTYnLFxuICB9XG5cbiAgaWYgKGFjY2Vzc1Rva2VuKSB7XG4gICAgc3lzdGVtUGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICB7fSxcbiAgICB7XG4gICAgICBzaWduOiBzaWduUmVxdWVzdChcbiAgICAgICAgYXBwU2VjcmV0LFxuICAgICAgICBhcGlQYXRoLFxuICAgICAgICBPYmplY3QuYXNzaWduKHt9LCBwYXlsb2FkLCBzeXN0ZW1QYXJhbXMpLFxuICAgICAgKSxcbiAgICB9LFxuICAgIHN5c3RlbVBhcmFtcyxcbiAgKVxufVxuXG4vLyBjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldDogZ2V0LFxuICBwb3N0OiBwb3N0LFxuICBpc1Jlc3BvbnNlU3VjY2Vzc2Z1bDogaXNSZXNwb25zZVN1Y2Nlc3NmdWwsXG4gIC8vIGhlbHBlclxuICBnZXRTeXN0ZW1RdWVyeVBhcmFtT2JqZWN0OiBnZXRTeXN0ZW1RdWVyeVBhcmFtT2JqZWN0LFxufVxuIl19