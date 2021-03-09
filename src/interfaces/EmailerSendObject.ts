import { EmailData } from '@/interfaces/EmailerSend';

export interface TplObject {
  [name: string]: string | any;
}

export default interface EmailerSendObject {
  from: EmailData;
  html: string;
  subject: string;
  text: string;
  to: EmailData;
  tplObject: TplObject;
  tplRelativePath: string;
}
