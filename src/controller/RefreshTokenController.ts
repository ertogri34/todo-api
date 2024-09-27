import mongoose from "mongoose";
import RefreshTokenModel from "../database/models/RefreshTokenModel";
import {
	IRefreshToken,
	IRefreshTokenDocument,
} from "../types/documents/IRefreshTokenDocument";
import logger from "../utils/logger";

class RefreshTokenController {
	/**
	 * Creates a new refresh token for the user.
	 * @param refreshToken - The refresh token object to be saved.
	 * @returns The saved refresh token document or null if an error occurs.
	 */
	public async createRefreshToken(
		refreshToken: IRefreshToken,
	): Promise<IRefreshTokenDocument | null> {
		try {
			const newRefreshToken = new RefreshTokenModel(
				refreshToken,
			);
			await newRefreshToken.save();
			return newRefreshToken as IRefreshTokenDocument;
		} catch (err) {
			logger.error(err);
			return null;
		}
	}

	/**
	 * Deletes all refresh tokens associated with the given user and userAgent.
	 * If multiple refresh tokens are found with the same userAgent, they will be deleted.
	 * @param userId - The ID of the user whose refresh tokens should be deleted.
	 * @param userAgent - The userAgent of the device whose refresh tokens should be deleted.
	 * @returns A boolean indicating whether the operation was successful.
	 */
	public async revokeUserRefreshTokensByUserAgent(
		userId: mongoose.Types.ObjectId, // Explicitly using mongoose ObjectId type
		userAgent: string,
	): Promise<boolean> {
		try {
			// Delete all refresh tokens for the given user with the same userAgent
			const result = await RefreshTokenModel.deleteMany({
				userId,
				userAgent,
			});
			return result.deletedCount > 0;
		} catch (err) {
			logger.error(
				`Error revoking tokens for userId: ${userId.toString()} and userAgent: ${userAgent}`,
				err,
			);
			return false;
		}
	}

	public async revokeUserRefreshTokenByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			const result = await RefreshTokenModel.deleteMany({
				userId,
			});
			return result.deletedCount > 0;
		} catch (err) {
			logger.error(
				`Error revoking tokens for userId: ${userId.toString()}.`,
				err,
			);
			return false;
		}
	}
	/**
	 * Method to find a refresh token in the database.
	 * @param refreshToken - The refresh token string to search for.
	 * @returns The found refresh token document or null if not found.
	 */
	public async findRefreshToken(
		refreshToken: string,
	): Promise<IRefreshTokenDocument | null> {
		try {
			// Querying the database to find the refresh token
			const foundToken = await RefreshTokenModel.findOne({
				refreshToken: refreshToken,
			});
			return foundToken; // Return the found token document or null if not found
		} catch (err) {
			// Logging the error for debugging purposes
			logger.error(err);
			return null; // Return null in case of an error during the database query
		}
	}
}

export default new RefreshTokenController();
