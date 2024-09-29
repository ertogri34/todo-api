/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 * **/
export const testEnvironment = "node";
export const transform = {
	"^.+.tsx?$": ["ts-jest", {}],
};
export const preset = "ts-jest";
export const testEnvironmentOptions = {
	NODE_ENV: "test",
};
