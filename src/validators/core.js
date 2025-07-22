import * as baseValidators from '@vuelidate/validators'

export const getBaseValidators = () => ({
	required: baseValidators.required,
	email: baseValidators.email,
	alpha: baseValidators.alpha,
	alphaNum: baseValidators.alphaNum,
	numeric: baseValidators.numeric,
	integer: baseValidators.integer,
	decimal: baseValidators.decimal,
	url: baseValidators.url,
	sameAs: baseValidators.sameAs,
	not: baseValidators.not,
	and: baseValidators.and,
	or: baseValidators.or,
	minLength: baseValidators.minLength,
	maxLength: baseValidators.maxLength,
	minValue: baseValidators.minValue,
	maxValue: baseValidators.maxValue,
	between: baseValidators.between,
	ipAddress: baseValidators.ipAddress,
	macAddress: baseValidators.macAddress,
	requiredIf: baseValidators.requiredIf,
	requiredUnless: baseValidators.requiredUnless
})