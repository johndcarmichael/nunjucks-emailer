"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var EmailerSendTypes_1 = require("../enums/EmailerSendTypes");
var index_1 = require("../index");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var emailerSetup_1 = tslib_1.__importDefault(require("../emailerSetup"));
var logPath = path_1["default"].join(process.cwd(), 'src/__tests__/log');
var to = 'john@john.com';
var from = 'bob@bob.com';
var fallbackFrom = 'test@test.com';
var subject = 'This is a test email';
var tplObject = {
    name: 'John'
};
var tplRelativePath = 'welcome';
var templateGlobalObject = {
    globalNumber: '123.123.654'
};
var expectedObject = {
    from: from,
    html: "<p>Welcome John</p>\n<p>" + templateGlobalObject.globalNumber + "</p>\n",
    subject: subject,
    text: "Welcome John\n",
    to: to,
    tplGlobalObject: templateGlobalObject,
    tplObject: tplObject,
    tplRelativePath: tplRelativePath
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
                    return [4 /*yield*/, index_1.Emailer.send({ to: to, from: from, subject: subject, tplObject: tplObject, tplRelativePath: tplRelativePath })];
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
                    emailerSetup_1["default"]({
                        sendType: EmailerSendTypes_1.EmailerSendTypes["return"],
                        fallbackFrom: fallbackFrom
                    });
                    index_1.emailerSetupSync({
                        sendType: EmailerSendTypes_1.EmailerSendTypes["return"],
                        templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                        logPath: logPath,
                        fallbackFrom: fallbackFrom,
                        templateGlobalObject: templateGlobalObject
                    });
                    return [4 /*yield*/, index_1.emailerSetupAsync({
                            sendType: EmailerSendTypes_1.EmailerSendTypes["return"],
                            templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                            logPath: logPath,
                            fallbackFrom: fallbackFrom,
                            templateGlobalObject: templateGlobalObject
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
                case 0: return [4 /*yield*/, index_1.Emailer.send({ to: to, from: from, subject: subject, tplObject: tplObject, tplRelativePath: tplRelativePath })];
                case 1:
                    sentObject = _a.sent();
                    expect(sentObject).toEqual(expectedObject);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return the object but with fallbackFrom email', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var sentObject;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.Emailer.send({ to: to, subject: subject, tplObject: tplObject, tplRelativePath: tplRelativePath })];
                case 1:
                    sentObject = _a.sent();
                    expect(sentObject).toEqual(Object.assign(JSON.parse(JSON.stringify(expectedObject)), { from: fallbackFrom }));
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
                    return [4 /*yield*/, index_1.Emailer.send({ to: to, from: from, subject: subject, tplObject: tplObject, tplRelativePath: 'doesnotexist' })];
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
        var fullPath = index_1.Emailer['calculateLogFilePath']('welcome');
        var regex = /\/\d{13,18}welcome\.json/;
        var pattern = RegExp(regex);
        console.log(fullPath);
        expect(pattern.test(fullPath.replace(logPath, ''))).toBe(true);
    });
    it('should write to file', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    index_1.emailerSetupSync({
                        sendType: EmailerSendTypes_1.EmailerSendTypes.file,
                        templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                        logPath: logPath,
                        fallbackFrom: fallbackFrom,
                        templateGlobalObject: templateGlobalObject
                    });
                    return [4 /*yield*/, index_1.Emailer.send({ to: to, from: from, subject: subject, tplObject: tplObject, tplRelativePath: tplRelativePath })];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, index_1.Emailer.getLatestLogFileData()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual(expectedObject);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw an error on bad log directory', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index_1.emailerSetupSync({
                        sendType: EmailerSendTypes_1.EmailerSendTypes.file,
                        templatePath: '/',
                        logPath: logPath,
                        fallbackFrom: fallbackFrom,
                        templateGlobalObject: templateGlobalObject
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, index_1.Emailer.send({ to: to, from: from, subject: subject, tplObject: tplObject, tplRelativePath: tplRelativePath })];
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
    it('Should write file to disk', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var logFile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index_1.emailerSetupSync({
                        sendType: EmailerSendTypes_1.EmailerSendTypes.log,
                        templatePath: path_1["default"].join(process.cwd(), 'src/__tests__/templates'),
                        logPath: logPath,
                        fallbackFrom: fallbackFrom,
                        templateGlobalObject: templateGlobalObject
                    });
                    return [4 /*yield*/, index_1.Emailer.send({ to: to, from: from, subject: subject, tplObject: tplObject, tplRelativePath: tplRelativePath })];
                case 1:
                    logFile = _a.sent();
                    expect(fs_extra_1["default"].existsSync(logFile)).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw error and not be able a non json file', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs_extra_1["default"].writeFileSync(path_1["default"].join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath, '999999999999.json'), 'this is not json');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, index_1.Emailer.getLatestLogFileData()];
                case 2:
                    _a.sent();
                    done('Should have thrown an error');
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('We should currently have 3 files written to disc', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, index_1.Emailer.getLogFileNames()];
                case 1:
                    _a.apply(void 0, [(_b.sent()).length]).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to empty log directory', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, index_1.Emailer.removeAllEmailJsonLogFiles()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, index_1.Emailer.getLogFileNames()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).length]).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw error and not be able to scan non-existent directory', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath = '/non-existent-path';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, index_1.Emailer.getLogFileNames()];
                case 2:
                    _a.sent();
                    done('Should have thrown an error');
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _a.sent();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('should throw error and not be empty non-existent directory', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var e_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath = '/non-existent-path';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, index_1.Emailer.removeAllEmailJsonLogFiles()];
                case 2:
                    _a.sent();
                    done('Should have thrown an error');
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _a.sent();
                    done();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
