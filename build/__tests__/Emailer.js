"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var Emailer_1 = tslib_1.__importDefault(require("../Emailer"));
var EmailerSendTypes_1 = require("../enums/EmailerSendTypes");
var EmailerSetupSync_1 = tslib_1.__importDefault(require("../EmailerSetupSync"));
var EmailerSetupAsync_1 = tslib_1.__importDefault(require("../EmailerSetupAsync"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var logPath = path_1["default"].join(process.cwd(), 'src/__tests__/log');
var to = 'john@john.com';
var from = 'bob@bob.com';
var subject = 'This is a test email';
var tplObject = {
    name: 'John'
};
var tplRelPath = 'welcome';
var expectedObject = {
    from: from,
    html: "<p>Welcome John</p>\n",
    subject: subject,
    text: "Welcome John\n",
    to: to,
    tplObject: tplObject,
    tplRelativePath: tplRelPath
};
describe('Setup, render and return object correctly', function () {
    afterAll(function () {
        fs_extra_1["default"].removeSync(logPath);
    });
    it('should throw error if not initialized', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Emailer_1["default"].send(to, from, subject, tplObject, tplRelPath)];
                case 1:
                    _a.sent();
                    done('Should have thrown an error!');
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    done();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('should initialise correctly', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    EmailerSetupSync_1["default"]({
                        sendType: EmailerSendTypes_1.EmailerSendTypes["return"],
                        templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                        logPath: logPath
                    });
                    return [4 /*yield*/, EmailerSetupAsync_1["default"]({
                            sendType: EmailerSendTypes_1.EmailerSendTypes["return"],
                            templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                            logPath: logPath
                        })];
                case 1:
                    _a.sent();
                    done();
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    done(e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('should return the object', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var sentObject;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Emailer_1["default"].send(to, from, subject, tplObject, tplRelPath)];
                case 1:
                    sentObject = _a.sent();
                    expect(sentObject).toEqual(expectedObject);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw error for wrong tpl name', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Emailer_1["default"].send(to, from, subject, tplObject, 'doesnotexist')];
                case 1:
                    _a.sent();
                    done('Should have thrown an error on wrong tpl name');
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _a.sent();
                    done();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('should calculate the correct file path', function () {
        var fullPath = Emailer_1["default"]['calculateLogFilePath']('welcome');
        var regex = /\/welcome\d{13,18}\.json/;
        var pattern = RegExp(regex);
        expect(pattern.test(fullPath.replace(logPath, ''))).toBe(true);
    });
    it('should write to file', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var recursive, files;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    EmailerSetupSync_1["default"]({
                        sendType: EmailerSendTypes_1.EmailerSendTypes.file,
                        templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                        logPath: logPath
                    });
                    return [4 /*yield*/, Emailer_1["default"].send(to, from, subject, tplObject, tplRelPath)];
                case 1:
                    _a.sent();
                    recursive = require('recursive-readdir-sync');
                    files = recursive(logPath);
                    expect(JSON.parse(fs_extra_1["default"].readFileSync(files.pop(), 'utf8'))).toEqual(expectedObject);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw an error on bad log directory', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    EmailerSetupSync_1["default"]({
                        sendType: EmailerSendTypes_1.EmailerSendTypes.file,
                        templatePath: '/',
                        logPath: logPath
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Emailer_1["default"].send(to, from, subject, tplObject, tplRelPath)];
                case 2:
                    _a.sent();
                    done('Should have thrown an error for unwritable directory, either this is running as root or there is an error in the code');
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('should return empty string for console mode', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    EmailerSetupSync_1["default"]({
                        sendType: EmailerSendTypes_1.EmailerSendTypes.log,
                        templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                        logPath: logPath
                    });
                    _a = expect;
                    return [4 /*yield*/, Emailer_1["default"].send(to, from, subject, tplObject, tplRelPath)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
});
