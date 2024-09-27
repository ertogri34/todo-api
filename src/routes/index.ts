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

const router = Router(); // Create a new Express Router instance

/**
 * Construct the base API URL using the configured API version.
 */
const baseURL = `/api/v${configure.API_VERSION}`; // Define the base URL for the API routes

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

// Set up the route for user registration
router.post(baseURL + "/auth/register", register);

// Set up the route for user login
router.post(baseURL + "/auth/login", login);

// Set up the route for refreshing the access token
router.post(
	baseURL + "/auth/refresh-token",
	authentication, // Use authentication middleware to verify the user's token
	refreshToken, // Handle the refresh token logic
);

export default router; // Export the configured router for use in the main application
