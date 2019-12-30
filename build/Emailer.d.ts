interface EmailerSend {
    to: string;
    from?: string;
    subject: string;
    tplObject?: any;
    tplRelativePath: string;
}
declare class Emailer {
    send(emailerSend: EmailerSend): Promise<any>;
    private hasBeenInitialized;
    private calculateLogFilePath;
    private renderTemplate;
    private sendTo;
}
declare const _default: Emailer;
export default _default;
