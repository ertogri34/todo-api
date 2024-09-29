import type {
	Request,
	Response,
	NextFunction,
} from "express";
import UserController from "../controller/UserController";
import NotFoundError from "../errors/NotFoundError";
import { IGetUserResponse } from "../types/responses/IGetUserResponse";
import ServerFailedError from "../errors/ServerFailedError";
import { IUpdateUserBody } from "../types/bodies/IUpdateUserBody";
import BadRequestError from "../errors/BadRequestError";
import { IUpdateUserResponse } from "../types/responses/IUpdateUserResponse";

/**
 * Retrieves the user information based on the user ID in the request.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response containing user information or an error.
 */
export async function getUser(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<Response<IGetUserResponse> | void> {
	try {
		// Attempt to find the user by ID
		const user = await UserController.findByUserId(
			req.user.id,
		);

		// If user not found, pass NotFoundError to the next middleware
		if (!user) {
			return next(new NotFoundError("User not found."));
		}

		// Structure the user response
		const userResponse: IGetUserResponse = {
			id: user.id.toString(), // Convert ObjectId to string
			name: user.name,
			email: user.email,
		};

		// Return the user information in the response
		return res.status(200).json({
			user: userResponse,
		});
	} catch (error) {
		// Handle any unexpected errors
		next(error);
	}
}

/**
 * Deletes the user based on the user ID in the request.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response with a 204 status or an error.
 */
export async function deleteUser(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<Response | void> {
	try {
		// Attempt to delete the user by ID
		await UserController.deleteByUserId(req.user.id);
		// Send a response with no content
		return res.status(204).send();
	} catch (err) {
		// Handle server errors
		return next(
			new ServerFailedError((err as Error).message),
		);
	}
}

/**
 * Updates the user information based on the request body.
 *
 * @param req - The HTTP request object, including user data.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response containing the updated user information or an error.
 */
export async function updateUser(
	req: Request<object, object, IUpdateUserBody>,
	res: Response,
	next: NextFunction,
): Promise<Response<IUpdateUserResponse> | void> {
	const { email, password, name } = req.body;

	// Check if at least one field is provided for update
	if (!email && !password && !name) {
		return next(
			new BadRequestError(
				"At least one field is required.",
			),
		);
	}

	try {
		// Attempt to update the user by ID with the provided data
		const updatedUser = await UserController.updateByUserId(
			req.user.id,
			req.body,
		);

		// Structure the response for the updated user
		const updatedUserResponse: IUpdateUserResponse = {
			name: updatedUser.name,
			email: updatedUser.email,
		};

		// Return the updated user information along with a success message
		return res.status(200).json({
			message: "Updated user successfully.",
			updated_user: updatedUserResponse,
		});
	} catch (err) {
		// Handle server errors
		return next(
			new ServerFailedError((err as Error).message),
		);
	}
}
