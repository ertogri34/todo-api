import AppError from "./AppError";

/**
 * BadRequestError class represents a client-side error with a 400 status code.
 * This class extends the custom AppError class, providing a default error message.
 */
export default class BadRequestError extends AppError {
	/**
	 * Constructs a new BadRequestError instance with an optional custom message.
	 * @param message - Custom error message, defaults to "Bad Request".
	 */
	public constructor(message = "Bad Request") {
		// Call the parent AppError class constructor with the message and status code 400
		super(message, 400);
	}
}
