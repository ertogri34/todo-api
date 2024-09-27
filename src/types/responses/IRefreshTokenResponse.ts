/**
 * Interface representing the structure of the response for a refresh token operation.
 */
export interface IRefreshTokenResponse {
	/**
	 * The newly generated access token for the user.
	 */
	access_token: string;

	/**
	 * The duration (in milliseconds) for which the access token is valid.
	 */
	expires_in: string; // The expiration time is provided as a string, indicating how long the token is valid
}
