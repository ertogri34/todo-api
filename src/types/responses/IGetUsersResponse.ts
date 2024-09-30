import { IGetUserResponse } from "./IGetUserResponse";

/**
 * Interface for the response when fetching multiple users.
 * The response contains an array of user objects.
 */
export interface IGetUsersResponse {
	/**
	 * Array of user data, each conforming to the IGetUserResponse interface.
	 */
	users: IGetUserResponse[];
}
