import EmailerConstructor from '@/interfaces/EmailerContructor';
import path from 'path';
import fs from 'fs-extra';

export default (emailerConstructor: EmailerConstructor) => {
  global.OPENAPI_NODEGEN_EMAILER_TEMPLATE_PATH = emailerConstructor.templatePath || path.join(process.cwd(), 'email/templates');
  global.OPENAPI_NODEGEN_EMAILER_SEND_TYPE = emailerConstructor.sendType;
  global.OPENAPI_NODEGEN_EMAILER_LOG_PATH = emailerConstructor.logPath || path.join(process.cwd(), 'email/logs');
};
