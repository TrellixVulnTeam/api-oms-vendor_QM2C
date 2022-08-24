'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

var _Common = require('./types/Common');

var _Product = require('./types/Product');

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

var ProductFilter = _flowRuntime2.default.tdz(function () {
  return _Product.ProductFilter;
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
 * getProducts GET /products/get
 * @param {Object} payload
 * filter           :require 'all', 'live', 'inactive', 'deleted', 'image-missing', 'pending', 'rejected', 'sold-out'
 * search            search by product name and/or Seller SKU.
 * offset
 * limit             20 as default. maximum products 500.
 * options           Options=1 means contain ReservedStock, RtsStock, PendingStock, RealTimeStock, FulfillmentBySellable.
 * sku_seller_list   JSON array (stringify). A maximum of 100 SKUs can be returned.
 * update_before     ISO 8601 date format
 * create_before     ISO 8601 date format
 * create_after      ISO 8601 date format
 * update_after      ISO 8601 date format
 */
var getProducts = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getProducts(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType = _flowRuntime2.default.string();

  var _appSecretType = _flowRuntime2.default.string();

  var _gatewayType = _flowRuntime2.default.string();

  var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType = _flowRuntime2.default.object(_flowRuntime2.default.property('filter', _flowRuntime2.default.ref(ProductFilter)), _flowRuntime2.default.property('search', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('offset', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('limit', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('options', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('sku_seller_list', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('create_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('create_after', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_after', _flowRuntime2.default.string(), true));

  var _actionType = _flowRuntime2.default.ref(HttpAction);

  var _protocolType2 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType).assert(payload);

  _flowRuntime2.default.param('action', _actionType, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType2, true).assert(protocol);

  var apiPath = '/products/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('filter', _flowRuntime2.default.ref(ProductFilter)), _flowRuntime2.default.property('search', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('offset', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('limit', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('options', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('sku_seller_list', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('create_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('create_after', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_after', _flowRuntime2.default.string(), true))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Retrieve the list of all product categories in the system
 */
var getCategoryTree = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getCategoryTree(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType2 = _flowRuntime2.default.string();

  var _appSecretType2 = _flowRuntime2.default.string();

  var _gatewayType2 = _flowRuntime2.default.string();

  var _accessTokenType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType2 = _flowRuntime2.default.any();

  var _actionType2 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType3 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType2).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType2).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType2).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType2).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType2).assert(payload);

  _flowRuntime2.default.param('action', _actionType2, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType3, true).assert(protocol);

  var apiPath = '/category/tree/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, undefined);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.any()), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Get a list of attributes for a specified product category.
 * @param {Object} payload
 * primary_category_id :require
 */
var getCategoryAttributes = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getCategoryAttributes(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType3 = _flowRuntime2.default.string();

  var _appSecretType3 = _flowRuntime2.default.string();

  var _gatewayType3 = _flowRuntime2.default.string();

  var _accessTokenType3 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType3 = _flowRuntime2.default.object(_flowRuntime2.default.property('primary_category_id', _flowRuntime2.default.string()));

  var _actionType3 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType4 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType3).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType3).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType3).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType3).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType3).assert(payload);

  _flowRuntime2.default.param('action', _actionType3, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType4, true).assert(protocol);

  var apiPath = '/category/attributes/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, undefined, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('primary_category_id', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Retrieve all product brands in the system.
 * @param {Object} payload
 * offset :require
 * limit  :require // default 100, maximum 1,000
 */
var getBrands = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getBrands(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType4 = _flowRuntime2.default.string();

  var _appSecretType4 = _flowRuntime2.default.string();

  var _gatewayType4 = _flowRuntime2.default.string();

  var _accessTokenType4 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType4 = _flowRuntime2.default.object(_flowRuntime2.default.property('offset', _flowRuntime2.default.string()), _flowRuntime2.default.property('limit', _flowRuntime2.default.string()));

  var _actionType4 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType5 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType4).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType4).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType4).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType4).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType4).assert(payload);

  _flowRuntime2.default.param('action', _actionType4, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType5, true).assert(protocol);

  var apiPath = '/brands/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, undefined, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('offset', _flowRuntime2.default.string()), _flowRuntime2.default.property('limit', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * TODO:
 * @param {Object} payload xml string
 * @ref https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.2de238e4eebY8v#?nodeId=10557&docId=108253
 */
var createProduct = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function createProduct(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType5 = _flowRuntime2.default.string();

  var _appSecretType5 = _flowRuntime2.default.string();

  var _gatewayType5 = _flowRuntime2.default.string();

  var _accessTokenType5 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType5 = _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()));

  var _actionType5 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType6 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType5).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType5).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType5).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType5).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType5).assert(payload);

  _flowRuntime2.default.param('action', _actionType5, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType6, true).assert(protocol);

  var apiPath = '/product/create';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 *
 * @param {Object} payload
 * payload xml string
 * @ref https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.6e6e38e475ZXlW#?nodeId=10557&docId=108252
 */
var updateProduct = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function updateProduct(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType6 = _flowRuntime2.default.string();

  var _appSecretType6 = _flowRuntime2.default.string();

  var _gatewayType6 = _flowRuntime2.default.string();

  var _accessTokenType6 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType6 = _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()));

  var _actionType6 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType7 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType6).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType6).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType6).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType6).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType6).assert(payload);

  _flowRuntime2.default.param('action', _actionType6, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType7, true).assert(protocol);

  var apiPath = '/product/update';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Migrate a single image from an external site to Lazada site.
 * Allowed image formats are JPG and PNG.
 * The maximum size of an image file is 1MB.
 * @param {Object} payload
 * ??
 */
var migrateImage = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function migrateImage(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType7 = _flowRuntime2.default.string();

  var _appSecretType7 = _flowRuntime2.default.string();

  var _gatewayType7 = _flowRuntime2.default.string();

  var _accessTokenType7 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType7 = _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()));

  var _actionType7 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType8 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType7).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType7).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType7).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType7).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType7).assert(payload);

  _flowRuntime2.default.param('action', _actionType7, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType8, true).assert(protocol);

  var apiPath = '/image/migrate';
  var baseURL = getScheme(protocol) + gateway;

  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Set the images for an existing product by associating one or more image URLs with it.
 * @param {Object} payload
 * @ref https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.2de238e4eebY8v#?nodeId=10557&docId=108254
 */
var setImages = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function setImages(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType8 = _flowRuntime2.default.string();

  var _appSecretType8 = _flowRuntime2.default.string();

  var _gatewayType8 = _flowRuntime2.default.string();

  var _accessTokenType8 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType8 = _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()));

  var _actionType8 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType9 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType8).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType8).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType8).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType8).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType8).assert(payload);

  _flowRuntime2.default.param('action', _actionType8, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType9, true).assert(protocol);

  var apiPath = '/images/set';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Update the price and quantity of one or more existing products.
 * The maximum number of products that can be updated is 50, but 20 is recommended.
 * @param {string} payload
 * @ref https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.2de238e4eebY8v#?nodeId=10557&docId=108251
 */
var updatePriceQuantity = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function updatePriceQuantity(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType9 = _flowRuntime2.default.string();

  var _appSecretType9 = _flowRuntime2.default.string();

  var _gatewayType9 = _flowRuntime2.default.string();

  var _accessTokenType9 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType9 = _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()));

  var _actionType9 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType10 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType9).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType9).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType9).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType9).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType9).assert(payload);

  _flowRuntime2.default.param('action', _actionType9, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType10, true).assert(protocol);

  var apiPath = '/product/price_quantity/update';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('payload', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * To remove an existing product, some SKUs in one product, or all SKUs in one product.
 * System supports a maximum number of 50 SellerSkus in one request
 * @param {Object} payload
 * seller_sku_list // Seller SKU in a json list e.g. ["asd","vvv","sss"], max 50 SellerSkus
 */
var removeProduct = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function removeProduct(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType10 = _flowRuntime2.default.string();

  var _appSecretType10 = _flowRuntime2.default.string();

  var _gatewayType10 = _flowRuntime2.default.string();

  var _accessTokenType10 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType10 = _flowRuntime2.default.object(_flowRuntime2.default.property('seller_sku_list', _flowRuntime2.default.string()));

  var _actionType10 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType11 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType10).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType10).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType10).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType10).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType10).assert(payload);

  _flowRuntime2.default.param('action', _actionType10, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType11, true).assert(protocol);

  var apiPath = '/product/remove';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('seller_sku_list', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

exports.default = {
  getProducts: getProducts,
  getCategoryTree: getCategoryTree,
  getCategoryAttributes: getCategoryAttributes,
  getBrands: getBrands,
  createProduct: createProduct,
  updateProduct: updateProduct,
  migrateImage: migrateImage,
  setImages: setImages,
  updatePriceQuantity: updatePriceQuantity,
  removeProduct: removeProduct
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXphZGFDbGllbnQvcHJvZHVjdC5qcyJdLCJuYW1lcyI6WyJnZXRTY2hlbWUiLCJwcm90b2NvbCIsIlBST1RPQ09MIiwiSFRUUCIsImFwcEtleSIsImFwcFNlY3JldCIsImdhdGV3YXkiLCJhY2Nlc3NUb2tlbiIsInBheWxvYWQiLCJhY3Rpb24iLCJIVFRQX0FDVElPTiIsIkdFVCIsIkhUVFBTIiwiYXBpUGF0aCIsImJhc2VVUkwiLCJMYXphZGFSZXF1ZXN0IiwiZ2V0IiwidW5kZWZpbmVkIiwicG9zdCIsImdldFByb2R1Y3RzIiwiZ2V0Q2F0ZWdvcnlUcmVlIiwiZ2V0Q2F0ZWdvcnlBdHRyaWJ1dGVzIiwiZ2V0QnJhbmRzIiwiY3JlYXRlUHJvZHVjdCIsInVwZGF0ZVByb2R1Y3QiLCJtaWdyYXRlSW1hZ2UiLCJzZXRJbWFnZXMiLCJ1cGRhdGVQcmljZVF1YW50aXR5IiwicmVtb3ZlUHJvZHVjdCJdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDJDQUFZLG1CQUFDQyxRQUFELEVBQWdDO0FBQUEsc0JBQXZCLG1DQUF1Qjs7QUFBQSxpREFBViw4QkFBVTs7QUFBQTs7QUFDaEQsNEJBQU9BLGFBQWFDLHFCQUFTQyxJQUF0QixHQUE2QixTQUE3QixHQUF5QyxVQUFoRDtBQUNELENBRkssRUFBWSx1RUFBUyxtQ0FBVCxnQ0FBb0IsOEJBQXBCLEVBQVosQ0FBTjs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxrQkFBaUIsb0NBQWpCLHVDQUErQixxQkFDN0JDLE1BRDZCLEVBRTdCQyxTQUY2QixFQUc3QkMsT0FINkIsRUFJN0JDLFdBSjZCLEVBSzdCQyxPQUw2QixFQW1CMUI7QUFBQSxNQUZIQyxNQUVHLHVFQUZtQkMsd0JBQVlDLEdBRS9CO0FBQUEsTUFESFYsUUFDRyx1RUFEbUJDLHFCQUFTVSxLQUM1Qjs7QUFBQSxvQkFsQkcsOEJBa0JIOztBQUFBLHVCQWpCTSw4QkFpQk47O0FBQUEscUJBaEJJLDhCQWdCSjs7QUFBQSx5QkFmUSwrQkFBRyw4QkFBSCxDQWVSOztBQUFBLHFCQWRJLDZCQUNMLHlDQUFRLHdDQUFSLENBREssRUFFTCx5Q0FBUyw4QkFBVCxPQUZLLEVBR0wseUNBQVMsOEJBQVQsT0FISyxFQUlMLHdDQUFRLDhCQUFSLE9BSkssRUFLTCwwQ0FBVSw4QkFBVixPQUxLLEVBTUwsa0RBQWtCLDhCQUFsQixPQU5LLEVBT0wsZ0RBQWdCLDhCQUFoQixPQVBLLEVBUUwsZ0RBQWdCLDhCQUFoQixPQVJLLEVBU0wsK0NBQWUsOEJBQWYsT0FUSyxFQVVMLCtDQUFlLDhCQUFmLE9BVkssQ0FjSjs7QUFBQSxvQkFGSSxxQ0FFSjs7QUFBQSx1QkFETSxtQ0FDTjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDSCxNQUFNQyxVQUFVLGVBQWhCO0FBQ0EsTUFBTUMsVUFBVWQsVUFBVUMsUUFBVixJQUFzQkssT0FBdEM7QUFDQSxTQUFPUyx3QkFBY0MsR0FBZCxDQUNMRixPQURLLEVBRUxWLE1BRkssRUFHTEMsU0FISyxFQUlMUSxPQUpLLEVBS0xOLFdBTEssRUFNTEMsT0FOSyxDQUFQO0FBUUQsQ0E5QkQsRUFBK0IscUVBQ3ZCLDhCQUR1Qiw0Q0FFcEIsOEJBRm9CLDBDQUd0Qiw4QkFIc0IsOENBSWxCLCtCQUFHLDhCQUFILENBSmtCLDBDQUt0Qiw2QkFDTCx5Q0FBUSx3Q0FBUixDQURLLEVBRUwseUNBQVMsOEJBQVQsT0FGSyxFQUdMLHlDQUFTLDhCQUFULE9BSEssRUFJTCx3Q0FBUSw4QkFBUixPQUpLLEVBS0wsMENBQVUsOEJBQVYsT0FMSyxFQU1MLGtEQUFrQiw4QkFBbEIsT0FOSyxFQU9MLGdEQUFnQiw4QkFBaEIsT0FQSyxFQVFMLGdEQUFnQiw4QkFBaEIsT0FSSyxFQVNMLCtDQUFlLDhCQUFmLE9BVEssRUFVTCwrQ0FBZSw4QkFBZixPQVZLLENBTHNCLHlDQWlCdEIscUNBakJzQiwyQ0FrQnBCLG1DQWxCb0IsRUFBL0I7O0FBZ0NBOzs7QUFHQSxzQkFBcUIsb0NBQXJCLHVDQUFtQyx5QkFDakNKLE1BRGlDLEVBRWpDQyxTQUZpQyxFQUdqQ0MsT0FIaUMsRUFJakNDLFdBSmlDLEVBS2pDQyxPQUxpQyxFQVE5QjtBQUFBLE1BRkhDLE1BRUcsdUVBRm1CQyx3QkFBWUMsR0FFL0I7QUFBQSxNQURIVixRQUNHLHVFQURtQkMscUJBQVNVLEtBQzVCOztBQUFBLHFCQVBHLDhCQU9IOztBQUFBLHdCQU5NLDhCQU1OOztBQUFBLHNCQUxJLDhCQUtKOztBQUFBLDBCQUpRLCtCQUFHLDhCQUFILENBSVI7O0FBQUEsc0JBSEksMkJBR0o7O0FBQUEscUJBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxvQkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCSyxPQUF0QztBQUNBLFNBQU9TLHdCQUFjQyxHQUFkLENBQWtCRixPQUFsQixFQUEyQlYsTUFBM0IsRUFBbUNDLFNBQW5DLEVBQThDUSxPQUE5QyxFQUF1REksU0FBdkQsQ0FBUDtBQUNELENBWkQsRUFBbUMscUVBQzNCLDhCQUQyQiw0Q0FFeEIsOEJBRndCLDBDQUcxQiw4QkFIMEIsOENBSXRCLCtCQUFHLDhCQUFILENBSnNCLDBDQUsxQiwyQkFMMEIseUNBTTFCLHFDQU4wQiwyQ0FPeEIsbUNBUHdCLEVBQW5DOztBQWNBOzs7OztBQUtBLDRCQUEyQixvQ0FBM0IsdUNBQXlDLCtCQUN2Q2IsTUFEdUMsRUFFdkNDLFNBRnVDLEVBR3ZDQyxPQUh1QyxFQUl2Q0MsV0FKdUMsRUFLdkNDLE9BTHVDLEVBVXBDO0FBQUEsTUFGSEMsTUFFRyx1RUFGbUJDLHdCQUFZQyxHQUUvQjtBQUFBLE1BREhWLFFBQ0csdUVBRG1CQyxxQkFBU1UsS0FDNUI7O0FBQUEscUJBVEcsOEJBU0g7O0FBQUEsd0JBUk0sOEJBUU47O0FBQUEsc0JBUEksOEJBT0o7O0FBQUEsMEJBTlEsK0JBQUcsOEJBQUgsQ0FNUjs7QUFBQSxzQkFMSSw2QkFDTCxzREFBcUIsOEJBQXJCLENBREssQ0FLSjs7QUFBQSxxQkFGSSxxQ0FFSjs7QUFBQSx1QkFETSxtQ0FDTjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDSCxNQUFNQyxVQUFVLDBCQUFoQjtBQUNBLE1BQU1DLFVBQVVkLFVBQVVDLFFBQVYsSUFBc0JLLE9BQXRDO0FBQ0EsU0FBT1Msd0JBQWNDLEdBQWQsQ0FDTEYsT0FESyxFQUVMVixNQUZLLEVBR0xDLFNBSEssRUFJTFEsT0FKSyxFQUtMSSxTQUxLLEVBTUxULE9BTkssQ0FBUDtBQVFELENBckJELEVBQXlDLHFFQUNqQyw4QkFEaUMsNENBRTlCLDhCQUY4QiwwQ0FHaEMsOEJBSGdDLDhDQUk1QiwrQkFBRyw4QkFBSCxDQUo0QiwwQ0FLaEMsNkJBQ0wsc0RBQXFCLDhCQUFyQixDQURLLENBTGdDLHlDQVFoQyxxQ0FSZ0MsMkNBUzlCLG1DQVQ4QixFQUF6Qzs7QUF1QkE7Ozs7OztBQU1BLGdCQUFlLG9DQUFmLHVDQUE2QixtQkFDM0JKLE1BRDJCLEVBRTNCQyxTQUYyQixFQUczQkMsT0FIMkIsRUFJM0JDLFdBSjJCLEVBSzNCQyxPQUwyQixFQVF4QjtBQUFBLE1BRkhDLE1BRUcsdUVBRm1CQyx3QkFBWUMsR0FFL0I7QUFBQSxNQURIVixRQUNHLHVFQURtQkMscUJBQVNVLEtBQzVCOztBQUFBLHFCQVBHLDhCQU9IOztBQUFBLHdCQU5NLDhCQU1OOztBQUFBLHNCQUxJLDhCQUtKOztBQUFBLDBCQUpRLCtCQUFHLDhCQUFILENBSVI7O0FBQUEsc0JBSEksNkJBQUkseUNBQVEsOEJBQVIsQ0FBSixFQUFvQix3Q0FBTyw4QkFBUCxDQUFwQixDQUdKOztBQUFBLHFCQUZJLHFDQUVKOztBQUFBLHVCQURNLG1DQUNOOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNILE1BQU1DLFVBQVUsYUFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCSyxPQUF0QztBQUNBLFNBQU9TLHdCQUFjQyxHQUFkLENBQ0xGLE9BREssRUFFTFYsTUFGSyxFQUdMQyxTQUhLLEVBSUxRLE9BSkssRUFLTEksU0FMSyxFQU1MVCxPQU5LLENBQVA7QUFRRCxDQW5CRCxFQUE2QixxRUFDckIsOEJBRHFCLDRDQUVsQiw4QkFGa0IsMENBR3BCLDhCQUhvQiw4Q0FJaEIsK0JBQUcsOEJBQUgsQ0FKZ0IsMENBS3BCLDZCQUFJLHlDQUFRLDhCQUFSLENBQUosRUFBb0Isd0NBQU8sOEJBQVAsQ0FBcEIsQ0FMb0IseUNBTXBCLHFDQU5vQiwyQ0FPbEIsbUNBUGtCLEVBQTdCOztBQXFCQTs7Ozs7QUFLQSxvQkFBbUIsb0NBQW5CLHVDQUFpQyx1QkFDL0JKLE1BRCtCLEVBRS9CQyxTQUYrQixFQUcvQkMsT0FIK0IsRUFJL0JDLFdBSitCLEVBSy9CQyxPQUwrQixFQVU1QjtBQUFBLE1BRkhDLE1BRUcsdUVBRm1CQyx3QkFBWUMsR0FFL0I7QUFBQSxNQURIVixRQUNHLHVFQURtQkMscUJBQVNVLEtBQzVCOztBQUFBLHFCQVRHLDhCQVNIOztBQUFBLHdCQVJNLDhCQVFOOztBQUFBLHNCQVBJLDhCQU9KOztBQUFBLDBCQU5RLCtCQUFHLDhCQUFILENBTVI7O0FBQUEsc0JBTEksNkJBQ0wsMENBQVMsOEJBQVQsQ0FESyxDQUtKOztBQUFBLHFCQUZJLHFDQUVKOztBQUFBLHVCQURNLG1DQUNOOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNILE1BQU1DLFVBQVUsaUJBQWhCO0FBQ0EsTUFBTUMsVUFBVWQsVUFBVUMsUUFBVixJQUFzQkssT0FBdEM7QUFDQSxTQUFPUyx3QkFBY0csSUFBZCxDQUNMSixPQURLLEVBRUxWLE1BRkssRUFHTEMsU0FISyxFQUlMUSxPQUpLLEVBS0xOLFdBTEssRUFNTEMsT0FOSyxDQUFQO0FBUUQsQ0FyQkQsRUFBaUMscUVBQ3pCLDhCQUR5Qiw0Q0FFdEIsOEJBRnNCLDBDQUd4Qiw4QkFId0IsOENBSXBCLCtCQUFHLDhCQUFILENBSm9CLDBDQUt4Qiw2QkFDTCwwQ0FBUyw4QkFBVCxDQURLLENBTHdCLHlDQVF4QixxQ0FSd0IsMkNBU3RCLG1DQVRzQixFQUFqQzs7QUF1QkE7Ozs7OztBQU1BLG9CQUFtQixvQ0FBbkIsdUNBQWlDLHVCQUMvQkosTUFEK0IsRUFFL0JDLFNBRitCLEVBRy9CQyxPQUgrQixFQUkvQkMsV0FKK0IsRUFLL0JDLE9BTCtCLEVBVTVCO0FBQUEsTUFGSEMsTUFFRyx1RUFGbUJDLHdCQUFZQyxHQUUvQjtBQUFBLE1BREhWLFFBQ0csdUVBRG1CQyxxQkFBU1UsS0FDNUI7O0FBQUEscUJBVEcsOEJBU0g7O0FBQUEsd0JBUk0sOEJBUU47O0FBQUEsc0JBUEksOEJBT0o7O0FBQUEsMEJBTlEsK0JBQUcsOEJBQUgsQ0FNUjs7QUFBQSxzQkFMSSw2QkFDTCwwQ0FBUyw4QkFBVCxDQURLLENBS0o7O0FBQUEscUJBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxpQkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCSyxPQUF0QztBQUNBLFNBQU9TLHdCQUFjRyxJQUFkLENBQ0xKLE9BREssRUFFTFYsTUFGSyxFQUdMQyxTQUhLLEVBSUxRLE9BSkssRUFLTE4sV0FMSyxFQU1MQyxPQU5LLENBQVA7QUFRRCxDQXJCRCxFQUFpQyxxRUFDekIsOEJBRHlCLDRDQUV0Qiw4QkFGc0IsMENBR3hCLDhCQUh3Qiw4Q0FJcEIsK0JBQUcsOEJBQUgsQ0FKb0IsMENBS3hCLDZCQUNMLDBDQUFTLDhCQUFULENBREssQ0FMd0IseUNBUXhCLHFDQVJ3QiwyQ0FTdEIsbUNBVHNCLEVBQWpDOztBQXVCQTs7Ozs7OztBQU9BLG1CQUFrQixvQ0FBbEIsdUNBQWdDLHNCQUM5QkosTUFEOEIsRUFFOUJDLFNBRjhCLEVBRzlCQyxPQUg4QixFQUk5QkMsV0FKOEIsRUFLOUJDLE9BTDhCLEVBVTNCO0FBQUEsTUFGSEMsTUFFRyx1RUFGbUJDLHdCQUFZQyxHQUUvQjtBQUFBLE1BREhWLFFBQ0csdUVBRG1CQyxxQkFBU1UsS0FDNUI7O0FBQUEscUJBVEcsOEJBU0g7O0FBQUEsd0JBUk0sOEJBUU47O0FBQUEsc0JBUEksOEJBT0o7O0FBQUEsMEJBTlEsK0JBQUcsOEJBQUgsQ0FNUjs7QUFBQSxzQkFMSSw2QkFDTCwwQ0FBUyw4QkFBVCxDQURLLENBS0o7O0FBQUEscUJBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxnQkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCSyxPQUF0Qzs7QUFFQSxTQUFPUyx3QkFBY0csSUFBZCxDQUNMSixPQURLLEVBRUxWLE1BRkssRUFHTEMsU0FISyxFQUlMUSxPQUpLLEVBS0xOLFdBTEssRUFNTEMsT0FOSyxDQUFQO0FBUUQsQ0F0QkQsRUFBZ0MscUVBQ3hCLDhCQUR3Qiw0Q0FFckIsOEJBRnFCLDBDQUd2Qiw4QkFIdUIsOENBSW5CLCtCQUFHLDhCQUFILENBSm1CLDBDQUt2Qiw2QkFDTCwwQ0FBUyw4QkFBVCxDQURLLENBTHVCLHlDQVF2QixxQ0FSdUIsMkNBU3JCLG1DQVRxQixFQUFoQzs7QUF3QkE7Ozs7O0FBS0EsZ0JBQWUsb0NBQWYsdUNBQTZCLG1CQUMzQkosTUFEMkIsRUFFM0JDLFNBRjJCLEVBRzNCQyxPQUgyQixFQUkzQkMsV0FKMkIsRUFLM0JDLE9BTDJCLEVBVXhCO0FBQUEsTUFGSEMsTUFFRyx1RUFGbUJDLHdCQUFZQyxHQUUvQjtBQUFBLE1BREhWLFFBQ0csdUVBRG1CQyxxQkFBU1UsS0FDNUI7O0FBQUEscUJBVEcsOEJBU0g7O0FBQUEsd0JBUk0sOEJBUU47O0FBQUEsc0JBUEksOEJBT0o7O0FBQUEsMEJBTlEsK0JBQUcsOEJBQUgsQ0FNUjs7QUFBQSxzQkFMSSw2QkFDTCwwQ0FBUyw4QkFBVCxDQURLLENBS0o7O0FBQUEscUJBRkkscUNBRUo7O0FBQUEsdUJBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxhQUFoQjtBQUNBLE1BQU1DLFVBQVVkLFVBQVVDLFFBQVYsSUFBc0JLLE9BQXRDO0FBQ0EsU0FBT1Msd0JBQWNHLElBQWQsQ0FDTEosT0FESyxFQUVMVixNQUZLLEVBR0xDLFNBSEssRUFJTFEsT0FKSyxFQUtMTixXQUxLLEVBTUxDLE9BTkssQ0FBUDtBQVFELENBckJELEVBQTZCLHFFQUNyQiw4QkFEcUIsNENBRWxCLDhCQUZrQiwwQ0FHcEIsOEJBSG9CLDhDQUloQiwrQkFBRyw4QkFBSCxDQUpnQiwwQ0FLcEIsNkJBQ0wsMENBQVMsOEJBQVQsQ0FESyxDQUxvQix5Q0FRcEIscUNBUm9CLDJDQVNsQixtQ0FUa0IsRUFBN0I7O0FBdUJBOzs7Ozs7QUFNQSwwQkFBeUIsb0NBQXpCLHVDQUF1Qyw2QkFDckNKLE1BRHFDLEVBRXJDQyxTQUZxQyxFQUdyQ0MsT0FIcUMsRUFJckNDLFdBSnFDLEVBS3JDQyxPQUxxQyxFQVVsQztBQUFBLE1BRkhDLE1BRUcsdUVBRm1CQyx3QkFBWUMsR0FFL0I7QUFBQSxNQURIVixRQUNHLHVFQURtQkMscUJBQVNVLEtBQzVCOztBQUFBLHFCQVRHLDhCQVNIOztBQUFBLHdCQVJNLDhCQVFOOztBQUFBLHNCQVBJLDhCQU9KOztBQUFBLDBCQU5RLCtCQUFHLDhCQUFILENBTVI7O0FBQUEsc0JBTEksNkJBQ0wsMENBQVMsOEJBQVQsQ0FESyxDQUtKOztBQUFBLHFCQUZJLHFDQUVKOztBQUFBLHdCQURNLG1DQUNOOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNILE1BQU1DLFVBQVUsZ0NBQWhCO0FBQ0EsTUFBTUMsVUFBVWQsVUFBVUMsUUFBVixJQUFzQkssT0FBdEM7QUFDQSxTQUFPUyx3QkFBY0csSUFBZCxDQUNMSixPQURLLEVBRUxWLE1BRkssRUFHTEMsU0FISyxFQUlMUSxPQUpLLEVBS0xOLFdBTEssRUFNTEMsT0FOSyxDQUFQO0FBUUQsQ0FyQkQsRUFBdUMscUVBQy9CLDhCQUQrQiw0Q0FFNUIsOEJBRjRCLDBDQUc5Qiw4QkFIOEIsOENBSTFCLCtCQUFHLDhCQUFILENBSjBCLDBDQUs5Qiw2QkFDTCwwQ0FBUyw4QkFBVCxDQURLLENBTDhCLHlDQVE5QixxQ0FSOEIsMkNBUzVCLG1DQVQ0QixFQUF2Qzs7QUF1QkE7Ozs7OztBQU1BLG9CQUFtQixvQ0FBbkIsdUNBQWlDLHVCQUMvQkosTUFEK0IsRUFFL0JDLFNBRitCLEVBRy9CQyxPQUgrQixFQUkvQkMsV0FKK0IsRUFLL0JDLE9BTCtCLEVBVTVCO0FBQUEsTUFGSEMsTUFFRyx1RUFGbUJDLHdCQUFZQyxHQUUvQjtBQUFBLE1BREhWLFFBQ0csdUVBRG1CQyxxQkFBU1UsS0FDNUI7O0FBQUEsc0JBVEcsOEJBU0g7O0FBQUEseUJBUk0sOEJBUU47O0FBQUEsdUJBUEksOEJBT0o7O0FBQUEsMkJBTlEsK0JBQUcsOEJBQUgsQ0FNUjs7QUFBQSx1QkFMSSw2QkFDTCxrREFBaUIsOEJBQWpCLENBREssQ0FLSjs7QUFBQSxzQkFGSSxxQ0FFSjs7QUFBQSx3QkFETSxtQ0FDTjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDSCxNQUFNQyxVQUFVLGlCQUFoQjtBQUNBLE1BQU1DLFVBQVVkLFVBQVVDLFFBQVYsSUFBc0JLLE9BQXRDO0FBQ0EsU0FBT1Msd0JBQWNHLElBQWQsQ0FDTEosT0FESyxFQUVMVixNQUZLLEVBR0xDLFNBSEssRUFJTFEsT0FKSyxFQUtMTixXQUxLLEVBTUxDLE9BTkssQ0FBUDtBQVFELENBckJELEVBQWlDLHFFQUN6Qiw4QkFEeUIsNENBRXRCLDhCQUZzQiwwQ0FHeEIsOEJBSHdCLDhDQUlwQiwrQkFBRyw4QkFBSCxDQUpvQiwwQ0FLeEIsNkJBQ0wsa0RBQWlCLDhCQUFqQixDQURLLENBTHdCLHlDQVF4QixxQ0FSd0IsMkNBU3RCLG1DQVRzQixFQUFqQzs7a0JBdUJlO0FBQ2JXLDBCQURhO0FBRWJDLGtDQUZhO0FBR2JDLDhDQUhhO0FBSWJDLHNCQUphO0FBS2JDLDhCQUxhO0FBTWJDLDhCQU5hO0FBT2JDLDRCQVBhO0FBUWJDLHNCQVJhO0FBU2JDLDBDQVRhO0FBVWJDO0FBVmEsQyIsImZpbGUiOiJwcm9kdWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBHQVRFV0FZIH0gZnJvbSAnLi9jb25zdGFudHMnXG5pbXBvcnQgdHlwZSB7IEFQSUFjdGlvbiB9IGZyb20gJy4vdHlwZXMvQ29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBQcm9kdWN0RmlsdGVyIH0gZnJvbSAnLi90eXBlcy9Qcm9kdWN0J1xuXG5pbXBvcnQgTGF6YWRhUmVxdWVzdCBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdCdcbmltcG9ydCB7IFBST1RPQ09MLCBIVFRQX0FDVElPTiB9IGZyb20gJ3NyYy9MYXphZGFSZXF1ZXN0L2NvbnN0YW50cydcbmltcG9ydCB0eXBlIHsgUHJvdG9jb2wsIEh0dHBBY3Rpb24gfSBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdC90eXBlcy9SZXF1ZXN0J1xuXG5jb25zdCBnZXRTY2hlbWUgPSAocHJvdG9jb2w6IFByb3RvY29sKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIHByb3RvY29sID09PSBQUk9UT0NPTC5IVFRQID8gJ2h0dHA6Ly8nIDogJ2h0dHBzOi8vJ1xufVxuXG4vKipcbiAqIGdldFByb2R1Y3RzIEdFVCAvcHJvZHVjdHMvZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICogZmlsdGVyICAgICAgICAgICA6cmVxdWlyZSAnYWxsJywgJ2xpdmUnLCAnaW5hY3RpdmUnLCAnZGVsZXRlZCcsICdpbWFnZS1taXNzaW5nJywgJ3BlbmRpbmcnLCAncmVqZWN0ZWQnLCAnc29sZC1vdXQnXG4gKiBzZWFyY2ggICAgICAgICAgICBzZWFyY2ggYnkgcHJvZHVjdCBuYW1lIGFuZC9vciBTZWxsZXIgU0tVLlxuICogb2Zmc2V0XG4gKiBsaW1pdCAgICAgICAgICAgICAyMCBhcyBkZWZhdWx0LiBtYXhpbXVtIHByb2R1Y3RzIDUwMC5cbiAqIG9wdGlvbnMgICAgICAgICAgIE9wdGlvbnM9MSBtZWFucyBjb250YWluIFJlc2VydmVkU3RvY2ssIFJ0c1N0b2NrLCBQZW5kaW5nU3RvY2ssIFJlYWxUaW1lU3RvY2ssIEZ1bGZpbGxtZW50QnlTZWxsYWJsZS5cbiAqIHNrdV9zZWxsZXJfbGlzdCAgIEpTT04gYXJyYXkgKHN0cmluZ2lmeSkuIEEgbWF4aW11bSBvZiAxMDAgU0tVcyBjYW4gYmUgcmV0dXJuZWQuXG4gKiB1cGRhdGVfYmVmb3JlICAgICBJU08gODYwMSBkYXRlIGZvcm1hdFxuICogY3JlYXRlX2JlZm9yZSAgICAgSVNPIDg2MDEgZGF0ZSBmb3JtYXRcbiAqIGNyZWF0ZV9hZnRlciAgICAgIElTTyA4NjAxIGRhdGUgZm9ybWF0XG4gKiB1cGRhdGVfYWZ0ZXIgICAgICBJU08gODYwMSBkYXRlIGZvcm1hdFxuICovXG5jb25zdCBnZXRQcm9kdWN0czogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBmaWx0ZXI6IFByb2R1Y3RGaWx0ZXIsXG4gICAgc2VhcmNoPzogc3RyaW5nLFxuICAgIG9mZnNldD86IG51bWJlcixcbiAgICBsaW1pdD86IG51bWJlcixcbiAgICBvcHRpb25zPzogbnVtYmVyLFxuICAgIHNrdV9zZWxsZXJfbGlzdD86IHN0cmluZyxcbiAgICB1cGRhdGVfYmVmb3JlPzogc3RyaW5nLFxuICAgIGNyZWF0ZV9iZWZvcmU/OiBzdHJpbmcsXG4gICAgY3JlYXRlX2FmdGVyPzogc3RyaW5nLFxuICAgIHVwZGF0ZV9hZnRlcj86IHN0cmluZyxcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLkdFVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL3Byb2R1Y3RzL2dldCdcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG4gIHJldHVybiBMYXphZGFSZXF1ZXN0LmdldChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGxpc3Qgb2YgYWxsIHByb2R1Y3QgY2F0ZWdvcmllcyBpbiB0aGUgc3lzdGVtXG4gKi9cbmNvbnN0IGdldENhdGVnb3J5VHJlZTogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IGFueSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLkdFVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL2NhdGVnb3J5L3RyZWUvZ2V0J1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgcmV0dXJuIExhemFkYVJlcXVlc3QuZ2V0KGJhc2VVUkwsIGFwcEtleSwgYXBwU2VjcmV0LCBhcGlQYXRoLCB1bmRlZmluZWQpXG59XG5cbi8qKlxuICogR2V0IGEgbGlzdCBvZiBhdHRyaWJ1dGVzIGZvciBhIHNwZWNpZmllZCBwcm9kdWN0IGNhdGVnb3J5LlxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIHByaW1hcnlfY2F0ZWdvcnlfaWQgOnJlcXVpcmVcbiAqL1xuY29uc3QgZ2V0Q2F0ZWdvcnlBdHRyaWJ1dGVzOiBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgZ2F0ZXdheTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGF5bG9hZDoge1xuICAgIHByaW1hcnlfY2F0ZWdvcnlfaWQ6IHN0cmluZyxcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLkdFVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL2NhdGVnb3J5L2F0dHJpYnV0ZXMvZ2V0J1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgcmV0dXJuIExhemFkYVJlcXVlc3QuZ2V0KFxuICAgIGJhc2VVUkwsXG4gICAgYXBwS2V5LFxuICAgIGFwcFNlY3JldCxcbiAgICBhcGlQYXRoLFxuICAgIHVuZGVmaW5lZCxcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogUmV0cmlldmUgYWxsIHByb2R1Y3QgYnJhbmRzIGluIHRoZSBzeXN0ZW0uXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICogb2Zmc2V0IDpyZXF1aXJlXG4gKiBsaW1pdCAgOnJlcXVpcmUgLy8gZGVmYXVsdCAxMDAsIG1heGltdW0gMSwwMDBcbiAqL1xuY29uc3QgZ2V0QnJhbmRzOiBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgZ2F0ZXdheTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGF5bG9hZDogeyBvZmZzZXQ6IHN0cmluZywgbGltaXQ6IHN0cmluZyB9LFxuICBhY3Rpb24/OiBIdHRwQWN0aW9uID0gSFRUUF9BQ1RJT04uR0VULFxuICBwcm90b2NvbD86IFByb3RvY29sID0gUFJPVE9DT0wuSFRUUFMsXG4pID0+IHtcbiAgY29uc3QgYXBpUGF0aCA9ICcvYnJhbmRzL2dldCdcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG4gIHJldHVybiBMYXphZGFSZXF1ZXN0LmdldChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICB1bmRlZmluZWQsXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG4vKipcbiAqIFRPRE86XG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCB4bWwgc3RyaW5nXG4gKiBAcmVmIGh0dHBzOi8vb3Blbi5sYXphZGEuY29tL2RvYy9kb2MuaHRtP3NwbT1hMm85bS4xMTE5MzUzNS4wLjAuMmRlMjM4ZTRlZWJZOHYjP25vZGVJZD0xMDU1NyZkb2NJZD0xMDgyNTNcbiAqL1xuY29uc3QgY3JlYXRlUHJvZHVjdDogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBwYXlsb2FkOiBzdHJpbmcsXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9wcm9kdWN0L2NyZWF0ZSdcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG4gIHJldHVybiBMYXphZGFSZXF1ZXN0LnBvc3QoXG4gICAgYmFzZVVSTCxcbiAgICBhcHBLZXksXG4gICAgYXBwU2VjcmV0LFxuICAgIGFwaVBhdGgsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICogcGF5bG9hZCB4bWwgc3RyaW5nXG4gKiBAcmVmIGh0dHBzOi8vb3Blbi5sYXphZGEuY29tL2RvYy9kb2MuaHRtP3NwbT1hMm85bS4xMTE5MzUzNS4wLjAuNmU2ZTM4ZTQ3NVpYbFcjP25vZGVJZD0xMDU1NyZkb2NJZD0xMDgyNTJcbiAqL1xuY29uc3QgdXBkYXRlUHJvZHVjdDogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBwYXlsb2FkOiBzdHJpbmcsXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9wcm9kdWN0L3VwZGF0ZSdcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG4gIHJldHVybiBMYXphZGFSZXF1ZXN0LnBvc3QoXG4gICAgYmFzZVVSTCxcbiAgICBhcHBLZXksXG4gICAgYXBwU2VjcmV0LFxuICAgIGFwaVBhdGgsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG4vKipcbiAqIE1pZ3JhdGUgYSBzaW5nbGUgaW1hZ2UgZnJvbSBhbiBleHRlcm5hbCBzaXRlIHRvIExhemFkYSBzaXRlLlxuICogQWxsb3dlZCBpbWFnZSBmb3JtYXRzIGFyZSBKUEcgYW5kIFBORy5cbiAqIFRoZSBtYXhpbXVtIHNpemUgb2YgYW4gaW1hZ2UgZmlsZSBpcyAxTUIuXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICogPz9cbiAqL1xuY29uc3QgbWlncmF0ZUltYWdlOiBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgZ2F0ZXdheTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGF5bG9hZDoge1xuICAgIHBheWxvYWQ6IHN0cmluZywgLy8geG1sIHN0cmluZ1xuICB9LFxuICBhY3Rpb24/OiBIdHRwQWN0aW9uID0gSFRUUF9BQ1RJT04uR0VULFxuICBwcm90b2NvbD86IFByb3RvY29sID0gUFJPVE9DT0wuSFRUUFMsXG4pID0+IHtcbiAgY29uc3QgYXBpUGF0aCA9ICcvaW1hZ2UvbWlncmF0ZSdcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG5cbiAgcmV0dXJuIExhemFkYVJlcXVlc3QucG9zdChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogU2V0IHRoZSBpbWFnZXMgZm9yIGFuIGV4aXN0aW5nIHByb2R1Y3QgYnkgYXNzb2NpYXRpbmcgb25lIG9yIG1vcmUgaW1hZ2UgVVJMcyB3aXRoIGl0LlxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIEByZWYgaHR0cHM6Ly9vcGVuLmxhemFkYS5jb20vZG9jL2RvYy5odG0/c3BtPWEybzltLjExMTkzNTM1LjAuMC4yZGUyMzhlNGVlYlk4diM/bm9kZUlkPTEwNTU3JmRvY0lkPTEwODI1NFxuICovXG5jb25zdCBzZXRJbWFnZXM6IEFQSUFjdGlvbiA9IChcbiAgYXBwS2V5OiBzdHJpbmcsXG4gIGFwcFNlY3JldDogc3RyaW5nLFxuICBnYXRld2F5OiBzdHJpbmcsXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLFxuICBwYXlsb2FkOiB7XG4gICAgcGF5bG9hZDogc3RyaW5nLCAvLyB4bWwgc3RyaW5nXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9pbWFnZXMvc2V0J1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgcmV0dXJuIExhemFkYVJlcXVlc3QucG9zdChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBwcmljZSBhbmQgcXVhbnRpdHkgb2Ygb25lIG9yIG1vcmUgZXhpc3RpbmcgcHJvZHVjdHMuXG4gKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgcHJvZHVjdHMgdGhhdCBjYW4gYmUgdXBkYXRlZCBpcyA1MCwgYnV0IDIwIGlzIHJlY29tbWVuZGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAqIEByZWYgaHR0cHM6Ly9vcGVuLmxhemFkYS5jb20vZG9jL2RvYy5odG0/c3BtPWEybzltLjExMTkzNTM1LjAuMC4yZGUyMzhlNGVlYlk4diM/bm9kZUlkPTEwNTU3JmRvY0lkPTEwODI1MVxuICovXG5jb25zdCB1cGRhdGVQcmljZVF1YW50aXR5OiBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgZ2F0ZXdheTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGF5bG9hZDoge1xuICAgIHBheWxvYWQ6IHN0cmluZyxcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLkdFVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL3Byb2R1Y3QvcHJpY2VfcXVhbnRpdHkvdXBkYXRlJ1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgcmV0dXJuIExhemFkYVJlcXVlc3QucG9zdChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogVG8gcmVtb3ZlIGFuIGV4aXN0aW5nIHByb2R1Y3QsIHNvbWUgU0tVcyBpbiBvbmUgcHJvZHVjdCwgb3IgYWxsIFNLVXMgaW4gb25lIHByb2R1Y3QuXG4gKiBTeXN0ZW0gc3VwcG9ydHMgYSBtYXhpbXVtIG51bWJlciBvZiA1MCBTZWxsZXJTa3VzIGluIG9uZSByZXF1ZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICogc2VsbGVyX3NrdV9saXN0IC8vIFNlbGxlciBTS1UgaW4gYSBqc29uIGxpc3QgZS5nLiBbXCJhc2RcIixcInZ2dlwiLFwic3NzXCJdLCBtYXggNTAgU2VsbGVyU2t1c1xuICovXG5jb25zdCByZW1vdmVQcm9kdWN0OiBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgZ2F0ZXdheTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGF5bG9hZDoge1xuICAgIHNlbGxlcl9za3VfbGlzdDogc3RyaW5nLFxuICB9LFxuICBhY3Rpb24/OiBIdHRwQWN0aW9uID0gSFRUUF9BQ1RJT04uR0VULFxuICBwcm90b2NvbD86IFByb3RvY29sID0gUFJPVE9DT0wuSFRUUFMsXG4pID0+IHtcbiAgY29uc3QgYXBpUGF0aCA9ICcvcHJvZHVjdC9yZW1vdmUnXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5wb3N0KFxuICAgIGJhc2VVUkwsXG4gICAgYXBwS2V5LFxuICAgIGFwcFNlY3JldCxcbiAgICBhcGlQYXRoLFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHBheWxvYWQsXG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRQcm9kdWN0cyxcbiAgZ2V0Q2F0ZWdvcnlUcmVlLFxuICBnZXRDYXRlZ29yeUF0dHJpYnV0ZXMsXG4gIGdldEJyYW5kcyxcbiAgY3JlYXRlUHJvZHVjdCxcbiAgdXBkYXRlUHJvZHVjdCxcbiAgbWlncmF0ZUltYWdlLFxuICBzZXRJbWFnZXMsXG4gIHVwZGF0ZVByaWNlUXVhbnRpdHksXG4gIHJlbW92ZVByb2R1Y3QsXG59XG4iXX0=