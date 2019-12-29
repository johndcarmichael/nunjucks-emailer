export interface TplObject {
  [name: string]: string | object;
}
export default interface EmailerSendObject {
  from: string;
  html: string;
  subject: string;
  text: string;
  to: string;
  tplObject: TplObject;
  tplRelativePath: string;
}
