/**
 * ILoginBody interface defines the structure of the request body
 * required for user login. It contains the user's credentials.
 */
export interface ILoginDTO {
	email: string; // The email address of the user, used for authentication
	password: string; // The password associated with the user's account
}
