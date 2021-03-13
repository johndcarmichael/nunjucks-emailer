import { EmailerSendTypes } from "../enums/EmailerSendTypes";
import { EmailData } from "./EmailerSend";
import InlineCss from 'inline-css';
export default interface EmailerConstructor {
    fallbackFrom: EmailData;
    fallbackSubject: string;
    logPath?: string;
    makeCssInline?: boolean;
    makeCssInlineOptions?: InlineCss.Options;
    sendType: EmailerSendTypes;
    templateGlobalObject?: any;
    templatePath?: string;
}
