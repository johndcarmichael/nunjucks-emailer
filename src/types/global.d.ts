/**
 * IMPORTANT - do not use imports in this file!
 * It will break global definition.
 */
declare namespace NodeJS {
  export interface Global {
    OPENAPI_NODEGEN_EMAILER_TEMPLATE_PATH?: string;
    OPENAPI_NODEGEN_EMAILER_LOG_PATH?: string;
    OPENAPI_NODEGEN_EMAILER_SEND_TYPE: string;
    OPENAPI_NODEGEN_EMAILER_API_KEY?: string;
  }
}
