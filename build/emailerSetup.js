"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
exports["default"] = (function (emailerConstructor) {
    global.OPENAPI_NODEGEN_EMAILER_SETTINGS = {
        tplPath: emailerConstructor.templatePath || path_1["default"].join(process.cwd(), 'email/templates'),
        tplGlobalObject: emailerConstructor.templateGlobalObject || {},
        sendType: emailerConstructor.sendType,
        logPath: emailerConstructor.logPath || path_1["default"].join(process.cwd(), 'email/logs'),
        fallbackFrom: emailerConstructor.fallbackFrom,
        fallbackSubject: emailerConstructor.fallbackSubject
    };
});
