export type ErrorTypes = `ValidationError`

export interface CapsuleError {
	name: ErrorTypes
}

export class ValidationError extends Error implements CapsuleError {
	public name: ErrorTypes
	constructor(message: string) {
		super(message)
		this.name = `ValidationError`
	}
}
