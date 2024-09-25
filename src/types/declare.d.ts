import AppError from "../errors/AppError";

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
	 */
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "test" | "development" | "production";
			PORT: string;
			ALLOW_LIST: string;
			API_VERSION: string;
		}
	}

	/**
	 * Extending Express's NextFunction interface to include a custom error object of type AppError.
	 * This allows passing an AppError instance through the middleware stack.
	 */
	namespace Express {
		interface NextFunction {
			err: AppError;
		}
	}
}

/**
 * Exporting an empty object to ensure this module is treated as a module
 * and the global declarations are correctly scoped.
 */
export {};
