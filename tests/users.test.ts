import request from "supertest";
import { app } from "../src/app";
import { connect, disconnect } from "../src/database/index";
import {
	IUser,
	UserRole,
} from "../src/types/documents/IUserDocument";
import UserModel from "../src/database/models/UserModel";
import { hashPassword } from "../src/utils/password";

const testUser: IUser = {
	email: "testuser@gmail.com",
	password: "password123",
	name: "Test User",
	role: UserRole.USER,
};

const adminUser: IUser = {
	email: "adminuser@gmail.com",
	password: "adminpassword123",
	name: "Admin User",
	role: UserRole.ADMIN,
};

describe("User Routes (Admin and Regular User)", () => {
	let accessToken: string;
	let adminAccessToken: string;
	let targetUserId: string;

	beforeAll(async () => {
		await connect();

		// Register a regular test user
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

		// Create an admin user manually using UserModel
		await UserModel.create({
			email: adminUser.email,
			name: adminUser.name,
			role: adminUser.role,
			password: (await hashPassword(adminUser.password))!,
		});

		// Log in with the admin user to get the admin access token
		const adminLoginResponse = await request(app)
			.post("/api/v1/auth/login")
			.set("User-Agent", "Test")
			.send({
				email: adminUser.email,
				password: adminUser.password,
			});
		adminAccessToken = adminLoginResponse.body.access_token;

		// Register another target user (but no user info returned, only a message)
		await request(app).post("/api/v1/auth/register").send({
			email: "targetuser@gmail.com",
			password: "targetpassword123",
			name: "Target User",
			role: UserRole.USER,
		});

		// Find the target user in the database to get their ID
		const targetUserRecord = await UserModel.findOne({
			email: "targetuser@gmail.com",
		});

		if (targetUserRecord) {
			targetUserId = targetUserRecord.id.toString();
		}
	});

	afterAll(async () => {
		// Delete test users from the database
		await UserModel.deleteMany({
			email: {
				$in: [
					testUser.email,
					"targetuser@gmail.com",
					adminUser.email,
				],
			},
		});
		await disconnect();
	});

	// Test for retrieving current user's profile
	test("GET /me - Retrieve current user's profile", async () => {
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

	// Test for updating current user's profile
	test("PUT /me - Update current user's profile", async () => {
		const updatedData = {
			name: "Updated Test User",
			email: "updatedtestuser@gmail.com",
		};

		const response = await request(app)
			.put("/api/v1/users/me")
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

	// Test for deleting current user's account
	test("DELETE /me - Delete current user's account", async () => {
		const response = await request(app)
			.delete("/api/v1/users/me")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(204);
	});

	// Test for retrieving all users as admin
	test("GET /users - Retrieve all users as Admin", async () => {
		const response = await request(app)
			.get("/api/v1/users")
			.set("Authorization", `Bearer ${adminAccessToken}`);

		expect(response.status).toBe(200);
		expect(response.body.users).toBeInstanceOf(Array);
		expect(response.body.users.length).toBeGreaterThan(0);
	});

	// Test for retrieving a specific user by ID as admin
	test("GET /users/:id - Retrieve specific user by ID as Admin", async () => {
		const response = await request(app)
			.get(`/api/v1/users/${targetUserId}`)
			.set("Authorization", `Bearer ${adminAccessToken}`);

		expect(response.status).toBe(200);
		expect(response.body.user).toHaveProperty(
			"name",
			"Target User",
		);
		expect(response.body.user).toHaveProperty(
			"email",
			"targetuser@gmail.com",
		);
	});

	// Test for updating a specific user by ID as admin
	test("PUT /users/:id - Update specific user by ID as Admin", async () => {
		const updatedData = {
			name: "Updated Target User",
			email: "updatedtargetuser@gmail.com",
		};

		const response = await request(app)
			.put(`/api/v1/users/${targetUserId}`)
			.set("Authorization", `Bearer ${adminAccessToken}`)
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

	// Test for deleting a specific user by ID as admin
	test("DELETE /users/:id - Delete specific user by ID as Admin", async () => {
		const response = await request(app)
			.delete(`/api/v1/users/${targetUserId}`)
			.set("Authorization", `Bearer ${adminAccessToken}`);

		expect(response.status).toBe(204);
	});
});
