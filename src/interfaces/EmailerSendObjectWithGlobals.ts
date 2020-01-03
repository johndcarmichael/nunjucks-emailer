import EmailerSendObject from '@/interfaces/EmailerSendObject';

export default interface EmailerSendObjectWithGlobals extends EmailerSendObject {
  tplGlobalObject: any;
  loggedFilePath?: string;
}
