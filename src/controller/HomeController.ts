import type { IMessageResponse } from "../types/responses/IMessageResponse";

/**
 * HomeController class to handle the home route logic
 */
class HomeController {
	/**
	 * Getter method to provide the welcome message
	 *
	 * @returns IMessageResponse - Contains a welcome message for the API
	 */
	public get homeMessage(): IMessageResponse {
		return {
			message: "Welcome to the Todo API.", // Response message
		};
	}
}

/**
 * Export an instance of HomeController as the default export
 */
export default new HomeController();
