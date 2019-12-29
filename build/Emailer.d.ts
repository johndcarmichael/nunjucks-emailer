declare class Emailer {
    send(to: string, from: string, subject: string, tplObject: any, tplRelativePath: string): Promise<any>;
    private hasBeenInitialized;
    private calculateLogFilePath;
    private renderTemplate;
    private sendTo;
}
declare const _default: Emailer;
export default _default;
