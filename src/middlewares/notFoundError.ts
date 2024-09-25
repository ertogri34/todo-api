import type {
	NextFunction,
	Request,
	Response,
} from "express";
import NotFoundError from "../errors/NotFoundError";

/**
 * Middleware to handle requests to routes that do not exist.
 *
 * @param req - The Express Request object, used to retrieve the original URL
 * @param _res - The Express Response object (not used in this middleware)
 * @param next - The next middleware function in the stack, called with a NotFoundError
 */
export default function notFound(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	/**
	 * Pass a NotFoundError to the next middleware in the stack.
	 * The error includes a message with the URL that could not be found.
	 */
	next(
		new NotFoundError(
			`The requested resource at "${req.originalUrl}" could not be found. Please check the URL and try again.`, // Detailed error message for the user
		),
	);
}
