import { IMessageResponse } from "./IMessageResponse"; // Import IMessageResponse interface for message-related properties
import { IRefreshTokenResponse } from "./IRefreshTokenResponse"; // Import IRefreshTokenResponse interface for refresh token-related properties

/**
 * Interface for the login response structure.
 *
 * This interface extends both IMessageResponse and IRefreshTokenResponse,
 * encapsulating the response data returned after a successful login.
 */
export interface ILoginResponse
	extends IMessageResponse,
		IRefreshTokenResponse {
	// The refresh token issued upon successful login.
	refresh_token: string;

	// The duration (in seconds) until the refresh token expires.
	refresh_token_expires_in: string;
}
