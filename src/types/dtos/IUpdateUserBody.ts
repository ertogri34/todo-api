/**
 * Interface representing the body for updating a user.
 *
 * All fields are optional, allowing for partial updates.
 */
export interface IUpdateUserDTO {
	/**
	 * The name of the user.
	 * This field is optional and can be used to update the user's name.
	 */
	name?: string;

	/**
	 * The email address of the user.
	 * This field is optional and can be used to update the user's email.
	 */
	email?: string;

	/**
	 * The password of the user.
	 * This field is optional and can be used to update the user's password.
	 */
	password?: string;
}
