import type { Request, Response } from "express";
import HomeController from "../controller/HomeController";
import { IMessageResponse } from "../types/IMessageResponse";

/**
 * Handler function for the /api/v1 endpoint.
 * This function sends a welcome message as a response.
 *
 * @param req - The Express Request object (not used here, but necessary for the handler signature)
 * @param res - The Express Response object, used to send the response to the client
 * @returns Response<IMessageResponse> - Returns a JSON response with a welcome message
 */
function getHome(
	req: Request,
	res: Response,
): Response<IMessageResponse> {
	/**
	 * Sends a 200 OK response with the home message
	 * provided by the HomeController.
	 */
	return res.status(200).json(
		HomeController.homeMessage, // Retrieves the welcome message from HomeController
	) as Response<IMessageResponse>;
}

export default getHome;
