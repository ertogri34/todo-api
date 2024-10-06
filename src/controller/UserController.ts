import mongoose from "mongoose";
import UserModel from "../database/models/UserModel";
import type {
	IUser,
	IUserDocument,
} from "../types/documents/IUserDocument";
import logger from "../utils/logger";
import { IUpdateUserBody } from "../types/dtos/IUpdateUserBody";
import { hashPassword } from "../utils/password";
import { IUpdateUserResponse } from "../types/responses/IUpdateUserResponse";

/**
 * UserController class that manages user operations such as
 * creating a new user, finding a user by email, and updating user information.
 */
class UserController {
	/**
	 * Creates a new user and saves it to the database.
	 *
	 * @param user - The user data to create.
	 * @returns The created user document (IUserDocument).
	 * @throws An error if the user creation fails.
	 */
	public async createUser(
		user: IUser,
	): Promise<IUserDocument> {
		try {
			const newUser = new UserModel(user); // Create a new user instance
			await newUser.save(); // Save the new user to the database
			return newUser as IUserDocument; // Return the saved user as IUserDocument
		} catch (err) {
			logger.error(err); // Log any errors
			throw err; // Rethrow the error for higher-level handling
		}
	}

	/**
	 * Finds a user by their email address.
	 *
	 * @param email - The email address to search for.
	 * @returns The user document if found, or null if not found.
	 */
	public async findByEmailUser(
		email: string,
	): Promise<IUserDocument | null> {
		try {
			const user = await UserModel.findOne<IUserDocument>({
				email,
			}); // Query the user by email
			return user; // Return the found user or null
		} catch (err) {
			logger.error(err); // Log any errors
			return null; // Return null if an error occurs
		}
	}

	/**
	 * Deletes a user by their email address.
	 *
	 * @param email - The email address of the user to delete.
	 * @returns True if the user was deleted, or false if not found or an error occurred.
	 */
	public async deleteUserByEmail(
		email: string,
	): Promise<boolean> {
		try {
			const result = await UserModel.deleteOne({ email }); // Delete the user by email
			return result.deletedCount > 0; // Return true if a user was deleted, false otherwise
		} catch (err) {
			logger.error(err); // Log any errors
			return false; // Return false if an error occurs
		}
	}

	/**
	 * Finds a user by their user ID.
	 *
	 * @param userId - The user ID to search for.
	 * @returns The user document if found, or null if not found.
	 */
	public async findByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<IUserDocument | null> {
		try {
			const user = await UserModel.findOne<IUserDocument>({
				_id: userId,
			});
			return user; // Return the found user or null
		} catch (err) {
			logger.error(err); // Log any errors
			return null; // Return null if an error occurs
		}
	}

	/**
	 * Deletes a user by their user ID.
	 *
	 * @param userId - The user ID of the user to delete.
	 * @returns True if the user was deleted, or false if not found or an error occurred.
	 */
	public async deleteByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			const deleteResult = await UserModel.deleteOne({
				_id: userId,
			}); // Delete the user by user ID
			return deleteResult.deletedCount > 0; // Return true if a user was deleted
		} catch (err) {
			logger.error(err); // Log any errors
			throw err; // Rethrow the error for higher-level handling
		}
	}

	/**
	 * Updates a user by their user ID.
	 *
	 * @param userId - The user ID of the user to update.
	 * @param body - The data to update the user with.
	 * @returns The updated user response (IUpdateUserResponse).
	 * @throws An error if the update fails.
	 */
	public async updateByUserId(
		userId: mongoose.Types.ObjectId,
		body: IUpdateUserBody,
	): Promise<IUpdateUserResponse> {
		// If a password is provided, hash it before saving
		if (body.password) {
			const hashedPassword = await hashPassword(
				body.password,
			);

			if (!hashedPassword) {
				throw new Error("Password hashing failed."); // Handle hashing failure
			}

			body.password = hashedPassword; // Update body with hashed password
		}

		try {
			// Update the user in the database and return the updated user
			const updatedUser = await UserModel.findByIdAndUpdate(
				userId,
				body,
				{
					new: true, // Return the newly updated document
				},
			);

			return updatedUser as IUpdateUserResponse; // Return updated user response
		} catch (err) {
			logger.error(err); // Log any errors
			throw err; // Rethrow the error for higher-level handling
		}
	}

	public async findUsers(
		limit?: number,
	): Promise<IUserDocument[]> {
		try {
			const users =
				await UserModel.find<IUserDocument>().exec();
			if (limit && limit > 0) return users.slice(0, limit);
			return users;
		} catch (err) {
			logger.error(err);
			throw err;
		}
	}
}

export default new UserController();
