import AppError from "../errors/AppError"; // Importing the custom AppError class for error handling
import { IPayload } from "./IPayload"; // Importing the IPayload interface that defines the structure of payload data

/**
 * Extending TypeScript's global types to include custom environment variables
 * and error handling in Express.
 */
declare global {
	/**
	 * Extending NodeJS's ProcessEnv interface to include the following environment variables:
	 * - NODE_ENV: Represents the current environment (test, development, or production)
	 * - PORT: The port on which the server will run
	 * - ALLOW_LIST: A string of allowed origins for CORS
	 * - API_VERSION: The version of the API (e.g., "v1")
	 * - MONGO_CONNECTION_URI: MongoDB connection URI
	 * - MONGO_DATABASE_NAME: MongoDB database name
	 */
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "test" | "development" | "production"; // Current environment for the application
			PORT: string; // Port number for server
			ALLOW_LIST: string; // Allowed origins for CORS
			API_VERSION: string; // API version
			MONGO_CONNECTION_URI: string; // MongoDB connection string
			MONGO_DATABASE_NAME: string; // Name of the MongoDB database
			SALT_ROUNDS: string; // Number of rounds for bcrypt salt generation
			SECRET_KEY: string; // Secret key for signing JWTs
			EXPIRES_IN: string; // Expiration time for access tokens
			REFRESH_TOKEN_EXPIRES_IN: string; // Expiration time for refresh tokens
			REFRESH_TOKEN_SECRET_KEY: string; // Secret key for signing refresh tokens
			ADMIN_USER_NAME: string;
			ADMIN_USER_EMAIL: string;
			ADMIN_USER_PASSWORD: string;
		}
	}

	/**
	 * Extending Express's NextFunction interface to include a custom error object of type AppError.
	 * This allows passing an AppError instance through the middleware stack for better error handling.
	 */
	namespace Express {
		interface NextFunction {
			err: AppError; // Custom error object for error handling in middleware
		}

		interface Request {
			user: IPayload; // User data attached to the request object after authentication
		}
	}
}

/**
 * Exporting an empty object to ensure this module is treated as a module
 * and the global declarations are correctly scoped, allowing TypeScript to recognize them.
 */
export {};
