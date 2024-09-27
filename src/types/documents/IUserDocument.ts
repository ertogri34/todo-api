// Importing the 'Document' interface from Mongoose, which is used for defining Mongoose documents
import mongoose, { Document } from "mongoose";

/**
 * Enum to define user roles.
 * USER is represented by 1 and ADMIN by 2.
 */
export enum UserRole {
	USER = 1, // Standard user role
	ADMIN = 2, // Administrative user role
}

/**
 * Interface defining the basic structure for a User.
 * All fields are required for a user object.
 */
export interface IUser {
	email: string; // The user's email address, must be unique
	password: string; // The user's password for authentication
	name: string; // The user's full name
	role: UserRole; // The user's role, defined by the UserRole enum
}

/**
 * Interface representing a User document in MongoDB.
 * It extends the IUser interface and adds Mongoose document properties.
 */
export interface IUserDocument extends IUser, Document {
	id: mongoose.Types.ObjectId; // Unique identifier for the user document in MongoDB
	createdAt: Date; // Timestamp for when the user was created
	updatedAt: Date; // Timestamp for when the user was last updated
}
