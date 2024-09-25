import AppError from "./AppError";

/**
 * NotFoundError class extends AppError to handle 404 errors.
 * It provides a default message for "Not Found" scenarios.
 */
export default class NotFoundError extends AppError {
	/**
	 * Constructor for initializing a NotFoundError instance.
	 *
	 * @param message - Custom error message (defaults to "Not Found" if not provided)
	 */
	public constructor(message = "Not Found") {
		// Call the parent class (AppError) constructor with the message and a 404 status code
		super(message, 404);
	}
}
