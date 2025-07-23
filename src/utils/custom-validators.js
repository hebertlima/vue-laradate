import { inject } from 'vue'
import { helpers } from '@vuelidate/validators'

export function defineValidator({
	name,
	validator,
	params = {},
	async = false
}) {
	const i18n = inject('vueLaradateI18n', null)
	const $t = i18n?.t ?? ((key) => key)

	const finalMessage = ((ctx) => {
		const path = `validations.${name}`
		return $t(path, { ...ctx.$params, $model: ctx.$model })
	})

	const wrapped = (value, siblings, vm) =>
		!helpers.req(value) || validator.call(vm, value, siblings, vm)

	const isAsync = async || validator.constructor.name === 'AsyncFunction'

	const validated = isAsync
		? helpers.withAsync(wrapped)
		: wrapped

	const withParams = helpers.withParams({ type: name, ...params }, validated)

	return helpers.withMessage(finalMessage, withParams)
}
