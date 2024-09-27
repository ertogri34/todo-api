import { Schema, model } from "mongoose";
import type { ITodoDocument } from "../../types/documents/ITodoDocument";

/**
 * todoSchema defines the structure of the Todo document in MongoDB.
 * It enforces data integrity through validation rules for each field.
 */
const todoSchema = new Schema<ITodoDocument>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: [true, "userId is required."], // userId is mandatory for associating a Todo item with a user
		},
		title: {
			type: String,
			required: [true, "Title is required."], // Title is a required field, cannot be empty
			maxlength: 255, // Maximum length of the title is limited to 255 characters
		},
		description: {
			type: String,
			default: "", // Default value is an empty string if no description is provided
			maxlength: 500, // Maximum length of the description is limited to 500 characters
		},
		completed: {
			type: Boolean,
			default: false, // Default value is false, indicating the task is not yet completed
		},
	},
	{
		timestamps: true, // Automatically manage createdAt and updatedAt timestamps for each Todo item
	},
);

/**
 * Exporting the Mongoose model for the Todo based on the defined todoSchema.
 * This model can be used to create, read, update, and delete Todo documents in the database.
 */
const TodoModel = model<ITodoDocument>(
	"Todo",
	todoSchema,
	"todos", // Collection name in the database
);

export default TodoModel;
