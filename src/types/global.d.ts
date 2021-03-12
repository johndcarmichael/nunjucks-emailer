/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */

declare namespace NodeJS {
  export interface Global {
    OPENAPI_NODEGEN_EMAILER_SETTINGS: {
      fallbackFrom: any,
      fallbackSubject: string
      makeCssInline: boolean,
      makeCssInlineOptions: any,
      logPath: string,
      sendType: string,
      tplGlobalObject: any,
      tplPath: string,
    };
  }
}
