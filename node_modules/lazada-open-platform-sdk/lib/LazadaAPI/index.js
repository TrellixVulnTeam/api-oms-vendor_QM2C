'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/**
 * Class representing an API interface
 * @property {string} appKey
 * @property {string} appSecret
 * @property {Venture} countryCode
 * @property {string=} accessToken
 * @property {string} gateway
 * @property {LazadaClient} client
 */


var _LazadaClient = require('../LazadaClient');

var _LazadaClient2 = _interopRequireDefault(_LazadaClient);

var _Common = require('../types/Common');

var _constants = require('../LazadaClient/constants');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Venture = _flowRuntime2.default.tdz(function () {
  return _Common.Venture;
});

var LazadaAPI = function () {

  /**
   * LazadaAPI constructor
   * @param {string} appKey
   * @param {string} appSecret
   * @param {Venture} countryCode
   * @param {string=} accessToken
   */
  function LazadaAPI(appKey, appSecret, countryCode, accessToken) {
    _classCallCheck(this, LazadaAPI);

    var _appKeyType = _flowRuntime2.default.string();

    var _appSecretType = _flowRuntime2.default.string();

    var _countryCodeType = _flowRuntime2.default.ref(Venture);

    var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

    _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

    _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

    _flowRuntime2.default.param('countryCode', _countryCodeType).assert(countryCode);

    _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

    if (!appKey) {
      throw new Error('Missing appKey');
    } else {
      this._appKey = appKey;
    }
    if (!appSecret) {
      throw new Error('Missing appSecret');
    } else {
      this._appSecret = appSecret;
    }
    if (!countryCode) {
      throw new Error('Missing countryCode');
    } else {
      this._countryCode = countryCode;
    }

    switch (countryCode) {
      case _constants.VENTURE.SINGAPORE:
        this._gateway = _constants.GATEWAY.SINGAPORE;
        break;
      case _constants.VENTURE.THAILAND:
        this._gateway = _constants.GATEWAY.THAILAND;
        break;
      case _constants.VENTURE.MALAYSIA:
        this._gateway = _constants.GATEWAY.MALAYSIA;
        break;
      case _constants.VENTURE.VIETNAM:
        this._gateway = _constants.GATEWAY.VIETNAM;
        break;
      case _constants.VENTURE.PHILIPPINES:
        this._gateway = _constants.GATEWAY.PHILIPPINES;
        break;
      case _constants.VENTURE.INDONESIA:
        this._gateway = _constants.GATEWAY.INDONESIA;
        break;
      default:
        throw new Error('countryCode not supported');
      // break
    }
    this._client = _LazadaClient2.default; // new LazadaClient(appKey, appSecret, countryCode)
    this.accessToken = accessToken;
  }

  /**
   * Get instance's app key
   * @return {string}
   */


  _createClass(LazadaAPI, [{
    key: 'appKey',
    get: function get() {
      return this._appKey;
    }

    /**
     * Get instance's app secret
     * @return {string}
     */

  }, {
    key: 'appSecret',
    get: function get() {
      return this._appSecret;
    }

    /**
     * Get instance's access token
     * @return {string}
     */

  }, {
    key: 'accessToken',
    get: function get() {
      return this._accessToken;
    }

    /**
     * Set instance's and client's access token (if given)
     * @param {string} token
     * @public
     * @return {void}
     */
    ,
    set: function set(token) {
      var _tokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

      _flowRuntime2.default.param('token', _tokenType).assert(token);

      if (token) {
        this._accessToken = token;
        this.client.accessToken = token;
      }
    }

    /**
     * Get instance's api location specific gateway
     * @return {string}
     */

  }, {
    key: 'gateway',
    get: function get() {
      return this._gateway;
    }

    /**
     * Set instance's api location specific gateway
     * @param {string} url
     * @private
     * @return {void}
     */
    ,
    set: function set(url) {
      var _urlType = _flowRuntime2.default.string();

      _flowRuntime2.default.param('url', _urlType).assert(url);

      if (url) {
        this._gateway = url;
      }
    }

    /**
     * Get LazadaClient object
     * @return {LazadaClient}
     */

  }, {
    key: 'client',
    get: function get() {
      return this._client;
    }
  }]);

  return LazadaAPI;
}();

module.exports = LazadaAPI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXphZGFBUEkvaW5kZXguanMiXSwibmFtZXMiOlsiTGF6YWRhQVBJIiwiYXBwS2V5IiwiYXBwU2VjcmV0IiwiY291bnRyeUNvZGUiLCJhY2Nlc3NUb2tlbiIsIkVycm9yIiwiX2FwcEtleSIsIl9hcHBTZWNyZXQiLCJfY291bnRyeUNvZGUiLCJWRU5UVVJFIiwiU0lOR0FQT1JFIiwiX2dhdGV3YXkiLCJHQVRFV0FZIiwiVEhBSUxBTkQiLCJNQUxBWVNJQSIsIlZJRVROQU0iLCJQSElMSVBQSU5FUyIsIklORE9ORVNJQSIsIl9jbGllbnQiLCJMYXphZGFDbGllbnQiLCJfYWNjZXNzVG9rZW4iLCJ0b2tlbiIsImNsaWVudCIsInVybCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUNBOzs7O0FBTUE7Ozs7Ozs7Ozs7O0FBSkE7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7SUFXTUEsUzs7QUFRSjs7Ozs7OztBQU9BLHFCQUNFQyxNQURGLEVBRUVDLFNBRkYsRUFHRUMsV0FIRixFQUlFQyxXQUpGLEVBS0U7QUFBQTs7QUFBQSxzQkFKTSw4QkFJTjs7QUFBQSx5QkFIUyw4QkFHVDs7QUFBQSwyQkFGVyxrQ0FFWDs7QUFBQSwyQkFEVywrQkFBRyw4QkFBSCxDQUNYOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNBLFFBQUksQ0FBQ0gsTUFBTCxFQUFhO0FBQ1gsWUFBTSxJQUFJSSxLQUFKLENBQVUsZ0JBQVYsQ0FBTjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtDLE9BQUwsR0FBZUwsTUFBZjtBQUNEO0FBQ0QsUUFBSSxDQUFDQyxTQUFMLEVBQWdCO0FBQ2QsWUFBTSxJQUFJRyxLQUFKLENBQVUsbUJBQVYsQ0FBTjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtFLFVBQUwsR0FBa0JMLFNBQWxCO0FBQ0Q7QUFDRCxRQUFJLENBQUNDLFdBQUwsRUFBa0I7QUFDaEIsWUFBTSxJQUFJRSxLQUFKLENBQVUscUJBQVYsQ0FBTjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtHLFlBQUwsR0FBb0JMLFdBQXBCO0FBQ0Q7O0FBRUQsWUFBUUEsV0FBUjtBQUNFLFdBQUtNLG1CQUFRQyxTQUFiO0FBQ0UsYUFBS0MsUUFBTCxHQUFnQkMsbUJBQVFGLFNBQXhCO0FBQ0E7QUFDRixXQUFLRCxtQkFBUUksUUFBYjtBQUNFLGFBQUtGLFFBQUwsR0FBZ0JDLG1CQUFRQyxRQUF4QjtBQUNBO0FBQ0YsV0FBS0osbUJBQVFLLFFBQWI7QUFDRSxhQUFLSCxRQUFMLEdBQWdCQyxtQkFBUUUsUUFBeEI7QUFDQTtBQUNGLFdBQUtMLG1CQUFRTSxPQUFiO0FBQ0UsYUFBS0osUUFBTCxHQUFnQkMsbUJBQVFHLE9BQXhCO0FBQ0E7QUFDRixXQUFLTixtQkFBUU8sV0FBYjtBQUNFLGFBQUtMLFFBQUwsR0FBZ0JDLG1CQUFRSSxXQUF4QjtBQUNBO0FBQ0YsV0FBS1AsbUJBQVFRLFNBQWI7QUFDRSxhQUFLTixRQUFMLEdBQWdCQyxtQkFBUUssU0FBeEI7QUFDQTtBQUNGO0FBQ0UsY0FBTSxJQUFJWixLQUFKLENBQVUsMkJBQVYsQ0FBTjtBQUNGO0FBckJGO0FBdUJBLFNBQUthLE9BQUwsR0FBZUMsc0JBQWYsQ0F4Q0EsQ0F3QzRCO0FBQzVCLFNBQUtmLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUlhO0FBQ1gsYUFBTyxLQUFLRSxPQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7d0JBSWdCO0FBQ2QsYUFBTyxLQUFLQyxVQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7d0JBSWtCO0FBQ2hCLGFBQU8sS0FBS2EsWUFBWjtBQUNEOztBQUVEOzs7Ozs7O3NCQU1nQkMsSyxFQUFnQjtBQUFBLHVCQUFYLCtCQUFHLDhCQUFILENBQVc7O0FBQUE7O0FBQzlCLFVBQUlBLEtBQUosRUFBVztBQUNULGFBQUtELFlBQUwsR0FBb0JDLEtBQXBCO0FBQ0EsYUFBS0MsTUFBTCxDQUFZbEIsV0FBWixHQUEwQmlCLEtBQTFCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozt3QkFJYztBQUNaLGFBQU8sS0FBS1YsUUFBWjtBQUNEOztBQUVEOzs7Ozs7O3NCQU1ZWSxHLEVBQWE7QUFBQSxxQkFBViw4QkFBVTs7QUFBQTs7QUFDdkIsVUFBSUEsR0FBSixFQUFTO0FBQ1AsYUFBS1osUUFBTCxHQUFnQlksR0FBaEI7QUFDRDtBQUNGOztBQUVEOzs7Ozs7O3dCQUlhO0FBQ1gsYUFBTyxLQUFLTCxPQUFaO0FBQ0Q7Ozs7OztBQUdITSxPQUFPQyxPQUFQLEdBQWlCekIsU0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBMYXphZGFDbGllbnQgZnJvbSAnc3JjL0xhemFkYUNsaWVudCdcbmltcG9ydCB0eXBlIHsgVmVudHVyZSB9IGZyb20gJ3NyYy90eXBlcy9Db21tb24nXG5pbXBvcnQgeyBWRU5UVVJFLCBHQVRFV0FZIH0gZnJvbSAnc3JjL0xhemFkYUNsaWVudC9jb25zdGFudHMnXG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIEFQSSBpbnRlcmZhY2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcHBLZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcHBTZWNyZXRcbiAqIEBwcm9wZXJ0eSB7VmVudHVyZX0gY291bnRyeUNvZGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nPX0gYWNjZXNzVG9rZW5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBnYXRld2F5XG4gKiBAcHJvcGVydHkge0xhemFkYUNsaWVudH0gY2xpZW50XG4gKi9cbmNsYXNzIExhemFkYUFQSSB7XG4gIF9hcHBLZXk6IHN0cmluZ1xuICBfYXBwU2VjcmV0OiBzdHJpbmdcbiAgX2NvdW50cnlDb2RlOiBWZW50dXJlXG4gIF9hY2Nlc3NUb2tlbjogP3N0cmluZ1xuICBfZ2F0ZXdheTogc3RyaW5nXG4gIF9jbGllbnQ6IGFueVxuXG4gIC8qKlxuICAgKiBMYXphZGFBUEkgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcEtleVxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwU2VjcmV0XG4gICAqIEBwYXJhbSB7VmVudHVyZX0gY291bnRyeUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBhY2Nlc3NUb2tlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgYXBwS2V5OiBzdHJpbmcsXG4gICAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gICAgY291bnRyeUNvZGU6IFZlbnR1cmUsXG4gICAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gICkge1xuICAgIGlmICghYXBwS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXBwS2V5JylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXBwS2V5ID0gYXBwS2V5XG4gICAgfVxuICAgIGlmICghYXBwU2VjcmV0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXBwU2VjcmV0JylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXBwU2VjcmV0ID0gYXBwU2VjcmV0XG4gICAgfVxuICAgIGlmICghY291bnRyeUNvZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBjb3VudHJ5Q29kZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvdW50cnlDb2RlID0gY291bnRyeUNvZGVcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGNvdW50cnlDb2RlKSB7XG4gICAgICBjYXNlIFZFTlRVUkUuU0lOR0FQT1JFOlxuICAgICAgICB0aGlzLl9nYXRld2F5ID0gR0FURVdBWS5TSU5HQVBPUkVcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgVkVOVFVSRS5USEFJTEFORDpcbiAgICAgICAgdGhpcy5fZ2F0ZXdheSA9IEdBVEVXQVkuVEhBSUxBTkRcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgVkVOVFVSRS5NQUxBWVNJQTpcbiAgICAgICAgdGhpcy5fZ2F0ZXdheSA9IEdBVEVXQVkuTUFMQVlTSUFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgVkVOVFVSRS5WSUVUTkFNOlxuICAgICAgICB0aGlzLl9nYXRld2F5ID0gR0FURVdBWS5WSUVUTkFNXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFZFTlRVUkUuUEhJTElQUElORVM6XG4gICAgICAgIHRoaXMuX2dhdGV3YXkgPSBHQVRFV0FZLlBISUxJUFBJTkVTXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFZFTlRVUkUuSU5ET05FU0lBOlxuICAgICAgICB0aGlzLl9nYXRld2F5ID0gR0FURVdBWS5JTkRPTkVTSUFcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bnRyeUNvZGUgbm90IHN1cHBvcnRlZCcpXG4gICAgICAvLyBicmVha1xuICAgIH1cbiAgICB0aGlzLl9jbGllbnQgPSBMYXphZGFDbGllbnQgLy8gbmV3IExhemFkYUNsaWVudChhcHBLZXksIGFwcFNlY3JldCwgY291bnRyeUNvZGUpXG4gICAgdGhpcy5hY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuXG4gIH1cblxuICAvKipcbiAgICogR2V0IGluc3RhbmNlJ3MgYXBwIGtleVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXBwS2V5KCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBLZXlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgaW5zdGFuY2UncyBhcHAgc2VjcmV0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhcHBTZWNyZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcFNlY3JldFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBpbnN0YW5jZSdzIGFjY2VzcyB0b2tlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYWNjZXNzVG9rZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjY2Vzc1Rva2VuXG4gIH1cblxuICAvKipcbiAgICogU2V0IGluc3RhbmNlJ3MgYW5kIGNsaWVudCdzIGFjY2VzcyB0b2tlbiAoaWYgZ2l2ZW4pXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlblxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBzZXQgYWNjZXNzVG9rZW4odG9rZW46ID9zdHJpbmcpIHtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuID0gdG9rZW5cbiAgICAgIHRoaXMuY2xpZW50LmFjY2Vzc1Rva2VuID0gdG9rZW5cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IGluc3RhbmNlJ3MgYXBpIGxvY2F0aW9uIHNwZWNpZmljIGdhdGV3YXlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGdhdGV3YXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dhdGV3YXlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgaW5zdGFuY2UncyBhcGkgbG9jYXRpb24gc3BlY2lmaWMgZ2F0ZXdheVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBzZXQgZ2F0ZXdheSh1cmw6IHN0cmluZykge1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHRoaXMuX2dhdGV3YXkgPSB1cmxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IExhemFkYUNsaWVudCBvYmplY3RcbiAgICogQHJldHVybiB7TGF6YWRhQ2xpZW50fVxuICAgKi9cbiAgZ2V0IGNsaWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xpZW50XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXphZGFBUElcbiJdfQ==