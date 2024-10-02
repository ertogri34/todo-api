import rateLimit from "express-rate-limit";
import type {
	Request,
	Response,
	NextFunction,
} from "express";
import RateLimitError from "../../errors/RateLimitError";

// General rate limiter middleware to restrict the number of requests
// windowMs: Time window in milliseconds (here 15 minutes)
// limit: Maximum number of requests allowed per IP within the time window (here 100 requests)
const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes window
	limit: 100, // Allow max 100 requests per window per IP

	// Custom handler to handle requests exceeding the rate limit
	// Instead of the default response, we return a custom RateLimitError
	handler: (
		_req: Request,
		_res: Response,
		next: NextFunction,
	): void => {
		// Pass the RateLimitError to the next middleware to handle it properly
		return next(new RateLimitError());
	},

	// Skip the rate limiter for requests coming from localhost (e.g., during local development)
	skip: (req: Request) => {
		// Bypass the limiter for localhost IPs
		return req.ip === "::1" || req.ip === "127.0.0.1";
	},
});

// Export the rate limiter middleware to be used across the application
export default rateLimiter;
