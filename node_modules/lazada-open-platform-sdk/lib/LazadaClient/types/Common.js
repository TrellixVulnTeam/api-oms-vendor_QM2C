"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APIAction = undefined;

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APIAction = exports.APIAction = _flowRuntime2.default.type("APIAction", _flowRuntime2.default.function(_flowRuntime2.default.param("appKey", _flowRuntime2.default.string()), _flowRuntime2.default.param("appSecret", _flowRuntime2.default.string()), _flowRuntime2.default.param("gateway", _flowRuntime2.default.string()), _flowRuntime2.default.param("accessToken", _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.param("payload", _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.ref("Promise", _flowRuntime2.default.existential()))));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9MYXphZGFDbGllbnQvdHlwZXMvQ29tbW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFJTyw0RUFBaUIsK0JBQ3RCLHNDQUFRLDhCQUFSLENBRHNCLEVBRXRCLHlDQUFXLDhCQUFYLENBRnNCLEVBR3RCLHVDQUFTLDhCQUFULENBSHNCLEVBSXRCLDJDQUFhLCtCQUFDLDhCQUFELENBQWIsQ0FKc0IsRUFLdEIsdUNBQVMsMkJBQVQsQ0FMc0IsK0JBTW5CLHFDQUFRLG1DQUFSLENBTm1CLEVBQWpCIiwiZmlsZSI6IkNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG5leHBvcnQgdHlwZSBBUElBY3Rpb24gPSAoXG4gIGFwcEtleTogc3RyaW5nLCAvLyByZXF1aXJlIGZvciBzaWduaW5nXG4gIGFwcFNlY3JldDogc3RyaW5nLCAvLyByZXF1aXJlIGZvciBzaWduaW5nXG4gIGdhdGV3YXk6IHN0cmluZywgLy8gbG9jYXRpb24gc3BlY2lmaWMgZ2F0ZXdheVxuICBhY2Nlc3NUb2tlbjogP3N0cmluZywgLy8gZm9yIGFsbCBhY3Rpb25zIHRoYXQgcmVxdWlyZSBhdXRob3JpemF0aW9uXG4gIHBheWxvYWQ6IGFueSwgLy8gcGFyYW1ldGVyc1xuKSA9PiBQcm9taXNlPCo+XG4iXX0=