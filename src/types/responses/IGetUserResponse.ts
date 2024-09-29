/**
 * Interface representing the response structure for retrieving user information.
 */
export interface IGetUserResponse {
	/**
	 * The unique identifier of the user.
	 * This is usually a string representing a MongoDB ObjectId.
	 */
	id: string;

	/**
	 * The first name of the user.
	 */
	name: string;

	/**
	 * The email address of the user.
	 */
	email: string;
}
