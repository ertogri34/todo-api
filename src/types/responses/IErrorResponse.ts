import type { Status } from "../Status";

/**
 * Interface representing the structure of an error response.
 *
 * This is used to standardize the format of error responses throughout the API.
 */
export interface IErrorResponse {
	/**
	 * The error message describing what went wrong.
	 */
	error: string;

	/**
	 * The status of the error, indicating whether it's a client error ("fail")
	 * or a server error ("error").
	 */
	status: Status;
}
