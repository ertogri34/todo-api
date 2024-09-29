import type {
	Request,
	Response,
	NextFunction,
} from "express"; // Importing types from express for request, response, and next function handling
import { IRefreshTokenBody } from "../../types/bodies/IRefreshTokenBody"; // Importing interface for refresh token body
import BadRequestError from "../../errors/BadRequestError"; // Importing custom error for bad requests
import RefreshTokenController from "../../controller/RefreshTokenController"; // Importing the controller for managing refresh tokens
import {
	generateAccessToken,
	verifyRefreshToken,
} from "../../utils/jsonwebtoken"; // Importing utility for generating access tokens
import ServerFailedError from "../../errors/ServerFailedError"; // Importing custom error for server failures
import { IRefreshTokenResponse } from "../../types/responses/IRefreshTokenResponse"; // Importing interface for refresh token response

/**
 * Middleware function to handle refresh token requests.
 * @param req - The incoming request object containing the refresh token.
 * @param res - The response object to send the results.
 * @param next - The next middleware function to call.
 * @returns A response containing the new access token or an error if any issue occurs.
 */
export default async function refreshToken(
	req: Request<object, object, IRefreshTokenBody>, // Defining the request type with a specific body type
	res: Response, // Defining the response type
	next: NextFunction, // Defining the next function type for middleware chaining
): Promise<Response<IRefreshTokenResponse> | void> {
	// The return type of the function
	const { refresh_token } = req.body; // Destructuring the refresh_token from the request body

	// Checking if the refresh token is provided in the request body
	if (!refresh_token) {
		return next(
			new BadRequestError("refresh_token is required."),
		); // Return an error if not provided
	}

	const verifedToken = verifyRefreshToken(refresh_token);

	if (!verifedToken) {
		return next(
			new BadRequestError("Invalid refresh token."),
		);
	}
	// Attempting to find the refresh token in the database
	const foundToken =
		await RefreshTokenController.findRefreshToken(
			refresh_token,
		);

	// Checking if the found token is valid
	if (!foundToken) {
		return next(
			new BadRequestError("Invalid refresh token."),
		); // Return an error if the token is not valid
	}
	// Generating a new access token using the user's information
	const accessTokenResult = generateAccessToken({
		id: req.user.id,
		name: req.user.name,
		role: req.user.role,
	}); // Assumes req.user is populated by a previous authentication middleware

	// Checking if the access token generation was successful
	if (!accessTokenResult) {
		return next(
			new ServerFailedError("Failed to generate token."),
		); // Return an error if token generation failed
	}

	// Sending a successful response with the new access token and its expiration time
	return res.status(201).json({
		access_token: accessTokenResult.accessToken, // New access token
		expires_in: accessTokenResult.expiresIn, // Expiration time of the new access token
	} as IRefreshTokenResponse); // Casting the response to the appropriate interface type
}
