/**
 * Interface representing the body of a registration request.
 *
 * This interface defines the expected structure of the data
 * sent during user registration, where all fields are required.
 */
export interface IRegisterBody {
	email: string; // Required email address of the user
	password: string; // Required password for the user account
	name: string; // Required name of the user
}
