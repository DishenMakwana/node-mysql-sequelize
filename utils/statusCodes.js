const statusCodes = {
  CONTINUE: { code: 100, desc: 'Continue' },
  SWITCHING_PROTOCOLS: { code: 101, desc: 'Switching Protocols' },
  CHECKPOINT: { code: 103, desc: 'Checkpoint' },
  OK: { code: 200, desc: 'OK' },
  CREATED: { code: 201, desc: 'Created' },
  ACCEPTED: { code: 202, desc: 'Accepted' },
  NON_AUTHORITATIVE_INFORMATION: {
    code: 203,
    desc: 'Non-Authoritative Information',
  },
  NO_CONTENT: { code: 204, desc: 'No Content' },
  RESET_CONTENT: { code: 205, desc: 'Reset Content' },
  PARTIAL_CONTENT: { code: 206, desc: 'Partial Content' },
  MULTI_STATUS: { code: 207, desc: 'Multi-Status' },
  ALREADY_REPORTED: { code: 208, desc: 'Already Reported' },
  IM_USED: { code: 226, desc: 'IM Used' },
  MULTIPLE_CHOICES: { code: 300, desc: 'Multiple Choices' },
  MOVED_PERMANENTLY: { code: 301, desc: 'Moved Permanently' },
  FOUND: { code: 302, desc: 'Found' },
  SEE_OTHER: { code: 303, desc: 'See Other' },
  NOT_MODIFIED: { code: 304, desc: 'Not Modified' },
  USE_PROXY: { code: 305, desc: 'Use Proxy' },
  TEMPORARY_REDIRECT: { code: 307, desc: 'Temporary Redirect' },
  PERMANENT_REDIRECT: { code: 308, desc: 'Permanent Redirect' },
  BAD_REQUEST: { code: 400, desc: 'Bad Request' },
  UNAUTHORIZED: { code: 401, desc: 'Unauthorized' },
  PAYMENT_REQUIRED: { code: 402, desc: 'Payment Required' },
  FORBIDDEN: { code: 403, desc: 'Forbidden' },
  NOT_FOUND: { code: 404, desc: 'Not Found' },
  METHOD_NOT_ALLOWED: { code: 405, desc: 'Method Not Allowed' },
  NOT_ACCEPTABLE: { code: 406, desc: 'Not Acceptable' },
  PROXY_AUTHENTICATION_REQUIRED: {
    code: 407,
    desc: 'Proxy Authentication Required',
  },
  REQUEST_TIMEOUT: { code: 408, desc: 'Request Timeout' },
  CONFLICT: { code: 409, desc: 'Conflict' },
  PRECONDITION_FAILED: { code: 412, desc: 'Precondition Failed' },
  PAYLOAD_TOO_LARGE: { code: 413, desc: 'Payload Too Large' },
  URI_TOO_LONG: { code: 414, desc: 'URI Too Long' },
  EXPECTATION_FAILED: { code: 417, desc: 'Expectation Failed' },
  UNPROCESSABLE_ENTITY: { code: 422, desc: 'Unprocessable Entity' },
  LOCKED: { code: 423, desc: 'Locked' },
  PRECONDITION_REQUIRED: { code: 428, desc: 'Precondition Required' },
  TOO_MANY_REQUESTS: { code: 429, desc: 'Too Many Requests' },
  INTERNAL_SERVER_ERROR: { code: 500, desc: 'Internal Server Error' },
  BAD_GATEWAY: { code: 502, desc: 'Bad Gateway' },
  SERVICE_UNAVAILABLE: { code: 503, desc: 'Service Unavailable' },
  GATEWAY_TIMEOUT: { code: 504, desc: 'Gateway Timeout' },
  INSUFFICIENT_STORAGE: { code: 507, desc: 'Insufficient Storage' },
};

module.exports = { statusCodes };
