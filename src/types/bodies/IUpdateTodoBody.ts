/**
 * Interface representing the body of an update request for a Todo item.
 */
export interface IUpdateTodoBody {
	/**
	 * The title of the Todo item. Optional field for updating the title.
	 */
	title?: string;

	/**
	 * The description of the Todo item. Optional field for updating the description.
	 */
	description?: string;

	/**
	 * The completion status of the Todo item. Optional field for updating the completion status.
	 */
	completed?: boolean;
}
