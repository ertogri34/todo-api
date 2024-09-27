/**
 * Interface representing the structure of the body expected in
 * refresh token requests. This helps in type-checking the request payload.
 */
export interface IRefreshTokenBody {
	refresh_token: string; // The refresh token used to obtain a new access token
}
