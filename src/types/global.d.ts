/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */

declare namespace NodeJS {
  export interface Global {
    OPENAPI_NODEGEN_EMAILER_SETTINGS: {
      tplPath: string,
      sendType: string,
      logPath: string,
    };
  }
}
