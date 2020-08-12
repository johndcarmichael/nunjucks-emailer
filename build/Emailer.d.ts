import EmailerSendObject from "./interfaces/EmailerSendObject";
import EmailerSend from "./interfaces/EmailerSend";
import EmailerSendObjectWithGlobals from "./interfaces/EmailerSendObjectWithGlobals";
declare class Emailer {
    send(emailerSend: EmailerSend): Promise<EmailerSendObjectWithGlobals>;
    getLogFileNames(): Promise<string[]>;
    getLatestLogFileData(): Promise<EmailerSendObjectWithGlobals>;
    removeAllEmailJsonLogFiles(): Promise<boolean>;
    hasBeenInitialized(): boolean;
    calculateLogFilePath(tplRelPath: string): string;
    renderTemplate(fullTemplatePath: string, templateObject?: any): Promise<string>;
    sendTo(sendObject: EmailerSendObject): Promise<EmailerSendObjectWithGlobals>;
    writeFile(tplRelativePath: string, object: EmailerSendObjectWithGlobals): Promise<string>;
}
declare const _default: Emailer;
export default _default;
