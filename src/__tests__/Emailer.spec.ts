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
const templateGlobalObject = {
  globalNumber: '123.123.654',
};
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
    const regex = /\/welcome\d{13,18}\.json/;
    const pattern = RegExp(regex);
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
    const recursive = require('recursive-readdir-sync');
    // read the dir and get the latest file name in the dir
    const files = recursive(logPath);
    expect(
      JSON.parse(
        fs.readFileSync(files.pop(), 'utf8'),
      ),
    ).toEqual(expectedObject);
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
      sendType: EmailerSendTypes.log,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath,
      fallbackFrom,
      templateGlobalObject,
    });
    const logFile = await Emailer.send({ to, from, subject, tplObject, tplRelativePath });
    expect(fs.existsSync(logFile)).toBe(true);
  });
});
