export class AuthRequiredError extends Error {
	constructor(message = "Authentication is required") {
		super(message);
		this.name = "AuthRequiredError";
	}
}
