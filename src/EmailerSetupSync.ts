import EmailerConstructor from '@/interfaces/EmailerContructor';
import fs from 'fs-extra';
import EmailerSetup from '@/EmailerSetup';

export default (emailerConstructor: EmailerConstructor): void => {
  EmailerSetup(emailerConstructor);
  fs.ensureDirSync(global.OPENAPI_NODEGEN_EMAILER_LOG_PATH);
};
