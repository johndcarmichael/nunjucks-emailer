"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var emailerSetup_1 = tslib_1.__importDefault(require("./emailerSetup"));
exports["default"] = (function (emailerConstructor) {
    emailerSetup_1["default"](emailerConstructor);
    fs_extra_1["default"].ensureDirSync(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath);
});
