import UnauthorizedError from "../errors/UnauthorizedError"; // Import the custom UnauthorizedError class for handling unauthorized access errors
import { UserRole } from "../types/documents/IUserDocument"; // Import the UserRole type for role validation
import type {
	Request, // Import the Request type from Express for type safety
	Response, // Import the Response type from Express for type safety
	NextFunction, // Import the NextFunction type from Express to define the next middleware function
} from "express";

/**
 * Middleware to authorize user roles.
 * This function checks if the user's role meets the required role level for access.
 * @param role - The minimum role required to access the endpoint
 * @returns A middleware function that processes the request and checks user access
 */
export default function authorizeRole(role: UserRole) {
	return (
		req: Request, // Express request object containing user data
		_res: Response, // Express response object, not used in this function
		next: NextFunction, // Next middleware function to call
	): void => {
		const payload = req.user; // Extract the user payload from the request

		// Check if the user's role is lower than the required role
		if (payload.role < role) {
			// If the user's role is insufficient, return an UnauthorizedError
			return next(new UnauthorizedError("Access denied"));
		}

		// If the user's role is sufficient, proceed to the next middleware or route handler
		next();
	};
}
