import mongoose from "mongoose"; // Import mongoose for ObjectId types
import TodoModel from "../database/models/TodoModel"; // Import the Todo model for database operations
import {
	ITodo,
	ITodoDocument,
} from "../types/documents/ITodoDocument"; // Import types for Todo and Todo document
import logger from "../utils/logger"; // Import logger for error handling

class TodoController {
	/**
	 * Retrieve all Todos for a specific user by user ID.
	 *
	 * @param userId - The ID of the user for whom to retrieve Todos
	 * @returns A promise that resolves to an array of ITodoDocument or null in case of error
	 */
	public async getTodosByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<ITodoDocument[] | null> {
		try {
			// Query the TodoModel to find all todos for the given userId
			const todos = await TodoModel.find<ITodoDocument>({
				userId,
			});
			return todos; // Return the found todos
		} catch (err) {
			logger.error(err); // Log any errors encountered
			return null; // Return null in case of an error
		}
	}

	/**
	 * Create a new Todo.
	 *
	 * @param todo - The ITodo object containing details of the Todo to create
	 * @returns A promise that resolves to the created ITodoDocument
	 */
	public async createTodo(
		todo: ITodo,
	): Promise<ITodoDocument> {
		try {
			// Create a new instance of TodoModel with the provided todo data
			const newTodo = new TodoModel(todo);
			await newTodo.save(); // Save the new todo to the database
			return newTodo as ITodoDocument; // Return the newly created todo document
		} catch (err) {
			logger.error(err); // Log any errors encountered
			throw err; // Rethrow the error to be handled by the caller
		}
	}

	/**
	 * Retrieve a Todo by its ID.
	 *
	 * @param todoId - The ID of the Todo to retrieve
	 * @returns A promise that resolves to the found ITodoDocument or null if not found
	 */
	public async getTodoById(
		todoId: mongoose.Types.ObjectId | string,
	): Promise<ITodoDocument | null> {
		try {
			// Query the TodoModel to find a todo by its ID
			const todo =
				await TodoModel.findById<ITodoDocument>(todoId);
			return todo; // Return the found todo
		} catch (err) {
			logger.error(err); // Log any errors encountered
			return null; // Return null in case of an error
		}
	}

	/**
	 * Delete a Todo by its ID.
	 *
	 * @param id - The ID of the Todo to delete
	 * @returns A promise that resolves to the result of the deletion operation
	 */
	public async deleteTodoById(
		id: mongoose.Types.ObjectId,
	): Promise<mongoose.mongo.DeleteResult> {
		try {
			// Delete the todo document by its ID from the TodoModel
			const deleteResult = await TodoModel.deleteOne({
				_id: id,
			});
			return deleteResult; // Return the result of the delete operation
		} catch (err) {
			logger.error(err); // Log any errors encountered
			throw err; // Rethrow the error to be handled by the caller
		}
	}

	/**
	 * Delete all Todos for a specific user by user ID.
	 *
	 * @param userId - The ID of the user whose Todos will be deleted
	 * @returns A promise that resolves to a boolean indicating whether any Todos were deleted
	 */
	public async deleteTodosByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			// Delete all todo documents associated with the given userId from the TodoModel
			const deleteResult = await TodoModel.deleteMany({
				userId,
			});

			return deleteResult.deletedCount > 0; // Return true if at least one Todo was deleted
		} catch (err) {
			logger.error(err); // Log any errors encountered
			throw err; // Rethrow the error to be handled by the caller
		}
	}
}

export default new TodoController(); // Export a new instance of the TodoController class
