import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import RateLimitError from "../../errors/RateLimitError";

// Define a rate limiter for critical routes to limit the number of requests
// windowMs: Time window in milliseconds (here 10 minutes)
// max: Maximum number of requests allowed in the defined window (here 10 requests)
const criticalRateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes window
	max: 10, // Allow max 10 requests per window per IP

	// Custom handler to respond when the rate limit is exceeded
	// Instead of the default response, we throw a custom RateLimitError
	handler: (
		_req: Request,
		_res: Response,
		next: NextFunction,
	) => {
		// Trigger a custom error when the request exceeds the limit
		return next(
			new RateLimitError(
				"Too many critical requests, please try again later.",
			),
		);
	},

	// Skip the rate limiter for requests from localhost (useful for development purposes)
	skip: (req: Request) => {
		// Bypass the limiter for localhost IPs
		return req.ip === "::1" || req.ip === "127.0.0.1";
	},
});

// Export the rate limiter to be used in critical routes
export default criticalRateLimiter;
