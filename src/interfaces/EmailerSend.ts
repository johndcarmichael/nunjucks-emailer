export type EmailData = string | { name?: string; email: string; }

export default interface EmailerSend {
  to: EmailData;
  tplRelativePath: string;
  from?: EmailData;
  subject?: string;
  tplObject?: any;
}
