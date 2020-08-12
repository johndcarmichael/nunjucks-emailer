export default interface EmailerSend {
  to: string;
  tplRelativePath: string;
  from?: string;
  subject?: string;
  tplObject?: any;
}
