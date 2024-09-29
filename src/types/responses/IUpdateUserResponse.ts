/**
 * Interface representing the structure of the response
 * returned after updating a user.
 */
export interface IUpdateUserResponse {
	/**
	 * The name of the user after the update.
	 */
	name: string;

	/**
	 * The email of the user after the update.
	 */
	email: string;
}
