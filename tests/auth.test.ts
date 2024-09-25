import request from "supertest";
import { app } from "../src/app";
import {
	UserRole,
	type IUser,
} from "../src/types/documents/IUserDocument";
import { connect, disconnect } from "../src/database";
import UserController from "../src/controller/UserController";

const testUser: IUser = {
	email: "test@gmail.com",
	password: "test123456",
	name: "Test",
	role: UserRole.USER,
};

describe("Auth Routes", () => {
	beforeEach(async () => {
		await connect();

		const existingUser =
			await UserController.findByEmailUser(testUser.email);

		if (existingUser) {
			await UserController.deleteUserByEmail(
				testUser.email,
			);
		}
	});

	afterEach(async () => {
		await disconnect();
	});

	test("/api/v1/auth/register", async () => {
		const response = await request(app)
			.post("/api/v1/auth/register")
			.send(testUser);

		expect(response.statusCode).toBe(201);
	});
});
