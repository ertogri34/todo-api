import AppError from "./AppError";

export default class RateLimitError extends AppError {
	public constructor(
		message: string = "Too many requests, please try again later.",
	) {
		super(message, 429);
	}
}
