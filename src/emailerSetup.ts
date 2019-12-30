import EmailerConstructor from '@/interfaces/EmailerContructor';
import path from 'path';

export default (emailerConstructor: EmailerConstructor) => {
  global.OPENAPI_NODEGEN_EMAILER_SETTINGS = {
    tplPath: emailerConstructor.templatePath || path.join(process.cwd(), 'email/templates'),
    sendType: emailerConstructor.sendType,
    logPath: emailerConstructor.logPath || path.join(process.cwd(), 'email/logs'),
    fallbackFrom: emailerConstructor.fallbackFrom,
  };
};
