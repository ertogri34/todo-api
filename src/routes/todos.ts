import type {
	NextFunction,
	Request,
	Response,
} from "express"; // Import necessary types from Express
import TodoController from "../controller/TodoController"; // Import the Todo controller for handling business logic

import { ICreateTodoBody } from "../types/bodies/ICreateTodoBody"; // Import the type for the request body of creating a Todo
import BadRequestError from "../errors/BadRequestError"; // Import custom error for bad requests
import ServerFailedError from "../errors/ServerFailedError"; // Import custom error for server failures
import { IIdentifiable } from "../types/params/IDWithParams"; // Import the type for parameters when getting a Todo
import { IGetTodosResponse } from "../types/responses/IGetTodosResponse"; // Import the type for the response of getting Todos
import { IGetTodoResponse } from "../types/responses/IGetTodoResponse"; // Import the type for the response of getting a single Todo
import { ICreateTodoResponse } from "../types/responses/ICraeteTodoResponse"; // Import the type for the response of creating a Todo
import NotFoundError from "../errors/NotFoundError"; // Import custom error for not found resources
import { IUpdateTodoBody } from "../types/bodies/IUpdateTodoBody"; // Import the type for the request body of updating a Todo
import logger from "../utils/logger"; // Import the logger utility for logging errors

/**
 * Retrieve all Todos for the authenticated user.
 *
 * @param req - The Express Request object
 * @param res - The Express Response object
 * @returns A response containing the list of Todos
 */
export async function getTodos(
	req: Request,
	res: Response,
): Promise<Response<IGetTodosResponse>> {
	const todos = await TodoController.getTodosByUserId(
		req.user.id, // Get Todos by the authenticated user's ID
	);

	return res.status(200).json({
		todos, // Return the list of Todos
	});
}

/**
 * Retrieve a single Todo by its ID.
 *
 * @param req - The Express Request object containing the Todo ID
 * @param res - The Express Response object
 * @param next - The NextFunction to handle errors
 * @returns A response containing the Todo or an error
 */
export async function getTodo(
	req: Request<IIdentifiable>,
	res: Response,
	next: NextFunction,
): Promise<Response<IGetTodoResponse> | void> {
	const todo = await TodoController.getTodoById(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		req.params.id!, // Get the Todo ID from request parameters
	);

	if (!todo) {
		return next(new NotFoundError("Todo Not Found")); // Handle case where Todo is not found
	}

	return res.status(200).json({ todo } as IGetTodoResponse); // Return the found Todo
}

/**
 * Create a new Todo.
 *
 * @param req - The Express Request object containing the Todo data
 * @param res - The Express Response object
 * @param next - The NextFunction to handle errors
 * @returns A response confirming the creation of the Todo or an error
 */
export async function createTodo(
	req: Request<object, object, ICreateTodoBody>,
	res: Response,
	next: NextFunction,
): Promise<Response<ICreateTodoResponse> | void> {
	const { title, description } = req.body; // Destructure title and description from request body

	if (!title || !description) {
		return next(
			new BadRequestError(
				"title and description required field.", // Validate that title and description are provided
			),
		);
	}
	try {
		const newTodo = await TodoController.createTodo({
			userId: req.user.id, // Set the user ID from the authenticated user
			title,
			description,
			completed: false, // Default to not completed
		});

		return res.status(201).json({
			message: "Todo Created Successfully.", // Confirm the creation of the Todo
			todo: newTodo,
		});
	} catch (err) {
		if ((err as Error).message === "ValidationError") {
			return next(
				new BadRequestError((err as Error).message), // Handle validation errors
			);
		}

		return next(
			new ServerFailedError((err as Error).message), // Handle server errors
		);
	}
}

/**
 * Update an existing Todo.
 *
 * @param req - The Express Request object containing the Todo ID and updated data
 * @param res - The Express Response object
 * @param next - The NextFunction to handle errors
 * @returns A response indicating success or an error
 */
export async function updateTodo(
	req: Request<IIdentifiable, object, IUpdateTodoBody>,
	res: Response,
	next: NextFunction,
): Promise<Response | void> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const id = req.params.id!; // Get the Todo ID from request parameters
	const { title, description, completed } = req.body; // Destructure updated fields from request body

	if (!title && !description && completed === undefined) {
		return next(
			new BadRequestError("minimum 1 field required."), // Validate that at least one field is provided for update
		);
	}

	const todo = await TodoController.getTodoById(id); // Retrieve the Todo to update

	if (!todo) {
		return next(new NotFoundError("Todo Not Found.")); // Handle case where Todo is not found
	}

	// Update the Todo fields based on provided values
	if (title) todo.title = title;
	if (description) todo.description = description;
	if (completed !== undefined) todo.completed = completed;

	await todo.save(); // Save the updated Todo

	return res.status(204).send(); // Respond with no content
}

/**
 * Delete a Todo by its ID.
 *
 * @param req - The Express Request object containing the Todo ID
 * @param res - The Express Response object
 * @param next - The NextFunction to handle errors
 * @returns A response indicating success or an error
 */
export async function deleteTodo(
	req: Request<IIdentifiable>,
	res: Response,
	next: NextFunction,
): Promise<Response | void> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const id = req.params.id!; // Get the Todo ID from request parameters

	const todo = await TodoController.getTodoById(id); // Retrieve the Todo to delete

	if (!todo) {
		return next(new NotFoundError("Not Found Todo.")); // Handle case where Todo is not found
	}

	try {
		await TodoController.deleteTodoById(id); // Delete the Todo by ID
		return res.status(204).send(); // Respond with no content
	} catch (err) {
		logger.error(err); // Log any errors encountered
		return next(
			new ServerFailedError((err as Error).message), // Handle server errors
		);
	}
}
