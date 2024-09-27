import { Schema, model } from "mongoose"; // Import Schema and model from Mongoose for schema definition and model creation
import type { IRefreshTokenDocument } from "../../types/documents/IRefreshTokenDocument"; // Import the interface for the refresh token document

/**
 * RefreshTokenSchema defines the structure of the refresh token document in MongoDB.
 * It outlines the fields and their respective types for the refresh token.
 */
const refreshTokenSchema =
	new Schema<IRefreshTokenDocument>(
		{
			userId: {
				type: Schema.Types.ObjectId, // Reference to the User document
				ref: "User",
				required: true, // This field is required
			},
			refreshToken: {
				type: String, // The actual refresh token string
				required: true, // This field is required
			},
			userAgent: {
				type: String, // The user agent string for the client
				required: true, // This field is required
			},
			expiresAt: {
				type: Date, // The expiration date of the refresh token
				required: true, // This field is required
			},
			createdAt: {
				type: Date, // The timestamp for when the document was created
				default: Date.now, // Defaults to the current date and time
			},
		},
		{
			timestamps: false, // Disable automatic timestamps for createdAt and updatedAt
		},
	);

// Create an index on the expiresAt field to automatically delete expired tokens
refreshTokenSchema.index(
	{ expiresAt: 1 },
	{ expireAfterSeconds: 0 }, // Specify that documents should expire after the expiresAt time
);

/**
 * Export the Mongoose model for the refresh token, based on the RefreshTokenSchema.
 * This model provides an interface for interacting with the refresh token collection in MongoDB.
 */
const RefreshTokenModel = model<IRefreshTokenDocument>(
	"RefreshToken", // Name of the model
	refreshTokenSchema, // The schema for the model
	"refresh_tokens", // The name of the collection in MongoDB
);

export default RefreshTokenModel; // Export the model for use in other parts of the application
