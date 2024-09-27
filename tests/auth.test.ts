import request from "supertest";
import { app } from "../src/app";
import {
	UserRole,
	type IUser,
} from "../src/types/documents/IUserDocument";
import { connect, disconnect } from "../src/database";
import UserController from "../src/controller/UserController";
import { ILoginResponse } from "../src/types/responses/ILoginResponse";

const testUser: IUser = {
	email: "test@gmail.com",
	password: "test123456",
	name: "Test",
	role: UserRole.USER,
};

describe("Auth Routes", () => {
	beforeAll(async () => {
		await connect();

		const existingUser =
			await UserController.findByEmailUser(testUser.email);

		if (existingUser) {
			await UserController.deleteUserByEmail(
				testUser.email,
			);
		}
	});

	test("/api/v1/auth/register", async () => {
		const response = await request(app)
			.post("/api/v1/auth/register")
			.send(testUser);

		expect(response.statusCode).toBe(201);
	});

	test("/api/v1/auth/login", async () => {
		const response = await request(app)
			.post("/api/v1/auth/login")
			.set("user-agent", "Test")
			.send({
				email: testUser.email,
				password: testUser.password,
			});
		expect(response.statusCode).toBe(201);
		expect(response.body).toBeDefined();
	});

	test("/api/v1/auth/refresh-token", async () => {
		const loginResponse = await request(app)
			.post("/api/v1/auth/login")
			.set("user-agent", "Test")
			.send({
				email: testUser.email,
				password: testUser.password,
			});

		const { access_token, refresh_token }: ILoginResponse =
			loginResponse.body as ILoginResponse;

		const response = await request(app)
			.post("/api/v1/auth/refresh-token")
			.set("Authorization", `Bearer ${access_token}`)
			.send({
				refresh_token,
			});

		expect(response.statusCode).toBe(201);
	});

	afterAll(async () => {
		await disconnect();
	});
});
