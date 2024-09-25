import winston from "winston";

// Create a logger instance using winston with specified configurations
const logger = winston.createLogger({
	level: "info", // Default logging level; messages at this level and above will be logged
	transports: [new winston.transports.Console()], // Output logs to the console
	format: winston.format.combine(
		// Combine multiple formats for structured logging
		winston.format.timestamp(), // Include a timestamp in the log messages
		winston.format.colorize(), // Colorize the log output for better readability
		winston.format.printf(
			({ timestamp, level, message }) => {
				// Format the log message using the timestamp, level, and message
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				return `${timestamp} [${level}] ${message}`; // Custom log message format
			},
		),
	),
});

// Export the logger instance for use throughout the application
export default logger;
