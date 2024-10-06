/**
 * Interface representing the structure of a Todo body for creation and updates.
 */
export interface ICreateTodoDTO {
	/** The title of the Todo item. */
	title: string;

	/** A detailed description of the Todo item. */
	description: string;
}
