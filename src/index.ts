import { initServer } from "./app"; // Import the function responsible for initializing the server
import { type Server } from "http"; // Import the Server type definition from the Node.js http module
import { connect, handleDisconnect } from "./database"; // Import the database connection functions

/**
 * Main function to initialize and start the server.
 *
 * @returns Promise<Server> The initialized server instance.
 */
async function main(): Promise<Server> {
	// Attempt to establish a connection to the database
	const inConnected = await connect();

	// Check if the connection was successful; if not, exit the process with a failure status
	if (!inConnected) {
		process.exit(1); // Exit with status code 1 to indicate an error
	}

	// Call the initServer function to start the server and return the server instance
	return initServer();
}

// Signal event handling for graceful shutdown
process.on("SIGINT", handleDisconnect); // Handle Ctrl+C to disconnect
process.on("SIGTERM", handleDisconnect); // Handle termination signal to disconnect

// Execute the main function to start the application asynchronously
void main(); // Use void to ignore the promise returned by main()
