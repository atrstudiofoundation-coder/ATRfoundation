export class ApiError extends Error {
  statusCode: number;
  detail?: string | Record<string, any>;
  code?: string;

  constructor(message: string, statusCode: number, detail?: string | Record<string, any>, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detail = detail;
    this.code = code;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network connectivity issue. Please check your connection.') {
    super(message, 0, undefined, 'ERR_NETWORK');
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required or session expired.') {
    super(message, 401, undefined, 'ERR_UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'You do not have administrative permissions to perform this action.') {
    super(message, 403, undefined, 'ERR_FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'The requested resource was not found.') {
    super(message, 404, undefined, 'ERR_NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  errors?: Record<string, string[]>;

  constructor(message = 'Validation failed for submitted data.', errors?: Record<string, string[]>) {
    super(message, 422, errors, 'ERR_VALIDATION');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
