import path = require('path');
import fs from 'fs';
import sgMail from '@sendgrid/mail';
import EmailerSendObject from '@/interfaces/EmailerSendObject';
import nunjucks from 'nunjucks';
import { EmailerSendTypes } from '@/enums/EmailerSendTypes';
import EmailerSend from '@/interfaces/EmailerSend';

class Emailer {
  public async send (emailerSend: EmailerSend): Promise<any> {
    if (!this.hasBeenInitialized()) {
      throw new Error('You must first call EmailerSetup before using the Emailer class.');
    }
    const messageObject = {
      from: emailerSend.from || global.OPENAPI_NODEGEN_EMAILER_SETTINGS.fallbackFrom,
      html: await this.renderTemplate(
        path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplPath, emailerSend.tplRelativePath + '.html.njk'),
        emailerSend.tplObject,
      ),
      subject: emailerSend.subject,
      text: await this.renderTemplate(
        path.join(global.OPENAPI_NODEGEN_EMAILER_SETTINGS.tplPath, emailerSend.tplRelativePath + '.txt.njk'),
        emailerSend.tplObject,
      ),
      to: emailerSend.to,
      tplObject: emailerSend.tplObject || {},
      tplRelativePath: emailerSend.tplRelativePath,
    };
    return await this.sendTo(messageObject);
  }

  private hasBeenInitialized () {
    return !(global.OPENAPI_NODEGEN_EMAILER_SETTINGS === undefined);
  }

  private calculateLogFilePath (tplRelPath: string) {
    return path.join(
      global.OPENAPI_NODEGEN_EMAILER_SETTINGS.logPath,
      tplRelPath + new Date().getTime() + '.json',
    );
  }

  private async renderTemplate (fullTemplatePath: string, templateObject?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(fullTemplatePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(nunjucks.renderString(data, templateObject || {}));
      });
    });
  }

  private async sendTo (sendObject: EmailerSendObject) {
    return new Promise((resolve) => {
      switch (global.OPENAPI_NODEGEN_EMAILER_SETTINGS.sendType) {
        case EmailerSendTypes.sendgrid:
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          return resolve(sgMail.send(sendObject));
        case EmailerSendTypes.return:
          return resolve(sendObject);
        case EmailerSendTypes.log:
          console.log(sendObject);
        // don't break here as log and file should write log to disk.
        case EmailerSendTypes.file:
          const filePath = this.calculateLogFilePath(sendObject.tplRelativePath);
          fs.writeFile(filePath, JSON.stringify(sendObject), 'utf8', () => {
            return resolve(filePath);
          });
          break;
      }
    });
  }
}

export default new Emailer();
