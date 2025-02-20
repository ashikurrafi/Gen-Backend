class apiError extends Error {
  constructor(
    statusCode,
    errorMessage = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = apiError;
