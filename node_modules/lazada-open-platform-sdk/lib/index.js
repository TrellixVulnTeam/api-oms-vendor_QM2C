'use strict';

var _LazadaAPI = require('./LazadaAPI');

var _LazadaAPI2 = _interopRequireDefault(_LazadaAPI);

var _Common = require('./types/Common');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Venture = _flowRuntime2.default.tdz(function () {
  return _Common.Venture;
});

/**
 * @typedef {string} Venture API gateway venture
 */

/**
 * Creates a new API object
 * @class
 * @example
 * // init with no access token
 * const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode)
 * const accessToken = // get access token...
 * aLazadaAPI.accessToken = accessToken // set access token
 * @example
 * // init with access token
 * const aLazadaAPI = new LazadaAPI(appKey, appSecret, countryCode, accessToken)
 * @param {string} appKey
 * @param {string} appSecret
 * @param {Venture} countryCode
 * @param {string=} accessToken
 */


module.exports = _flowRuntime2.default.annotate(function exports(appKey, appSecret, countryCode, accessToken) {
  var _appKeyType = _flowRuntime2.default.string();

  var _appSecretType = _flowRuntime2.default.string();

  var _countryCodeType = _flowRuntime2.default.ref(Venture);

  var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('countryCode', _countryCodeType).assert(countryCode);

  _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

  /**
   * Create a proxy and forward any unrecognisable properties/methods to `client`
   */
  var forwardPropertyHandler = {
    get: function get(aLazadaAPI, property) {
      if (property in aLazadaAPI) {
        return _flowRuntime2.default.object().assert(aLazadaAPI)[property];
      } else if (aLazadaAPI.client !== undefined) {
        var action = aLazadaAPI.client[property];
        if (!action) return undefined;
        return function (args) {
          return action(aLazadaAPI.appKey, aLazadaAPI.appSecret, aLazadaAPI.gateway, aLazadaAPI.accessToken, args);
        };
      }
      return undefined;
    }
  };
  var lazadaAPI = new _LazadaAPI2.default(appKey, appSecret, countryCode, accessToken);
  return new Proxy(lazadaAPI, forwardPropertyHandler);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('countryCode', _flowRuntime2.default.ref(Venture)), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiYXBwS2V5IiwiYXBwU2VjcmV0IiwiY291bnRyeUNvZGUiLCJhY2Nlc3NUb2tlbiIsImZvcndhcmRQcm9wZXJ0eUhhbmRsZXIiLCJnZXQiLCJhTGF6YWRhQVBJIiwicHJvcGVydHkiLCJjbGllbnQiLCJ1bmRlZmluZWQiLCJhY3Rpb24iLCJnYXRld2F5IiwiYXJncyIsImxhemFkYUFQSSIsIkxhemFkYUFQSSIsIlByb3h5Il0sIm1hcHBpbmdzIjoiQUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkFBLE9BQU9DLE9BQVAsa0NBQWlCLGlCQUNmQyxNQURlLEVBRWZDLFNBRmUsRUFHZkMsV0FIZSxFQUlmQyxXQUplLEVBS1o7QUFBQSxvQkFKRyw4QkFJSDs7QUFBQSx1QkFITSw4QkFHTjs7QUFBQSx5QkFGUSxrQ0FFUjs7QUFBQSx5QkFEUSwrQkFBRyw4QkFBSCxDQUNSOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNIOzs7QUFHQSxNQUFNQyx5QkFBeUI7QUFDN0JDLFNBQUssYUFBQ0MsVUFBRCxFQUFhQyxRQUFiLEVBQTBCO0FBQzdCLFVBQUlBLFlBQVlELFVBQWhCLEVBQTRCO0FBQzFCLGVBQWtCLDhCQUFYLFFBQUNBLFVBQUQsRUFBcUJDLFFBQXJCLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSUQsV0FBV0UsTUFBWCxLQUFzQkMsU0FBMUIsRUFBcUM7QUFDMUMsWUFBTUMsU0FBU0osV0FBV0UsTUFBWCxDQUFrQkQsUUFBbEIsQ0FBZjtBQUNBLFlBQUksQ0FBQ0csTUFBTCxFQUFhLE9BQU9ELFNBQVA7QUFDYixlQUFPLGdCQUFRO0FBQ2IsaUJBQU9DLE9BQ0xKLFdBQVdOLE1BRE4sRUFFTE0sV0FBV0wsU0FGTixFQUdMSyxXQUFXSyxPQUhOLEVBSUxMLFdBQVdILFdBSk4sRUFLTFMsSUFMSyxDQUFQO0FBT0QsU0FSRDtBQVNEO0FBQ0QsYUFBT0gsU0FBUDtBQUNEO0FBbEI0QixHQUEvQjtBQW9CQSxNQUFNSSxZQUFZLElBQUlDLG1CQUFKLENBQWNkLE1BQWQsRUFBc0JDLFNBQXRCLEVBQWlDQyxXQUFqQyxFQUE4Q0MsV0FBOUMsQ0FBbEI7QUFDQSxTQUFPLElBQUlZLEtBQUosQ0FBVUYsU0FBVixFQUFxQlQsc0JBQXJCLENBQVA7QUFDRCxDQS9CRCxFQUFpQixxRUFDVCw4QkFEUyw0Q0FFTiw4QkFGTSw4Q0FHSixrQ0FISSw4Q0FJSiwrQkFBRyw4QkFBSCxDQUpJLEVBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgTGF6YWRhQVBJIGZyb20gJ3NyYy9MYXphZGFBUEknXG5pbXBvcnQgdHlwZSB7IFZlbnR1cmUgfSBmcm9tICdzcmMvdHlwZXMvQ29tbW9uJ1xuXG4vKipcbiAqIEB0eXBlZGVmIHtzdHJpbmd9IFZlbnR1cmUgQVBJIGdhdGV3YXkgdmVudHVyZVxuICovXG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBBUEkgb2JqZWN0XG4gKiBAY2xhc3NcbiAqIEBleGFtcGxlXG4gKiAvLyBpbml0IHdpdGggbm8gYWNjZXNzIHRva2VuXG4gKiBjb25zdCBhTGF6YWRhQVBJID0gbmV3IExhemFkYUFQSShhcHBLZXksIGFwcFNlY3JldCwgY291bnRyeUNvZGUpXG4gKiBjb25zdCBhY2Nlc3NUb2tlbiA9IC8vIGdldCBhY2Nlc3MgdG9rZW4uLi5cbiAqIGFMYXphZGFBUEkuYWNjZXNzVG9rZW4gPSBhY2Nlc3NUb2tlbiAvLyBzZXQgYWNjZXNzIHRva2VuXG4gKiBAZXhhbXBsZVxuICogLy8gaW5pdCB3aXRoIGFjY2VzcyB0b2tlblxuICogY29uc3QgYUxhemFkYUFQSSA9IG5ldyBMYXphZGFBUEkoYXBwS2V5LCBhcHBTZWNyZXQsIGNvdW50cnlDb2RlLCBhY2Nlc3NUb2tlbilcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcHBLZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcHBTZWNyZXRcbiAqIEBwYXJhbSB7VmVudHVyZX0gY291bnRyeUNvZGVcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYWNjZXNzVG9rZW5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgY291bnRyeUNvZGU6IFZlbnR1cmUsXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLFxuKSA9PiB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBwcm94eSBhbmQgZm9yd2FyZCBhbnkgdW5yZWNvZ25pc2FibGUgcHJvcGVydGllcy9tZXRob2RzIHRvIGBjbGllbnRgXG4gICAqL1xuICBjb25zdCBmb3J3YXJkUHJvcGVydHlIYW5kbGVyID0ge1xuICAgIGdldDogKGFMYXphZGFBUEksIHByb3BlcnR5KSA9PiB7XG4gICAgICBpZiAocHJvcGVydHkgaW4gYUxhemFkYUFQSSkge1xuICAgICAgICByZXR1cm4gKGFMYXphZGFBUEk6IE9iamVjdClbcHJvcGVydHldXG4gICAgICB9IGVsc2UgaWYgKGFMYXphZGFBUEkuY2xpZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gYUxhemFkYUFQSS5jbGllbnRbcHJvcGVydHldXG4gICAgICAgIGlmICghYWN0aW9uKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIHJldHVybiBhcmdzID0+IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uKFxuICAgICAgICAgICAgYUxhemFkYUFQSS5hcHBLZXksXG4gICAgICAgICAgICBhTGF6YWRhQVBJLmFwcFNlY3JldCxcbiAgICAgICAgICAgIGFMYXphZGFBUEkuZ2F0ZXdheSxcbiAgICAgICAgICAgIGFMYXphZGFBUEkuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICBhcmdzLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gIH1cbiAgY29uc3QgbGF6YWRhQVBJID0gbmV3IExhemFkYUFQSShhcHBLZXksIGFwcFNlY3JldCwgY291bnRyeUNvZGUsIGFjY2Vzc1Rva2VuKVxuICByZXR1cm4gbmV3IFByb3h5KGxhemFkYUFQSSwgZm9yd2FyZFByb3BlcnR5SGFuZGxlcilcbn1cbiJdfQ==