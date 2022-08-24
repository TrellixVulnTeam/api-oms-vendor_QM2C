'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

var _Common = require('./types/Common');

var _Order = require('./types/Order');

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

var OrderStatus = _flowRuntime2.default.tdz(function () {
  return _Order.OrderStatus;
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
 *
 * @param {Object} payload
 *
 * created_after  // ISO 8601 date format, require if no update_after
 * created_before // ISO 8601 date format
 * update_after   // ISO 8601 date format, require if no update_after
 * update_before  // ISO 8601 date format
 *
 * status         // pending | canceled | ready_to_ship | delivered | returned | shipped | failed
 *
 * sort_by        // created_at | updated_at
 * sort_direction // ASC | DESC
 *
 * offset
 * limit          // max 100
 */
var getOrders = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getOrders(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType = _flowRuntime2.default.string();

  var _appSecretType = _flowRuntime2.default.string();

  var _gatewayType = _flowRuntime2.default.string();

  var _accessTokenType = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType = _flowRuntime2.default.object(_flowRuntime2.default.property('created_after', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('created_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_after', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('status', _flowRuntime2.default.ref(OrderStatus), true), _flowRuntime2.default.property('sort_by', _flowRuntime2.default.union(_flowRuntime2.default.string('created_at'), _flowRuntime2.default.string('updated_at')), true), _flowRuntime2.default.property('sort_direction', _flowRuntime2.default.union(_flowRuntime2.default.string('ASC'), _flowRuntime2.default.string('DESC')), true), _flowRuntime2.default.property('offset', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('limit', _flowRuntime2.default.number(), true));

  var _actionType = _flowRuntime2.default.ref(HttpAction);

  var _protocolType2 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType).assert(payload);

  _flowRuntime2.default.param('action', _actionType, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType2, true).assert(protocol);

  var apiPath = '/orders/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('created_after', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('created_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_after', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('update_before', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('status', _flowRuntime2.default.ref(OrderStatus), true), _flowRuntime2.default.property('sort_by', _flowRuntime2.default.union(_flowRuntime2.default.string('created_at'), _flowRuntime2.default.string('updated_at')), true), _flowRuntime2.default.property('sort_direction', _flowRuntime2.default.union(_flowRuntime2.default.string('ASC'), _flowRuntime2.default.string('DESC')), true), _flowRuntime2.default.property('offset', _flowRuntime2.default.number(), true), _flowRuntime2.default.property('limit', _flowRuntime2.default.number(), true))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Get the list of items for a single order.
 * @param {Object} payload
 * order_id
 */
var getOrder = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getOrder(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType2 = _flowRuntime2.default.string();

  var _appSecretType2 = _flowRuntime2.default.string();

  var _gatewayType2 = _flowRuntime2.default.string();

  var _accessTokenType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType2 = _flowRuntime2.default.object(_flowRuntime2.default.property('order_id', _flowRuntime2.default.number()));

  var _actionType2 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType3 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType2).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType2).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType2).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType2).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType2).assert(payload);

  _flowRuntime2.default.param('action', _actionType2, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType3, true).assert(protocol);

  var apiPath = '/order/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('order_id', _flowRuntime2.default.number()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Get the item information of an order.
 * @param {Object} payload
 * order_id {number| string}
 */
var getOrderItems = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getOrderItems(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType3 = _flowRuntime2.default.string();

  var _appSecretType3 = _flowRuntime2.default.string();

  var _gatewayType3 = _flowRuntime2.default.string();

  var _accessTokenType3 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType3 = _flowRuntime2.default.object(_flowRuntime2.default.property('order_id', _flowRuntime2.default.string()));

  var _actionType3 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType4 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType3).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType3).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType3).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType3).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType3).assert(payload);

  _flowRuntime2.default.param('action', _actionType3, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType4, true).assert(protocol);

  var apiPath = '/order/items/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('order_id', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Get the item information of one or more orders.
 * @param {Object} payload
 * order_ids // stringify JSON array [42922, 32793] (Max List Size: 1000)
 */
var getMultipleOrderItems = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getMultipleOrderItems(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType4 = _flowRuntime2.default.string();

  var _appSecretType4 = _flowRuntime2.default.string();

  var _gatewayType4 = _flowRuntime2.default.string();

  var _accessTokenType4 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType4 = _flowRuntime2.default.object(_flowRuntime2.default.property('order_ids', _flowRuntime2.default.string()));

  var _actionType4 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType5 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType4).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType4).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType4).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType4).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType4).assert(payload);

  _flowRuntime2.default.param('action', _actionType4, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType5, true).assert(protocol);

  var apiPath = '/orders/items/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('order_ids', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Get additional error context for the SetStatusToCanceled API.
 * @param {Object} payload
 * access_token :require
 */
var getFailureReasons = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getFailureReasons(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType5 = _flowRuntime2.default.string();

  var _appSecretType5 = _flowRuntime2.default.string();

  var _gatewayType5 = _flowRuntime2.default.string();

  var _accessTokenType5 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType5 = _flowRuntime2.default.any();

  var _actionType5 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType6 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType5).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType5).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType5).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType5).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType5).assert(payload);

  _flowRuntime2.default.param('action', _actionType5, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType6, true).assert(protocol);

  var apiPath = '/order/failure_reason/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.any()), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Cancel a single order item.
 * @param {Object} payload
 * reason_detail
 * reason_id :require  | ID of the cancel reason.
 * order_item_id :require | Order item ID
 */
var setStatusToCanceled = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function setStatusToCanceled(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.POST;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType6 = _flowRuntime2.default.string();

  var _appSecretType6 = _flowRuntime2.default.string();

  var _gatewayType6 = _flowRuntime2.default.string();

  var _accessTokenType6 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType6 = _flowRuntime2.default.object(_flowRuntime2.default.property('reason_detail', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('reason_id', _flowRuntime2.default.number()), _flowRuntime2.default.property('order_item_id', _flowRuntime2.default.number()));

  var _actionType6 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType7 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType6).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType6).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType6).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType6).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType6).assert(payload);

  _flowRuntime2.default.param('action', _actionType6, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType7, true).assert(protocol);

  var apiPath = '/order/cancel';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('reason_detail', _flowRuntime2.default.string(), true), _flowRuntime2.default.property('reason_id', _flowRuntime2.default.number()), _flowRuntime2.default.property('order_item_id', _flowRuntime2.default.number()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Mark an order item as being ready to ship
 * @param {Object} payload
 * delivery_type     :require // dropship (Now only 'dropship' is supported.)
 * order_item_ids    :require // e.g. [1832590,1832592]
 * shipment_provider :require // name of shipment provider e.g. Aramax
 * tracking_number   :require
 */
var setStatusToReadyToShip = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function setStatusToReadyToShip(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.POST;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType7 = _flowRuntime2.default.string();

  var _appSecretType7 = _flowRuntime2.default.string();

  var _gatewayType7 = _flowRuntime2.default.string();

  var _accessTokenType7 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType7 = _flowRuntime2.default.object(_flowRuntime2.default.property('delivery_type', _flowRuntime2.default.string()), _flowRuntime2.default.property('order_item_ids', _flowRuntime2.default.string()), _flowRuntime2.default.property('shipment_provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('tracking_number', _flowRuntime2.default.string()));

  var _actionType7 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType8 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType7).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType7).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType7).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType7).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType7).assert(payload);

  _flowRuntime2.default.param('action', _actionType7, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType8, true).assert(protocol);

  var apiPath = '/order/rts';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('delivery_type', _flowRuntime2.default.string()), _flowRuntime2.default.property('order_item_ids', _flowRuntime2.default.string()), _flowRuntime2.default.property('shipment_provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('tracking_number', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Mark an order item as being packed.
 * All order items must have status 'pending'
 * @param {Object} payload
 * shipping_provider :require // name of shipment provider e.g. as  Aramax Mandatory for the "dropship" delivery type.
 * delivery_type     :require // dropship | pickup | send_to_warehouse
 * order_item_ids    :require stringify JSON array //  e.g. [1530553,1830236]
 */
var setStatusToPackedByMarketplace = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function setStatusToPackedByMarketplace(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.POST;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType8 = _flowRuntime2.default.string();

  var _appSecretType8 = _flowRuntime2.default.string();

  var _gatewayType8 = _flowRuntime2.default.string();

  var _accessTokenType8 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType8 = _flowRuntime2.default.object(_flowRuntime2.default.property('shipping_provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('delivery_type', _flowRuntime2.default.string()), _flowRuntime2.default.property('order_item_ids', _flowRuntime2.default.string()));

  var _actionType8 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType9 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType8).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType8).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType8).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType8).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType8).assert(payload);

  _flowRuntime2.default.param('action', _actionType8, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType9, true).assert(protocol);

  var apiPath = '/order/pack';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('shipping_provider', _flowRuntime2.default.string()), _flowRuntime2.default.property('delivery_type', _flowRuntime2.default.string()), _flowRuntime2.default.property('order_item_ids', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Set the invoice number for the specified order.
 * @param {Object} payload
 * order_item_id  :require
 * invoice_number : require
 */
var setInvoiceNumber = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function setInvoiceNumber(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.POST;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType9 = _flowRuntime2.default.string();

  var _appSecretType9 = _flowRuntime2.default.string();

  var _gatewayType9 = _flowRuntime2.default.string();

  var _accessTokenType9 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType9 = _flowRuntime2.default.object(_flowRuntime2.default.property('order_item_id', _flowRuntime2.default.number()), _flowRuntime2.default.property('invoice_number', _flowRuntime2.default.string()));

  var _actionType9 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType10 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType9).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType9).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType9).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType9).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType9).assert(payload);

  _flowRuntime2.default.param('action', _actionType9, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType10, true).assert(protocol);

  var apiPath = '/order/invoice_number/set';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.post(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('order_item_id', _flowRuntime2.default.number()), _flowRuntime2.default.property('invoice_number', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

/**
 * Retrieve order-related documents, including invoices and shipping labels.
 * @param {Object} payload
 * access_token
 * doc_type       :require // invoice, shippingLabel, carrierManifest
 * order_item_ids :require // max list size: 100 stringify JSON array
 */
var getDocument = _flowRuntime2.default.ref(APIAction).assert(_flowRuntime2.default.annotate(function getDocument(appKey, appSecret, gateway, accessToken, payload) {
  var action = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _constants2.HTTP_ACTION.GET;
  var protocol = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _constants2.PROTOCOL.HTTPS;

  var _appKeyType10 = _flowRuntime2.default.string();

  var _appSecretType10 = _flowRuntime2.default.string();

  var _gatewayType10 = _flowRuntime2.default.string();

  var _accessTokenType10 = _flowRuntime2.default.nullable(_flowRuntime2.default.string());

  var _payloadType10 = _flowRuntime2.default.object(_flowRuntime2.default.property('doc_type', _flowRuntime2.default.string()), _flowRuntime2.default.property('order_item_ids', _flowRuntime2.default.string()));

  var _actionType10 = _flowRuntime2.default.ref(HttpAction);

  var _protocolType11 = _flowRuntime2.default.ref(Protocol);

  _flowRuntime2.default.param('appKey', _appKeyType10).assert(appKey);

  _flowRuntime2.default.param('appSecret', _appSecretType10).assert(appSecret);

  _flowRuntime2.default.param('gateway', _gatewayType10).assert(gateway);

  _flowRuntime2.default.param('accessToken', _accessTokenType10).assert(accessToken);

  _flowRuntime2.default.param('payload', _payloadType10).assert(payload);

  _flowRuntime2.default.param('action', _actionType10, true).assert(action);

  _flowRuntime2.default.param('protocol', _protocolType11, true).assert(protocol);

  var apiPath = '/order/document/get';
  var baseURL = getScheme(protocol) + gateway;
  return _LazadaRequest2.default.get(baseURL, appKey, appSecret, apiPath, accessToken, payload);
}, _flowRuntime2.default.function(_flowRuntime2.default.param('appKey', _flowRuntime2.default.string()), _flowRuntime2.default.param('appSecret', _flowRuntime2.default.string()), _flowRuntime2.default.param('gateway', _flowRuntime2.default.string()), _flowRuntime2.default.param('accessToken', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param('payload', _flowRuntime2.default.object(_flowRuntime2.default.property('doc_type', _flowRuntime2.default.string()), _flowRuntime2.default.property('order_item_ids', _flowRuntime2.default.string()))), _flowRuntime2.default.param('action', _flowRuntime2.default.ref(HttpAction)), _flowRuntime2.default.param('protocol', _flowRuntime2.default.ref(Protocol)))));

exports.default = {
  getOrders: getOrders,
  getOrder: getOrder,
  getOrderItems: getOrderItems,
  getMultipleOrderItems: getMultipleOrderItems,
  getFailureReasons: getFailureReasons,
  setStatusToCanceled: setStatusToCanceled,
  setStatusToReadyToShip: setStatusToReadyToShip,
  setStatusToPackedByMarketplace: setStatusToPackedByMarketplace,
  setInvoiceNumber: setInvoiceNumber,
  getDocument: getDocument
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXphZGFDbGllbnQvb3JkZXIuanMiXSwibmFtZXMiOlsiZ2V0U2NoZW1lIiwicHJvdG9jb2wiLCJQUk9UT0NPTCIsIkhUVFAiLCJhcHBLZXkiLCJhcHBTZWNyZXQiLCJnYXRld2F5IiwiYWNjZXNzVG9rZW4iLCJwYXlsb2FkIiwiYWN0aW9uIiwiSFRUUF9BQ1RJT04iLCJHRVQiLCJIVFRQUyIsImFwaVBhdGgiLCJiYXNlVVJMIiwiTGF6YWRhUmVxdWVzdCIsImdldCIsIlBPU1QiLCJwb3N0IiwiZ2V0T3JkZXJzIiwiZ2V0T3JkZXIiLCJnZXRPcmRlckl0ZW1zIiwiZ2V0TXVsdGlwbGVPcmRlckl0ZW1zIiwiZ2V0RmFpbHVyZVJlYXNvbnMiLCJzZXRTdGF0dXNUb0NhbmNlbGVkIiwic2V0U3RhdHVzVG9SZWFkeVRvU2hpcCIsInNldFN0YXR1c1RvUGFja2VkQnlNYXJrZXRwbGFjZSIsInNldEludm9pY2VOdW1iZXIiLCJnZXREb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDJDQUFZLG1CQUFDQyxRQUFELEVBQWdDO0FBQUEsc0JBQXZCLG1DQUF1Qjs7QUFBQSxpREFBViw4QkFBVTs7QUFBQTs7QUFDaEQsNEJBQU9BLGFBQWFDLHFCQUFTQyxJQUF0QixHQUE2QixTQUE3QixHQUF5QyxVQUFoRDtBQUNELENBRkssRUFBWSx1RUFBUyxtQ0FBVCxnQ0FBb0IsOEJBQXBCLEVBQVosQ0FBTjs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsZ0JBQWUsb0NBQWYsdUNBQTZCLG1CQUMzQkMsTUFEMkIsRUFFM0JDLFNBRjJCLEVBRzNCQyxPQUgyQixFQUkzQkMsV0FKMkIsRUFLM0JDLE9BTDJCLEVBcUJ4QjtBQUFBLE1BRkhDLE1BRUcsdUVBRm1CQyx3QkFBWUMsR0FFL0I7QUFBQSxNQURIVixRQUNHLHVFQURt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O0FBQUEsc0JBRkkscUNBRUo7O0FBQUEsd0JBRE0sbUNBQ047O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0gsTUFBTUMsVUFBVSxxQkFBaEI7QUFDQSxNQUFNQyxVQUFVZCxVQUFVQyxRQUFWLElBQXNCSyxPQUF0QztBQUNBLFNBQU9TLHdCQUFjQyxHQUFkLENBQ0xGLE9BREssRUFFTFYsTUFGSyxFQUdMQyxTQUhLLEVBSUxRLE9BSkssRUFLTE4sV0FMSyxFQU1MQyxPQU5LLENBQVA7QUFRRCxDQXRCRCxFQUErQixxRUFDdkIsOEJBRHVCLDRDQUVwQiw4QkFGb0IsMENBR3RCLDhCQUhzQiw4Q0FJbEIsK0JBQUcsOEJBQUgsQ0FKa0IsMENBS3RCLDZCQUNMLDJDQUFVLDhCQUFWLENBREssRUFFTCxpREFBZ0IsOEJBQWhCLENBRkssQ0FMc0IseUNBU3RCLHFDQVRzQiwyQ0FVcEIsbUNBVm9CLEVBQS9COztrQkF3QmU7QUFDYlcsc0JBRGE7QUFFYkMsb0JBRmE7QUFHYkMsOEJBSGE7QUFJYkMsOENBSmE7QUFLYkMsc0NBTGE7QUFNYkMsMENBTmE7QUFPYkMsZ0RBUGE7QUFRYkMsZ0VBUmE7QUFTYkMsb0NBVGE7QUFVYkM7QUFWYSxDIiwiZmlsZSI6Im9yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbid1c2Ugc3RyaWN0J1xuaW1wb3J0IHsgR0FURVdBWSB9IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHR5cGUgeyBBUElBY3Rpb24gfSBmcm9tICcuL3R5cGVzL0NvbW1vbidcbmltcG9ydCB0eXBlIHsgT3JkZXJTdGF0dXMgfSBmcm9tICcuL3R5cGVzL09yZGVyJ1xuaW1wb3J0IExhemFkYVJlcXVlc3QgZnJvbSAnc3JjL0xhemFkYVJlcXVlc3QnXG5pbXBvcnQgeyBQUk9UT0NPTCwgSFRUUF9BQ1RJT04gfSBmcm9tICdzcmMvTGF6YWRhUmVxdWVzdC9jb25zdGFudHMnXG5pbXBvcnQgdHlwZSB7IFByb3RvY29sLCBIdHRwQWN0aW9uIH0gZnJvbSAnc3JjL0xhemFkYVJlcXVlc3QvdHlwZXMvUmVxdWVzdCdcblxuY29uc3QgZ2V0U2NoZW1lID0gKHByb3RvY29sOiBQcm90b2NvbCk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBwcm90b2NvbCA9PT0gUFJPVE9DT0wuSFRUUCA/ICdodHRwOi8vJyA6ICdodHRwczovLydcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqXG4gKiBjcmVhdGVkX2FmdGVyICAvLyBJU08gODYwMSBkYXRlIGZvcm1hdCwgcmVxdWlyZSBpZiBubyB1cGRhdGVfYWZ0ZXJcbiAqIGNyZWF0ZWRfYmVmb3JlIC8vIElTTyA4NjAxIGRhdGUgZm9ybWF0XG4gKiB1cGRhdGVfYWZ0ZXIgICAvLyBJU08gODYwMSBkYXRlIGZvcm1hdCwgcmVxdWlyZSBpZiBubyB1cGRhdGVfYWZ0ZXJcbiAqIHVwZGF0ZV9iZWZvcmUgIC8vIElTTyA4NjAxIGRhdGUgZm9ybWF0XG4gKlxuICogc3RhdHVzICAgICAgICAgLy8gcGVuZGluZyB8IGNhbmNlbGVkIHwgcmVhZHlfdG9fc2hpcCB8IGRlbGl2ZXJlZCB8IHJldHVybmVkIHwgc2hpcHBlZCB8IGZhaWxlZFxuICpcbiAqIHNvcnRfYnkgICAgICAgIC8vIGNyZWF0ZWRfYXQgfCB1cGRhdGVkX2F0XG4gKiBzb3J0X2RpcmVjdGlvbiAvLyBBU0MgfCBERVNDXG4gKlxuICogb2Zmc2V0XG4gKiBsaW1pdCAgICAgICAgICAvLyBtYXggMTAwXG4gKi9cbmNvbnN0IGdldE9yZGVyczogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBjcmVhdGVkX2FmdGVyPzogc3RyaW5nLFxuICAgIGNyZWF0ZWRfYmVmb3JlPzogc3RyaW5nLFxuICAgIHVwZGF0ZV9hZnRlcj86IHN0cmluZyxcbiAgICB1cGRhdGVfYmVmb3JlPzogc3RyaW5nLFxuXG4gICAgc3RhdHVzPzogT3JkZXJTdGF0dXMsXG5cbiAgICBzb3J0X2J5PzogJ2NyZWF0ZWRfYXQnIHwgJ3VwZGF0ZWRfYXQnLFxuICAgIHNvcnRfZGlyZWN0aW9uPzogJ0FTQycgfCAnREVTQycsXG5cbiAgICBvZmZzZXQ/OiBudW1iZXIsXG4gICAgbGltaXQ/OiBudW1iZXIsXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9vcmRlcnMvZ2V0J1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgcmV0dXJuIExhemFkYVJlcXVlc3QuZ2V0KFxuICAgIGJhc2VVUkwsXG4gICAgYXBwS2V5LFxuICAgIGFwcFNlY3JldCxcbiAgICBhcGlQYXRoLFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHBheWxvYWQsXG4gIClcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGxpc3Qgb2YgaXRlbXMgZm9yIGEgc2luZ2xlIG9yZGVyLlxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIG9yZGVyX2lkXG4gKi9cbmNvbnN0IGdldE9yZGVyOiBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLFxuICBhcHBTZWNyZXQ6IHN0cmluZyxcbiAgZ2F0ZXdheTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogP3N0cmluZyxcbiAgcGF5bG9hZDoge1xuICAgIG9yZGVyX2lkOiBudW1iZXIsXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9vcmRlci9nZXQnXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5nZXQoXG4gICAgYmFzZVVSTCxcbiAgICBhcHBLZXksXG4gICAgYXBwU2VjcmV0LFxuICAgIGFwaVBhdGgsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG4vKipcbiAqIEdldCB0aGUgaXRlbSBpbmZvcm1hdGlvbiBvZiBhbiBvcmRlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gKiBvcmRlcl9pZCB7bnVtYmVyfCBzdHJpbmd9XG4gKi9cbmNvbnN0IGdldE9yZGVySXRlbXM6IEFQSUFjdGlvbiA9IChcbiAgYXBwS2V5OiBzdHJpbmcsXG4gIGFwcFNlY3JldDogc3RyaW5nLFxuICBnYXRld2F5OiBzdHJpbmcsXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLFxuICBwYXlsb2FkOiB7XG4gICAgb3JkZXJfaWQ6IHN0cmluZyxcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLkdFVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL29yZGVyL2l0ZW1zL2dldCdcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG4gIHJldHVybiBMYXphZGFSZXF1ZXN0LmdldChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogR2V0IHRoZSBpdGVtIGluZm9ybWF0aW9uIG9mIG9uZSBvciBtb3JlIG9yZGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gKiBvcmRlcl9pZHMgLy8gc3RyaW5naWZ5IEpTT04gYXJyYXkgWzQyOTIyLCAzMjc5M10gKE1heCBMaXN0IFNpemU6IDEwMDApXG4gKi9cbmNvbnN0IGdldE11bHRpcGxlT3JkZXJJdGVtczogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBvcmRlcl9pZHM6IHN0cmluZyxcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLkdFVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL29yZGVycy9pdGVtcy9nZXQnXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5nZXQoXG4gICAgYmFzZVVSTCxcbiAgICBhcHBLZXksXG4gICAgYXBwU2VjcmV0LFxuICAgIGFwaVBhdGgsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG4vKipcbiAqIEdldCBhZGRpdGlvbmFsIGVycm9yIGNvbnRleHQgZm9yIHRoZSBTZXRTdGF0dXNUb0NhbmNlbGVkIEFQSS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gKiBhY2Nlc3NfdG9rZW4gOnJlcXVpcmVcbiAqL1xuY29uc3QgZ2V0RmFpbHVyZVJlYXNvbnM6IEFQSUFjdGlvbiA9IChcbiAgYXBwS2V5OiBzdHJpbmcsXG4gIGFwcFNlY3JldDogc3RyaW5nLFxuICBnYXRld2F5OiBzdHJpbmcsXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLFxuICBwYXlsb2FkOiBhbnksXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9vcmRlci9mYWlsdXJlX3JlYXNvbi9nZXQnXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5nZXQoYmFzZVVSTCwgYXBwS2V5LCBhcHBTZWNyZXQsIGFwaVBhdGgsIGFjY2Vzc1Rva2VuKVxufVxuXG4vKipcbiAqIENhbmNlbCBhIHNpbmdsZSBvcmRlciBpdGVtLlxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIHJlYXNvbl9kZXRhaWxcbiAqIHJlYXNvbl9pZCA6cmVxdWlyZSAgfCBJRCBvZiB0aGUgY2FuY2VsIHJlYXNvbi5cbiAqIG9yZGVyX2l0ZW1faWQgOnJlcXVpcmUgfCBPcmRlciBpdGVtIElEXG4gKi9cbmNvbnN0IHNldFN0YXR1c1RvQ2FuY2VsZWQ6IEFQSUFjdGlvbiA9IChcbiAgYXBwS2V5OiBzdHJpbmcsXG4gIGFwcFNlY3JldDogc3RyaW5nLFxuICBnYXRld2F5OiBzdHJpbmcsXG4gIGFjY2Vzc1Rva2VuOiA/c3RyaW5nLFxuICBwYXlsb2FkOiB7XG4gICAgcmVhc29uX2RldGFpbD86IHN0cmluZyxcbiAgICByZWFzb25faWQ6IG51bWJlcixcbiAgICBvcmRlcl9pdGVtX2lkOiBudW1iZXIsXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5QT1NULFxuICBwcm90b2NvbD86IFByb3RvY29sID0gUFJPVE9DT0wuSFRUUFMsXG4pID0+IHtcbiAgY29uc3QgYXBpUGF0aCA9ICcvb3JkZXIvY2FuY2VsJ1xuICBjb25zdCBiYXNlVVJMID0gZ2V0U2NoZW1lKHByb3RvY29sKSArIGdhdGV3YXlcbiAgcmV0dXJuIExhemFkYVJlcXVlc3QucG9zdChcbiAgICBiYXNlVVJMLFxuICAgIGFwcEtleSxcbiAgICBhcHBTZWNyZXQsXG4gICAgYXBpUGF0aCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgICBwYXlsb2FkLFxuICApXG59XG5cbi8qKlxuICogTWFyayBhbiBvcmRlciBpdGVtIGFzIGJlaW5nIHJlYWR5IHRvIHNoaXBcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gKiBkZWxpdmVyeV90eXBlICAgICA6cmVxdWlyZSAvLyBkcm9wc2hpcCAoTm93IG9ubHkgJ2Ryb3BzaGlwJyBpcyBzdXBwb3J0ZWQuKVxuICogb3JkZXJfaXRlbV9pZHMgICAgOnJlcXVpcmUgLy8gZS5nLiBbMTgzMjU5MCwxODMyNTkyXVxuICogc2hpcG1lbnRfcHJvdmlkZXIgOnJlcXVpcmUgLy8gbmFtZSBvZiBzaGlwbWVudCBwcm92aWRlciBlLmcuIEFyYW1heFxuICogdHJhY2tpbmdfbnVtYmVyICAgOnJlcXVpcmVcbiAqL1xuY29uc3Qgc2V0U3RhdHVzVG9SZWFkeVRvU2hpcDogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBkZWxpdmVyeV90eXBlOiBzdHJpbmcsXG4gICAgb3JkZXJfaXRlbV9pZHM6IHN0cmluZyxcbiAgICBzaGlwbWVudF9wcm92aWRlcjogc3RyaW5nLFxuICAgIHRyYWNraW5nX251bWJlcjogc3RyaW5nLFxuICB9LFxuICBhY3Rpb24/OiBIdHRwQWN0aW9uID0gSFRUUF9BQ1RJT04uUE9TVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL29yZGVyL3J0cydcbiAgY29uc3QgYmFzZVVSTCA9IGdldFNjaGVtZShwcm90b2NvbCkgKyBnYXRld2F5XG4gIHJldHVybiBMYXphZGFSZXF1ZXN0LnBvc3QoXG4gICAgYmFzZVVSTCxcbiAgICBhcHBLZXksXG4gICAgYXBwU2VjcmV0LFxuICAgIGFwaVBhdGgsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG4vKipcbiAqIE1hcmsgYW4gb3JkZXIgaXRlbSBhcyBiZWluZyBwYWNrZWQuXG4gKiBBbGwgb3JkZXIgaXRlbXMgbXVzdCBoYXZlIHN0YXR1cyAncGVuZGluZydcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gKiBzaGlwcGluZ19wcm92aWRlciA6cmVxdWlyZSAvLyBuYW1lIG9mIHNoaXBtZW50IHByb3ZpZGVyIGUuZy4gYXMgIEFyYW1heCBNYW5kYXRvcnkgZm9yIHRoZSBcImRyb3BzaGlwXCIgZGVsaXZlcnkgdHlwZS5cbiAqIGRlbGl2ZXJ5X3R5cGUgICAgIDpyZXF1aXJlIC8vIGRyb3BzaGlwIHwgcGlja3VwIHwgc2VuZF90b193YXJlaG91c2VcbiAqIG9yZGVyX2l0ZW1faWRzICAgIDpyZXF1aXJlIHN0cmluZ2lmeSBKU09OIGFycmF5IC8vICBlLmcuIFsxNTMwNTUzLDE4MzAyMzZdXG4gKi9cbmNvbnN0IHNldFN0YXR1c1RvUGFja2VkQnlNYXJrZXRwbGFjZTogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBzaGlwcGluZ19wcm92aWRlcjogc3RyaW5nLFxuICAgIGRlbGl2ZXJ5X3R5cGU6IHN0cmluZyxcbiAgICBvcmRlcl9pdGVtX2lkczogc3RyaW5nLFxuICB9LFxuICBhY3Rpb24/OiBIdHRwQWN0aW9uID0gSFRUUF9BQ1RJT04uUE9TVCxcbiAgcHJvdG9jb2w/OiBQcm90b2NvbCA9IFBST1RPQ09MLkhUVFBTLFxuKSA9PiB7XG4gIGNvbnN0IGFwaVBhdGggPSAnL29yZGVyL3BhY2snXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5wb3N0KFxuICAgIGJhc2VVUkwsXG4gICAgYXBwS2V5LFxuICAgIGFwcFNlY3JldCxcbiAgICBhcGlQYXRoLFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHBheWxvYWQsXG4gIClcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGludm9pY2UgbnVtYmVyIGZvciB0aGUgc3BlY2lmaWVkIG9yZGVyLlxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAqIG9yZGVyX2l0ZW1faWQgIDpyZXF1aXJlXG4gKiBpbnZvaWNlX251bWJlciA6IHJlcXVpcmVcbiAqL1xuY29uc3Qgc2V0SW52b2ljZU51bWJlcjogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBvcmRlcl9pdGVtX2lkOiBudW1iZXIsXG4gICAgaW52b2ljZV9udW1iZXI6IHN0cmluZyxcbiAgfSxcbiAgYWN0aW9uPzogSHR0cEFjdGlvbiA9IEhUVFBfQUNUSU9OLlBPU1QsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9vcmRlci9pbnZvaWNlX251bWJlci9zZXQnXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5wb3N0KFxuICAgIGJhc2VVUkwsXG4gICAgYXBwS2V5LFxuICAgIGFwcFNlY3JldCxcbiAgICBhcGlQYXRoLFxuICAgIGFjY2Vzc1Rva2VuLFxuICAgIHBheWxvYWQsXG4gIClcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBvcmRlci1yZWxhdGVkIGRvY3VtZW50cywgaW5jbHVkaW5nIGludm9pY2VzIGFuZCBzaGlwcGluZyBsYWJlbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICogYWNjZXNzX3Rva2VuXG4gKiBkb2NfdHlwZSAgICAgICA6cmVxdWlyZSAvLyBpbnZvaWNlLCBzaGlwcGluZ0xhYmVsLCBjYXJyaWVyTWFuaWZlc3RcbiAqIG9yZGVyX2l0ZW1faWRzIDpyZXF1aXJlIC8vIG1heCBsaXN0IHNpemU6IDEwMCBzdHJpbmdpZnkgSlNPTiBhcnJheVxuICovXG5jb25zdCBnZXREb2N1bWVudDogQVBJQWN0aW9uID0gKFxuICBhcHBLZXk6IHN0cmluZyxcbiAgYXBwU2VjcmV0OiBzdHJpbmcsXG4gIGdhdGV3YXk6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46ID9zdHJpbmcsXG4gIHBheWxvYWQ6IHtcbiAgICBkb2NfdHlwZTogc3RyaW5nLFxuICAgIG9yZGVyX2l0ZW1faWRzOiBzdHJpbmcsXG4gIH0sXG4gIGFjdGlvbj86IEh0dHBBY3Rpb24gPSBIVFRQX0FDVElPTi5HRVQsXG4gIHByb3RvY29sPzogUHJvdG9jb2wgPSBQUk9UT0NPTC5IVFRQUyxcbikgPT4ge1xuICBjb25zdCBhcGlQYXRoID0gJy9vcmRlci9kb2N1bWVudC9nZXQnXG4gIGNvbnN0IGJhc2VVUkwgPSBnZXRTY2hlbWUocHJvdG9jb2wpICsgZ2F0ZXdheVxuICByZXR1cm4gTGF6YWRhUmVxdWVzdC5nZXQoXG4gICAgYmFzZVVSTCxcbiAgICBhcHBLZXksXG4gICAgYXBwU2VjcmV0LFxuICAgIGFwaVBhdGgsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcGF5bG9hZCxcbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldE9yZGVycyxcbiAgZ2V0T3JkZXIsXG4gIGdldE9yZGVySXRlbXMsXG4gIGdldE11bHRpcGxlT3JkZXJJdGVtcyxcbiAgZ2V0RmFpbHVyZVJlYXNvbnMsXG4gIHNldFN0YXR1c1RvQ2FuY2VsZWQsXG4gIHNldFN0YXR1c1RvUmVhZHlUb1NoaXAsXG4gIHNldFN0YXR1c1RvUGFja2VkQnlNYXJrZXRwbGFjZSxcbiAgc2V0SW52b2ljZU51bWJlcixcbiAgZ2V0RG9jdW1lbnQsXG59XG4iXX0=