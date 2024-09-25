import UserModel from "../database/models/UserModel";
import type {
	IUser,
	IUserDocument,
} from "../types/documents/IUserDocument";
import logger from "../utils/logger";

/**
 * UserController class that manages user operations such as
 * creating a new user and finding a user by email.
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
			const newUser = new UserModel(user);
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
			const user = await UserModel.findOne({ email }); // Query the user by email
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
}

export default new UserController();
