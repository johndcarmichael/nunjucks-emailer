"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path = require("path");
var fs_1 = tslib_1.__importDefault(require("fs"));
var mail_1 = tslib_1.__importDefault(require("@sendgrid/mail"));
var nunjucks_1 = tslib_1.__importDefault(require("nunjucks"));
var EmailerSendTypes_1 = require("./enums/EmailerSendTypes");
var Emailer = /** @class */ (function () {
    function Emailer() {
    }
    Emailer.prototype.send = function (emailerSend) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var messageObject, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.hasBeenInitialized()) {
                            throw new Error('You must first call EmailerSetup before using the Emailer class.');
                        }
                        _a = {
                            from: emailerSend.from || global.OPENAPI_NODEGEN_EMAILER_SETTINGS.fallbackFrom
                        };
                        return [4 /*yield*/, this.renderTemplate(path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplPath, emailerSend.tplRelativePath + '.html.njk'), emailerSend.tplObject)];
                    case 1:
                        _a.html = _b.sent(),
                            _a.subject = emailerSend.subject;
                        return [4 /*yield*/, this.renderTemplate(path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplPath, emailerSend.tplRelativePath + '.txt.njk'), emailerSend.tplObject)];
                    case 2:
                        messageObject = (_a.text = _b.sent(),
                            _a.to = emailerSend.to,
                            _a.tplObject = emailerSend.tplObject || {},
                            _a.tplRelativePath = emailerSend.tplRelativePath,
                            _a);
                        return [4 /*yield*/, this.sendTo(messageObject)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Emailer.prototype.hasBeenInitialized = function () {
        return !(global.OPENAPI_NODEGEN_EMAILER_SETTINGS === undefined);
    };
    Emailer.prototype.calculateLogFilePath = function (tplRelPath) {
        return path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath, tplRelPath + new Date().getTime() + '.json');
    };
    Emailer.prototype.renderTemplate = function (fullTemplatePath, templateObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_1["default"].readFile(fullTemplatePath, 'utf8', function (err, data) {
                            if (err) {
                                return reject(err);
                            }
                            var env = nunjucks_1["default"].configure({
                                autoescape: false
                            });
                            for (var key in global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject) {
                                if (global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject.hasOwnProperty(key)) {
                                    env.addGlobal(key, global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject[key]);
                                }
                            }
                            resolve(nunjucks_1["default"].renderString(data, templateObject || {}));
                        });
                    })];
            });
        });
    };
    Emailer.prototype.sendTo = function (sendObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sendObjectWithGlobals;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                sendObjectWithGlobals = Object.assign(sendObject, {
                    tplGlobalObject: global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject
                });
                return [2 /*return*/, new Promise(function (resolve) {
                        switch (global.OPENAPI_NODEGEN_EMAILER_SETTINGS.sendType) {
                            case EmailerSendTypes_1.EmailerSendTypes.sendgrid:
                                mail_1["default"].setApiKey(process.env.SENDGRID_API_KEY);
                                return resolve(mail_1["default"].send(sendObjectWithGlobals));
                            case EmailerSendTypes_1.EmailerSendTypes["return"]:
                                return resolve(sendObjectWithGlobals);
                            case EmailerSendTypes_1.EmailerSendTypes.log:
                                console.log(sendObjectWithGlobals);
                            // don't break here as log and file should write log to disk.
                            case EmailerSendTypes_1.EmailerSendTypes.file:
                                var filePath_1 = _this.calculateLogFilePath(sendObject.tplRelativePath);
                                fs_1["default"].writeFile(filePath_1, JSON.stringify(sendObjectWithGlobals), 'utf8', function () {
                                    return resolve(filePath_1);
                                });
                                break;
                        }
                    })];
            });
        });
    };
    return Emailer;
}());
exports["default"] = new Emailer();
