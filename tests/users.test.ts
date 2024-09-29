import request from "supertest";
import { app } from "../src/app";
import { connect, disconnect } from "../src/database/index";
import {
	IUser,
	UserRole,
} from "../src/types/documents/IUserDocument";

const testUser: IUser = {
	email: "testuser@gmail.com",
	password: "password123",
	name: "Test User",
	role: UserRole.USER,
};

describe("User Routes", () => {
	let accessToken: string;

	beforeAll(async () => {
		await connect();

		await request(app)
			.post("/api/v1/auth/register")
			.send(testUser);

		const loginResponse = await request(app)
			.post("/api/v1/auth/login")
			.set("User-Agent", "Test")
			.send({
				email: testUser.email,
				password: testUser.password,
			});
		accessToken = loginResponse.body.access_token;
	});

	afterAll(async () => {
		await disconnect();
	});

	test("GET /users/me", async () => {
		const response = await request(app)
			.get("/api/v1/users/me")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body.user).toHaveProperty(
			"name",
			testUser.name,
		);
		expect(response.body.user).toHaveProperty(
			"email",
			testUser.email,
		);
	});

	test("PUT /users/me/update", async () => {
		const updatedData = {
			name: "Updated User",
			email: "updateduser@gmail.com",
		};

		const response = await request(app)
			.put("/api/v1/users/me/update")
			.set("Authorization", `Bearer ${accessToken}`)
			.send(updatedData);

		expect(response.status).toBe(200);
		expect(response.body.updated_user).toHaveProperty(
			"name",
			updatedData.name,
		);
		expect(response.body.updated_user).toHaveProperty(
			"email",
			updatedData.email,
		);
		expect(response.body.message).toBe(
			"Updated user successfully.",
		);
	});

	test("DELETE /users/me/delete", async () => {
		const response = await request(app)
			.delete("/api/v1/users/me/delete")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(204);
	});
});
