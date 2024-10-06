import {
	type Request,
	type Response,
	type NextFunction,
} from "express"; // Import Express types for Request, Response, and NextFunction
import UserController from "../controller/UserController"; // Import UserController for handling user-related logic
import NotFoundError from "../errors/NotFoundError"; // Import NotFoundError for handling cases where a user is not found
import type { IGetUserResponse } from "../types/responses/IGetUserResponse"; // Import the response type for getting user information
import ServerFailedError from "../errors/ServerFailedError"; // Import ServerFailedError for handling server-side failures
import type { IUpdateUserDTO } from "../types/dtos/IUpdateUserBody"; // Import the request body type for updating user information
import BadRequestError from "../errors/BadRequestError"; // Import BadRequestError for handling invalid request data
import type { IUpdateUserResponse } from "../types/responses/IUpdateUserResponse"; // Import the response type for updating user information
import { IGetUsersResponse } from "../types/responses/IGetUsersResponse"; // Import the response type for getting multiple users
import { IQueryParams } from "../types/params/QueryParams"; // Import the query parameters type for GET requests
import { IIdentifiable } from "../types/params/IIdentifiable"; // Import the type for identifying a specific user

/**
 * Retrieves the user information based on the user ID in the request.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response containing user information or an error.
 */
export async function getProfile(
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
			id: user.id,
			name: user.name,
			email: user.email,
		};

		// Return the user information in the response
		return res.status(200).json({ user: userResponse });
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
	req: Request<object, object, IUpdateUserDTO>,
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

/**
 * Retrieves a list of users, limited by a query parameter.
 *
 * @param req - The HTTP request object, including query parameters.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response containing an array of users or an error.
 */
export async function getUsers(
	req: Request<object, IQueryParams>,
	res: Response,
	next: NextFunction,
): Promise<Response<IGetUsersResponse[]> | void> {
	const limit = Number(
		req.query.limit !== undefined ? req.query.limit : 10,
	);

	try {
		// Attempt to find users with a limit
		const users = await UserController.findUsers(limit);

		// Map user information to the response structure
		return res.status(200).json({
			users: users.map(
				(user) =>
					({
						id: user.id,
						name: user.name,
						email: user.email,
					}) as IGetUserResponse,
			),
		});
	} catch (err) {
		// Handle server errors
		return next(
			new ServerFailedError((err as Error).message),
		);
	}
}

/**
 * Retrieves the target user based on the user ID in the request parameters.
 *
 * @param req - The HTTP request object, including the target user ID.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response containing the target user information or an error.
 */
export async function getTargetUser(
	req: Request<IIdentifiable>,
	res: Response,
	next: NextFunction,
): Promise<Response<IGetUserResponse> | void> {
	const id = req.params.id!;

	// Attempt to find the target user by ID
	const user = await UserController.findByUserId(id);

	// If user not found, pass NotFoundError to the next middleware
	if (!user) {
		return next(new NotFoundError("User not found."));
	}

	// Structure the response for the found user
	const response: IGetUserResponse = {
		id: user.id,
		name: user.name,
		email: user.email,
	};

	// Return the found user information
	return res.status(200).json({ user: response });
}

/**
 * Deletes the target user based on the user ID in the request parameters.
 *
 * @param req - The HTTP request object, including the target user ID.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response with a 204 status or an error.
 */
export async function getTargetUserDelete(
	req: Request<IIdentifiable>,
	res: Response,
	next: NextFunction,
): Promise<Response | void> {
	try {
		// Attempt to delete the target user by ID
		await UserController.deleteByUserId(req.params.id!);

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
 * Updates the target user information based on the request body and ID in the request parameters.
 *
 * @param req - The HTTP request object, including the target user ID and update data.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns A response containing the updated target user information or an error.
 */
export async function getTargetUserUpdate(
	req: Request<IIdentifiable, object, IUpdateUserDTO>,
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
		// Attempt to update the target user by ID with the provided data
		const updatedUser = await UserController.updateByUserId(
			req.params.id!,
			req.body,
		);

		// Structure the response for the updated target user
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
