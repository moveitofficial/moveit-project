export interface WsErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
  };
}
