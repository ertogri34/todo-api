import { ITodoDocument } from "../documents/ITodoDocument";

/**
 * IGetTodosResponse interface defines the structure of the response
 * for a GET request to retrieve a list of Todo items.
 */
export interface IGetTodosResponse {
	todos: ITodoDocument[]; // An array of Todo documents
}
