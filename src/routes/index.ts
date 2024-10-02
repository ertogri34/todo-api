import {
	type Request,
	Router,
	type Response,
} from "express"; // Import Express types for Request and Response, and Router
import getHome from "./homes"; // Import the handler function for the home route
import configure from "../utils/configure"; // Import application configuration settings
import register from "./auth/register"; // Import the handler for user registration
import login from "./auth/login"; // Import the handler for user login
import refreshToken from "./auth/refresh-token"; // Import the handler for refreshing tokens
import authentication from "../middlewares/authentication"; // Import middleware for authentication checks
import {
	createTodo,
	deleteTodo,
	getTodo,
	getTodos,
	updateTodo,
} from "./todos"; // Import handlers for CRUD operations on Todos
import {
	deleteUser,
	getProfile,
	getTargetUser,
	getTargetUserDelete,
	getTargetUserUpdate,
	getUsers,
	updateUser,
} from "./users"; // Import handlers for user management operations
import authorizeRole from "../middlewares/authorizeRole"; // Import role-based authorization middleware
import { UserRole } from "../types/documents/IUserDocument"; // Import user role types

// Import the rate limiters & speed limiters
import rateLimiter from "../middlewares/rateLimits/rateLimiter";
import speedLimiter from "../middlewares/rateLimits/speedLimiter";
import criticalRateLimiter from "../middlewares/rateLimits/criticalRateLimiter";

const router = Router(); // Create a new Express Router instance

/**
 * Construct the base API URL using the configured API version.
 */
const baseURL = `/api/v${configure.API_VERSION}`; // Define the base URL for the API routes
const authURL = `${baseURL}/auth`; // Define the URL for authentication routes
const todoURL = `${baseURL}/todos`; // Define the URL for Todo routes
const userURL = `${baseURL}/users/me`; // Define the URL for user management routes

/**
 * Redirect root URL ("/") requests to the API base URL.
 *
 * @param _req - The Express Request object (not used, but required for the handler signature)
 * @param res - The Express Response object, used to perform the redirect
 */
router.get("/", (_req: Request, res: Response): void => {
	res.redirect(baseURL); // Redirect to /api/vX where X is the current API version
});

/**
 * Set up the route for the base API URL ("/api/vX").
 * The getHome function handles this route and returns a welcome message.
 */
router.get(baseURL, speedLimiter, getHome); // Handle GET requests to the base API URL with speed limiter

// Set up user authentication routes with rate limiting and critical rate limiting
router.post(`${authURL}/register`, rateLimiter, register); // Handle user registration with rate limiting
router.post(`${authURL}/login`, criticalRateLimiter, login); // Handle user login with critical rate limiting
router.post(
	`${authURL}/refresh-token`,
	authentication, // Authenticate the user before allowing a token refresh
	criticalRateLimiter, // Apply critical rate limiting for token refresh
	refreshToken, // Handle the refresh token functionality
);

// Set up Todo routes with authentication and rate limiting
router.get(todoURL, authentication, rateLimiter, getTodos); // Retrieve all Todos with rate limiting
router.post(
	todoURL,
	authentication,
	rateLimiter,
	createTodo,
); // Create a new Todo with rate limiting
router.get(
	`${todoURL}/:id`,
	authentication,
	rateLimiter,
	getTodo,
); // Retrieve a Todo by ID with rate limiting
router.put(
	`${todoURL}/:id`,
	authentication,
	rateLimiter,
	updateTodo,
); // Update a Todo by ID with rate limiting
router.delete(
	`${todoURL}/:id`,
	authentication,
	rateLimiter,
	deleteTodo,
); // Delete a Todo by ID with rate limiting

// Set up user management routes with authentication
router.get(
	userURL,
	authentication,
	rateLimiter,
	getProfile,
); // Retrieve current user's profile information with rate limiting
router.delete(
	`${userURL}`,
	authentication,
	rateLimiter,
	deleteUser,
); // Delete current user's account with rate limiting
router.put(
	`${userURL}`,
	authentication,
	rateLimiter,
	updateUser,
); // Update current user's profile information with rate limiting

// Set up admin routes for user management with critical rate limiting
router.get(
	`${baseURL}/users`,
	authentication,
	authorizeRole(UserRole.ADMIN), // Only admins can retrieve a list of users
	rateLimiter, // Apply rate limiting for user retrieval
	getUsers,
); // Retrieve all users

router.get(
	`${baseURL}/users/:id`,
	authentication,
	authorizeRole(UserRole.ADMIN), // Only admins can retrieve a specific user by ID
	rateLimiter, // Apply rate limiting for user retrieval
	getTargetUser,
); // Retrieve a specific user by ID

router.delete(
	`${baseURL}/users/:id`,
	authentication,
	authorizeRole(UserRole.ADMIN), // Only admins can delete a specific user by ID
	rateLimiter, // Apply rate limiting for user deletion
	getTargetUserDelete,
); // Delete a specific user by ID

router.put(
	`${baseURL}/users/:id`,
	authentication,
	authorizeRole(UserRole.ADMIN), // Only admins can update a specific user by ID
	rateLimiter, // Apply rate limiting for user updates
	getTargetUserUpdate,
); // Update a specific user by ID

export default router; // Export the configured router for use in the main application
