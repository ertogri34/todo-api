import { ITodoDocument } from "../documents/ITodoDocument"; // Import ITodoDocument for type definition of the Todo

/**
 * Interface representing the response for retrieving a Todo item.
 */
export interface IGetTodoResponse {
	/**
	 * The Todo document that has been retrieved.
	 */
	todo: ITodoDocument; // The retrieved Todo document
}
