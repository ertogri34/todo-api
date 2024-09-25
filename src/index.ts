import { initServer } from "./app"; // Import the function to initialize the server
import { type Server } from "http"; // Import the Server type from the http module

/**
 * Main function to initialize and start the server.
 *
 * @returns Server - The initialized server instance.
 */
function main(): Server {
	return initServer(); // Call initServer to start the server and return the instance
}

// Execute the main function to start the application
main();
