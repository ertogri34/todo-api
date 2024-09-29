import request from "supertest";
import { app } from "../src/app";
import { connect } from "../src/database/index";
import { disconnect } from "mongoose";
import {
	IUser,
	UserRole,
} from "../src/types/documents/IUserDocument";
import { ICreateTodoBody } from "../src/types/bodies/ICreateTodoBody";

const testUser: IUser = {
	email: "test@gmail.com",
	password: "test123456",
	name: "Test",
	role: UserRole.USER,
};

let accessToken: string;
let todoId: string;

describe("Todo Routes", () => {
	beforeAll(async () => {
		await connect();

		await request(app)
			.post("/api/v1/auth/register")
			.send(testUser);

		const loginResponse = await request(app)
			.post("/api/v1/auth/login")
			.set("user-agent", "Test")
			.send({
				email: testUser.email,
				password: testUser.password,
			});

		accessToken = loginResponse.body.access_token;
	});

	afterAll(async () => {
		await disconnect();
	});

	test("GET /api/v1/todos - Retrieve all Todos", async () => {
		const response = await request(app)
			.get("/api/v1/todos")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("todos");
	});

	test("POST /api/v1/todos - Create a new Todo", async () => {
		const newTodo: ICreateTodoBody = {
			title: "Test Todo",
			description: "This is a test Todo",
		};

		const response = await request(app)
			.post("/api/v1/todos")
			.set("Authorization", `Bearer ${accessToken}`)
			.send(newTodo);

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("todo");
		todoId = response.body.todo._id;
	});

	test("GET /api/v1/todos/:id - Retrieve a single Todo", async () => {
		const response = await request(app)
			.get(`/api/v1/todos/${todoId}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("todo");
	});

	test("PUT /api/v1/todos/:id - Update a Todo", async () => {
		const updatedTodo = {
			title: "Updated Test Todo",
		};

		const response = await request(app)
			.put(`/api/v1/todos/${todoId}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send(updatedTodo);

		expect(response.status).toBe(204);
	});

	test("DELETE /api/v1/todos/:id - Delete a Todo", async () => {
		const response = await request(app)
			.delete(`/api/v1/todos/${todoId}`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.status).toBe(204);
	});
});
