import { helpers } from '@vuelidate/validators'
import { logger } from './logger'

export function buildValidator(name, validator) {
	if (!validator) {
		logger.error(`Validator "${name}" is undefined.`)

		return helpers.withMessage(
			() => `Validator "${name}" not found`,
			() => false
		)
	}

	const validatorFn = validator.$validator || validator
	const originalParams = validator.$params || {}

	const enrichedParams = { 
		type: name,
		...originalParams,
	}

	const messageFn = validator.$message || (() => `Validation failed for ${name}`)

	for (const [key, val] of Object.entries(originalParams)) {
		enrichedParams[key] = val
	}

	return helpers.withMessage(
		messageFn,
		helpers.withParams(enrichedParams, validatorFn)
	)
}