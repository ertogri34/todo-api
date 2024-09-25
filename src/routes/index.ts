import {
	type Request,
	Router,
	type Response,
} from "express";
import getHome from "./homes";
import configure from "../utils/configure";
import register from "./auth/register";

const router = Router();

/**
 * Construct the base API URL using the configured API version.
 */
const baseURL = `/api/v${configure.API_VERSION}`;

/**
 * Redirect root URL ("/") requests to the API base URL.
 *
 * @param _req - The Express Request object (not used, but required for the handler signature)
 * @param res - The Express Response object, used to perform the redirect
 */
router.get("/", (_req: Request, res: Response): void => {
	res.redirect(baseURL); // Redirects to /api/vX where X is the API version
});

/**
 * Set up the route for the base API URL ("/api/vX").
 * The getHome function handles this route and returns a welcome message.
 */
router.get(baseURL, getHome);

router.post(baseURL + "/auth/register", register);

export default router;
