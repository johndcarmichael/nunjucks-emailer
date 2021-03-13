"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path = require("path");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var mail_1 = tslib_1.__importDefault(require("@sendgrid/mail"));
var inline_css_1 = tslib_1.__importDefault(require("inline-css"));
var nunjucks_1 = tslib_1.__importDefault(require("nunjucks"));
var EmailerSendTypes_1 = require("./enums/EmailerSendTypes");
var getSubjectFromHtml_1 = tslib_1.__importDefault(require("./utils/getSubjectFromHtml"));
var Emailer = /** @class */ (function () {
    function Emailer() {
    }
    Emailer.prototype.send = function (emailerSend) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, HTMLString, subjectFromHtmlString, cssInlineOpts, messageObject;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.hasBeenInitialized()) {
                            throw new Error('You must first call EmailerSetup before using the Emailer class.');
                        }
                        config = global.OPENAPI_NODEGEN_EMAILER_SETTINGS;
                        return [4 /*yield*/, this.renderTemplate(path.join(config.tplPath, emailerSend.tplRelativePath + '.html.njk'), emailerSend.tplObject)];
                    case 1:
                        HTMLString = _b.sent();
                        subjectFromHtmlString = getSubjectFromHtml_1["default"](HTMLString);
                        if (!config.makeCssInline) return [3 /*break*/, 3];
                        cssInlineOpts = config.makeCssInlineOptions || {};
                        return [4 /*yield*/, inline_css_1["default"](HTMLString, cssInlineOpts)];
                    case 2:
                        HTMLString = _b.sent();
                        _b.label = 3;
                    case 3:
                        _a = {
                            from: emailerSend.from || global.OPENAPI_NODEGEN_EMAILER_SETTINGS.fallbackFrom,
                            html: HTMLString,
                            subject: emailerSend.subject || subjectFromHtmlString || global.OPENAPI_NODEGEN_EMAILER_SETTINGS.fallbackSubject
                        };
                        return [4 /*yield*/, this.renderTemplate(path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplPath, emailerSend.tplRelativePath + '.txt.njk'), emailerSend.tplObject)];
                    case 4:
                        messageObject = (_a.text = _b.sent(),
                            _a.to = emailerSend.to,
                            _a.tplObject = emailerSend.tplObject || {},
                            _a.tplRelativePath = emailerSend.tplRelativePath,
                            _a);
                        return [4 /*yield*/, this.sendTo(messageObject)];
                    case 5: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Emailer.prototype.getLogFileNames = function () {
        return new Promise(function (resolve, reject) {
            fs_extra_1["default"].readdir(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath, function (err, files) {
                if (err) {
                    console.error('Unable to scan directory: ' + global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath);
                    return reject(err);
                }
                return resolve(files);
            });
        });
    };
    Emailer.prototype.getLatestLogFileData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _b = (_a = fs_extra_1["default"]).readJSON;
                        _d = (_c = path).join;
                        _e = [global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath];
                        return [4 /*yield*/, this.getLogFileNames()];
                    case 1:
                        _b.apply(_a, [_d.apply(_c, _e.concat([(_f.sent()).pop()])),
                            function (err, json) {
                                if (err) {
                                    return reject(err);
                                }
                                return resolve(json);
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Emailer.prototype.removeAllEmailJsonLogFiles = function () {
        return new Promise(function (resolve, reject) {
            fs_extra_1["default"].emptyDir(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath, function (err) {
                if (err) {
                    console.error('There was an error clearing the log folder');
                    return reject(err);
                }
                return resolve(true);
            });
        });
    };
    Emailer.prototype.hasBeenInitialized = function () {
        return !(global.OPENAPI_NODEGEN_EMAILER_SETTINGS === undefined);
    };
    Emailer.prototype.calculateLogFilePath = function (tplRelPath) {
        return path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath, new Date().getTime() + tplRelPath + '.json');
    };
    Emailer.prototype.renderTemplate = function (fullTemplatePath, templateObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_extra_1["default"].readFile(fullTemplatePath, 'utf8', function (err, data) {
                            if (err) {
                                return reject(err);
                            }
                            nunjucks_1["default"].configure({
                                autoescape: false
                            });
                            var env = new nunjucks_1["default"].Environment(new nunjucks_1["default"].FileSystemLoader(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplPath));
                            for (var key in global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject) {
                                if (global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject.hasOwnProperty(key)) {
                                    env.addGlobal(key, global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject[key]);
                                }
                            }
                            resolve(env.renderString(data, templateObject || {}));
                        });
                    })];
            });
        });
    };
    Emailer.prototype.sendTo = function (sendObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sendObjectWithGlobals, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sendObjectWithGlobals = Object.assign(sendObject, {
                            tplGlobalObject: global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplGlobalObject
                        });
                        _a = global.OPENAPI_NODEGEN_EMAILER_SETTINGS.sendType;
                        switch (_a) {
                            case EmailerSendTypes_1.EmailerSendTypes.log: return [3 /*break*/, 1];
                            case EmailerSendTypes_1.EmailerSendTypes.file: return [3 /*break*/, 2];
                            case EmailerSendTypes_1.EmailerSendTypes.sendgrid: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        console.log(sendObjectWithGlobals);
                        return [3 /*break*/, 6];
                    case 2:
                        _b = sendObjectWithGlobals;
                        return [4 /*yield*/, this.writeFile(sendObject.tplRelativePath, sendObjectWithGlobals)];
                    case 3:
                        _b.loggedFilePath = _c.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        mail_1["default"].setApiKey(process.env.SENDGRID_API_KEY);
                        return [4 /*yield*/, mail_1["default"].send(sendObjectWithGlobals)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, sendObjectWithGlobals];
                }
            });
        });
    };
    Emailer.prototype.writeFile = function (tplRelativePath, object) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var filePath = _this.calculateLogFilePath(tplRelativePath);
            fs_extra_1["default"].writeFile(filePath, JSON.stringify(object), 'utf8', function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve(filePath);
            });
        });
    };
    return Emailer;
}());
exports["default"] = new Emailer();
