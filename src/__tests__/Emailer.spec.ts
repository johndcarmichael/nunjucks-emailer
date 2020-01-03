import path from 'path';
import { EmailerSendTypes } from '@/enums/EmailerSendTypes';
import { Emailer, emailerSetupAsync, emailerSetupSync } from '@/index';
import fs from 'fs-extra';
import emailerSetup from '@/emailerSetup';

const logPath = path.join(process.cwd(), 'src/__tests__/log');
const to = 'john@john.com';
const from = 'bob@bob.com';
const fallbackFrom = 'test@test.com';
const subject = 'This is a test email';
const tplObject = {
  name: 'John',
};
const tplRelativePath = 'welcome';
function GlobalObject () {
  this.globalNumber = '123.123.654';
}
GlobalObject.prototype.age = 25;
// @ts-ignore
const templateGlobalObject = new GlobalObject();

const expectedObject = {
  from: from,
  html: `<p>Welcome John</p>
<p>${templateGlobalObject.globalNumber}</p>
`,
  subject: subject,
  text: `Welcome John
`,
  to: to,
  tplGlobalObject: templateGlobalObject,
  tplObject: tplObject,
  tplRelativePath: tplRelativePath,
};

describe('Setup, render and return object correctly', () => {
  afterAll(() => {
    fs.removeSync(logPath);
  });
  it('should throw error if not initialized', async (done) => {
    try {
      await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
      done('Should have thrown an error!');
    } catch (e) {
      done();
    }
  });
  it('should initialise correctly', async (done) => {
    try {
      emailerSetup({
        sendType: EmailerSendTypes.return,
        fallbackFrom,
      });
      emailerSetupSync({
        sendType: EmailerSendTypes.return,
        templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
        logPath: logPath,
        fallbackFrom,
        templateGlobalObject,
      });
      await emailerSetupAsync({
        sendType: EmailerSendTypes.return,
        templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
        logPath: logPath,
        fallbackFrom,
        templateGlobalObject,
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should return the object', async () => {
    const sentObject = await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
    expect(sentObject).toEqual(expectedObject);
  });

  it('should return the object but with fallbackFrom email', async () => {
    const sentObject = await Emailer.send({ to, subject, tplObject, tplRelativePath });
    expect(sentObject).toEqual(
      Object.assign(JSON.parse(JSON.stringify(expectedObject)), { from: fallbackFrom }),
    );
  });

  it('should throw error for wrong tpl name', async (done) => {
    try {
      await Emailer.send({ to, from, subject, tplObject, tplRelativePath: 'doesnotexist' });
      done('Should have thrown an error on wrong tpl name');
    } catch (e) {
      done();
    }
  });

  it('should calculate the correct file path', () => {
    const fullPath = Emailer['calculateLogFilePath']('welcome');
    const regex = /\/\d{13,18}welcome\.json/;
    const pattern = RegExp(regex);
    console.log(fullPath);
    expect(pattern.test(fullPath.replace(logPath, ''))).toBe(true);
  });

  it('should write to file', async () => {
    emailerSetupSync({
      sendType: EmailerSendTypes.file,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath,
      fallbackFrom,
      templateGlobalObject,
    });
    await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
    expect(await Emailer.getLatestLogFileData()).toEqual(expectedObject);
  });

  it('should throw an error on bad log directory', async (done) => {
    emailerSetupSync({
      sendType: EmailerSendTypes.file,
      templatePath: '/',
      logPath,
      fallbackFrom,
      templateGlobalObject,
    });
    try {
      await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
      done('Should have thrown an error for unwritable directory, either this is running as root or there is an error in the code');
    } catch (e) {
      done();
    }
  });

  it('Should write file to disk', async () => {
    emailerSetupSync({
      sendType: EmailerSendTypes.file,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath,
      fallbackFrom,
      templateGlobalObject,
    });
    const logFile = await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
    expect(fs.existsSync(logFile.loggedFilePath)).toBe(true);
  });

  it('should throw error and not be able a non json file', async (done) => {
    fs.writeFileSync(
      path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath, '999999999999.json'),
      'this is not json',
    );
    try {
      await Emailer.getLatestLogFileData();
      done('Should have thrown an error');
    } catch (e) {
      done();
    }
  });

  it('We should currently have 3 files written to disc', async () => {
    expect((await Emailer.getLogFileNames()).length).toBe(3);
  });

  it('should be able to empty log directory', async () => {
    await Emailer.removeAllEmailJsonLogFiles();
    expect((await Emailer.getLogFileNames()).length).toBe(0);
  });

  it('should throw error and not be able to scan non-existent directory', async (done) => {
    global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath = '/non-existent-path';
    try {
      await Emailer.getLogFileNames();
      done('Should have thrown an error');
    } catch (e) {
      done();
    }
  });

  it('should throw error and not be empty non-existent directory', async (done) => {
    global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath = '/non-existent-path';
    try {
      await Emailer.removeAllEmailJsonLogFiles();
      done('Should have thrown an error');
    } catch (e) {
      done();
    }
  });

  it('should console log', async () => {
    emailerSetupSync({
      sendType: EmailerSendTypes.log,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath: logPath,
      fallbackFrom,
      templateGlobalObject,
    });
    await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
    // todo write in jest fn to check use of console log.
    expect((await Emailer.getLogFileNames()).length).toBe(0);
  });

  it('should console error as no api key set', async (done) => {
    emailerSetupSync({
      sendType: EmailerSendTypes.sendgrid,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath: logPath,
      fallbackFrom,
      templateGlobalObject,
    });
    try {
      await Emailer.send({ to, from, subject, tplRelativePath });
      done('should have thrown error as sendgrid not setup');
    } catch (e) {
      expect(e.response.body.errors[0].message).toBe('Permission denied, wrong credentials');
      done();
    }
  });
});
