import path from 'path';
import Emailer from '@/Emailer';
import { EmailerSendTypes } from '@/enums/EmailerSendTypes';
import EmailerSetupSync from '@/EmailerSetupSync';
import EmailerSetupAsync from '@/EmailerSetupAsync';
import fs from 'fs-extra';

const logPath = path.join(process.cwd(), 'src/__tests__/log');
const to = 'john@john.com';
const from = 'bob@bob.com';
const subject = 'This is a test email';
const tplObject = {
  name: 'John',
};
const tplRelPath = 'welcome';
const expectedObject = {
  from: from,
  html: `<p>Welcome John</p>
`,
  subject: subject,
  text: `Welcome John
`,
  to: to,
  tplObject: tplObject,
  tplRelativePath: tplRelPath,
};

describe('Setup, render and return object correctly', () => {
  afterAll(() => {
    fs.removeSync(logPath);
  });
  it('should throw error if not initialized', async (done) => {
    try {
      await Emailer.send(to, from, subject, tplObject, tplRelPath);
      done('Should have thrown an error!');
    } catch (e) {
      done();
    }
  });
  it('should initialise correctly', async (done) => {
    try {
      EmailerSetupSync({
        sendType: EmailerSendTypes.return,
        templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
        logPath: logPath,
      });
      await EmailerSetupAsync({
        sendType: EmailerSendTypes.return,
        templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
        logPath: logPath,
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should return the object', async () => {
    const sentObject = await Emailer.send(to, from, subject, tplObject, tplRelPath);
    expect(sentObject).toEqual(expectedObject);
  });

  it('should throw error for wrong tpl name', async (done) => {
    try {
      await Emailer.send(to, from, subject, tplObject, 'doesnotexist');
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
    EmailerSetupSync({
      sendType: EmailerSendTypes.file,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath: logPath,
    });
    await Emailer.send(to, from, subject, tplObject, tplRelPath);
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
    EmailerSetupSync({
      sendType: EmailerSendTypes.file,
      templatePath: '/',
      logPath: logPath,
    });
    try {
      await Emailer.send(to, from, subject, tplObject, tplRelPath);
      done('Should have thrown an error for unwritable directory, either this is running as root or there is an error in the code');
    } catch (e) {
      done();
    }
  });

  it('should return empty string for console mode', async () => {
    EmailerSetupSync({
      sendType: EmailerSendTypes.log,
      templatePath: path.join(process.cwd(), 'src/__tests__/templates'),
      logPath: logPath,
    });
    expect(await Emailer.send(to, from, subject, tplObject, tplRelPath)).toBe('');
  });
});
