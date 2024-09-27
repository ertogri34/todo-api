import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for creating and verifying JWTs
import { IPayload } from "../types/IPayload"; // Import the IPayload interface to define the structure of the token payload
import configure from "./configure"; // Import the application configuration settings
import logger from "./logger"; // Import the logger for error logging

/**
 * Generates an access token using the provided payload.
 * @param payload - The data to be encoded in the JWT.
 * @returns An object containing the access token and its expiration time, or null if an error occurs.
 */
export function generateAccessToken(
	payload: IPayload,
): { accessToken: string; expiresIn: number } | null {
	try {
		// Create a JWT token with the given payload and secret key
		const token = jwt.sign(payload, configure.SECRET_KEY, {
			// Set expiration time based on the configured value
			expiresIn: configure.EXPIRES_IN.toString() + "ms",
		});

		// Return the generated token and its expiration time
		return {
			accessToken: token,
			expiresIn: configure.EXPIRES_IN, // Expiration time in milliseconds
		};
	} catch (err) {
		// Log any errors encountered during token generation
		logger.error(err);
		return null; // Return null in case of error
	}
}

/**
 * Generates a refresh token using the provided payload.
 * @param payload - The data to be encoded in the JWT.
 * @returns An object containing the refresh token and its expiration time, or null if an error occurs.
 */
export function generateRefreshToken(payload: IPayload): {
	refreshToken: string;
	expiresIn: number;
} | null {
	try {
		// Create a refresh token with the given payload and secret key
		const token = jwt.sign(
			payload,
			configure.REFRESH_TOKEN_SECRET_KEY,
			{
				// Set expiration time for the refresh token
				expiresIn:
					configure.REFRESH_TOKEN_EXPIRES_IN.toString() +
					"ms",
			},
		);

		// Return the generated refresh token and its expiration time
		return {
			refreshToken: token,
			expiresIn: configure.REFRESH_TOKEN_EXPIRES_IN, // Expiration time for the refresh token
		};
	} catch (err) {
		// Log any errors encountered during token generation
		logger.error(err);
		return null; // Return null in case of error
	}
}

/**
 * Verifies a JWT and decodes its payload.
 * @param token - The JWT to be verified.
 * @param secret_key - The secret key used for verification.
 * @returns The decoded payload if the token is valid, or null if an error occurs.
 */
export function verifyToken(
	token: string,
	secret_key: string,
): IPayload | null {
	try {
		// Verify the token and decode its payload
		const decodedToken = jwt.verify(token, secret_key);
		return decodedToken as IPayload; // Cast the decoded token to IPayload type
	} catch (err) {
		// Log any errors encountered during token verification
		logger.error(err);
		return null; // Return null in case of error
	}
}

/**
 * Verifies an access token using the application's secret key.
 * @param token - The access token to be verified.
 * @returns The decoded payload if the token is valid, or null if an error occurs.
 */
export function verifyAccessToken(
	token: string,
): IPayload | null {
	return verifyToken(token, configure.SECRET_KEY); // Call verifyToken with the access token and secret key
}

/**
 * Verifies a refresh token using the application's refresh token secret key.
 * @param token - The refresh token to be verified.
 * @returns The decoded payload if the token is valid, or null if an error occurs.
 */
export function verifyRefreshToken(
	token: string,
): IPayload | null {
	return verifyToken(
		token,
		configure.REFRESH_TOKEN_SECRET_KEY.toString(), // Call verifyToken with the refresh token and secret key
	);
}
