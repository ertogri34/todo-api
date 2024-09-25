import AppError from "./AppError";

/**
 * ServerFailedError class represents a server-side error with a 500 status code.
 * This class extends the custom AppError class, providing a default error message for server failures.
 */
export default class ServerFailedError extends AppError {
	/**
	 * Constructs a new ServerFailedError instance with an optional custom message.
	 * @param message - Custom error message, defaults to "Server Failed Error".
	 */
	public constructor(message = "Server Failed Error") {
		// Call the parent AppError class constructor with the message and status code 500
		super(message, 500);
	}
}
