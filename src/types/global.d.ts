/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */

declare namespace NodeJS {
  export interface Global {
    OPENAPI_NODEGEN_EMAILER_SETTINGS: {
      tplPath: string,
      tplGlobalObject: any,
      sendType: string,
      logPath: string,
      fallbackFrom: string,
      fallbackSubject: string
    };
  }
}
