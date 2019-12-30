import EmailerSend from "./interfaces/EmailerSend";
declare class Emailer {
    send(emailerSend: EmailerSend): Promise<any>;
    private hasBeenInitialized;
    private calculateLogFilePath;
    private renderTemplate;
    private sendTo;
}
declare const _default: Emailer;
export default _default;
