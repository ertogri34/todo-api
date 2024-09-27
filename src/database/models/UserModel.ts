import { CallbackError, Schema, model } from "mongoose"; // Import necessary Mongoose components
import {
	IUserDocument,
	UserRole,
} from "../../types/documents/IUserDocument"; // Import the IUserDocument interface and UserRole enum
import RefreshTokenController from "../../controller/RefreshTokenController"; // Import the controller for handling refresh token operations
import TodoController from "../../controller/TodoController";

// Regular expression for validating the email format
const emailRegex =
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Defines the schema for the User model.
 *
 * The User schema outlines the structure and constraints for user documents stored in the MongoDB database.
 * Each field is configured with specific validation rules and data types to ensure data integrity.
 */
const userSchema = new Schema<IUserDocument>(
	{
		email: {
			type: String,
			required: [true, "Email is required."], // Ensures the email field is mandatory
			unique: true, // Enforces uniqueness for each email entry
			match: [emailRegex, "Email is invalid"], // Validates the email against the regex pattern
			trim: true, // Trims leading and trailing whitespace
			lowercase: true, // Converts the email to lowercase for consistency
		},
		password: {
			type: String,
			required: true, // Ensures the password field is mandatory
			minlength: [
				6,
				"Password must be at least 6 characters long", // Enforces a minimum length of 6 characters for the password
			],
		},
		name: {
			type: String,
			required: [true, "Name is required."], // Ensures the name field is mandatory
			trim: true, // Trims leading and trailing whitespace
		},
		role: {
			type: Number,
			default: UserRole.USER, // Assigns USER as the default role for new users
		},
	},
	{
		timestamps: true, // Automatically manages 'createdAt' and 'updatedAt' fields for user records
	},
);

/**
 * Pre-remove middleware to revoke all associated refresh tokens when a user is deleted.
 *
 * This middleware executes before a user document is deleted from the database, ensuring
 * that all refresh tokens linked to the user are properly revoked, thereby enhancing security.
 */
userSchema.pre(
	"deleteOne",
	async function (next: (err?: CallbackError) => void) {
		const user = await this.model.findOne<IUserDocument>();

		if (!user) {
			return next();
		}
		// Revoke all refresh tokens associated with the user before deleting the user document
		await RefreshTokenController.revokeUserRefreshTokenByUserId(
			user.id,
		);

		await TodoController.deleteTodosByUserId(user.id);

		next(); // Proceed to the next middleware or operation
	},
);

/**
 * Defines the UserModel, representing the 'users' collection in MongoDB.
 *
 * The UserModel provides the interface for interacting with user documents in MongoDB.
 * It encapsulates methods for querying and manipulating user-related data.
 */
const UserModel = model<IUserDocument>(
	"User", // The name of the Mongoose model
	userSchema, // The schema defining the structure of user documents
	"users", // The name of the collection in MongoDB
);

export default UserModel; // Export the UserModel for use in other parts of the application
