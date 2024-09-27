import { Document } from "mongoose";
import { IUserDocument } from "./IUserDocument"; // Importing the IUserDocument interface

/**
 * IRefreshToken interface represents the structure of a refresh token.
 * It includes details necessary for token management and validation.
 */
export interface IRefreshToken {
	userId: IUserDocument["_id"]; // The unique identifier of the user associated with the refresh token
	refreshToken: string; // The actual refresh token string used for generating new access tokens
	expiresAt: Date; // The expiration date of the refresh token
	userAgent: string; // The user agent string representing the device/browser that requested the token
}

/**
 * IRefreshTokenDocument interface extends Mongoose's Document interface
 * to include additional fields specific to refresh tokens.
 */
export interface IRefreshTokenDocument
	extends Document,
		IRefreshToken {
	createdAt: Date; // The timestamp when the refresh token document was created
}
