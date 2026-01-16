class ApiResponse {
    constructor(statusCode, data, message = "Success", success = true) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}

class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.name = this.constructor.name;
        this.stack = "";

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = { ApiResponse, ApiError };
