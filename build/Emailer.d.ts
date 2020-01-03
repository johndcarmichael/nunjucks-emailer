import EmailerSend from "./interfaces/EmailerSend";
import EmailerSendObjectWithGlobals from "./interfaces/EmailerSendObjectWithGlobals";
declare class Emailer {
    send(emailerSend: EmailerSend): Promise<EmailerSendObjectWithGlobals>;
    getLogFileNames(): Promise<string[]>;
    getLatestLogFileData(): Promise<EmailerSendObjectWithGlobals>;
    removeAllEmailJsonLogFiles(): Promise<boolean>;
    private hasBeenInitialized;
    private calculateLogFilePath;
    private renderTemplate;
    private sendTo;
    private writeFile;
}
declare const _default: Emailer;
export default _default;
