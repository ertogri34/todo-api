/**
 * Interface representing the structure of a message response.
 *
 * This is used to standardize the format of responses that include a message.
 */
export interface IMessageResponse {
	/**
	 * The message to be returned in the response.
	 */
	message: string;
}
