import path = require('path');
import fs from 'fs';
import sgMail from '@sendgrid/mail';
import EmailerSendObject from '@/interfaces/EmailerSendObject';
import nunjucks from 'nunjucks';
import { EmailerSendTypes } from '@/enums/EmailerSendTypes';

class Emailer {
  public async send (to: string, from: string, subject: string, tplObject: any, tplRelativePath: string): Promise<any> {
    if (!this.hasBeenInitialized()) {
      throw new Error('You must first call EmailerSetup before using the Emailer class.');
    }
    const messageObject = {
      from,
      html: await this.renderTemplate(
        path.join(global.OPENAPI_NODEGEN_EMAILER_TEMPLATE_PATH, tplRelativePath + '.html.njk'),
        tplObject,
      ),
      subject,
      text: await this.renderTemplate(
        path.join(global.OPENAPI_NODEGEN_EMAILER_TEMPLATE_PATH, tplRelativePath + '.txt.njk'),
        tplObject,
      ),
      to,
      tplObject,
      tplRelativePath,
    };
    return await this.sendTo(messageObject);
  }

  private hasBeenInitialized () {
    return !(global.OPENAPI_NODEGEN_EMAILER_TEMPLATE_PATH === undefined
      || global.OPENAPI_NODEGEN_EMAILER_SEND_TYPE === undefined
      || global.OPENAPI_NODEGEN_EMAILER_LOG_PATH === undefined);
  }

  private calculateLogFilePath (tplRelPath: string) {
    return path.join(
      global.OPENAPI_NODEGEN_EMAILER_LOG_PATH,
      tplRelPath + new Date().getTime() + '.json',
    );
  }

  private async renderTemplate (fullTemplatePath: string, templateObject: any): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(fullTemplatePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(nunjucks.renderString(data, templateObject));
      });
    });
  }

  private async sendTo (sendObject: EmailerSendObject) {
    return new Promise((resolve) => {
      switch (global.OPENAPI_NODEGEN_EMAILER_SEND_TYPE) {
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
