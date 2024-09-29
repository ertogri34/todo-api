import {
	type Request,
	Router,
	type Response,
} from "express"; // Import necessary types from Express
import getHome from "./homes"; // Import the function to handle requests to the home route
import configure from "../utils/configure"; // Import the application configuration settings
import register from "./auth/register"; // Import the register function for handling user registration
import login from "./auth/login"; // Import the login function for user authentication
import refreshToken from "./auth/refresh-token"; // Import the refresh token function
import authentication from "../middlewares/authentication"; // Import the middleware for authentication checks
import {
	createTodo,
	deleteTodo,
	getTodo,
	getTodos,
	updateTodo,
} from "./todos"; // Import the functions for handling Todo operations
import { deleteUser, getUser, updateUser } from "./users"; // Import user management functions

const router = Router(); // Create a new Express Router instance

/**
 * Construct the base API URL using the configured API version.
 */
const baseURL = `/api/v${configure.API_VERSION}`; // Define the base URL for the API routes
const authURL = `${baseURL}/auth`; // Define the URL for authentication operations
const todoURL = `${baseURL}/todos`; // Define the URL for Todo operations
const userURL = `${baseURL}/users/me`; // Define the URL for user management operations

/**
 * Redirect root URL ("/") requests to the API base URL.
 *
 * @param _req - The Express Request object (not used, but required for the handler signature)
 * @param res - The Express Response object, used to perform the redirect
 */
router.get("/", (_req: Request, res: Response): void => {
	res.redirect(baseURL); // Redirects to /api/vX where X is the API version
});

/**
 * Set up the route for the base API URL ("/api/vX").
 * The getHome function handles this route and returns a welcome message.
 */
router.get(baseURL, getHome); // Handle GET requests to the base API URL

// Set up user authentication routes
router.post(`${authURL}/register`, register); // User registration route
router.post(`${authURL}/login`, login); // User login route
router.post(
	`${authURL}/refresh-token`,
	authentication, // Use authentication middleware to verify the user's token
	refreshToken, // Handle the refresh token logic
);

// Set up Todo routes with authentication
router.get(todoURL, authentication, getTodos); // Get all Todos
router.post(todoURL, authentication, createTodo); // Create a new Todo
router.get(`${todoURL}/:id`, authentication, getTodo); // Get a Todo by ID
router.put(`${todoURL}/:id`, authentication, updateTodo); // Update a Todo by ID
router.delete(`${todoURL}/:id`, authentication, deleteTodo); // Delete a Todo by ID

// Set up user management routes with authentication
router.get(userURL, authentication, getUser); // Get current user's info
router.delete(
	`${userURL}/delete`,
	authentication,
	deleteUser,
); // Delete current user
router.put(`${userURL}/update`, authentication, updateUser); // Update current user's info

export default router; // Export the configured router for use in the main application
