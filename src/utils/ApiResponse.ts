import type { Response } from 'express'

class ApiResponse {
    constructor(
        public statusCode: number,
        public data: any,
        public message: string = "Success",
        public success: boolean = true
    ) { }
}

class ApiError extends Error {
    public statusCode: number
    public errors: any[]
    public success: boolean
    public override stack: string = ""

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.success = false
        this.errors = errors
        this.name = this.constructor.name

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiResponse, ApiError }