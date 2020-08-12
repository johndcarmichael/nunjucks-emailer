import { EmailerSendTypes } from "../enums/EmailerSendTypes";
export default interface EmailerConstructor {
    fallbackFrom: string;
    fallbackSubject: string;
    logPath?: string;
    sendType: EmailerSendTypes;
    templateGlobalObject?: any;
    templatePath?: string;
}
