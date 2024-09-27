import AppError from "./AppError"; // Import the base AppError class for custom error handling

/**
 * Custom error class for unauthorized access.
 * This class extends the base AppError class to represent an unauthorized error with a specific status code.
 */
export default class UnauthorizedError extends AppError {
	/**
	 * Constructor for the UnauthorizedError class.
	 * @param message - Optional custom error message; defaults to "UnauthorizedError".
	 */
	public constructor(message = "UnauthorizedError") {
		super(message, 401); // Call the parent constructor with the message and status code 401 (Unauthorized)
	}
}
