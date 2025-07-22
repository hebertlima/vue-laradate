import { helpers } from '@vuelidate/validators'
import { logger } from './logger'

export function createValidator(name, targetValidator) {
	if (!targetValidator) {
		logger.error(`Validator "${name}" not provided to createValidator`)
		return helpers.withMessage(
			() => `Validation configuration error for "${name}"`,
			() => false
		)
	}

	const messageFunction = (ctx) => {
		try {
			if (typeof targetValidator.$message === 'function') {
				return targetValidator.$message(ctx)
			}
			logger.warn(`Validator "${name}" has no message function`)
			return `Validation failed for ${name}`
		} catch (error) {
			logger.error(`Message generation error for "${name}":`, error)
			return `Validation message error`
		}
	}

	const validatorFunction = (value, parentVm) => {
		try {
			if (typeof targetValidator.$validator === 'function') {
				return targetValidator.$validator(value, parentVm)
			}
			logger.error(`Validator "${name}" has no validator function`)
			return false
		} catch (error) {
			logger.error(`Validation error for "${name}":`, error)
			return false
		}
	}

	return helpers.withMessage(
		messageFunction,
		helpers.withParams(
			{ type: name },
			validatorFunction
		)
	)
}