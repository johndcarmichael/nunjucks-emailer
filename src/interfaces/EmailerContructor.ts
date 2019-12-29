import { EmailerSendTypes } from '@/enums/EmailerSendTypes';

export default interface EmailerConstructor {
  templatePath?: string;
  sendType: EmailerSendTypes;
  logPath?: string;
}
