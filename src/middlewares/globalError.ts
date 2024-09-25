import type {
	NextFunction,
	Request,
	Response,
} from "express";
import AppError from "../errors/AppError";
import type { IErrorResponse } from "../types/IErrorResponse";

/**
 * Global error handling middleware for handling all errors
 * that occur in the application.
 *
 * @param err - The error object, expected to be an instance of AppError
 * @param _req - The Express Request object (not used, but necessary for middleware signature)
 * @param res - The Express Response object, used to send the error response
 * @param _next - The next middleware function in the stack (not used, but necessary for middleware signature)
 * @returns Response<IErrorResponse> - Returns a JSON response with the error message and status
 */
export default function globalError(
	err: AppError,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction,
): Response<IErrorResponse> {
	/**
	 * Return a JSON response with the error message and status code.
	 * The error details are extracted from the AppError instance.
	 */
	return res.status(err.statusCode).json({
		error: err.message, // Error message to be returned
		status: err.status, // Error status ('fail' or 'error') based on statusCode
	}) as Response<IErrorResponse>;
}
