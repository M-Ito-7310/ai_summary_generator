export type ErrorCode =
  | 'INVALID_URL'
  | 'FETCH_FAILED'
  | 'PARSING_FAILED'
  | 'AI_API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'DATABASE_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  retryable?: boolean;
}

export class CustomError extends Error {
  code: ErrorCode;
  details?: string;
  retryable: boolean;

  constructor(code: ErrorCode, message: string, details?: string, retryable = false) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.retryable = retryable;
  }
}
