import mongoose from "mongoose"; // Import mongoose for ObjectId types

/**
 * Interface representing an identifiable entity that includes an optional ID field.
 * This can be used across multiple functions like get, update, and delete
 * for any entity (e.g., Todo, User) that requires an ID parameter.
 */
export interface IIdentifiable {
	/**
	 * The unique identifier of the entity (e.g., Todo, User).
	 * It is an optional field and is of type mongoose ObjectId.
	 */
	id?: mongoose.Types.ObjectId;
}
