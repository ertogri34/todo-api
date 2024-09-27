import { config } from "dotenv";

// Load environment variables from a .env file based on the current NODE_ENV
config({ path: `.env.${process.env.NODE_ENV}` });

// Check if ALLOW_LIST environment variable is defined; if not, throw an error
if (!process.env.ALLOW_LIST) {
	throw new Error("ALLOW_LIST undefined."); // Ensure that ALLOW_LIST is set to avoid runtime errors
}

// Split the ALLOW_LIST string into an array of allowed origins
const allowList = process.env.ALLOW_LIST.split(",");

// Configuration object to store application settings
const configure = {
	NODE_ENV: process.env.NODE_ENV, // The current environment (development, production, etc.)
	PORT: Number(process.env.PORT), // The port number for the server, converted to a number
	ALLOW_LIST: allowList, // Array of allowed origins for CORS
	API_VERSION: process.env.API_VERSION, // The API version string
	MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI, // MongoDB connection URI
	MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME, // Name of the MongoDB database
	SALT_ROUNDS: Number(process.env.SALT_ROUNDS), // Number of rounds for password hashing
	SECRET_KEY: process.env.SECRET_KEY, // Secret key for signing tokens
	EXPIRES_IN: process.env.EXPIRES_IN, // Token expiration time
	REFRESH_TOKEN_EXPIRES_IN:
		process.env.REFRESH_TOKEN_EXPIRES_IN, // Refresh token expiration time
	REFRESH_TOKEN_SECRET_KEY:
		process.env.REFRESH_TOKEN_SECRET_KEY, // Secret key for refresh token signing
};

// Export the configuration object for use throughout the application
export default configure;
