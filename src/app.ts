import express from "express";
import cors from "cors";
import configure from "./utils/configure";
import { Server } from "http";
import helmet from "helmet";
import routes from "./routes/index";
import notFound from "./middlewares/notFoundError";
import globalError from "./middlewares/globalError";
import logger from "./utils/logger";
import morgan from "morgan";

/**
 * Create an Express application
 */
const app = express();

/**
 * CORS settings
 */
app.use(
	cors({
		origin: configure.ALLOW_LIST, // Allowed origins
		methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
		optionsSuccessStatus: 204, // Success status code for preflight requests
	}),
);

/**
 * Set to trust the proxy to get the real IP address
 */
app.set("trust proxy", false);

/**
 * Security for HTTP headers
 */
app.use(helmet());

/**
 * JSON parser for request bodies
 */
app.use(express.json());

/**
 * URL parameters parser
 */
app.use(express.urlencoded({ extended: true }));

/**
 * HTTP request logging middleware
 */
app.use(
	morgan(
		configure.NODE_ENV === "development" // Use 'dev' format in development
			? "dev"
			: "combined", // Use 'combined' format in production
	),
);

/**
 * All routes configuration
 */
app.use(routes);

/**
 * Middleware for handling Not Found errors
 */
app.use(notFound);

/**
 * Global error handling middleware
 */
app.use(globalError);

/**
 * Initialize and start the server
 *
 * @param port - The port the server will listen on
 * @returns Server
 */
export function initServer(
	port: number = configure.PORT,
): Server {
	return app.listen(port, () => {
		logger.info(
			`Server is listening at http://localhost:${port.toString()}`, // Log the server listening message
		);
	});
}

export { app };
