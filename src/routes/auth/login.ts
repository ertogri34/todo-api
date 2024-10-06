import type {
	Request,
	Response,
	NextFunction,
} from "express";
import type { ILoginDTO } from "../../types/dtos/ILoginDTO";
import BadRequestError from "../../errors/BadRequestError";
import UserController from "../../controller/UserController";
import NotFoundError from "../../errors/NotFoundError";
import { comparePassword } from "../../utils/password";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../../utils/jsonwebtoken";
import ServerFailedError from "../../errors/ServerFailedError";
import type { IPayload } from "../../types/IPayload";
import RefreshTokenController from "../../controller/RefreshTokenController";
import configure from "../../utils/configure";
import type { ILoginResponse } from "../../types/responses/ILoginResponse";

/**
 * Handles user login by validating credentials and generating tokens.
 *
 * @param req - The request object containing user credentials.
 * @param res - The response object for sending back the results.
 * @param next - The next middleware function in the stack.
 * @returns A response with access and refresh tokens or an error.
 */
export default async function login(
	req: Request<object, object, ILoginDTO>,
	res: Response,
	next: NextFunction,
): Promise<Response<ILoginResponse> | void> {
	const { email, password } = req.body; // Destructure email and password from the request body

	// Validate presence of email and password
	if (!email || !password) {
		return next(
			new BadRequestError(
				"Email and password are required fields.",
			),
		);
	}

	// Check if the user exists in the database
	const existingUser =
		await UserController.findByEmailUser(email);

	if (!existingUser) {
		return next(new NotFoundError("User not found."));
	}

	// Compare the provided password with the stored hashed password
	const isPasswordValid = await comparePassword(
		password,
		existingUser.password,
	);

	if (!isPasswordValid) {
		return next(new BadRequestError("Invalid password."));
	}

	// Create a payload for token generation
	const payload: IPayload = {
		id: existingUser.id,
		name: existingUser.name,
		role: existingUser.role,
	};

	// Generate access token for the user
	const accessTokenResult = generateAccessToken(payload);

	if (!accessTokenResult) {
		return next(
			new ServerFailedError(
				"Failed to generate access token.",
			),
		);
	}

	// Generate refresh token for the user
	const refreshTokenResult = generateRefreshToken(payload);

	if (!refreshTokenResult) {
		return next(
			new ServerFailedError(
				"Failed to generate refresh token.",
			),
		);
	}

	if (!req.headers["user-agent"]) {
		return next(
			new BadRequestError("User-Agent header is missing"),
		);
	}
	// Revoke all existing refresh tokens for the user
	await RefreshTokenController.revokeUserRefreshTokensByUserAgent(
		existingUser.id,
		req.headers["user-agent"],
	);

	// Create a new refresh token entry in the database
	await RefreshTokenController.createRefreshToken({
		userId: existingUser._id, // User ID to associate with the refresh token
		refreshToken: refreshTokenResult.refreshToken, // The generated refresh token
		expiresAt: new Date(
			Date.now() + configure.REFRESH_TOKEN_EXPIRES_IN, // Expiration time calculated from the configured value
		),
		userAgent: req.headers["user-agent"],
	});

	// Send response with success message and tokens
	return res.status(201).json({
		message: "Login successful",
		access_token: accessTokenResult.accessToken, // Access token for the user
		expires_in: accessTokenResult.expiresIn, // Expiration time of the access token
		refresh_token: refreshTokenResult.refreshToken, // Refresh token for the user
		refresh_token_expires_in: refreshTokenResult.expiresIn, // Expiration time of the refresh token
	} as ILoginResponse);
}
