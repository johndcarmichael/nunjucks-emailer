export default interface EmailerSend {
    to: string;
    from?: string;
    subject: string;
    tplObject?: any;
    tplRelativePath: string;
}
