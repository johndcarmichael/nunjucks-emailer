import { EmailerSendTypes } from '@/enums/EmailerSendTypes';
import { EmailData } from '@/interfaces/EmailerSend';

export default interface EmailerConstructor {
  fallbackFrom: EmailData;
  fallbackSubject: string;
  logPath?: string;
  sendType: EmailerSendTypes;
  templateGlobalObject?: any;
  templatePath?: string;
}
