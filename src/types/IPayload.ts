import { ObjectId } from "mongoose"; // Import ObjectId type from Mongoose for MongoDB document identifiers
import { UserRole } from "./documents/IUserDocument"; // Import UserRole enum to represent different user roles

/**
 * Interface for the JWT payload structure.
 *
 * This interface defines the structure of the payload that will be embedded in a JSON Web Token (JWT).
 */
export interface IPayload {
	// Unique identifier for the user, represented as a MongoDB ObjectId.
	id: ObjectId;

	// The role of the user, indicating their permissions within the application.
	role: UserRole;

	// The name of the user, which may be used for display purposes.
	name: string;
}
