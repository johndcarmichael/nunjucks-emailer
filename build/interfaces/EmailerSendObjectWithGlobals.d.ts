import EmailerSendObject from "./EmailerSendObject";
export default interface EmailerSendObjectWithGlobals extends EmailerSendObject {
    tplGlobalObject: any;
    loggedFilePath?: string;
}
