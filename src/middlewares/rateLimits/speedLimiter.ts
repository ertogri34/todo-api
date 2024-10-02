import slowDown from "express-slow-down";
import type { Request } from "express";

// Speed limiter middleware to slow down responses after a certain number of requests
// windowMs: Time window in milliseconds (here 15 minutes)
// delayAfter: Number of requests before starting to delay responses (here, 50 requests)
// delayMs: Delay applied to each request once the limit is reached (here, 500ms)
// maxDelayMs: Maximum delay allowed for requests (here, 2000ms)
// validate: Ensures that the delayMs function is properly validated
const speedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes window
	delayAfter: () => 50, // Start delaying after 50 requests
	delayMs: () => 500, // Add 500ms delay per request after the limit
	maxDelayMs: () => 2000, // Maximum delay of 2000ms per request

	// Validate the delayMs function to ensure correctness
	validate: true,

	// Skip the speed limiter for requests from localhost (useful during development)
	skip: (req: Request) => {
		// Bypass the limiter for localhost IPs
		return req.ip === "::1" || req.ip === "127.0.0.1";
	},
});

export default speedLimiter;
