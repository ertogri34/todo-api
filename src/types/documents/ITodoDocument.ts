import { Document } from "mongoose";
import { IUserDocument } from "./IUserDocument";

/**
 * ITodo interface defines the structure of a Todo item.
 * It includes the following properties:
 * - userId: The ID of the user associated with the Todo item, referenced from the IUserDocument.
 * - title: The title of the Todo item, a string that describes the task.
 * - description: A detailed description of the Todo item, providing more context about the task.
 * - completed: A boolean indicating whether the Todo item has been completed.
 */
export interface ITodo {
	userId: IUserDocument["_id"];
	title: string;
	description: string;
	completed: boolean;
}

/**
 * ITodoDocument interface extends the Mongoose Document interface
 * to include additional properties specific to the Todo document.
 * It includes the following timestamps:
 * - createdAt: A Date indicating when the Todo item was created.
 * - updatedAt: A Date indicating when the Todo item was last updated.
 */
export interface ITodoDocument extends Document, ITodo {
	createdAt: Date;
	updatedAt: Date;
}
