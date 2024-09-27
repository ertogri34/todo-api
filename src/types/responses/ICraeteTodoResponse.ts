import { ITodoDocument } from "../documents/ITodoDocument"; // Import ITodoDocument for type definition of the Todo
import { IMessageResponse } from "./IMessageResponse"; // Import IMessageResponse for standard message structure

/**
 * Interface representing the response for a created Todo item.
 *
 * This interface extends IMessageResponse to include the created Todo document.
 */
export interface ICreateTodoResponse
	extends IMessageResponse {
	/**
	 * The created Todo document.
	 */
	todo: ITodoDocument; // The Todo document that has been created
}
