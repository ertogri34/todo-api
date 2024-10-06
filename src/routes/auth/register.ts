import type {
	NextFunction,
	Request,
	Response,
} from "express";
import BadRequestError from "../../errors/BadRequestError";
import { type IRegisterDTO } from "../../types/dtos/IRegisterDTO";
import UserController from "../../controller/UserController";
import type { IMessageResponse } from "../../types/responses/IMessageResponse";
import ServerFailedError from "../../errors/ServerFailedError";
import { UserRole } from "../../types/documents/IUserDocument";
import { hashPassword } from "../../utils/password";

/**
 * Handles the registration of a new user.
 *
 * This function validates the required input fields (email, password, and name),
 * checks if the user is already registered, hashes the password, and then
 * creates a new user entry in the database. If any error occurs, it handles
 * the appropriate error responses, including validation and server errors.
 *
 * @param req - Express Request object containing the registration data in the body.
 * @param res - Express Response object used to send the response back to the client.
 * @param next - Function to pass control to the next middleware or error handler.
 * @returns A Promise that resolves to a JSON response if successful or void if an error occurs.
 */
export default async function register(
	req: Request<object, object, IRegisterDTO>,
	res: Response,
	next: NextFunction,
): Promise<Response<IMessageResponse> | void> {
	const { email, password, name } = req.body;

	// Check for required fields: email, password, and name
	if (!email || !password || !name) {
		return next(
			new BadRequestError(
				"Required fields: email, password, and name.",
			),
		);
	}

	try {
		// Check if a user with the same email already exists
		const existingUser =
			await UserController.findByEmailUser(email);
		if (existingUser) {
			return next(
				new BadRequestError("User already registered."),
			);
		}

		// Hash the password before storing the user
		const hashedPassword = await hashPassword(password);
		if (!hashedPassword) {
			return next(
				new ServerFailedError("Password hashing failed."),
			);
		}

		// Create the new user in the database with the hashed password
		await UserController.createUser({
			email,
			password: hashedPassword,
			name,
			role: UserRole.USER, // Assign a default role as USER
		});

		// Return a success response upon successful user creation
		return res.status(201).json({
			message: "Successfully User Created.",
		} as IMessageResponse);
	} catch (err) {
		// Handle validation errors, such as missing or incorrect fields
		if ((err as Error).name === "ValidationError") {
			return next(
				new BadRequestError((err as Error).message),
			);
		}

		// Handle any other server-related errors
		return next(
			new ServerFailedError((err as Error).message),
		);
	}
}
