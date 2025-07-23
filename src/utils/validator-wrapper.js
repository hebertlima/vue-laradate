import { buildValidator } from './validator-builder'

export function createValidator(name, targetValidator) {
	return buildValidator(name, targetValidator)
}