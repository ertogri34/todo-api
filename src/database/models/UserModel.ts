import { Schema, model } from "mongoose"; // Import Schema and model from mongoose
import {
	IUserDocument,
	UserRole,
} from "../../types/documents/IUserDocument"; // Import the IUserDocument interface and UserRole enum

// Regular expression for validating email format
const emailRegex =
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Schema definition for the User model.
 *
 * Defines the structure of the User document in the MongoDB database,
 * including validation rules for each field.
 */
const userSchema = new Schema<IUserDocument>(
	{
		email: {
			type: String,
			required: [true, "Email is required."], // Email is required
			unique: true, // Email must be unique
			match: [emailRegex, "Email is invalid"], // Validate email format
			trim: true, // Remove whitespace from both ends
			lowercase: true, // Convert email to lowercase
		},
		password: {
			type: String,
			required: true, // Password is required
			minlength: [
				6,
				"Password must be at least 6 characters long", // Minimum password length
			],
		},
		name: {
			type: String,
			required: [true, "Name is required."], // Name is required
			trim: true, // Remove whitespace from both ends
		},
		role: {
			type: Number,
			default: UserRole.USER, // Default role is USER
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt fields
	},
);

/**
 * UserModel is the Mongoose model for the User collection in MongoDB.
 * It provides an interface for interacting with the User documents.
 */
const UserModel = model<IUserDocument>(
	"User", // Name of the model
	userSchema, // Schema for the model
	"users", // Name of the collection in the database
);

export default UserModel; // Export the UserModel for use in other modules
