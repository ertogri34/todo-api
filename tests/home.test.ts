import request from "supertest";
import { app } from "../src/app";

describe("Home Route", () => {
	test("GET /api/v1", async (): Promise<void> => {
		const response = await request(app).get("/api/v1");

		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});
});
