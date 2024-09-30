import mongoose from "mongoose"; // Import mongoose for MongoDB connection
import configure from "../utils/configure"; // Import configuration settings
import logger from "../utils/logger"; // Import logger for logging errors
import UserController from "../controller/UserController";
import { hashPassword } from "../utils/password";
import { UserRole } from "../types/documents/IUserDocument";

async function initAdminUser(): Promise<void> {
	// Check if the admin user already exists
	if (
		await UserController.findByEmailUser(
			configure.ADMIN_USER_EMAIL,
		)
	) {
		return; // Exit if the admin user already exists
	}

	if (!process.env.ADMIN_USER_PASSWORD) {
		logger.error(
			"Admin user password not set in environment variables.",
		);
		return; // Exit if the admin password is not set
	}

	const hashedPassword = await hashPassword(
		process.env.ADMIN_USER_PASSWORD,
	);

	await UserController.createUser({
		email: configure.ADMIN_USER_EMAIL,
		password: hashedPassword!,
		name: configure.ADMIN_USER_NAME,
		role: UserRole.ADMIN,
	});

	logger.info(
		`Admin user created: ${configure.ADMIN_USER_EMAIL}`,
	);
}

/**
 * Connects to the MongoDB database using the provided URI and database name.
 *
 * @param uri - The connection string for MongoDB. Defaults to the configured URI.
 * @param dbName - The name of the database to connect to. Defaults to the configured database name.
 * @returns Promise<boolean> - Resolves to true if the connection is successful, otherwise false.
 */
async function connect(
	uri = configure.MONGO_CONNECTION_URI,
	dbName = configure.MONGO_DATABASE_NAME,
): Promise<boolean> {
	try {
		await mongoose.connect(uri, { dbName });
		await initAdminUser(); // Initialize admin user
		logger.info(
			`Successfully connected to MongoDB database: ${dbName}`,
		);
		return true; // Return true if the connection is successful
	} catch (err) {
		logger.error(
			`MongoDB connection error: ${(err as Error).message}`,
		);
		return false; // Return false if the connection fails
	}
}

/**
 * Disconnects from the MongoDB database.
 *
 * @returns Promise<boolean> - Resolves to true if the disconnection is successful, otherwise false.
 */
async function disconnect(): Promise<boolean> {
	try {
		await mongoose.disconnect();
		logger.info("Successfully disconnected from MongoDB");
		return true; // Return true if disconnection is successful
	} catch (err) {
		logger.error(
			`MongoDB disconnection error: ${(err as Error).message}`,
		);
		return false; // Return false if disconnection fails
	}
}

// Closure to manage the disconnecting state
const createDisconnectHandler = () => {
	let isDisconnecting = false; // Disconnect state control

	return async (): Promise<void> => {
		if (!isDisconnecting) {
			isDisconnecting = true; // Mark as disconnecting
			await disconnect(); // Call the disconnect function
			process.exit(0); // Exit the process successfully
		}
	};
};

const handleDisconnect = createDisconnectHandler(); // Create the disconnect handler

export { connect, disconnect, handleDisconnect };
