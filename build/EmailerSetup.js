"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
exports["default"] = (function (emailerConstructor) {
    global.OPENAPI_NODEGEN_EMAILER_TEMPLATE_PATH = emailerConstructor.templatePath || path_1["default"].join(process.cwd(), 'email/templates');
    global.OPENAPI_NODEGEN_EMAILER_SEND_TYPE = emailerConstructor.sendType;
    global.OPENAPI_NODEGEN_EMAILER_LOG_PATH = emailerConstructor.logPath || path_1["default"].join(process.cwd(), 'email/logs');
});
