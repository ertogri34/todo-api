import type { Status } from "../types/Status";

/**
 * AppError class extends the native Error class
 * and adds custom properties for handling API errors.
 */
export default class AppError extends Error {
	/**
	 * Status of the error, can either be 'fail' for client errors or 'error' for server errors.
	 */
	public readonly status: Status;

	/**
	 * Constructor for initializing an AppError instance.
	 *
	 * @param message - Error message describing the error
	 * @param statusCode - HTTP status code indicating the type of error (4xx or 5xx)
	 */
	public constructor(
		message: string,
		public readonly statusCode: number,
	) {
		super(message); // Call the parent class (Error) constructor with the message

		/**
		 * Determine the status based on the statusCode:
		 * 'fail' if it's a client error (4xx), otherwise 'error' for server errors (5xx).
		 */
		this.status = this.statusCode.toString().startsWith("4")
			? "fail"
			: "error";

		/**
		 * Capture the stack trace for debugging purposes, excluding the constructor itself.
		 */
		Error.captureStackTrace(this, this.constructor);
	}
}
