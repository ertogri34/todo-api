import mongoose from "mongoose"; // Import mongoose for ObjectId types

/**
 * Interface representing the parameters for retrieving a Todo item.
 */
export interface IGetTodoParams {
	/**
	 * The ID of the Todo item to retrieve. This is an optional field.
	 */
	id?: mongoose.Types.ObjectId;
}
